import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LayoutChangeEvent, Modal, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import {
  COLS,
  METALS,
  NPC_NAMES,
  STAGES,
  recipe,
} from "../../karbasan/catalog";
import { Cell, Ore, availableProduct } from "../../karbasan/engine";
import { useGame } from "../../karbasan/context";
import { Shell } from "./Shell";
import { Button, Label, Panel, Progress, Sprite, styles } from "./primitives";
const Corners = memo(function Corners({
  size,
  height,
}: {
  size: number;
  height: number;
}) {
  return (
    <Sprite
      name="selection"
      width={size}
      height={height}
      stretch
      style={{ position: "absolute", left: 0, top: 0 }}
    />
  );
});
type TileProps = {
  cell: Cell;
  index: number;
  size: number;
  height: number;
  selected: boolean;
  motion: boolean;
  onTap: (i: number) => void;
  onMove: (a: number, b: number) => void;
};
const Tile = memo(function Tile({
  cell,
  index,
  size,
  height,
  selected,
  motion,
  onTap,
  onMove,
}: TileProps) {
  const x = useSharedValue(0),
    y = useSharedValue(0),
    drag = useSharedValue(0),
    originX = useSharedValue(0),
    originY = useSharedValue(0),
    pulse = useSharedValue(1);
  const stage = cell?.kind === "ore" ? cell.stage : 0;
  useEffect(() => {
    if (stage > 1 && motion)
      pulse.set(
        withSequence(
          withTiming(1.16, { duration: 90 }),
          withTiming(1, { duration: 160 }),
        ),
      );
  }, [stage, motion, pulse]);
  const animated = useAnimatedStyle(() => ({
    zIndex: drag.get() ? 50 : 0,
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { scale: drag.get() && motion ? 1.1 : pulse.get() },
    ],
  }));
  const gesture = useMemo(() => {
    const tap = Gesture.Tap()
      .maxDuration(280)
      .runOnJS(true)
      .onEnd((_e, ok) => {
        if (ok) onTap(index);
      });
    const pan = Gesture.Pan()
      .enabled(cell?.kind === "ore")
      .minDistance(8)
      .onBegin((e) => {
        originX.set(e.absoluteX);
        originY.set(e.absoluteY);
      })
      .onStart(() => {
        drag.set(1);
      })
      .onUpdate((e) => {
        x.set(e.absoluteX - originX.get());
        y.set(e.absoluteY - originY.get());
      })
      .onEnd((e) => {
        const col =
            (index % COLS) + Math.round((e.absoluteX - originX.get()) / size),
          row =
            Math.floor(index / COLS) +
            Math.round((e.absoluteY - originY.get()) / height);
        if (col >= 0 && col < 6 && row >= 0 && row < 8)
          runOnJS(onMove)(index, row * 6 + col);
      })
      .onFinalize(() => {
        drag.set(0);
        x.set(withTiming(0, { duration: motion ? 100 : 0 }));
        y.set(withTiming(0, { duration: motion ? 100 : 0 }));
      });
    return Gesture.Race(pan, tap);
  }, [
    cell?.kind,
    index,
    size,
    height,
    motion,
    onTap,
    onMove,
    x,
    y,
    drag,
    originX,
    originY,
  ]);
  const label =
    cell?.kind === "ore"
      ? `${METALS[cell.material].name} ${STAGES[cell.stage]}, seviye ${cell.stage}`
      : cell?.kind === "mine"
        ? "Maden üreticisi, üretmek için dokun"
        : cell?.kind === "forge"
          ? "Ocak, tarifleri aç"
          : "Boş hücre";
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${Math.floor(index / 6) + 1}. satır ${(index % 6) + 1}. sütun, ${label}`}
        accessibilityHint="Seç ve hedefe dokun veya sürükle. Hazır cevheri alttaki Kır düğmesiyle işle."
        accessibilityActions={[{ name: "activate" }]}
        onAccessibilityAction={() => onTap(index)}
        style={[
          {
            width: size,
            height,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              (Math.floor(index / 6) + (index % 6)) % 2
                ? "#D9AF7244"
                : "#FFFFFF33",
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#E0CBAA",
          },
          selected && { backgroundColor: "#FFF0C7" },
          animated,
        ]}
      >
        {cell && (
          <Sprite
            name={
              cell.kind === "ore"
                ? `${cell.material}-${cell.stage}`
                : cell.kind === "mine"
                  ? "pickaxe"
                  : "workshop-before"
            }
            size={Math.min(size, height) * 0.9}
          />
        )}
        {selected && <Corners size={size} height={height} />}
      </Animated.View>
    </GestureDetector>
  );
});
function Orders() {
  const { game: g } = useGame();
  if (!g) return null;
  return (
    <View
      style={{ height: 84, flexDirection: "row", paddingHorizontal: 9, gap: 5 }}
    >
      {g.orders.map((o) => {
        const r = recipe(o.recipe)!,
          ready = availableProduct(g, r.id) > 0;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityLabel={`${NPC_NAMES[o.npc]} siparişi: ${r.name}, ${r.gold} altın${ready ? ", teslimata hazır" : ""}`}
            onPress={() =>
              router.push({ pathname: "/order", params: { id: String(o.id) } })
            }
            style={{ flex: 1 }}
          >
            <Panel kind="order" padding={5} style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Sprite name={`npc-${o.npc}`} width={54} height={54} />
                <Sprite name={r.art} size={40} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.row}>
                  <Sprite name="coin" size={17} />
                  <Label style={{ fontSize: 12, fontWeight: "bold" }}>
                    {r.gold}
                  </Label>
                </View>
                <View
                  style={{
                    backgroundColor: ready ? "#70A62F" : "#9B8B6E",
                    paddingHorizontal: 6,
                    borderRadius: 5,
                  }}
                >
                  <Label
                    style={{
                      fontSize: 11,
                      color: "#FFF8E5",
                      fontWeight: "bold",
                    }}
                  >
                    {ready ? "1/1" : "0/1"}
                  </Label>
                </View>
              </View>
            </Panel>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Home() {
  const { game: g, perform } = useGame(),
    [selected, setSelected] = useState<number | null>(null),
    [boardArea, setBoardArea] = useState({ width: 0, height: 0 });
  const current = useRef(g),
    selection = useRef(selected);
  useEffect(() => {
    current.current = g;
  }, [g]);
  useEffect(() => {
    selection.current = selected;
  }, [selected]);
  const onMove = useCallback(
    (from: number, to: number) => {
      const result = perform({ type: "move", from, to });
      if (result?.event.kind !== "notice") {
        setSelected(to);
        selection.current = to;
      }
    },
    [perform],
  );
  const onTap = useCallback(
    (index: number) => {
      const cell = current.current?.board[index];
      if (cell?.kind === "mine") {
        perform({ type: "produce" });
        return;
      }
      if (cell?.kind === "forge") {
        router.push("/recipes");
        return;
      }
      if (selection.current !== null && selection.current !== index) {
        const from = current.current?.board[selection.current];
        if (
          from?.kind === "ore" &&
          (cell === null ||
            (cell?.kind === "ore" &&
              from.material === cell.material &&
              from.stage === cell.stage &&
              from.stage < 5))
        ) {
          onMove(selection.current, index);
          return;
        }
      }
      setSelected(index);
      selection.current = index;
    },
    [perform, onMove],
  );
  const cell = Math.max(1, (boardArea.width - 42) / 6);
  const cellHeight = Math.max(1, (boardArea.height - 24) / 8);
  const ore =
    g && selected !== null && g.board[selected]?.kind === "ore"
      ? (g.board[selected] as Ore)
      : null;
  const measure = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBoardArea((old) =>
      old.width === width && old.height === height ? old : { width, height },
    );
  }, []);
  return (
    <Shell scroll={false}>
      <View style={{ flex: 1, gap: 5, paddingTop: 2 }}>
        <Orders />
        <View
          onLayout={measure}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {g && boardArea.height > 0 && (
            <Panel
              padding={12}
              style={{
                paddingHorizontal: 12,
                paddingTop: 12,
                paddingBottom: 12,
                width: cell * 6 + 24,
                height: cellHeight * 8 + 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: cell * 6,
                  height: cellHeight * 8,
                  overflow: "visible",
                }}
              >
                {g.board.map((c, i) => (
                  <Tile
                    key={i}
                    cell={c}
                    index={i}
                    size={cell}
                    height={cellHeight}
                    selected={selected === i}
                    motion={g.settings.motion}
                    onTap={onTap}
                    onMove={onMove}
                  />
                ))}
              </View>
            </Panel>
          )}
        </View>
        <Panel
          kind="info"
          padding={9}
          style={{
            marginHorizontal: 9,
            minHeight: 63,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sprite
            name={ore ? `${ore.material}-${ore.stage}` : "pickaxe"}
            size={40}
          />
          <View style={{ flex: 1, gap: 3 }}>
            <Label
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontWeight: "bold", fontSize: 13 }}
            >
              {ore
                ? `${METALS[ore.material].name} ${STAGES[ore.stage]}`
                : "Karbasan Atölyesi"}
            </Label>
            <Label numberOfLines={1} style={{ fontSize: 10 }}>
              {ore
                ? ore.stage >= 3
                  ? "Kır ve külçeleri depoya gönder"
                  : "Aynı cevherleri birleştir"
                : "Üretmek için kazmaya dokun"}
            </Label>
            {g && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Büyü enerjisi ${g.mana}/100`}
                onPress={() => router.push("/help")}
              >
                <Progress value={g.mana / 100} height={5} />
              </Pressable>
            )}
          </View>
          {ore ? (
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Button
                title="KIR"
                disabled={ore.stage < 3}
                onPress={() => {
                  perform({ type: "break", index: selected! });
                  setSelected(null);
                }}
                style={{ width: g?.mana === 100 ? 56 : 83, minHeight: 39 }}
              />
              {g?.mana === 100 && ore.stage >= 3 && (
                <Button
                  title="ZİNCİR"
                  onPress={() => {
                    perform({ type: "chain", index: selected! });
                    setSelected(null);
                  }}
                  style={{ width: 77, minHeight: 39 }}
                />
              )}
            </View>
          ) : (
            <Button
              title="ÜRET"
              onPress={() => perform({ type: "produce" })}
              style={{ width: 83, minHeight: 39 }}
            />
          )}
        </Panel>
      </View>
      <Modal
        visible={!!g && !g.tutorial}
        transparent
        animationType={g?.settings.motion ? "fade" : "none"}
        onRequestClose={() => {
          perform({ type: "tutorial" });
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#172A4566",
            justifyContent: "center",
            padding: 26,
          }}
        >
          <Panel padding={20} style={{ gap: 13 }}>
            <View style={styles.row}>
              <Sprite name="npc-0" size={83} />
              <View style={{ flex: 1 }}>
                <Label style={styles.heading}>Karbasan’a hoş geldin</Label>
                <Label style={{ marginTop: 7 }}>
                  Aynı maden ve seviyedeki iki cevheri birleştir. 3. seviyede
                  kır, külçelerle takı üret.
                </Label>
              </View>
            </View>
            <Label style={styles.muted}>
              Üretici kazma, tarif ocağı ve bütün madenler aynı tahtada. Taşıma
              için seçip hedefe de dokunabilirsin.
            </Label>
            <Button
              title="Anladım"
              onPress={() => perform({ type: "tutorial" })}
            />
          </Panel>
        </View>
      </Modal>
    </Shell>
  );
}
