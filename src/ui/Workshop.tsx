import React from "react";
import { StyleSheet, View } from "react-native";
import { Art, FAMILIES, Family } from "./art";
export function Workshop({
  stage,
  family = (["packets", "peppers", "cosmic"] as const)[stage % 3],
}: {
  stage: number;
  family?: Family;
}) {
  return (
    <View
      accessible
      accessibilityLabel={`Dönüşüm atölyesi, aşama ${stage + 1}`}
      style={s.scene}
    >
      <View style={s.halo} />
      <View style={s.pedestal} />
      <Art row={FAMILIES[family].row} column={Math.min(stage, 4)} unit={128} />
      <View style={s.lights}>
        {Array.from({ length: 6 }, (_, i) => (
          <View
            key={i}
            style={[
              s.light,
              {
                backgroundColor:
                  i <= stage ? FAMILIES[family].accent : "#E4C9EC",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  scene: {
    height: 155,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8EBFC",
    borderRadius: 18,
    overflow: "hidden",
  },
  halo: {
    position: "absolute",
    width: 145,
    height: 145,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: "#F1D5F5",
  },
  pedestal: {
    position: "absolute",
    bottom: 23,
    width: 170,
    height: 22,
    borderRadius: 40,
    backgroundColor: "#DCC1EA",
  },
  lights: { position: "absolute", bottom: 8, flexDirection: "row", gap: 6 },
  light: { width: 7, height: 7, borderRadius: 4 },
});
