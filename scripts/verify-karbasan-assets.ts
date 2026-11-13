import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { MATERIALS, RECIPES } from "../src/karbasan/catalog";

// Evaluate the generated data module with a PNG-only loader; Node must not execute PNG bytes.
const sourceFile = path.resolve("src/ui/karbasan/sprites.ts");
const compiled = ts.transpileModule(readFileSync(sourceFile, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
type Atlas = { image: string; width: number; height: number };
type Sprite = { source: string; x: number; y: number; w: number; h: number };
const data = {} as {
  SOURCES: Record<string, Atlas>;
  SPRITES: Record<string, Sprite>;
};
vm.runInNewContext(compiled, {
  exports: data,
  require: (file: string) => {
    assert.ok(file.endsWith(".png"), `Unexpected asset import: ${file}`);
    return path.resolve(path.dirname(sourceFile), file);
  },
});
for (const [name, atlas] of Object.entries(data.SOURCES)) {
  const png = readFileSync(atlas.image);
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", name);
  assert.equal(png.readUInt32BE(16), atlas.width, `${name} width`);
  assert.equal(png.readUInt32BE(20), atlas.height, `${name} height`);
}
for (const [name, sprite] of Object.entries(data.SPRITES)) {
  const atlas = data.SOURCES[sprite.source];
  assert.ok(atlas, `${name} source`);
  for (const value of [sprite.x, sprite.y, sprite.w, sprite.h])
    assert.ok(Number.isInteger(value), `${name} must use integer pixels`);
  assert.ok(
    sprite.x >= 0 && sprite.y >= 0 && sprite.w > 0 && sprite.h > 0,
    name,
  );
  assert.ok(sprite.x + sprite.w <= atlas.width, `${name} horizontal bounds`);
  assert.ok(sprite.y + sprite.h <= atlas.height, `${name} vertical bounds`);
}
for (const material of MATERIALS)
  for (let stage = 1; stage <= 5; stage++)
    assert.ok(
      data.SPRITES[`${material}-${stage}`],
      `${material} stage ${stage}`,
    );
for (const recipe of RECIPES)
  assert.ok(data.SPRITES[recipe.art], `${recipe.id} artwork`);
console.log(
  `Verified ${Object.keys(data.SOURCES).length} PNG sources, ${Object.keys(data.SPRITES).length} sprite rectangles, 40 ore stages and ${RECIPES.length} recipes.`,
);
