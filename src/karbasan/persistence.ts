import { Game, initial, isGame } from "./engine";
export const SAVE_KEY = "katlapatla:karbasan:v3";
export const BACKUP_KEY = `${SAVE_KEY}:backup`;
export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
}
function decode(raw: string): Game {
  const value: unknown = JSON.parse(raw);
  if (!isGame(value))
    throw new Error("Karbasan kaydı doğrulanamadı. Kayıt korunuyor.");
  return value;
}
export function repository(storage: Storage) {
  let pending: Promise<void> = Promise.resolve(),
    lastSaved: string | null = null;
  return {
    async load(now: number) {
      const raw = await storage.getItem(SAVE_KEY);
      if (raw === null) return initial(now);
      const game = decode(raw);
      lastSaved = raw;
      return game;
    },
    save(game: Game): Promise<void> {
      if (!isGame(game))
        return Promise.reject(new Error("Geçersiz kayıt yazılmadı."));
      const raw = JSON.stringify(game);
      const write = pending
        .catch(() => undefined)
        .then(async () => {
          if (lastSaved === raw) return;
          if (lastSaved !== null) await storage.setItem(BACKUP_KEY, lastSaved);
          await storage.setItem(SAVE_KEY, raw);
          lastSaved = raw;
        });
      pending = write;
      return write;
    },
    async restoreBackup() {
      await pending.catch(() => undefined);
      const raw = await storage.getItem(BACKUP_KEY);
      if (raw === null) throw new Error("Doğrulanmış yedek bulunamadı.");
      const game = decode(raw);
      await storage.setItem(SAVE_KEY, raw);
      lastSaved = raw;
      return game;
    },
  };
}
