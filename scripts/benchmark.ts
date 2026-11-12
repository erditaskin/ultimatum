import { performance } from "node:perf_hooks";
import { initial, blast } from "../src/game/engine";
const g = initial(0);
g.board.fill(5);
for (let i = 0; i < 1000; i++) blast(g, 0, 0);
const samples: number[] = [];
for (let i = 0; i < 10000; i++) {
  const start = performance.now();
  blast(g, 0, 0);
  samples.push(performance.now() - start);
}
samples.sort((a, b) => a - b);
console.log(
  JSON.stringify(
    {
      scenario: "36 level-5 machines, entire-board chain",
      iterations: samples.length,
      p50ms: samples[5000],
      p95ms: samples[9500],
      maxMs: samples.at(-1),
      runtime: process.version,
      platform: process.platform,
    },
    null,
    2,
  ),
);
