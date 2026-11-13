import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AccessibilityInfo, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Command, Feedback, Game, Result, apply, refill } from "./engine";
import { repository } from "./persistence";
const repo = repository(AsyncStorage);
type State = {
  game: Game | null;
  now: number;
  loadError: string;
  saveError: boolean;
  feedback: (Feedback & { id: number }) | null;
  perform: (cmd: Command) => Result | null;
  retry: () => void;
  restore: () => void;
  clearFeedback: () => void;
};
const Context = createContext<State | null>(null);
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game | null>(null),
    [now, setNow] = useState(Date.now),
    [loadError, setLoadError] = useState(""),
    [saveError, setSaveError] = useState(false),
    [feedback, setFeedback] = useState<State["feedback"]>(null);
  const current = useRef<Game | null>(null),
    alive = useRef(true),
    sequence = useRef(0),
    saveSequence = useRef(0);
  const persist = useCallback((g: Game) => {
    const revision = ++saveSequence.current;
    void repo
      .save(g)
      .then(() => {
        if (alive.current && revision === saveSequence.current)
          setSaveError(false);
      })
      .catch(() => {
        if (alive.current && revision === saveSequence.current)
          setSaveError(true);
      });
  }, []);
  const commit = useCallback(
    (g: Game) => {
      if (current.current === g) return;
      current.current = g;
      setGame(g);
      persist(g);
    },
    [persist],
  );
  const load = useCallback(() => {
    void Promise.all([
      repo.load(Date.now()),
      AccessibilityInfo.isReduceMotionEnabled(),
    ])
      .then(([loaded, reduced]) => {
        if (!alive.current) return;
        const g = reduced
          ? { ...loaded, settings: { ...loaded.settings, motion: false } }
          : loaded;
        current.current = g;
        setGame(g);
        setLoadError("");
        persist(g);
      })
      .catch((e: unknown) => {
        if (alive.current)
          setLoadError(e instanceof Error ? e.message : "Kayıt okunamadı.");
      });
  }, [persist]);
  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
    };
  }, [load]);
  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (current.current) {
        const next = refill(current.current, t);
        if (next !== current.current) commit(next);
      }
    };
    const id = setInterval(tick, 1000);
    const subscription = AppState.addEventListener("change", (s) => {
      if (s === "active") tick();
      else if (current.current) persist(current.current);
    });
    return () => {
      clearInterval(id);
      subscription.remove();
    };
  }, [commit, persist]);
  const perform = useCallback(
    (cmd: Command) => {
      if (!current.current) return null;
      const result = apply(current.current, cmd, {
        now: Date.now(),
        random: Math.random,
      });
      commit(result.game);
      setFeedback({ ...result.event, id: ++sequence.current });
      return result;
    },
    [commit],
  );
  const retry = useCallback(() => {
    if (current.current) persist(current.current);
    else load();
  }, [persist, load]);
  const restore = useCallback(() => {
    void repo
      .restoreBackup()
      .then((g) => {
        if (alive.current) {
          current.current = g;
          setGame(g);
          setLoadError("");
          setSaveError(false);
        }
      })
      .catch((e: unknown) => {
        if (alive.current)
          setLoadError(e instanceof Error ? e.message : "Yedek okunamadı.");
      });
  }, []);
  const clearFeedback = useCallback(() => setFeedback(null), []);
  const value = useMemo(
    () => ({
      game,
      now,
      loadError,
      saveError,
      feedback,
      perform,
      retry,
      restore,
      clearFeedback,
    }),
    [
      game,
      now,
      loadError,
      saveError,
      feedback,
      perform,
      retry,
      restore,
      clearFeedback,
    ],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useGame() {
  const value = useContext(Context);
  if (!value) throw new Error("GameProvider eksik");
  return value;
}
