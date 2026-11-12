export const SIZE = 6;
export const CAPACITY = 60;
export type Tile = 1 | 2 | 3 | 4 | 5;
export const FAMILY_IDS = ["packets", "peppers", "cosmic"] as const;
export type Family = (typeof FAMILY_IDS)[number];
export type Piece = { level: Tile; family: Family };
export const piece = (level: Tile, family: Family = "packets"): Piece => ({
  level,
  family,
});
export type Campaign = { start: number; end: number };
// Release campaigns are explicit UTC instants. An empty list means no active campaign.
export const CAMPAIGNS: Campaign[] = [];
export type Game = {
  version: 2;
  board: (Piece | null)[];
  rights: number;
  refillAt: number;
  gold: number;
  score: number;
  progress: number;
  mission: number;
  reward: number | null;
  workshop: number;
  best: number;
  sound: boolean;
  haptics: boolean;
  motion: boolean;
};
export type Blast = {
  index: number;
  depth: number;
  points: number;
  family: Family;
};
export const target = (g: Game) => 500 + g.mission * 250;
export const upgradeCost = (g: Game) => 100 + g.workshop * 75;
export const activePowerHour = (now: number, campaigns = CAMPAIGNS) =>
  campaigns.some((c) => now >= c.start && now < c.end);
export const missionReward = (
  mission: number,
  now: number,
  campaigns = CAMPAIGNS,
) =>
  Math.floor(
    (100 + mission * 15) * (activePowerHour(now, campaigns) ? 1.5 : 1),
  );
export function initial(now: number): Game {
  const board: Game["board"] = Array(36).fill(null);
  board[14] = piece(3);
  board[15] = piece(3, "peppers");
  board[20] = piece(1);
  board[21] = piece(1);
  board[2] = piece(1, "cosmic");
  board[3] = piece(1, "cosmic");
  board[4] = piece(1, "peppers");
  board[5] = piece(1, "peppers");
  return {
    version: 2,
    board,
    rights: CAPACITY,
    refillAt: now,
    gold: 0,
    score: 0,
    progress: 0,
    mission: 0,
    reward: null,
    workshop: 0,
    best: 0,
    sound: true,
    haptics: true,
    motion: true,
  };
}
export function refill(g: Game, now: number, campaigns = CAMPAIGNS): Game {
  if (now <= g.refillAt) return g;
  if (g.rights >= CAPACITY) return { ...g, refillAt: now };
  let cursor = g.refillAt;
  let units = 0;
  const cuts = [
    ...new Set(
      campaigns
        .flatMap((c) => [c.start, c.end])
        .filter((t) => t > cursor && t < now),
    ),
  ].sort((a, b) => a - b);
  for (const end of [...cuts, now]) {
    units += (end - cursor) * (activePowerHour(cursor, campaigns) ? 2 : 1);
    cursor = end;
  }
  const gained = Math.floor(units / 30000);
  if (g.rights + gained >= CAPACITY)
    return { ...g, rights: CAPACITY, refillAt: now };
  // Remaining weighted time is retained by locating its timestamp backwards across boundaries.
  let remaining = units % 30000;
  cursor = now;
  for (const start of [...cuts.reverse(), g.refillAt]) {
    const rate = activePowerHour((start + cursor) / 2, campaigns) ? 2 : 1;
    const weight = (cursor - start) * rate;
    if (remaining <= weight)
      return {
        ...g,
        rights: g.rights + gained,
        refillAt: cursor - remaining / rate,
      };
    remaining -= weight;
    cursor = start;
  }
  return g;
}
export function produce(
  g: Game,
  index: number,
  now: number,
  family: Family = "packets",
): Game {
  g = refill(g, now);
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= 36 ||
    g.board[index] !== null ||
    g.rights < 1
  )
    return g;
  const board = [...g.board];
  board[index] = piece(1, family);
  return { ...g, board, rights: g.rights - 1 };
}
export function move(g: Game, from: number, to: number): Game {
  if (
    ![from, to].every((i) => Number.isInteger(i) && i >= 0 && i < 36) ||
    from === to
  )
    return g;
  const a = g.board[from],
    b = g.board[to];
  if (
    !a ||
    (b !== null &&
      (a.level !== b.level || a.family !== b.family || a.level === 5))
  )
    return g;
  const board = [...g.board];
  board[from] = null;
  board[to] = b === null ? a : piece((a.level + 1) as Tile, a.family);
  return { ...g, board };
}
export const distance = (a: number, b: number) =>
  Math.abs((a % 6) - (b % 6)) + Math.abs(Math.floor(a / 6) - Math.floor(b / 6));
