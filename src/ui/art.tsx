import React, { memo } from "react";
import { Image, View } from "react-native";
import type { Family } from "../game/engine";
export type { Family } from "../game/engine";
export const FAMILIES: Record<
  Family,
  {
    label: string;
    row: number;
    accent: string;
    sparks: string[];
    names: string[];
  }
> = {
  packets: {
    label: "Katlı",
    row: 1,
    accent: "#C3219D",
    sparks: ["#FF24B9", "#AE37FF", "#F688D6"],
    names: [
      "",
      "Katlı Paket",
      "Akordeon Paket",
      "Yıldız Paket",
      "Şişkin Paket",
      "Konfeti Çekirdeği",
    ],
  },
  peppers: {
    label: "Biber",
    row: 2,
    accent: "#C43327",
    sparks: ["#FF4426", "#70CE00", "#FFB321"],
    names: [
      "",
      "Yeşil Biber",
      "Alaca Biber",
      "Acı Biber",
      "Ateş Biberi",
      "Süper Biber",
    ],
  },
  cosmic: {
    label: "Kozmik",
    row: 3,
    accent: "#087C99",
    sparks: ["#00D9FF", "#1766FF", "#B4F800", "#FF7B49"],
    names: [
      "",
      "Grafit Kapsül",
      "Çelik Kapsül",
      "Yaylı Kapsül",
      "Gümüş Kapsül",
      "Kozmik Çekirdek",
    ],
  },
};
const atlas = require("../../assets/brand/game-atlas-v1.png");
// One decoded transparent texture serves every sprite. Clipping happens in native views.
export const Art = memo(function Art({
  row,
  column,
  unit,
  span = 1,
}: {
  row: number;
  column: number;
  unit: number;
  span?: number;
}) {
  return (
    <View
      pointerEvents="none"
      accessible={false}
      style={{ width: unit * span, height: unit, overflow: "hidden" }}
    >
      <Image
        source={atlas}
        accessible={false}
        resizeMode="stretch"
        fadeDuration={0}
        style={{
          position: "absolute",
          width: unit * 5,
          height: unit * 5,
          left: -column * unit,
          top: -row * unit,
        }}
      />
    </View>
  );
});
