import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Tile as Level } from "../game/engine";
import { Art, FAMILIES, Family } from "./art";
type Props = {
  level: Level | null;
  family: Family;
  index: number;
  size: number;
  selected: boolean;
  highlighted: boolean;
  motion: boolean;
  onTap: (i: number) => void;
  onArm: (i: number | null) => void;
  onBlast: (i: number) => void;
  onMove: (from: number, to: number) => void;
};
export const Tile = memo(function Tile({
  level,
  family,
  index,
  size,
  selected,
  highlighted,
  motion,
  onTap,
  onArm,
  onBlast,
  onMove,
}: Props) {
  const x = useSharedValue(0),
    y = useSharedValue(0),
    scale = useSharedValue(1),
    charge = useSharedValue(0),
    originX = useSharedValue(0),
    originY = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));
  const chargeStyle = useAnimatedStyle(() => ({
    opacity: charge.value,
    transform: [{ scale: 0.75 + charge.value * 0.25 }],
  }));
  const gesture = useMemo(() => {
    const tap = Gesture.Tap()
      .maxDuration(230)
      .runOnJS(true)
      .onEnd((_e, ok) => {
        if (ok) onTap(index);
      });
    const hold = Gesture.LongPress()
      .enabled(level !== null && level >= 3)
      .minDuration(250)
      .maxDistance(8)
      .runOnJS(true)
      .onBegin(() => {
        if (level && level >= 3) {
          onArm(index);
          charge.value = withTiming(1, { duration: 250 });
          scale.value = withTiming(motion ? 1.12 : 1, { duration: 230 });
        }
      })
      .onStart(() => {
        if (level && level >= 3) onBlast(index);
      })
      .onFinalize(() => {
        onArm(null);
        charge.value = 0;
        scale.value = withTiming(1);
      });
    const pan = Gesture.Pan()
      .minDistance(9)
      .onBegin((e) => {
        originX.value = e.absoluteX;
        originY.value = e.absoluteY;
      })
      .onStart(() => runOnJS(onArm)(null))
      .onUpdate((e) => {
        x.value = e.absoluteX - originX.value;
        y.value = e.absoluteY - originY.value;
      })
      .onEnd((e) => {
        const col =
            (index % 6) + Math.round((e.absoluteX - originX.value) / size),
          row =
            Math.floor(index / 6) +
            Math.round((e.absoluteY - originY.value) / size);
        if (col >= 0 && col < 6 && row >= 0 && row < 6)
          runOnJS(onMove)(index, row * 6 + col);
      })
      .onFinalize(() => {
        x.value = withTiming(0);
        y.value = withTiming(0);
      });
    return Gesture.Race(pan, hold, tap);
  }, [
    index,
    level,
    size,
    motion,
    onTap,
    onArm,
    onBlast,
    onMove,
    x,
    y,
    scale,
    charge,
    originX,
    originY,
  ]);
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${Math.floor(index / 6) + 1}. satır ${(index % 6) + 1}. sütun, ${level ? FAMILIES[family].names[level] : "boş"}`}
        accessibilityHint="Seçmek için dokun. Hazır parçayı patlatmak için basılı tut."
        accessibilityActions={[
          { name: "activate" },
          { name: "longpress", label: "Patlat" },
        ]}
        onAccessibilityAction={(e) =>
          e.nativeEvent.actionName === "longpress"
            ? onBlast(index)
            : onTap(index)
        }
        style={[
          s.cell,
          { width: size - 4, height: size - 4 },
          selected && s.selected,
          highlighted && s.highlight,
          style,
        ]}
      >
        {level !== null && level >= 3 && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderWidth: 3, borderColor: "#C52DE1", borderRadius: 14 },
              chargeStyle,
            ]}
          />
        )}
        {level && (
          <>
            <Art
              row={FAMILIES[family].row}
              column={level - 1}
              unit={size - 4}
            />
            <View
              style={[
                s.badge,
                {
                  backgroundColor:
                    level >= 3 ? FAMILIES[family].accent : "#78528E",
                },
              ]}
            >
              <Text style={s.level}>
                {level >= 3 ? "ϟ " : ""}
                {level}
              </Text>
            </View>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
});
const s = StyleSheet.create({
  cell: {
    margin: 2,
    backgroundColor: "#F9EFFC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: { borderColor: "#C52DE1" },
  highlight: { backgroundColor: "#F4CBED", borderColor: "#D94CC3" },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 6,
    minWidth: 15,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  level: { fontSize: 9, fontWeight: "900", color: "#FFFFFF" },
});
