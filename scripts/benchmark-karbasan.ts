import { performance } from "node:perf_hooks";
import { initial, apply, isGame } from "../src/karbasan/engine";
const g = initial(0);
g.mana = 100;
g.board = g.board.map((c) =>
  c?.kind === "mine" || c?.kind === "forge"
    ? c
    : { kind: "ore", material: "valorite", stage: 5 },
);
const samples: number[] = [];
for (let i = 0; i < 11000; i++) {
  const t = performance.now();
  const r = apply(
    g,
    { type: "chain", index: 0 },
    { now: 0, random: () => 0.5 },
  );
  if (!isGame(r.game)) throw Error("Invalid result");
  if (i >= 1000) samples.push(performance.now() - t);
}
samples.sort((a, b) => a - b);
console.log(
  JSON.stringify(
    {
      scenario:
        "46 ready ores + fixed producers, full chain + schema validation",
      runtime: process.version,
      iterations: samples.length,
      p50ms: samples[5000],
      p95ms: samples[9500],
      maxMs: samples.at(-1),
    },
    null,
    2,
  ),
);
