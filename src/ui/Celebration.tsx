import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
function Spark({ angle }: { angle: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 340 });
  }, [progress]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * progress.value * 135 },
      { translateY: Math.sin(angle) * progress.value * 110 },
      { scale: 1 + progress.value },
    ],
  }));
  return <Animated.View style={[s.spark, style]} />;
}
export function Celebration({
  text,
  motion,
}: {
  text: string;
  motion: boolean;
}) {
  return (
    <View pointerEvents="none" style={s.root}>
      {motion &&
        Array.from({ length: 10 }, (_, i) => (
          <Spark key={`${text}:${i}`} angle={(i * Math.PI) / 5} />
        ))}
      <View style={s.card}>
        <Text style={s.text}>{text}</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: {
    position: "absolute",
    top: "40%",
    left: 25,
    right: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#19263CEB",
    borderWidth: 2,
    borderColor: "#FDE09A",
    padding: 24,
    borderRadius: 24,
  },
  text: {
    color: "#FDE09A",
    fontWeight: "900",
    fontSize: 32,
    textAlign: "center",
  },
  spark: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#FFBD88",
  },
});
