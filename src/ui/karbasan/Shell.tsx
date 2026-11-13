import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Href, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useGame } from "../../karbasan/context";
import { levelForXp, rankForLevel } from "../../karbasan/catalog";
import { powerActive } from "../../karbasan/engine";
import {
  Button,
  Label,
  Panel,
  Progress,
  Sprite,
  colors,
  styles,
} from "./primitives";
import { SOURCES } from "./sprites";
const destinations = [
  { id: "map", path: "/map", label: "Harita", icon: "map" },
  { id: "storage", path: "/storage", label: "Depo", icon: "chest" },
  { id: "home", path: "/", label: "Atölye", icon: "anvil" },
  { id: "equipment", path: "/equipment", label: "Eşyalar", icon: "equipment" },
] as const;
export function ResourceBar() {
  const { game: g } = useGame();
  if (!g) return null;
  const level = levelForXp(g.xp).level;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 9,
        height: 40,
        gap: 5,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profil ve unvanlar"
        onPress={() => router.push("/profile")}
      >
        <Sprite name="kp" size={36} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Seviye ${level}, profil`}
        onPress={() => router.push("/profile")}
        style={{
          width: 30,
          height: 34,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#8B512C",
          borderColor: "#DDB06D",
          borderWidth: 2,
          borderRadius: 9,
        }}
      >
        <Label style={{ color: "#FFF5DF", fontWeight: "bold", fontSize: 17 }}>
          {level}
        </Label>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Enerji ${g.energy}/100, dükkan`}
        onPress={() => router.push("/shop")}
        style={{ flex: 1 }}
      >
        <Panel
          kind="pill"
          padding={3}
          style={{
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Sprite name="energy" size={32} />
          <Label
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontSize: 14, fontWeight: "bold", flex: 1 }}
          >
            {g.energy}/100
          </Label>
          <Label
            style={{
              color: colors.green,
              fontSize: 20,
              fontWeight: "bold",
              marginRight: 4,
            }}
          >
            +
          </Label>
        </Panel>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${g.gold} altın, dükkan`}
        onPress={() => router.push("/shop")}
        style={{ flex: 1 }}
      >
        <Panel
          kind="pill"
          padding={3}
          style={{
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Sprite name="coin" size={28} />
          <Label
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontSize: 14, fontWeight: "bold", flex: 1 }}
          >
            {g.gold.toLocaleString("tr-TR")}
          </Label>
        </Panel>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dükkan"
        onPress={() => router.push("/shop")}
        style={{ padding: 3 }}
      >
        <Sprite name="shop" size={34} />
      </Pressable>
    </View>
  );
}
export function TownHeader({ compact = false }: { compact?: boolean }) {
  const { game: g, now } = useGame();
  const { width, height } = useWindowDimensions();
  const townHeight = height < 750 ? 76 : 100;
  if (!g) return null;
  const level = levelForXp(g.xp);
  return (
    <View
      style={{
        height: compact ? 48 : townHeight,
        paddingHorizontal: 14,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {!compact && (
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: 0, bottom: -2 }}
        >
          <Sprite
            name={g.workshop >= 3 ? "workshop-after" : "workshop-before"}
            width={width * 0.5}
            height={townHeight + 12}
          />
        </View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Karbasan, profil"
        onPress={() => router.push("/profile")}
      >
        <Panel
          kind="title"
          padding={4}
          style={{ width: compact ? 174 : width * 0.53, alignItems: "center" }}
        >
          <Label
            style={{
              fontSize: compact ? 21 : 25,
              fontWeight: "bold",
              letterSpacing: 0.6,
            }}
          >
            KARBASAN
          </Label>
        </Panel>
        <View
          style={{
            backgroundColor: "#FFF0D8EE",
            borderColor: "#C8A673",
            borderWidth: 1,
            borderRadius: 7,
            paddingHorizontal: 7,
            paddingVertical: 3,
            marginHorizontal: 9,
            marginTop: -1,
          }}
        >
          <Label
            style={{
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            {rankForLevel(level.level)} · {level.level}. seviye
          </Label>
          <Progress value={level.current / level.needed} height={6} />
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          powerActive(g, now) ? "Power Hour etkin" : "Ayarlar"
        }
        onPress={() =>
          router.push(powerActive(g, now) ? "/power" : "/settings")
        }
        style={{
          position: "absolute",
          right: 16,
          top: 2,
          padding: 5,
          backgroundColor: "#FFF1D8CC",
          borderRadius: 9,
        }}
      >
        <Sprite
          name={powerActive(g, now) ? "hourglass" : "gear-icon"}
          size={28}
        />
      </Pressable>
    </View>
  );
}
export function Navigation({ active }: { active: string }) {
  return (
    <View
      style={{ height: 66, flexDirection: "row", paddingHorizontal: 8, gap: 3 }}
    >
      {destinations.map((d) => (
        <Pressable
          key={d.id}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === d.id }}
          accessibilityLabel={d.label}
          onPress={() => router.replace(d.path as Href)}
          style={{ flex: 1 }}
        >
          <Panel
            kind={active === d.id ? "navActive" : "nav"}
            padding={4}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Sprite name={d.icon} size={37} />
            <Label
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: active === d.id ? colors.ink : "#FFF1D8",
                textShadowColor: "#5D351E",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 1,
              }}
            >
              {d.label}
            </Label>
          </Panel>
        </Pressable>
      ))}
    </View>
  );
}
export function Shell({
  children,
  active = "home",
  title,
  scroll = true,
  back = true,
}: {
  children?: React.ReactNode;
  active?: string;
  title?: string;
  scroll?: boolean;
  back?: boolean;
}) {
  const insets = useSafeAreaInsets(),
    { game: g, loadError, retry, restore } = useGame();
  return (
    <View style={{ flex: 1, backgroundColor: "#D8E7F3" }}>
      <StatusBar style="dark" />
      <Image
        source={SOURCES.background.image}
        accessible={false}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 6),
        }}
      >
        {!g ? (
          <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
            <Panel>
              <Sprite name="wordmark" width={260} height={80} />
              {loadError ? (
                <>
                  <Label style={{ marginVertical: 14 }}>{loadError}</Label>
                  <Button title="Yeniden dene" onPress={retry} />
                  <Button
                    title="Yedeği geri yükle"
                    secondary
                    onPress={restore}
                    style={{ marginTop: 8 }}
                  />
                </>
              ) : (
                <ActivityIndicator color={colors.green} />
              )}
            </Panel>
          </View>
        ) : (
          <>
            <ResourceBar />
            <TownHeader compact={!!title} />
            {title && (
              <Panel
                kind="info"
                padding={7}
                style={{
                  marginHorizontal: 9,
                  marginVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {back && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Geri"
                    onPress={() =>
                      router.canGoBack() ? router.back() : router.replace("/")
                    }
                    style={{
                      width: 36,
                      height: 36,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sprite name="back" size={32} />
                  </Pressable>
                )}
                <Label
                  style={[
                    styles.heading,
                    {
                      flex: 1,
                      textAlign: back ? "left" : "center",
                      fontSize: 22,
                    },
                  ]}
                >
                  {title}
                </Label>
                {title !== "Ayarlar" && (
                  <Pressable
                    accessibilityLabel="Ayarlar"
                    accessibilityRole="button"
                    onPress={() => router.push("/settings")}
                    style={{ padding: 5 }}
                  >
                    <Sprite name="gear-icon" size={26} />
                  </Pressable>
                )}
              </Panel>
            )}
            {scroll ? (
              <ScrollView
                bounces={false}
                contentContainerStyle={{
                  padding: 10,
                  paddingBottom: 16,
                  gap: 10,
                }}
                style={{ flex: 1 }}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={{ flex: 1 }}>{children}</View>
            )}
            <Navigation active={active} />
          </>
        )}
      </View>
    </View>
  );
}