export function blast(
  g: Game,
  index: number,
  now: number,
): { game: Game; events: Blast[] } {
  if (!g.board[index] || g.board[index]!.level < 3)
    return { game: g, events: [] };
  const queue = [{ index, depth: 0 }],
    seen = new Set([index]);
  const events: Blast[] = [];
  for (let n = 0; n < queue.length; n++) {
    const { index: current, depth } = queue[n];
    const { level, family } = g.board[current]!;
    events.push({
      index: current,
      depth,
      family,
      points: [0, 0, 0, 100, 300, 900][level] * Math.min(depth + 1, 8),
    });
    g.board.forEach((tile, i) => {
      if (
        tile &&
        tile.level >= 3 &&
        !seen.has(i) &&
        distance(current, i) <= level - 2
      ) {
        seen.add(i);
        queue.push({ index: i, depth: depth + 1 });
      }
    });
  }
  const points = events.reduce((sum, e) => sum + e.points, 0);
  const progress = g.progress + points;
  return {
    events,
    game: {
      ...g,
      board: g.board.map((t, i) => (seen.has(i) ? null : t)),
      score: g.score + points,
      progress,
      best: Math.max(g.best, events.length),
      reward:
        g.reward ??
        (progress >= target(g) ? missionReward(g.mission, now) : null),
    },
  };
}
export function claim(g: Game, now: number): Game {
  if (g.reward === null) return g;
  const next: Game = {
    ...g,
    gold: g.gold + g.reward,
    progress: g.progress - target(g),
    mission: g.mission + 1,
    reward: null,
  };
  if (next.progress >= target(next))
    next.reward = missionReward(next.mission, now);
  return next;
}
export function upgrade(g: Game): Game {
  return g.workshop >= 5 || g.gold < upgradeCost(g)
    ? g
    : { ...g, gold: g.gold - upgradeCost(g), workshop: g.workshop + 1 };
}
export function isGame(value: unknown): value is Game {
  if (!value || typeof value !== "object") return false;
  const g = value as Game;
  return (
    g.version === 2 &&
    Array.isArray(g.board) &&
    g.board.length === 36 &&
    g.board.every(
      (t) =>
        t === null ||
        (typeof t === "object" &&
          t !== null &&
          Number.isInteger(t.level) &&
          t.level >= 1 &&
          t.level <= 5 &&
          FAMILY_IDS.includes(t.family)),
    ) &&
    [
      "rights",
      "refillAt",
      "gold",
      "score",
      "progress",
      "mission",
      "workshop",
      "best",
    ].every(
      (k) =>
        Number.isFinite(g[k as keyof Game]) && Number(g[k as keyof Game]) >= 0,
    ) &&
    g.rights <= CAPACITY &&
    [
      "rights",
      "gold",
      "score",
      "progress",
      "mission",
      "workshop",
      "best",
    ].every((k) => Number.isSafeInteger(g[k as keyof Game])) &&
    (g.reward === null || (Number.isSafeInteger(g.reward) && g.reward >= 0)) &&
    [g.sound, g.haptics, g.motion].every((v) => typeof v === "boolean")
  );
}

// Legacy generic Pofs gain stable, paired families once; all earned progress is preserved.
export function migrateGame(value: unknown): Game | null {
  if (isGame(value)) return value;
  if (!value || typeof value !== "object") return null;
  const legacy = value as Record<string, unknown>;
  if (
    legacy.version !== 1 ||
    !Array.isArray(legacy.board) ||
    legacy.board.length !== 36
  )
    return null;
  if (
    !legacy.board.every(
      (t) => t === null || (Number.isInteger(t) && t >= 1 && t <= 5),
    )
  )
    return null;
  const candidate = {
    ...legacy,
    version: 2,
    board: legacy.board.map((level, i) =>
      level === null ? null : piece(level, FAMILY_IDS[Math.floor(i / 2) % 3]),
    ),
  };
  return isGame(candidate) ? candidate : null;
}
