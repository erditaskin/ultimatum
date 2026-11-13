import {
  BREAK_BARS,
  CRAFTING_IDS,
  COLS,
  ENERGY_CAP,
  ENERGY_PACK,
  ENERGY_PRICE,
  FORGE,
  GEMS,
  Gem,
  MATERIALS,
  MINE,
  METALS,
  Material,
  RECIPES,
  RecipeId,
  ROWS,
  levelForXp,
  recipe,
  workshopCost,
  workshopLevel,
} from "./catalog";
export type Ore = { kind: "ore"; material: Material; stage: number };
export type Cell = Ore | { kind: "mine" | "forge" } | null;
export type Settings = {
  music: boolean;
  sound: boolean;
  haptics: boolean;
  motion: boolean;
};
export type Order = { id: number; npc: number; recipe: RecipeId };
export type Game = {
  version: 3;
  board: Cell[];
  energy: number;
  energyAt: number;
  energyRemainder: number;
  gold: number;
  xp: number;
  score: number;
  mana: number;
  workshop: number;
  bars: Record<Material, number>;
  gems: Record<Gem, number>;
  products: Record<string, number>;
  orders: Order[];
  nextOrderId: number;
  equipped: string | null;
  protected: string[];
  discovered: Material[];
  crafted: string[];
  title: string;
  hitap: "Lord" | "Leydi";
  stats: {
    merged: number;
    broken: number;
    sold: number;
    best: number;
    gemPity: number;
  };
  settings: Settings;
  tutorial: boolean;
  campaign: { start: number; end: number };
};
export type Command =
  | { type: "produce" }
  | { type: "move"; from: number; to: number }
  | { type: "break" | "chain"; index: number }
  | { type: "craft"; recipe: string }
  | { type: "deliver" | "replace-order"; id: number }
  | { type: "equip" | "protect"; item: string }
  | { type: "upgrade" | "buy-energy" | "tutorial" }
  | { type: "setting"; key: keyof Settings; value: boolean }
  | { type: "title"; title: string }
  | { type: "hitap"; value: "Lord" | "Leydi" };
export type Feedback = {
  kind: string;
  text: string;
  points?: number;
  level?: number;
  indices?: number[];
  stage?: number;
  material?: Material;
};
export type Result = { game: Game; event: Feedback };
export type Env = { now: number; random: () => number };
const ore = (material: Material, stage: number): Ore => ({
  kind: "ore",
  material,
  stage,
});
const record = <T extends string>(keys: readonly T[]) =>
  Object.fromEntries(keys.map((k) => [k, 0])) as Record<T, number>;
export function initial(now: number): Game {
  const board: Cell[] = Array(COLS * ROWS).fill(null);
  board[MINE] = { kind: "mine" };
  board[FORGE] = { kind: "forge" };
  [
    [0, "iron", 1],
    [1, "iron", 1],
    [6, "bronze", 1],
    [7, "bronze", 1],
    [13, "iron", 2],
    [14, "iron", 2],
    [19, "iron", 3],
    [20, "bronze", 3],
    [25, "iron", 1],
    [26, "iron", 1],
  ].forEach(([i, m, s]) => {
    board[i as number] = ore(m as Material, s as number);
  });
  return {
    version: 3,
    board,
    energy: 100,
    energyAt: now,
    energyRemainder: 0,
    gold: 350,
    xp: 0,
    score: 0,
    mana: 0,
    workshop: 0,
    bars: record(MATERIALS),
    gems: record(GEMS),
    products: {},
    orders: [
      { id: 1, npc: 0, recipe: "iron-ring" },
      { id: 2, npc: 1, recipe: "bronze-ring" },
      { id: 3, npc: 2, recipe: "iron-ring" },
    ],
    nextOrderId: 4,
    equipped: null,
    protected: [],
    discovered: ["iron", "bronze"],
    crafted: [],
    title: "Çırak",
    hitap: "Lord",
    stats: { merged: 0, broken: 0, sold: 0, best: 0, gemPity: 0 },
    settings: { music: true, sound: true, haptics: true, motion: true },
    tutorial: false,
    campaign: { start: now, end: now + 3600000 },
  };
}
export const powerActive = (g: Game, now: number) =>
  now >= g.campaign.start && now < g.campaign.end;
