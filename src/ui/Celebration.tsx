import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Art, Family, FAMILIES } from "./art";
function Spark({
  angle,
  color,
  cosmic,
}: {
  angle: number;
  color: string;
  cosmic: boolean;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 550 });
  }, [progress]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * progress.value * 145 },
      { translateY: Math.sin(angle) * progress.value * 125 },
      { scale: 1 + progress.value * 0.5 },
      { rotate: `${progress.value * 50}deg` },
    ],
  }));
  return (
    <Animated.View style={[s.spark, style]}>
      {cosmic ? (
        <Text
          style={{
            color,
            fontSize: 23,
            textShadowColor: "#FFFFFF",
            textShadowRadius: 4,
          }}
        >
          ★
        </Text>
      ) : (
        <View
          style={{
            width: 10,
            height: 16,
            borderRadius: 3,
            backgroundColor: color,
          }}
        />
      )}
    </Animated.View>
  );
}
function Burst({
  family,
  motion,
  unit,
}: {
  family: Family;
  motion: boolean;
  unit: number;
}) {
  const phase = useSharedValue(0);
  useEffect(() => {
    phase.value = withTiming(1, { duration: 550 });
  }, [phase]);
  const style = useAnimatedStyle(() => ({
    opacity: motion ? 1 - phase.value * 0.65 : 1,
    transform: [
      { scale: motion ? 0.7 + phase.value * 0.5 : 1 },
      { rotate: motion ? `${phase.value * 12}deg` : "0deg" },
    ],
  }));
  return (
    <Animated.View style={style}>
      <Art row={4} column={FAMILIES[family].row - 1} unit={unit} />
    </Animated.View>
  );
}
export function Celebration({
  text,
  motion,
  families,
}: {
  text: string;
  motion: boolean;
  families: Family[];
}) {
  const accent = FAMILIES[families[0]].accent;
  return (
    <View pointerEvents="none" style={s.root}>
      {motion &&
        Array.from({ length: 12 }, (_, i) => {
          const family = families[i % families.length];
          const colors = FAMILIES[family].sparks;
          return (
            <Spark
              key={`${text}:${i}`}
              angle={(i * Math.PI) / 6}
              color={colors[i % colors.length]}
              cosmic={family === "cosmic"}
            />
          );
        })}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {families.map((family) => (
          <Burst
            key={`${text}:${family}`}
            family={family}
            motion={motion}
            unit={families.length > 1 ? 110 : 200}
          />
        ))}
      </View>
      <View style={[s.card, { borderColor: accent }]}>
        <Text style={[s.text, { color: accent }]}>{text}</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: {
    position: "absolute",
    top: "29%",
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFFF5",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 22,
    marginTop: -18,
  },
  text: { fontWeight: "900", fontSize: 25, textAlign: "center" },
  spark: { position: "absolute", top: 90 },
});
