import React, { useEffect, useRef, useState } from "react";
import { AppState, Modal, Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAudioPlayer, type AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useGame } from "../../karbasan/context";
import { METALS } from "../../karbasan/catalog";
import { Button, Label, Panel, Sprite, styles } from "./primitives";
// Expo audio players are mutable native handles, not React state.
function configureAudio(player: AudioPlayer, volume: number, loop = false) {
  player.volume = volume;
  player.loop = loop;
}
function Spark({ index, color }: { index: number; color: string }) {
  const phase = useSharedValue(0);
  useEffect(() => {
    phase.set(withTiming(1, { duration: 750 + index * 21 }));
  }, [phase, index]);
  const angle = (index * Math.PI * 2) / 22,
    radius = 70 + (index % 4) * 19;
  const style = useAnimatedStyle(() => ({
    opacity: 1 - phase.get(),
    transform: [
      { translateX: Math.cos(angle) * radius * phase.get() },
      { translateY: Math.sin(angle) * radius * phase.get() },
      { scale: 1 - phase.get() * 0.6 },
      { rotate: `${index * 17 + phase.get() * 100}deg` },
    ],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", left: "50%", top: 58 }, style]}
    >
      <Label
        style={{
          fontSize: 14 + (index % 3) * 4,
          color,
          textShadowColor: "#FFF8DF",
          textShadowRadius: 3,
        }}
      >
        ✦
      </Label>
    </Animated.View>
  );
}
export function FeedbackLayer() {
  const { feedback, game: g, saveError, retry, clearFeedback } = useGame();
  const preferences = useRef(g?.settings);
  useEffect(() => {
    preferences.current = g?.settings;
  }, [g?.settings]);
  const [dismissedId, setDismissedId] = useState(0);
  const visible = feedback && feedback.id !== dismissedId;
  const shown =
    visible && ["chain", "level", "discover", "upgrade"].includes(feedback.kind)
      ? feedback
      : null;
  const toast =
    visible &&
    !shown &&
    !["move", "setting", "produce", "tutorial"].includes(feedback.kind)
      ? feedback.text
      : "";
  const merge1 = useAudioPlayer(
      require("../../../assets/audio/karbasan/merge-1.wav"),
    ),
    merge2 = useAudioPlayer(
      require("../../../assets/audio/karbasan/merge-2.wav"),
    ),
    merge3 = useAudioPlayer(
      require("../../../assets/audio/karbasan/merge-3.wav"),
    ),
    merge4 = useAudioPlayer(
      require("../../../assets/audio/karbasan/merge-4.wav"),
    ),
    merge5 = useAudioPlayer(
      require("../../../assets/audio/karbasan/merge-5.wav"),
    );
  const broken = useAudioPlayer(
      require("../../../assets/audio/karbasan/break.wav"),
    ),
    chain = useAudioPlayer(require("../../../assets/audio/karbasan/chain.wav")),
    delivery = useAudioPlayer(
      require("../../../assets/audio/karbasan/deliver.wav"),
    ),
    level = useAudioPlayer(require("../../../assets/audio/karbasan/level.wav")),
    music = useAudioPlayer(
      require("../../../assets/audio/karbasan/ambience.wav"),
    );
  const players = useRef([
    merge1,
    merge2,
    merge3,
    merge4,
    merge5,
    broken,
    chain,
    delivery,
    level,
  ]);
  useEffect(() => {
    players.current = [
      merge1,
      merge2,
      merge3,
      merge4,
      merge5,
      broken,
      chain,
      delivery,
      level,
    ];
  }, [merge1, merge2, merge3, merge4, merge5, broken, chain, delivery, level]);
  useEffect(() => {
    configureAudio(music, 0.16, true);
    if (g?.settings.music) music.play();
    else music.pause();
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active" && g?.settings.music) music.play();
      else music.pause();
    });
    return () => sub.remove();
  }, [g?.settings.music, music]);
  useEffect(() => {
    const settings = preferences.current;
    if (!feedback || !settings) return;
    const player =
      feedback.kind === "merge"
        ? players.current[Math.max(0, Math.min(4, (feedback.stage ?? 1) - 1))]
        : feedback.kind === "break"
          ? broken
          : feedback.kind === "chain"
            ? chain
            : feedback.kind === "level"
              ? level
              : ["deliver", "craft", "upgrade"].includes(feedback.kind)
                ? delivery
                : null;
    if (settings.sound && player) {
      try {
        configureAudio(player, 0.55);
        void player
          .seekTo(0)
          .then(() => player.play())
          .catch(() => {});
      } catch {
        /* Sound failure must not change game results. */
      }
    }
    if (
      settings.haptics &&
      ["merge", "break", "chain", "deliver", "level", "craft"].includes(
        feedback.kind,
      )
    )
      void Haptics.impactAsync(
        feedback.kind === "chain"
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
    if (["level", "discover", "upgrade"].includes(feedback.kind)) return;
    const timer = setTimeout(
      () => {
        setDismissedId(feedback.id);
      },
      feedback.kind === "chain" ? 2200 : 3000,
    );
    return () => clearTimeout(timer);
  }, [feedback, broken, chain, delivery, level]);
  const close = () => {
    setDismissedId(feedback?.id ?? 0);
    clearFeedback();
  };
  return (
    <>
      {toast && (
        <View
          pointerEvents="none"
          style={{ position: "absolute", left: 28, right: 28, bottom: 130 }}
        >
          <Panel kind="info" padding={13}>
            <Label
              accessibilityLiveRegion="polite"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {toast}
            </Label>
          </Panel>
        </View>
      )}
      {saveError && (
        <View style={{ position: "absolute", left: 12, right: 12, top: 100 }}>
          <Panel padding={12}>
            <Label style={{ fontWeight: "bold", color: "#9D3425" }}>
              Kayıt yapılamadı. İlerlemen bu oturumda korunuyor.
            </Label>
            <Button title="Yeniden dene" onPress={retry} />
          </Panel>
        </View>
      )}
      <Modal
        visible={shown !== null}
        transparent
        animationType={g?.settings.motion ? "fade" : "none"}
        onRequestClose={close}
      >
        <Pressable
          accessible={false}
          onPress={shown?.kind === "chain" ? close : undefined}
          style={{
            flex: 1,
            backgroundColor: "#17253A77",
            justifyContent: "center",
            padding: 28,
          }}
        >
          <Animated.View
            entering={g?.settings.motion ? ZoomIn.duration(240) : undefined}
            exiting={g?.settings.motion ? ZoomOut.duration(120) : undefined}
          >
            {shown?.kind === "chain" ? (
              <View style={{ alignItems: "center" }}>
                {g?.settings.motion &&
                  Array.from({ length: 22 }, (_, i) => (
                    <Spark
                      key={i}
                      index={i}
                      color={
                        [
                          METALS[shown.material ?? "iron"].color,
                          "#DCCBF5",
                          "#FFDF81",
                          "#B5EDF1",
                        ][i % 4]
                      }
                    />
                  ))}
                <View
                  style={{
                    height: 115,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {[3, 4, 5].map((stage, i) => (
                    <Animated.View
                      key={stage}
                      entering={
                        g?.settings.motion ? FadeIn.delay(i * 90) : undefined
                      }
                    >
                      <Sprite
                        name={`${shown.material ?? "iron"}-${stage}`}
                        size={78}
                      />
                    </Animated.View>
                  ))}
                </View>
                <Panel kind="purple" padding={18}>
                  <Label
                    style={{
                      fontSize: 26,
                      color: "#FFF1D8",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {shown.text}
                  </Label>
                </Panel>
              </View>
            ) : (
              <Panel padding={22} style={{ alignItems: "center", gap: 13 }}>
                <Sprite
                  name={
                    shown?.kind === "discover"
                      ? `${shown.material}-5`
                      : shown?.kind === "upgrade"
                        ? "workshop-after"
                        : "level-badge"
                  }
                  size={130}
                />
                <Label style={[styles.heading, { textAlign: "center" }]}>
                  {shown?.kind === "discover"
                    ? "Yeni maden keşfedildi"
                    : shown?.kind === "upgrade"
                      ? "Atölyen gelişti!"
                      : `SEVİYE ${shown?.level ?? 1}`}
                </Label>
                {shown?.kind === "discover" && shown.material && (
                  <Label
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: METALS[shown.material].color,
                    }}
                  >
                    {METALS[shown.material].name}
                  </Label>
                )}
                <Label style={{ textAlign: "center", fontSize: 16 }}>
                  {shown?.text}
                </Label>
                <Button
                  title="Devam"
                  onPress={close}
                  style={{ alignSelf: "stretch" }}
                />
              </Panel>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}