export function refill(g: Game, now: number): Game {
  if (!Number.isFinite(now) || now <= g.energyAt) return g;
  if (g.energy >= ENERGY_CAP) return g;
  const overlap = Math.max(
    0,
    Math.min(now, g.campaign.end) - Math.max(g.energyAt, g.campaign.start),
  );
  const accrued = g.energyRemainder + now - g.energyAt + overlap;
  const added = Math.floor(accrued / 60000);
  if (!added) return g;
  const energy = Math.min(ENERGY_CAP, g.energy + added);
  return {
    ...g,
    energy,
    energyAt: now,
    energyRemainder: energy === ENERGY_CAP ? 0 : accrued % 60000,
  };
}
const distance = (a: number, b: number) =>
  Math.abs((a % COLS) - (b % COLS)) +
  Math.abs(Math.floor(a / COLS) - Math.floor(b / COLS));
const validIndex = (i: number) =>
  Number.isInteger(i) && i >= 0 && i < COLS * ROWS;
const rnd = (env: Env) => Math.min(0.999999999, Math.max(0, env.random()));
export const activeBonus = (g: Game) =>
  (g.equipped && recipe(g.equipped)?.bonus) || 0;
export function canCraft(g: Game, id: string) {
  const r = recipe(id);
  return (
    !!r &&
    r.level <= levelForXp(g.xp).level &&
    g.bars[r.metal] >= r.bars &&
    (!r.gem || g.gems[r.gem] >= r.gems)
  );
}
export const availableProduct = (g: Game, id: string) =>
  g.protected.includes(id)
    ? 0
    : Math.max(0, (g.products[id] || 0) - (g.equipped === id ? 1 : 0));
