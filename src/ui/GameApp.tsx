import React, {
  Profiler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  AppState,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import {
  Game,
  NAMES,
  missionReward,
  activePowerHour,
  blast,
  claim,
  distance,
  move,
  produce,
  refill,
  target,
  upgrade,
  upgradeCost,
} from "../game/engine";
import { load, save } from "../storage/save";
import { Tile } from "./Tile";
import { Workshop } from "./Workshop";
import { Celebration } from "./Celebration";
const stages = [
  "Minik Atölye",
  "Yaylı Atölye",
  "Pof Fabrikası",
  "Gümbürtü Laboratuvarı",
  "Çılgın Dönüşüm Merkezi",
];
function WorkshopCard({
  game,
  onUpgrade,
}: {
  game: Game;
  onUpgrade: () => void;
}) {
  return (
    <View style={s.workshop}>
      <View style={s.row}>
        <View>
          <Text style={s.eyebrow}>ATÖLYEN · AŞAMA {game.workshop + 1}</Text>
          <Text style={s.cardTitle}>{stages[Math.min(game.workshop, 4)]}</Text>
        </View>
        <Text style={{ fontSize: 30 }}>
          {["✦", "✦", "✧", "ϟ", "★"][Math.min(game.workshop, 4)]}
        </Text>
      </View>
      <Workshop stage={game.workshop} />
      <Text style={s.muted}>Her dönüşüm atölyene yeni bir parıltı katar.</Text>
      <Pressable
        accessibilityRole="button"
        disabled={game.workshop >= 5 || game.gold < upgradeCost(game)}
        onPress={onUpgrade}
        style={[
          s.upgrade,
          (game.workshop >= 5 || game.gold < upgradeCost(game)) && {
            opacity: 0.45,
          },
        ]}
      >
        <Text style={s.text}>
          {game.workshop >= 5
            ? "Atölye tamamlandı!"
            : `Dönüştür · ${upgradeCost(game)} altın`}
        </Text>
      </Pressable>
    </View>
  );
}
function GameScreen() {
  const [now, setNow] = useState(() => Date.now());
  const [game, setGame] = useState<Game | null>(null),
    [error, setError] = useState(""),
    [selected, setSelected] = useState<number | null>(null),
    [armed, setArmed] = useState<number | null>(null),
    [settings, setSettings] = useState(false),
    [workshopOpen, setWorkshopOpen] = useState(false),
    [message, setMessage] = useState(
      "İki Pof’u birleştir. Makinelere basılı tut!",
    ),
    [burst, setBurst] = useState<{ text: string; indices: number[] } | null>(
      null,
    ),
    [playback, setPlayback] = useState<Game["board"] | null>(null);
  const current = useRef<Game | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    alive = useRef(true),
    locked = useRef(false);
  const { width } = useWindowDimensions();
  const boardWidth = Math.min(width - 36, 420),
    cell = boardWidth / 6;
  const player = useAudioPlayer(require("../../assets/audio/pop.wav"));
  useEffect(() => {
    alive.current = true;
    Promise.all([
      load(),
      AccessibilityInfo.isReduceMotionEnabled().catch(() => false),
    ])
      .then(([loaded, reduced]) => {
        const g = reduced ? { ...loaded, motion: false } : loaded;
        if (alive.current) {
          current.current = g;
          setGame(g);
        }
      })
      .catch((e) => setError(String(e)));
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const commit = useCallback((next: Game) => {
    if (next === current.current) return;
    current.current = next;
    setGame(next);
    save(next)
      .then(() => {
        if (alive.current) setError("");
      })
      .catch(() => {
        if (alive.current)
          setError(
            "Kayıt yazılamadı. Son değişiklik cihazda saklanmamış olabilir.",
          );
      });
  }, []);
  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
      if (current.current) {
        const next = refill(current.current, Date.now());
        if (next.rights !== current.current.rights) commit(next);
      }
    };
    const id = setInterval(tick, 1000);
    const sub = AppState.addEventListener("change", (state) => {
      setArmed(null);
      setSelected(null);
      if (state === "active") tick();
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [commit]);
  const onMove = useCallback(
    (from: number, to: number) => {
      if (!current.current || locked.current) return;
      const next = move(current.current, from, to);
      if (next === current.current) {
        setMessage("Aynı seviyeleri birleştir veya boş kareye taşı.");
        return;
      }
      commit(next);
      setSelected(null);
      setMessage("Hazırlık güzel! Zincir için makineleri yakınlaştır.");
    },
    [commit],
  );
  const onTap = useCallback(
    (i: number) => {
      if (!current.current || locked.current) return;
      if (selected !== null && selected !== i) {
        onMove(selected, i);
        return;
      }
      setSelected(selected === i ? null : i);
      const t = current.current.board[i];
      setMessage(
        t
          ? `${NAMES[t]} · Seviye ${t}${t >= 3 ? " · Patlatmak için basılı tut." : ""}`
          : "Boş kare · Bir parçayı seçip buraya taşı.",
      );
    },
    [selected, onMove],
  );
  const onBlast = useCallback(
    (i: number) => {
      const g = current.current;
      if (!g || locked.current) return;
      const started = performance.now();
      const result = blast(g, i, Date.now());
      if (__DEV__)
        console.info("[performance] blast ms", performance.now() - started);
      if (!result.events.length) return;
      locked.current = true;
      setSelected(null);
      setArmed(null);
      commit(result.game);
      const points = result.events.reduce((sum, e) => sum + e.points, 0);
      const waves = [...new Set(result.events.map((e) => e.depth))];
      let shown = 0;
      const visual = [...g.board];
      setPlayback(visual);
      const showWave = (step: number) => {
        if (!alive.current) return;
        const wave = result.events.filter((e) => e.depth === waves[step]);
        wave.forEach((e) => {
          visual[e.index] = null;
          shown += e.points;
        });
        if (g.haptics)
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          ).catch(() => {});
        if (g.sound) {
          try {
            player.setPlaybackRate(Math.min(1 + step * 0.12, 2));
            void player
              .seekTo(0)
              .then(() => player.play())
              .catch(() => {});
          } catch (error) {
            if (__DEV__) console.warn("Audio feedback unavailable", error);
          }
        }

        setPlayback([...visual]);
        setBurst({
          text: `${result.events.length > 1 ? "ZİNCİR KOMBO!" : "POF!"} ×${Math.min(waves[step] + 1, 8)}\n+${shown.toLocaleString("tr-TR")}`,
          indices: wave.map((e) => e.index),
        });
        timer.current = setTimeout(
          () => {
            if (step + 1 < waves.length) showWave(step + 1);
            else {
              locked.current = false;
              setBurst(null);
              setPlayback(null);
            }
          },
          g.motion ? 350 : 80,
        );
      };
      showWave(0);
      setMessage(`${result.events.length} makine patladı. +${points} puan!`);
    },
    [commit, player],
  );
  const make = () => {
    const g = current.current;
    if (!g || locked.current) return;
    const empty = g.board.flatMap((t, i) => (t === null ? [i] : []));
    if (!empty.length) {
      setMessage("Tahta dolu. Birleştir veya bir makine patlat.");
      return;
    }
    const next = produce(
      g,
      empty[Math.floor(Math.random() * empty.length)],
      Date.now(),
    );
    commit(next);
    setMessage(
      next.board === g.board
        ? "Haklar yenileniyor. Eldeki parçalarla devam edebilirsin."
        : "Yeni Pof geldi. Aynı seviyeleri birleştir!",
    );
  };
  const onUpgrade = () => {
    if (!current.current || locked.current) return;
    const next = upgrade(current.current);
    if (next !== current.current) {
      commit(next);
      setMessage("Atölye dönüştü! Daha büyük kombolar seni bekliyor.");
    }
  };
  if (!game)
    return (
      <SafeAreaView style={s.loading}>
        {error ? (
          <>
            <Text style={s.text}>{error}</Text>
            <Text style={s.muted}>
              Mevcut kayıt korundu. Uygulamayı yeniden açmayı dene.
            </Text>
          </>
        ) : (
          <ActivityIndicator color="#FDE09A" />
        )}
      </SafeAreaView>
    );
  const power = activePowerHour(now),
    ready = game.reward !== null;
  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={s.content} bounces={false}>
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>ÇILGIN DÖNÜŞÜM ATÖLYESİ</Text>
            <Text style={s.title}>
              katla<Text style={{ color: "#FFB67F" }}>patla</Text>
              <Text style={{ color: "#FAE59A" }}>!</Text>
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Ayarlar"
            onPress={() => setSettings(true)}
            style={s.gear}
          >
            <Text style={s.muted}>Ayar</Text>
          </Pressable>
        </View>
        <View style={s.stats}>
          <Text style={s.stat}>ϟ {game.rights}/60</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Atölyeyi aç, ${game.gold} altın`}
            onPress={() => setWorkshopOpen(true)}
          >
            <Text style={s.stat}>● {game.gold} altın ›</Text>
          </Pressable>
          <Text style={s.stat}>★ {game.score.toLocaleString("tr-TR")}</Text>
        </View>
        {power && (
          <Text style={s.power}>
            POWER HOUR · 2× yenilenme · +%50 görev altını
          </Text>
        )}
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.cardTitle}>GÖREV {game.mission + 1}</Text>
            <Text style={s.reward}>
              +{game.reward ?? missionReward(game.mission, now)} altın
            </Text>
          </View>
          <Text style={s.text}>
            {target(game).toLocaleString("tr-TR")} patlama puanı topla
          </Text>
          <View style={s.track}>
            <View
              style={[
                s.fill,
                {
                  width: `${Math.min(game.progress / target(game), 1) * 100}%`,
                },
              ]}
            />
          </View>
          <View style={s.row}>
            <Text style={s.muted}>
              {Math.min(game.progress, target(game))} / {target(game)}
            </Text>
            {ready && (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  if (!locked.current && current.current)
                    commit(claim(current.current, Date.now()));
                }}
              >
                <Text style={s.reward}>ÖDÜLÜ AL →</Text>
              </Pressable>
            )}
          </View>
        </View>
        <View style={[s.board, { width: boardWidth + 8 }]}>
          {(playback ?? game.board).map((level, i) => (
            <Tile
              key={i}
              level={level}
              index={i}
              size={cell}
              selected={selected === i}
              highlighted={
                (armed !== null &&
                  distance(armed, i) <= (game.board[armed] ?? 0) - 2) ||
                !!burst?.indices.includes(i)
              }
              motion={game.motion}
              onTap={onTap}
              onArm={setArmed}
              onBlast={onBlast}
              onMove={onMove}
            />
          ))}
        </View>
        <Text accessibilityLiveRegion="polite" style={s.hint}>
          {message}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pof üret, bir üretim hakkı"
          onPress={make}
          style={({ pressed }) => [s.produce, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Text style={s.produceTitle}>✦ POF ÜRET</Text>
          <Text style={s.produceSub}>
            1 üretim hakkı · Birleştir, hazırla, patlat!
          </Text>
        </Pressable>
        <WorkshopCard game={game} onUpgrade={onUpgrade} />
        <Text style={s.footer}>
          REKOR ZİNCİR {game.best} · ÇEVRİMDIŞI ATÖLYE
        </Text>
        {error && <Text style={s.error}>{error}</Text>}
      </ScrollView>
      {burst && <Celebration text={burst.text} motion={game.motion} />}
      <Modal
        visible={workshopOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setWorkshopOpen(false)}
      >
        <View style={s.modal}>
          <View style={s.modalCard}>
            <Text style={s.title}>Atölyen</Text>
            <WorkshopCard game={game} onUpgrade={onUpgrade} />
            <Pressable
              accessibilityRole="button"
              style={s.upgrade}
              onPress={() => setWorkshopOpen(false)}
            >
              <Text style={s.text}>Tahtaya dön</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        visible={settings}
        transparent
        animationType="fade"
        onRequestClose={() => setSettings(false)}
      >
        <View style={s.modal}>
          <View style={s.modalCard}>
            <Text style={s.title}>Ayarlar</Text>
            {(["sound", "haptics", "motion"] as const).map((key, i) => (
              <Pressable
                key={key}
                accessibilityRole="switch"
                accessibilityState={{ checked: game[key] }}
                onPress={() =>
                  current.current &&
                  commit({ ...current.current, [key]: !current.current[key] })
                }
                style={s.setting}
              >
                <Text style={s.text}>
                  {["Ses", "Titreşim", "Hareketli efektler"][i]}
                </Text>
                <Text style={s.reward}>{game[key] ? "Açık" : "Kapalı"}</Text>
              </Pressable>
            ))}
            <Text style={s.muted}>
              Taşı: sürükle veya seçip hedefe dokun. Patlat: 3. seviye ve üstüne
              kısa basılı tut. Küçük Pof’lar patlamadan korunur.
            </Text>
            <Pressable style={s.upgrade} onPress={() => setSettings(false)}>
              <Text style={s.text}>Oyuna dön</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
let commits: number[] = [];
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Profiler
          id="game"
          onRender={(_id, _phase, duration) => {
            if (__DEV__) {
              commits.push(duration);
              if (commits.length === 120) {
                console.info(
                  "[performance] React commit p95 ms",
                  commits.sort((a, b) => a - b)[113],
                );
                commits = [];
              }
            }
          }}
        >
          <GameScreen />
        </Profiler>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#101B2E" },
  loading: {
    flex: 1,
    backgroundColor: "#101B2E",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    color: "#9CAEC8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#B6E6D7",
    letterSpacing: -1.5,
  },
  gear: { padding: 12, backgroundColor: "#24334D", borderRadius: 16 },
  stats: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "#1C2A42",
    padding: 12,
    borderRadius: 15,
  },
  stat: { color: "#FDE09A", fontSize: 14, fontWeight: "800" },
  text: { color: "#EDF2FC", fontSize: 14, fontWeight: "600" },
  muted: { color: "#A7B6CC", fontSize: 12, lineHeight: 18 },
  card: {
    backgroundColor: "#20314A",
    padding: 14,
    borderRadius: 18,
    width: "100%",
    gap: 7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { color: "#F2E9D5", fontSize: 16, fontWeight: "800" },
  reward: { color: "#FDE09A", fontWeight: "800", fontSize: 12 },
  track: {
    height: 7,
    backgroundColor: "#101B2E",
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: { height: 7, backgroundColor: "#9CDDC4", borderRadius: 8 },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    backgroundColor: "#19263C",
    borderRadius: 20,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    color: "#C7D3E6",
    textAlign: "center",
    minHeight: 34,
  },
  produce: {
    backgroundColor: "#FFBD88",
    borderRadius: 18,
    padding: 14,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#C47D53",
  },
  produceTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#322C40",
    letterSpacing: 1,
  },
  produceSub: { fontSize: 11, color: "#594351", marginTop: 4 },
  workshop: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#3E4D63",
    borderRadius: 18,
    gap: 8,
    backgroundColor: "#1A293D",
  },
  upgrade: {
    padding: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#354863",
    marginTop: 5,
  },
  footer: { color: "#788CA9", fontSize: 9, letterSpacing: 1 },
  power: { color: "#FFCE7E", fontSize: 11, fontWeight: "900" },
  error: { color: "#FF9C9C", fontSize: 12 },
  modal: {
    flex: 1,
    backgroundColor: "#000A",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#20314A",
    borderRadius: 24,
    padding: 24,
    gap: 18,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
});
