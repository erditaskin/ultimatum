import AsyncStorage from "@react-native-async-storage/async-storage";
import { Game, initial, isGame, migrateGame } from "../game/engine";
const KEY = "katlapatla:v2";
let pending = Promise.resolve();
export async function load(): Promise<Game> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw !== null) {
    const data: unknown = JSON.parse(raw);
    if (!isGame(data))
      throw new Error("Kayıt biçimi okunamadı. Mevcut kayıt korundu.");
    return data;
  }
  const legacy = await AsyncStorage.getItem("katlapatla:v1");
  if (legacy === null) return initial(Date.now());
  const migrated = migrateGame(JSON.parse(legacy));
  if (!migrated)
    throw new Error("Eski kayıt dönüştürülemedi. Mevcut kayıt korundu.");
  // Keep the v1 key intact as a recovery copy; publish v2 only after successful migration.
  await AsyncStorage.setItem(KEY, JSON.stringify(migrated));
  return migrated;
}
export function save(game: Game): Promise<void> {
  if (!isGame(game))
    return Promise.reject(new Error("Geçersiz oyun durumu kaydedilmedi."));
  const raw = JSON.stringify(game);
  const write = pending
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(KEY, raw));
  pending = write;
  return write;
}