export function titles(g: Game) {
  const result = ["Çırak"];
  if (g.stats.sold >= 10) result.push("Kasabanın Ustası");
  if (g.discovered.length >= 4) result.push("Kristal Ustası");
  if (g.stats.best >= 5) result.push("Zincir Ustası");
  if (levelForXp(g.xp).level >= 12) result.push("Usta");
  if (levelForXp(g.xp).level >= 20 && g.stats.sold >= 100) result.push(g.hitap);
  return result;
}
function nextRecipe(g: Game, env: Env): RecipeId {
  const options = RECIPES.filter((r) => r.level <= levelForXp(g.xp).level);
  return options[Math.floor(rnd(env) * options.length)].id;
}
function breakOre(g: Game, cell: Ore, depth: number, env: Env) {
  g.bars[cell.material] += Math.floor(
    BREAK_BARS[cell.stage] * (1 + depth * 0.25),
  );
  g.stats.broken++;
  g.stats.gemPity++;
  if (rnd(env) < 0.35 || g.stats.gemPity >= 3) {
    // Cycle the pity reward so no early recipe depends on a lucky drop forever.
    const gem = GEMS[Math.floor((g.stats.broken - 1) / 3) % GEMS.length];
    g.gems[gem]++;
    g.stats.gemPity = 0;
  }
}
export function apply(input: Game, cmd: Command, env: Env): Result {
  const base = refill(input, env.now);
  const fail = (text: string): Result => ({
    game: base,
    event: { kind: "notice", text },
  });
  const ok = (game: Game, event: Feedback): Result => ({ game, event });
  if (cmd.type === "produce") {
    const empty = base.board.flatMap((c, i) => (c === null ? [i] : []));
    if (!empty.length)
      return fail("Tahta dolu. Birleştir veya hazır cevheri kır.");
    if (base.energy < 1)
      return fail("Enerjin yenileniyor. Birleştirmeye devam edebilirsin.");
    const choices = MATERIALS.filter(
      (m) => METALS[m].level <= levelForXp(base.xp).level,
    );
    let roll = rnd(env) * choices.reduce((sum, m) => sum + METALS[m].weight, 0),
      material = choices[0];
    for (const m of choices) {
      roll -= METALS[m].weight;
      if (roll < 0) {
        material = m;
        break;
      }
    }
    const index = empty[Math.floor(rnd(env) * empty.length)],
      board = [...base.board];
    board[index] = ore(material, rnd(env) < base.workshop * 0.025 ? 2 : 1);
    const discovered = base.discovered.includes(material)
      ? base.discovered
      : [...base.discovered, material];
    return ok(
      {
        ...base,
        board,
        energy: base.energy - 1,
        energyAt: base.energy === ENERGY_CAP ? env.now : base.energyAt,
        discovered,
      },
      {
        kind: discovered === base.discovered ? "produce" : "discover",
        text: `${METALS[material].name} cevheri çıktı.`,
        material,
        indices: [index],
      },
    );
  }
  if (cmd.type === "move") {
    if (!validIndex(cmd.from) || !validIndex(cmd.to) || cmd.from === cmd.to)
      return fail("Geçerli bir hedef seç.");
    const a = base.board[cmd.from],
      b = base.board[cmd.to];
    if (a?.kind !== "ore" || (b !== null && b.kind !== "ore"))
      return fail("Üreticiler sabit kalır.");
    const board = [...base.board];
    if (!b) {
      board[cmd.to] = a;
      board[cmd.from] = null;
      return ok({ ...base, board }, { kind: "move", text: "Cevher taşındı." });
    }
    if (a.material !== b.material || a.stage !== b.stage || a.stage >= 5)
      return fail("Aynı maden ve aynı seviyeyi birleştir.");
    board[cmd.to] = ore(a.material, a.stage + 1);
    board[cmd.from] = null;
    return ok(
      {
        ...base,
        board,
        stats: { ...base.stats, merged: base.stats.merged + 1 },
      },
      {
        kind: "merge",
        stage: a.stage + 1,
        material: a.material,
        indices: [cmd.to],
        text: `${METALS[a.material].name} · Seviye ${a.stage + 1}`,
      },
    );
  }
  if (cmd.type === "break" || cmd.type === "chain") {
    if (!validIndex(cmd.index)) return fail("Bir cevher seç.");
    const first = base.board[cmd.index];
    if (first?.kind !== "ore" || first.stage < 3)
      return fail("Cevher 3. seviyeden itibaren kırılır.");
    const chain = cmd.type === "chain";
    if (chain && base.mana < 100)
      return fail("Önce cevher kırarak büyü enerjisini doldur.");
    const g: Game = {
      ...base,
      board: [...base.board],
      bars: { ...base.bars },
      gems: { ...base.gems },
      stats: { ...base.stats },
    };
    const queue = [{ index: cmd.index, depth: 0 }],
      visited = new Set([cmd.index]);
    let points = 0;
    for (let head = 0; head < queue.length; head++) {
      const { index, depth } = queue[head],
        cell = base.board[index];
      if (cell?.kind !== "ore") continue;
      if (chain)
        base.board.forEach((c, i) => {
          if (
            c?.kind === "ore" &&
            c.stage >= 3 &&
            !visited.has(i) &&
            distance(index, i) <= cell.stage - 2
          ) {
            visited.add(i);
            queue.push({ index: i, depth: depth + 1 });
          }
        });
      breakOre(g, cell, depth, env);
      g.board[index] = null;
      points += 25 * cell.stage * Math.min(depth + 1, 8);
    }
    if (chain) points = Math.round(points * (1 + activeBonus(g) / 100));
    g.score += points;
    g.mana = chain
      ? 0
      : Math.min(100, base.mana + [0, 0, 0, 18, 35, 60][first.stage]);
    g.stats.best = Math.max(g.stats.best, queue.length);
    return ok(g, {
      kind: chain ? "chain" : "break",
      points,
      indices: queue.map((x) => x.index),
      material: first.material,
      stage: first.stage,
      text: chain
        ? `ZİNCİR ×${queue.length} · +${points}`
        : `${METALS[first.material].name} depoya gönderildi.`,
    });
  }
  if (cmd.type === "craft") {
    const r = recipe(cmd.recipe);
    if (!r || !canCraft(base, cmd.recipe))
      return fail("Tarif kilitli veya malzemelerin eksik.");
    const bars = { ...base.bars, [r.metal]: base.bars[r.metal] - r.bars },
      gems = { ...base.gems };
    if (r.gem) gems[r.gem] -= r.gems;
    return ok(
      {
        ...base,
        bars,
        gems,
        products: { ...base.products, [r.id]: (base.products[r.id] || 0) + 1 },
        crafted: base.crafted.includes(r.id)
          ? base.crafted
          : [...base.crafted, r.id],
      },
      { kind: "craft", text: `${r.name} hazır. Depoya eklendi.` },
    );
  }
  if (cmd.type === "deliver" || cmd.type === "replace-order") {
    const order = base.orders.find((o) => o.id === cmd.id);
    if (!order) return fail("Bu sipariş zaten tamamlandı.");
    const r = recipe(order.recipe)!;
    if (cmd.type === "replace-order")
      return ok(
        {
          ...base,
          orders: base.orders.map((o) =>
            o.id === cmd.id
              ? { ...o, id: base.nextOrderId, recipe: nextRecipe(base, env) }
              : o,
          ),
          nextOrderId: base.nextOrderId + 1,
        },
        { kind: "order", text: "Yeni sipariş geldi." },
      );
    if (availableProduct(base, r.id) < 1)
      return fail("Ürün hazır değil veya korunuyor.");
    const xp =
      base.xp + Math.round(r.xp * (powerActive(base, env.now) ? 1.5 : 1));
    const after = { ...base, xp };
    const orders = base.orders.map((o) =>
      o.id === cmd.id
        ? { ...o, id: base.nextOrderId, recipe: nextRecipe(after, env) }
        : o,
    );
    return ok(
      {
        ...after,
        orders,
        nextOrderId: base.nextOrderId + 1,
        products: { ...base.products, [r.id]: base.products[r.id] - 1 },
        gold: base.gold + r.gold,
        stats: { ...base.stats, sold: base.stats.sold + 1 },
      },
      {
        kind:
          levelForXp(xp).level > levelForXp(base.xp).level
            ? "level"
            : "deliver",
        level: levelForXp(xp).level,
        text: `+${r.gold} altın · +${xp - base.xp} XP`,
      },
    );
  }
  if (cmd.type === "equip" || cmd.type === "protect") {
    const r = recipe(cmd.item);
    if (!r || !base.products[r.id]) return fail("Bu eşya depoda bulunmuyor.");
    if (cmd.type === "protect")
      return ok(
        {
          ...base,
          protected: base.protected.includes(r.id)
            ? base.protected.filter((x) => x !== r.id)
            : [...base.protected, r.id],
        },
        {
          kind: "equip",
          text: base.protected.includes(r.id)
            ? "Eşya koruması kaldırıldı."
            : "Eşya satıştan korundu.",
        },
      );
    if (!r.bonus) return fail("Yalnızca amulet takılabilir.");
    return ok(
      { ...base, equipped: base.equipped === r.id ? null : r.id },
      {
        kind: "equip",
        text: base.equipped === r.id ? "Amulet çıkarıldı." : "Amulet takıldı.",
      },
    );
  }
  if (cmd.type === "upgrade") {
    if (base.workshop >= 8) return fail("Karbasan atölyesi tamamlandı.");
    if (levelForXp(base.xp).level < workshopLevel(base.workshop))
      return fail(`Önce ${workshopLevel(base.workshop)}. seviyeye ulaş.`);
    const cost = workshopCost(base.workshop);
    if (base.gold < cost) return fail("Atölye için yeterli altının yok.");
    return ok(
      { ...base, gold: base.gold - cost, workshop: base.workshop + 1 },
      { kind: "upgrade", text: "Karbasan atölyen gelişti!" },
    );
  }
  if (cmd.type === "buy-energy") {
    if (base.energy >= ENERGY_CAP) return fail("Enerjin zaten dolu.");
    if (base.gold < ENERGY_PRICE) return fail("Yeterli altının yok.");
    return ok(
      {
        ...base,
        gold: base.gold - ENERGY_PRICE,
        energy: Math.min(ENERGY_CAP, base.energy + ENERGY_PACK),
      },
      { kind: "purchase", text: "Enerji eklendi." },
    );
  }
  if (cmd.type === "setting")
    return ok(
      { ...base, settings: { ...base.settings, [cmd.key]: cmd.value } },
      { kind: "setting", text: "Ayar kaydedildi." },
    );
  if (cmd.type === "tutorial")
    return ok(
      { ...base, tutorial: true },
      { kind: "tutorial", text: "Maden üretmek için kazmaya dokun." },
    );
  if (cmd.type === "hitap")
    return ok(
      {
        ...base,
        hitap: cmd.value,
        title: base.title === base.hitap ? cmd.value : base.title,
      },
      { kind: "title", text: "Hitabın güncellendi." },
    );
  if (cmd.type === "title" && titles(base).includes(cmd.title))
    return ok(
      { ...base, title: cmd.title },
      { kind: "title", text: "Unvan seçildi." },
    );
  return fail("Bu işlem henüz kullanılamıyor.");
}
const obj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const number = (v: unknown, max = 100000000) =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= 0 && v <= max;
export function isGame(v: unknown): v is Game {
  if (
    !obj(v) ||
    v.version !== 3 ||
    !Array.isArray(v.board) ||
    v.board.length !== 48
  )
    return false;
  if (
    !v.board.every((c, i) =>
      c === null
        ? i !== MINE && i !== FORGE
        : obj(c) &&
          (i === MINE
            ? c.kind === "mine"
            : i === FORGE
              ? c.kind === "forge"
              : c.kind === "ore" &&
                MATERIALS.includes(c.material as Material) &&
                number(c.stage, 5) &&
                (c.stage as number) >= 1),
    )
  )
    return false;
  for (const key of [
    "energy",
    "gold",
    "xp",
    "score",
    "mana",
    "workshop",
    "nextOrderId",
    "energyRemainder",
  ])
    if (!number(v[key])) return false;
  if (
    (v.energy as number) > 100 ||
    (v.mana as number) > 100 ||
    (v.workshop as number) > 8 ||
    (v.energyRemainder as number) >= 60000 ||
    !number(v.energyAt, Number.MAX_SAFE_INTEGER)
  )
    return false;
  if (
    !obj(v.bars) ||
    !MATERIALS.every((m) => number((v.bars as Record<string, unknown>)[m])) ||
    !obj(v.gems) ||
    !GEMS.every((m) => number((v.gems as Record<string, unknown>)[m]))
  )
    return false;
  if (
    !obj(v.products) ||
    !Object.entries(v.products).every(
      ([id, n]) => CRAFTING_IDS.includes(id as RecipeId) && number(n),
    )
  )
    return false;
  if (
    !Array.isArray(v.orders) ||
    v.orders.length !== 3 ||
    !v.orders.every(
      (o) =>
        obj(o) &&
        number(o.id) &&
        (o.id as number) < (v.nextOrderId as number) &&
        number(o.npc, 2) &&
        !!recipe(String(o.recipe)),
    ) ||
    new Set(v.orders.map((o) => o.id)).size !== 3
  )
    return false;
  const ids = (a: unknown, valid: (x: unknown) => boolean) =>
    Array.isArray(a) && a.every(valid) && new Set(a).size === a.length;
  if (
    !ids(v.discovered, (x) => MATERIALS.includes(x as Material)) ||
    !ids(v.crafted, (x) => !!recipe(String(x))) ||
    !ids(
      v.protected,
      (x) =>
        !!recipe(String(x)) &&
        Number((v.products as Record<string, unknown>)[String(x)]) > 0,
    )
  )
    return false;
  if (
    v.equipped !== null &&
    (typeof v.equipped !== "string" ||
      !recipe(v.equipped)?.bonus ||
      !Number(v.products[v.equipped]))
  )
    return false;
  if (
    !obj(v.settings) ||
    !["music", "sound", "haptics", "motion"].every(
      (k) => typeof (v.settings as Record<string, unknown>)[k] === "boolean",
    ) ||
    typeof v.tutorial !== "boolean"
  )
    return false;
  if (
    !obj(v.stats) ||
    !["merged", "broken", "sold", "best", "gemPity"].every((k) =>
      number((v.stats as Record<string, unknown>)[k]),
    )
  )
    return false;
  return (
    obj(v.campaign) &&
    number(v.campaign.start, Number.MAX_SAFE_INTEGER) &&
    number(v.campaign.end, Number.MAX_SAFE_INTEGER) &&
    (v.campaign.end as number) >= (v.campaign.start as number) &&
    typeof v.title === "string" &&
    v.title.length < 80 &&
    (v.hitap === "Lord" || v.hitap === "Leydi")
  );
}
