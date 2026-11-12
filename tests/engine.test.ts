import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initial,
  move,
  blast,
  produce,
  refill,
  claim,
  upgrade,
  isGame,
} from "../src/game/engine";
test("merges conserve level value and do not mutate source", () => {
  const g = initial(0);
  const n = move(g, 20, 21);
  assert.equal(n.board[21], 2);
  assert.equal(n.board[20], null);
  assert.equal(g.board[20], 1);
  assert.equal(move(n, 14, 21), n);
});
test("breadth first chain consumes each machine once and protects Pofs", () => {
  const g = initial(0);
  g.board[8] = 3;
  const { game, events } = blast(g, 14, 0);
  assert.equal(events.length, 3);
  assert.equal(new Set(events.map((e) => e.index)).size, 3);
  assert.equal(game.score, 500);
  assert.equal(game.board[20], 1);
  assert.equal(game.reward, 100);
  assert.equal(g.board[14], 3);
});
test("mission reward claimed once and workshop spends gold", () => {
  const g = blast(initial(0), 14, 0).game;
  g.progress = 500;
  g.reward = 100;
  const n = claim(g, 0);
  assert.equal(n.gold, 100);
  assert.equal(n.mission, 1);
  assert.equal(claim(n, 0), n);
  assert.equal(upgrade(n).gold, 0);
  assert.equal(upgrade(n).workshop, 1);
});
test("full board and empty rights cannot spend production rights", () => {
  let g = initial(0);
  g.board.fill(1);
  assert.equal(produce(g, 0, 0), g);
  g = initial(0);
  g.rights = 0;
  assert.equal(produce(g, 0, 0), g);
});
test("refill handles normal, campaign boundaries, remainder and cap", () => {
  const g = initial(0);
  g.rights = 0;
  assert.equal(refill(g, 60000, []).rights, 2);
  const c = [{ start: 10000, end: 40000 }];
  const n = refill(g, 45000, c);
  assert.equal(n.rights, 2);
  assert.equal(n.refillAt, 35000);
  const m = refill(n, 60000, c);
  assert.equal(m.rights, 3);
  assert.equal(refill(g, 9999999, []).rights, 60);
  assert.equal(refill(g, -1, []), g);
});
test("save validation rejects corrupt data", () => {
  assert.equal(isGame(initial(0)), true);
  assert.equal(isGame({ ...initial(0), board: [1] }), false);
  assert.equal(isGame({ ...initial(0), gold: NaN }), false);
  assert.equal(isGame({ ...initial(0), rights: 61 }), false);
});
test("maximum-level pieces cannot merge; cycles cannot loop", () => {
  const g = initial(0);
  g.board.fill(5);
  assert.equal(move(g, 0, 1), g);
  const b = blast(g, 0, 0);
  assert.equal(b.events.length, 36);
  assert.ok(b.game.board.every((t) => t === null));
});

test("incremental refill agrees with offline refill across overlapping campaigns", () => {
  const campaigns = [
    { start: 10000, end: 70000 },
    { start: 50000, end: 90000 },
  ];
  const start = initial(0);
  start.rights = 0;
  let stepped = start;
  for (let now = 1000; now <= 120000; now += 1000)
    stepped = refill(stepped, now, campaigns);
  const once = refill(start, 120000, campaigns);
  assert.equal(stepped.rights, once.rights);
  assert.equal(stepped.refillAt, once.refillAt);
});
test("reward overflow carries into following mission without duplicate gold", () => {
  const start = initial(0);
  start.progress = 2000;
  start.reward = 100;
  const first = claim(start, 0);
  assert.equal(first.progress, 1500);
  assert.equal(first.reward, 115);
  const second = claim(first, 0);
  assert.equal(second.gold, 215);
  assert.equal(second.mission, 2);
});
test("production at cap starts a fresh refill interval", () => {
  const g = initial(0);
  const n = produce(g, 0, 1000000);
  assert.equal(n.refillAt, 1000000);
  assert.equal(n.rights, 59);
  assert.equal(refill(n, 1001000, []).rights, 59);
  assert.equal(refill(n, 1030000, []).rights, 60);
});

test("Power Hour boosts mission gold only inside its exact window", async () => {
  const { missionReward } = await import("../src/game/engine");
  const campaigns = [{ start: 1000, end: 2000 }];
  assert.equal(missionReward(0, 999, campaigns), 100);
  assert.equal(missionReward(0, 1000, campaigns), 150);
  assert.equal(missionReward(1, 1999, campaigns), 172);
  assert.equal(missionReward(0, 2000, campaigns), 100);
});
