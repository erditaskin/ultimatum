import AsyncStorage from "@react-native-async-storage/async-storage";
import { Game, initial, isGame } from "../game/engine";
const KEY = "katlapatla:v1";
let pending = Promise.resolve();
export async function load(): Promise<Game> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === null) return initial(Date.now());
  const data: unknown = JSON.parse(raw);
  if (!isGame(data))
    throw new Error("Kayıt biçimi okunamadı. Mevcut kayıt korundu.");
  return data;
}
export function save(game: Game): Promise<void> {
  const raw = JSON.stringify(game);
  const write = pending
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(KEY, raw));
  pending = write;
  return write;
}
