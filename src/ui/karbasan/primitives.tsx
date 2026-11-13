import React, { memo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
} from "react-native";
import { SPRITES, SOURCES, SpriteName } from "./sprites";
export const colors = {
  ink: "#432815",
  muted: "#826849",
  cream: "#FFF1D8",
  gold: "#C49345",
  green: "#4B8319",
  purple: "#7848A0",
};
export const serif = Platform.select({ ios: "Georgia", default: "serif" });
export function Label({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.text, style]} />;
}
export const Sprite = memo(function Sprite({
  name,
  size = 40,
  width = size,
  height = size,
  style,
  stretch = false,
}: {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  stretch?: boolean;
}) {
  const rect = SPRITES[name as SpriteName];
  if (!rect) return null;
  return (
    <Crop
      source={SOURCES[rect.source]}
      rect={rect}
      width={width}
      height={height}
      stretch={stretch}
      style={style}
    />
  );
});
type Source = { image: ImageSourcePropType; width: number; height: number };
type Rect = { x: number; y: number; w: number; h: number };
const Crop = memo(function Crop({
  source,
  rect,
  width,
  height,
  stretch = false,
  style,
}: {
  source: Source;
  rect: Rect;
  width: number;
  height: number;
  stretch?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = Math.min(width / rect.w, height / rect.h),
    sx = stretch ? width / rect.w : scale,
    sy = stretch ? height / rect.h : scale;
  return (
    <View
      pointerEvents="none"
      style={[
        {
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {/* Clip the sprite before centering; letterboxing must never reveal neighboring atlas pixels. */}
      <View
        style={{ width: rect.w * sx, height: rect.h * sy, overflow: "hidden" }}
      >
        <Image
          accessible={false}
          fadeDuration={0}
          source={source.image}
          resizeMode="stretch"
          style={{
            position: "absolute",
            width: source.width * sx,
            height: source.height * sy,
            left: -rect.x * sx,
            top: -rect.y * sy,
          }}
        />
      </View>
    </View>
  );
});
export function Skin({
  kind,
  width,
  height,
}: {
  kind: SpriteName;
  width: number;
  height: number;
}) {
  const r = SPRITES[kind],
    source = SOURCES[r.source];
  if (width <= 0 || height <= 0) return null;
  const capX = kind === "panel" ? 80 : Math.min(50, r.w / 4),
    capY = kind === "panel" ? 80 : Math.min(40, r.h / 4),
    tx = Math.min(15, width / 4),
    ty = Math.min(13, height / 4);
  const xs = [0, capX, r.w - capX],
    ys = [0, capY, r.h - capY],
    ws = [capX, r.w - capX * 2, capX],
    hs = [capY, r.h - capY * 2, capY];
  const dx = [0, tx, width - tx],
    dy = [0, ty, height - ty],
    dw = [tx, width - tx * 2, tx],
    dh = [ty, height - ty * 2, ty];
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {ys.flatMap((y, row) =>
        xs.map((x, col) => (
          <Crop
            key={`${row}-${col}`}
            source={source}
            rect={{ x: r.x + x, y: r.y + y, w: ws[col], h: hs[row] }}
            width={dw[col]}
            height={dh[row]}
            stretch
            style={{ position: "absolute", left: dx[col], top: dy[row] }}
          />
        )),
      )}
    </View>
  );
}
export function Panel({
  children,
  style,
  kind = "panel",
  padding = 14,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  kind?: SpriteName;
  padding?: number;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setSize((old) =>
          old.width === width && old.height === height
            ? old
            : { width, height },
        );
      }}
      style={[
        {
          padding,
          paddingTop: kind === "panel" ? Math.max(30, padding) : padding,
          paddingBottom: kind === "panel" ? Math.max(30, padding) : padding,
          paddingHorizontal: kind === "panel" ? Math.max(22, padding) : padding,
          position: "relative",
        },
        style,
      ]}
    >
      <Skin kind={kind} {...size} />
      {children}
    </View>
  );
}
export function Button({
  title,
  onPress,
  disabled = false,
  secondary = false,
  icon,
  style,
  label,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  label?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { minHeight: 46, opacity: pressed ? 0.78 : disabled ? 0.65 : 1 },
        style,
      ]}
    >
      <Panel
        kind={disabled ? "disabled" : secondary ? "cream" : "green"}
        padding={10}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {icon && <Sprite name={icon} size={24} />}
        <Label
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={{
            flexShrink: 1,
            fontSize: 17,
            fontWeight: "bold",
            textAlign: "center",
            color: secondary ? colors.ink : "#FFF9E8",
            textShadowColor: secondary ? "transparent" : "#385117",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1,
          }}
        >
          {title}
        </Label>
      </Panel>
    </Pressable>
  );
}
export function Progress({
  value,
  height = 9,
}: {
  value: number;
  height?: number;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(Math.max(0, Math.min(1, value)) * 100),
      }}
      style={{
        height,
        backgroundColor: "#80654C",
        borderRadius: height,
        borderWidth: 1,
        borderColor: "#CFB278",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          backgroundColor: "#83BE34",
          borderTopWidth: 1,
          borderTopColor: "#CDE46C",
          borderRadius: height,
        }}
      />
    </View>
  );
}
export function Heading({
  title,
  icon,
  subtitle,
}: {
  title: string;
  icon?: string;
  subtitle?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 12,
      }}
    >
      {icon && <Sprite name={icon} size={40} />}
      <View style={{ flex: 1 }}>
        <Label style={styles.heading}>{title}</Label>
        {subtitle && <Label style={styles.muted}>{subtitle}</Label>}
      </View>
    </View>
  );
}
export const styles = StyleSheet.create({
  text: { fontFamily: serif, color: colors.ink, fontSize: 14 },
  heading: {
    fontFamily: serif,
    fontSize: 23,
    fontWeight: "bold",
    color: colors.ink,
  },
  muted: { fontSize: 12, color: colors.muted },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  divider: { height: 1, backgroundColor: "#DAC7A9", marginVertical: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
