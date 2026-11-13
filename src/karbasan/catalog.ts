export const MATERIALS = [
  "iron",
  "bronze",
  "shadow",
  "agapite",
  "verite",
  "valorite",
  "blackrock",
  "bloodrock",
] as const;
export type Material = (typeof MATERIALS)[number];
export const GEMS = ["emerald", "ruby", "amethyst"] as const;
export type Gem = (typeof GEMS)[number];
export const METALS: Record<
  Material,
  { name: string; level: number; weight: number; color: string }
> = {
  iron: { name: "Demir", level: 1, weight: 48, color: "#7F8996" },
  bronze: { name: "Bronz", level: 1, weight: 34, color: "#934F36" },
  shadow: { name: "Gölge Demiri", level: 3, weight: 8, color: "#8D50BD" },
  agapite: { name: "Agapit", level: 5, weight: 5, color: "#D79E8D" },
  verite: { name: "Verit", level: 7, weight: 4, color: "#3DBD4D" },
  valorite: { name: "Valorit", level: 10, weight: 3, color: "#B474DF" },
  blackrock: { name: "Karataş", level: 14, weight: 2, color: "#1ABBCB" },
  bloodrock: { name: "Kızıltaş", level: 18, weight: 2, color: "#D72F50" },
};
export const GEM_NAMES: Record<Gem, string> = {
  emerald: "Zümrüt",
  ruby: "Yakut",
  amethyst: "Ametist",
};
export const STAGES = [
  "",
  "Parçası",
  "Kümesi",
  "Zengin Cevheri",
  "Yoğun Cevheri",
  "Çekirdeği",
];
export const RECIPES = [
  {
    id: "iron-ring",
    name: "Demir Yüzük",
    level: 1,
    metal: "iron",
    bars: 2,
    gem: null,
    gems: 0,
    gold: 85,
    xp: 45,
    art: "iron-ring-art",
    bonus: 0,
  },
  {
    id: "bronze-ring",
    name: "Zümrütlü Bronz Yüzük",
    level: 1,
    metal: "bronze",
    bars: 2,
    gem: "emerald",
    gems: 1,
    gold: 150,
    xp: 70,
    art: "ring",
    bonus: 0,
  },
  {
    id: "iron-bracelet",
    name: "Yakutlu Demir Bileklik",
    level: 2,
    metal: "iron",
    bars: 4,
    gem: "ruby",
    gems: 1,
    gold: 210,
    xp: 100,
    art: "iron-ruby-bracelet-art",
    bonus: 0,
  },
  {
    id: "shadow-amulet",
    name: "Gölge Amulet",
    level: 3,
    metal: "shadow",
    bars: 3,
    gem: "amethyst",
    gems: 1,
    gold: 340,
    xp: 140,
    art: "amulet-purple",
    bonus: 5,
  },
  {
    id: "agapite-amulet",
    name: "Koruyucu Agapit Amulet",
    level: 5,
    metal: "agapite",
    bars: 3,
    gem: "ruby",
    gems: 1,
    gold: 480,
    xp: 190,
    art: "amulet-red",
    bonus: 7,
  },
  {
    id: "verite-bracelet",
    name: "Verit Bileklik",
    level: 7,
    metal: "verite",
    bars: 4,
    gem: "emerald",
    gems: 2,
    gold: 650,
    xp: 240,
    art: "bracelet",
    bonus: 0,
  },
  {
    id: "valorite-amulet",
    name: "Işıltılı Valorit Amulet",
    level: 10,
    metal: "valorite",
    bars: 3,
    gem: "amethyst",
    gems: 2,
    gold: 850,
    xp: 300,
    art: "amulet-purple",
    bonus: 10,
  },
  {
    id: "blackrock-amulet",
    name: "Karataş Amulet",
    level: 14,
    metal: "blackrock",
    bars: 3,
    gem: "amethyst",
    gems: 2,
    gold: 1100,
    xp: 380,
    art: "blackrock-amulet-art",
    bonus: 12,
  },
  {
    id: "bloodrock-crown",
    name: "Kızıltaş Tacı",
    level: 18,
    metal: "bloodrock",
    bars: 4,
    gem: "ruby",
    gems: 3,
    gold: 1500,
    xp: 460,
    art: "bloodrock-crown-art",
    bonus: 0,
  },
] as const satisfies readonly {
  id: string;
  name: string;
  level: number;
  metal: Material;
  bars: number;
  gem: Gem | null;
  gems: number;
  gold: number;
  xp: number;
  art: string;
  bonus: number;
}[];
export type Recipe = (typeof RECIPES)[number];
export type RecipeId = Recipe["id"];
export const recipe = (id: string) => RECIPES.find((r) => r.id === id);
export const COLS = 6,
  ROWS = 8,
  MINE = 42,
  FORGE = 47,
  ENERGY_CAP = 100;
export const CRAFTING_IDS = RECIPES.map((r) => r.id);
export const NPC_NAMES = ["Boran", "Elin", "Tarkan"];
export const ENERGY_PRICE = 250,
  ENERGY_PACK = 30;
export const BREAK_BARS = [0, 0, 0, 1, 3, 8];
export function levelForXp(xp: number) {
  let level = 1,
    spent = 0;
  while (level < 50 && xp >= spent + xpForNext(level))
    spent += xpForNext(level++);
  return { level, current: xp - spent, needed: xpForNext(level) };
}
export const xpForNext = (level: number) => Math.round(120 + 65 * level ** 1.7);
export const rankForLevel = (level: number) =>
  level < 5
    ? "Çırak"
    : level < 12
      ? "Kalfa"
      : level < 20
        ? "Usta"
        : "Büyük Usta";
export const workshopCost = (stage: number) => Math.round(350 * 1.85 ** stage);
export const workshopLevel = (stage: number) => stage * 2 + 1;
