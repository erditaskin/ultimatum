import test from "node:test";
import assert from "node:assert/strict";
import {
  apply,
  initial,
  isGame,
  refill,
  availableProduct,
  canCraft,
  Game,
  Ore,
} from "../src/karbasan/engine";
import { ENERGY_PRICE, levelForXp, MINE, FORGE } from "../src/karbasan/catalog";
import { BACKUP_KEY, repository, SAVE_KEY } from "../src/karbasan/persistence";
const time = 1_700_000_000_000;
const env = (now = time, value = 0) => ({ now, random: () => value });
const fresh = () => initial(time);
const tile = (material = "iron", stage = 3): Ore => ({
  kind: "ore",
  material: material as Ore["material"],
  stage,
});
function ready() {
  const g = fresh();
  g.tutorial = true;
  return g;
}
test("Karbasan initial state validates and producer slots remain fixed", () => {
  const g = fresh();
  assert.equal(isGame(g), true);
  assert.equal(g.board.length, 48);
  assert.deepEqual(g.board[MINE], { kind: "mine" });
  assert.deepEqual(g.board[FORGE], { kind: "forge" });
  assert.strictEqual(
    apply(g, { type: "move", from: 0, to: MINE }, env()).game,
    g,
  );
});
test("matching merge is immutable and cannot change metal or exceed stage five", () => {
  const g = ready(),
    snapshot = JSON.stringify(g);
  const next = apply(g, { type: "move", from: 0, to: 1 }, env()).game;
  assert.deepEqual(next.board[1], tile("iron", 2));
  assert.equal(next.board[0], null);
  assert.equal(JSON.stringify(g), snapshot);
  assert.strictEqual(apply(g, { type: "move", from: 0, to: 6 }, env()).game, g);
  g.board[0] = tile("iron", 5);
  g.board[1] = tile("iron", 5);
  assert.strictEqual(apply(g, { type: "move", from: 0, to: 1 }, env()).game, g);
});
test("production charges once and never yields locked material", () => {
  const g = ready(),
    result = apply(g, { type: "produce" }, env(time, 0.9999));
  assert.equal(result.game.energy, 99);
  assert.equal(result.event.material, "bronze");
  assert.equal(isGame(result.game), true);
  g.board = g.board.map((c) => c ?? tile());
  assert.equal(apply(g, { type: "produce" }, env()).game.energy, 100);
  g.energy = 0;
  g.board[2] = null;
  assert.equal(apply(g, { type: "produce" }, env()).game.energy, 0);
});
test("normal break preserves neighbors and gives bars with guaranteed gem pity", () => {
  const g = ready();
  g.board[18] = tile("bronze", 3);
  g.board[19] = tile("iron", 3);
  g.stats.gemPity = 2;
  const next = apply(g, { type: "break", index: 19 }, env(time, 0.99)).game;
  assert.equal(next.bars.iron, 1);
  assert.equal(next.board[19], null);
  assert.deepEqual(next.board[18], tile("bronze", 3));
  assert.equal(
    Object.values(next.gems).reduce((a, b) => a + b, 0),
    1,
  );
  assert.equal(next.mana, 18);
  assert.equal(g.bars.iron, 0);
});
test("chain needs full magic and visits ready neighbors once across types", () => {
  const g = ready();
  g.board[18] = tile("bronze", 3);
  g.board[19] = tile("iron", 4);
  g.board[20] = tile("iron", 1);
  g.board[24] = tile("bronze", 3);
  assert.strictEqual(apply(g, { type: "chain", index: 19 }, env()).game, g);
  g.mana = 100;
  const result = apply(g, { type: "chain", index: 19 }, env());
  assert.ok(result.event.indices!.length >= 3);
  assert.equal(
    new Set(result.event.indices).size,
    result.event.indices!.length,
  );
  assert.deepEqual(result.game.board[20], tile("iron", 1));
  assert.equal(result.game.mana, 0);
  assert.equal(isGame(result.game), true);
});
test("craft atomically consumes all ingredients; no partial loss on failure", () => {
  const g = ready();
  g.bars.bronze = 2;
  assert.equal(canCraft(g, "bronze-ring"), false);
  assert.strictEqual(
    apply(g, { type: "craft", recipe: "bronze-ring" }, env()).game,
    g,
  );
  g.gems.emerald = 1;
  const next = apply(g, { type: "craft", recipe: "bronze-ring" }, env()).game;
  assert.equal(next.bars.bronze, 0);
  assert.equal(next.gems.emerald, 0);
  assert.equal(next.products["bronze-ring"], 1);
  assert.equal(g.bars.bronze, 2);
});
test("delivery is single-use, grants separate gold/XP and replaces order id", () => {
  const g = ready();
  g.products["iron-ring"] = 1;
  const next = apply(g, { type: "deliver", id: 1 }, env()).game;
  assert.equal(next.gold, g.gold + 85);
  assert.equal(next.xp, 68);
  assert.equal(next.products["iron-ring"], 0);
  assert.strictEqual(apply(next, { type: "deliver", id: 1 }, env()).game, next);
  assert.equal(isGame(next), true);
});
test("equipped and protected amulets cannot be sold; extra copies can", () => {
  const g = ready();
  g.products["shadow-amulet"] = 1;
  g.equipped = "shadow-amulet";
  assert.equal(availableProduct(g, "shadow-amulet"), 0);
  g.products["shadow-amulet"] = 2;
  assert.equal(availableProduct(g, "shadow-amulet"), 1);
  g.protected = ["shadow-amulet"];
  assert.equal(availableProduct(g, "shadow-amulet"), 0);
});
test("energy integrates Power Hour end, cap and backwards time", () => {
  const g = ready();
  g.energy = 0;
  g.campaign.end = time + 30000;
  assert.equal(refill(g, time + 60000).energy, 1);
  assert.equal(refill(g, time + 60000).energyRemainder, 30000);
  assert.equal(refill(g, time + 90000).energy, 2);
  assert.strictEqual(refill(g, time - 1), g);
  g.energy = 99;
  assert.equal(refill(g, time + 3600000).energy, 100);
});
test("buying energy is atomic and cannot spend at cap", () => {
  const g = ready();
  assert.strictEqual(apply(g, { type: "buy-energy" }, env()).game, g);
  g.energy = 80;
  const next = apply(g, { type: "buy-energy" }, env()).game;
  assert.equal(next.energy, 100);
  assert.equal(next.gold, g.gold - ENERGY_PRICE);
  g.gold = 0;
  assert.strictEqual(apply(g, { type: "buy-energy" }, env()).game, g);
});
test("schema rejects malformed slots, inventory, campaigns and negative resources", () => {
  const g = ready();
  for (const change of [
    { energy: -1 },
    { board: [] },
    { mana: 101 },
    { bars: {} },
    { orders: [] },
    { campaign: { start: time, end: time - 1 } },
    { equipped: "iron-ring" },
  ])
    assert.equal(isGame({ ...g, ...change }), false);
  assert.equal(levelForXp(0).level, 1);
  assert.equal(levelForXp(185).level, 2);
});
function memory() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: async (k: string) => values.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      values.set(k, v);
    },
  };
}
test("save uses new slot, keeps legacy data, and ordered writes end with latest state", async () => {
  const storage = memory();
  storage.values.set("katlapatla:v2", "old-prototype");
  const repo = repository(storage),
    g = await repo.load(time);
  await Promise.all([
    repo.save(g),
    repo.save({ ...g, gold: 500 }),
    repo.save({ ...g, gold: 600 }),
  ]);
  assert.equal(JSON.parse(storage.values.get(SAVE_KEY)!).gold, 600);
  assert.equal(JSON.parse(storage.values.get(BACKUP_KEY)!).gold, 500);
  assert.equal(storage.values.get("katlapatla:v2"), "old-prototype");
});
test("corrupt saves are not reset and backup restore is explicit", async () => {
  const storage = memory();
  storage.values.set(SAVE_KEY, "{broken");
  storage.values.set(BACKUP_KEY, JSON.stringify(ready()));
  const repo = repository(storage);
  await assert.rejects(repo.load(time));
  assert.equal(storage.values.get(SAVE_KEY), "{broken");
  const g = await repo.restoreBackup();
  assert.equal(isGame(g), true);
  assert.equal(isGame(JSON.parse(storage.values.get(SAVE_KEY)!)), true);
});
test("failed write can be retried without corrupting canonical snapshot", async () => {
  const storage = memory();
  const g = ready();
  let fail = true;
  const repo = repository({
    ...storage,
    setItem: async (k, v) => {
      if (fail) throw new Error("disk");
      storage.values.set(k, v);
    },
  });
  await assert.rejects(repo.save(g));
  assert.equal(storage.values.has(SAVE_KEY), false);
  fail = false;
  await repo.save(g);
  assert.equal(isGame(JSON.parse(storage.values.get(SAVE_KEY)!)), true);
});
test("random legal action sequence preserves invariants", () => {
  let g: Game = ready(),
    seed = 7;
  const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  for (let i = 0; i < 1000; i++) {
    const from = Math.floor(random() * 48),
      to = Math.floor(random() * 48);
    g = apply(
      g,
      i % 3 === 0
        ? { type: "produce" }
        : i % 3 === 1
          ? { type: "move", from, to }
          : { type: "break", index: from },
      { now: time + i * 1000, random },
    ).game;
    assert.equal(isGame(g), true);
  }
});

test("workshop production bonus yields only stage two and remains level gated", () => {
  const g = fresh();
  g.workshop = 8;
  const sequence = [0, 0, 0.19];
  const result = apply(
    g,
    { type: "produce" },
    { now: time, random: () => sequence.shift() ?? 0 },
  );
  assert.equal(result.game.board[2]?.kind, "ore");
  assert.equal((result.game.board[2] as Ore).stage, 2);
  assert.equal((result.game.board[2] as Ore).material, "iron");
  assert.equal(result.game.energy, 99);
  assert.ok(isGame(result.game));
});
