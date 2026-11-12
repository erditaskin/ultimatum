import React from "react";
import { StyleSheet, Text, View } from "react-native";
const colors = [
  "#8EDFCB",
  "#91CFF5",
  "#B9A2F4",
  "#FFB77C",
  "#FF85B4",
  "#FAE59A",
];
export function Workshop({ stage }: { stage: number }) {
  const color = colors[Math.min(stage, 5)];
  return (
    <View
      accessible
      accessibilityLabel={`Atölye makinesi, dönüşüm ${stage}`}
      style={s.scene}
    >
      <View style={[s.pipe, { height: 25 + stage * 3, left: "22%" }]} />
      <View style={[s.pipe, { height: 20 + stage * 5, right: "22%" }]} />
      <View
        style={[s.machine, { backgroundColor: color, width: 100 + stage * 12 }]}
      >
        <View style={s.bolts}>
          <Text style={s.bolt}>✦</Text>
          <Text style={s.bolt}>✦</Text>
        </View>
        <Text style={s.face}>● ◡ ●</Text>
        <View style={s.gauge}>
          {Array.from({ length: stage + 1 }, (_, i) => (
            <View key={i} style={s.light} />
          ))}
        </View>
      </View>
      <View style={s.base} />
      {stage >= 2 && <Text style={s.spark}>✦</Text>}
      {stage >= 4 && (
        <Text style={[s.spark, { left: 25, right: undefined, top: 30 }]}>
          ✧
        </Text>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  scene: {
    height: 115,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#142137",
    borderRadius: 14,
    overflow: "hidden",
  },
  machine: {
    height: 76,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#FFFFFF40",
    alignItems: "center",
    zIndex: 2,
  },
  face: { fontSize: 23, color: "#24334D", fontWeight: "900" },
  bolts: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  bolt: { fontSize: 10, color: "#24334D" },
  gauge: {
    height: 12,
    backgroundColor: "#24334D",
    borderRadius: 6,
    flexDirection: "row",
    gap: 4,
    padding: 3,
  },
  light: { width: 8, height: 6, backgroundColor: "#FAE59A", borderRadius: 3 },
  base: {
    height: 12,
    width: 210,
    backgroundColor: "#40526C",
    borderRadius: 8,
    marginBottom: 5,
  },
  pipe: {
    position: "absolute",
    bottom: 70,
    width: 16,
    borderRadius: 5,
    backgroundColor: "#667D9D",
  },
  spark: {
    position: "absolute",
    right: 25,
    top: 15,
    fontSize: 25,
    color: "#FAE59A",
  },
});
