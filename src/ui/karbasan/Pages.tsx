import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useGame } from "../../karbasan/context";
import {
  ENERGY_PACK,
  ENERGY_PRICE,
  GEM_NAMES,
  GEMS,
  MATERIALS,
  METALS,
  NPC_NAMES,
  RECIPES,
  Recipe,
  levelForXp,
  rankForLevel,
  recipe,
  workshopCost,
  workshopLevel,
} from "../../karbasan/catalog";
import {
  Game,
  activeBonus,
  availableProduct,
  canCraft,
  powerActive,
  titles,
} from "../../karbasan/engine";
import {
  Button,
  Heading,
  Label,
  Panel,
  Progress,
  Sprite,
  colors,
  styles,
} from "./primitives";
import { Shell } from "./Shell";
import { SOURCES } from "./sprites";
const back = () => (router.canGoBack() ? router.back() : router.replace("/"));
function ItemCard({
  icon,
  name,
  quantity,
  onPress,
  selected = false,
  locked = false,
}: {
  icon: string;
  name: string;
  quantity?: number;
  onPress?: () => void;
  selected?: boolean;
  locked?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}${quantity !== undefined ? `, ${quantity} adet` : ""}${locked ? ", kilitli" : ""}`}
      onPress={onPress}
      style={{
        width: "31.4%",
        minHeight: 113,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? "#E3A22A" : "#D5B58C",
        borderRadius: 9,
        padding: 6,
        backgroundColor: selected ? "#FFF1C8" : "#F6E9D5",
        alignItems: "center",
        justifyContent: "center",
        opacity: locked ? 0.55 : 1,
      }}
    >
      <Sprite name={icon} size={61} />
      <Label
        numberOfLines={2}
        style={{
          fontSize: 12,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 3,
        }}
      >
        {name}
      </Label>
      {quantity !== undefined && (
        <Label
          style={{ fontSize: 12, fontWeight: "bold", color: colors.muted }}
        >
          {quantity}
        </Label>
      )}
      {locked && (
        <View style={{ position: "absolute", right: 3, bottom: 3 }}>
          <Sprite name="lock" size={20} />
        </View>
      )}
    </Pressable>
  );
}
function Requirements({ g, r }: { g: Game; r: Recipe }) {
  const entries = [
    {
      name: `${METALS[r.metal].name} Külçe`,
      icon: `bar-${r.metal}`,
      have: g.bars[r.metal],
      need: r.bars,
    },
    ...(r.gem
      ? [
          {
            name: GEM_NAMES[r.gem],
            icon: `gem-${r.gem}`,
            have: g.gems[r.gem],
            need: r.gems,
          },
        ]
      : []),
  ];
  return (
    <View style={{ gap: 8 }}>
      <Label
        style={{
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        Gerekli Malzemeler
      </Label>
      {entries.map((e) => (
        <View
          key={e.name}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 9,
            borderColor: "#CFB388",
            borderWidth: 1,
            borderRadius: 8,
            gap: 9,
            backgroundColor: "#FFF5E3",
          }}
        >
          <Sprite name={e.icon} size={45} />
          <Label style={{ flex: 1, fontWeight: "bold", fontSize: 14 }}>
            {e.name}
          </Label>
          <Label
            style={{
              fontWeight: "bold",
              color: e.have >= e.need ? colors.green : "#A44734",
            }}
          >
            {e.have}/{e.need}
          </Label>
          <Sprite name={e.have >= e.need ? "check" : "lock"} size={24} />
        </View>
      ))}
    </View>
  );
}
export function OrderPage() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    { game: g, perform, now } = useGame();
  const order = g?.orders.find((o) => o.id === Number(id)),
    r = order ? recipe(order.recipe) : null;
  return (
    <Shell
      title={
        r && g && availableProduct(g, r.id) > 0 ? "Sipariş hazır" : "Sipariş"
      }
    >
      {g && order && r ? (
        <Panel padding={16} style={{ gap: 16 }}>
          <View style={styles.row}>
            <Sprite name={`npc-${order.npc}`} width={100} height={110} />
            <View style={{ flex: 1, alignItems: "center", gap: 7 }}>
              <Label
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                {r.name}
              </Label>
              <Sprite name={r.art} size={100} />
            </View>
          </View>
          <Label
            style={{ textAlign: "center", fontSize: 13, color: colors.muted }}
          >
            {NPC_NAMES[order.npc]} bu eseri atölyenden almak istiyor.
          </Label>
          <Panel
            kind="pill"
            padding={8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
            }}
          >
            <Label style={{ fontWeight: "bold" }}>Ödül:</Label>
            <Sprite name="coin" size={24} />
            <Label style={{ fontWeight: "bold" }}>{r.gold}</Label>
            <Sprite name="xp" size={24} />
            <Label style={{ fontWeight: "bold" }}>
              {Math.round(r.xp * (powerActive(g, now) ? 1.5 : 1))} XP
            </Label>
          </Panel>
          {availableProduct(g, r.id) > 0 ? (
            <>
              <Label
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.green,
                }}
              >
                Ürün hazır · 1/1
              </Label>
              <Button
                title="Teslim Et"
                onPress={() => {
                  const result = perform({ type: "deliver", id: order.id });
                  if (result?.event.kind !== "notice") back();
                }}
              />
            </>
          ) : (
            <>
              <Requirements g={g} r={r} />
              {g.protected.includes(r.id) && (
                <Label style={{ color: "#A44734" }}>
                  Bu ürün satıştan korunuyor. Eşyalar’dan korumayı
                  kaldırabilirsin.
                </Label>
              )}
              <Button
                title="Üret"
                disabled={!canCraft(g, r.id)}
                onPress={() => perform({ type: "craft", recipe: r.id })}
              />
              <Button
                title="Tahtada hazırla"
                secondary
                icon="pickaxe"
                onPress={() => router.replace("/")}
              />
            </>
          )}
          <Button
            title="Başka sipariş iste"
            secondary
            onPress={() => {
              perform({ type: "replace-order", id: order.id });
              back();
            }}
          />
        </Panel>
      ) : (
        <Panel>
          <Label>Sipariş tamamlandı veya yenilendi.</Label>
          <Button title="Tahtaya dön" onPress={() => router.replace("/")} />
        </Panel>
      )}
    </Shell>
  );
}
export function CraftPage() {
  const { item } = useLocalSearchParams<{ item: string }>(),
    { game: g, perform } = useGame(),
    r = recipe(item ?? "");
  return (
    <Shell title="Üretim">
      {g && r ? (
        <Panel padding={17} style={{ gap: 16 }}>
          <Heading title={r.name} />
          <View style={{ alignItems: "center" }}>
            <Sprite name={r.art} size={160} />
          </View>
          <Requirements g={g} r={r} />
          <Label style={styles.muted}>
            Üretimde malzemeler tüketilir. Eser depoya eklenir; satış için
            ayrıca sipariş teslim edilir.
          </Label>
          <Button
            title="Üret"
            disabled={!canCraft(g, r.id)}
            onPress={() => perform({ type: "craft", recipe: r.id })}
          />
          <Label style={{ textAlign: "center" }}>
            Depodaki eser: {g.products[r.id] ?? 0}
          </Label>
          <Button
            title="Depoyu aç"
            secondary
            onPress={() => router.replace("/storage")}
          />
        </Panel>
      ) : (
        <Panel>
          <Label>Tarif bulunamadı.</Label>
        </Panel>
      )}
    </Shell>
  );
}
export function RecipesPage() {
  const { game: g } = useGame();
  return (
    <Shell title="Tarifler">
      {g && (
        <Panel padding={14} style={{ gap: 14 }}>
          <Heading
            title="Tarifler"
            icon="scroll"
            subtitle={`${g.crafted.length}/${RECIPES.length} eser üretildi`}
          />
          <View style={styles.grid}>
            {RECIPES.map((r) => {
              const locked = r.level > levelForXp(g.xp).level;
              return (
                <ItemCard
                  key={r.id}
                  icon={r.art}
                  name={locked ? `${r.name}\nSeviye ${r.level}` : r.name}
                  locked={locked}
                  onPress={() => {
                    if (!locked)
                      router.push({
                        pathname: "/craft",
                        params: { item: r.id },
                      });
                  }}
                />
              );
            })}
          </View>
          <Label style={styles.muted}>
            Yeni madenler ve tarifler oyuncu seviyenle açılır.
          </Label>
        </Panel>
      )}
    </Shell>
  );
}
export function StoragePage() {
  const { game: g } = useGame(),
    [filter, setFilter] = useState("Tümü"),
    [selected, setSelected] = useState<string | null>(null);
  if (!g) return <Shell active="storage" />;
  const materials = MATERIALS.filter((m) => g.bars[m] > 0),
    gems = GEMS.filter((m) => g.gems[m] > 0),
    products = RECIPES.filter((r) => (g.products[r.id] ?? 0) > 0);
  const empty = !materials.length && !gems.length && !products.length;
  return (
    <Shell active="storage" title="Depo" back={false}>
      <Panel padding={14} style={{ gap: 14 }}>
        <Heading title="Malzeme ve ürünlerin" icon="chest" />
        {empty ? (
          <View style={{ alignItems: "center", gap: 15, paddingVertical: 30 }}>
            <Sprite name="empty-crate" size={170} />
            <Label style={styles.heading}>Henüz malzemen yok</Label>
            <Label>Cevherleri birleştir ve kır.</Label>
            <Button
              title="Atölyeye dön"
              onPress={() => router.replace("/")}
              style={{ alignSelf: "stretch" }}
            />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {["Tümü", "Külçe", "Taş", "Ürün"].map((f) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: filter === f }}
                  key={f}
                  onPress={() => setFilter(f)}
                  style={{
                    flex: 1,
                    minHeight: 38,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: filter === f ? "#6A9636" : "#EAD5B3",
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: "#C7A16C",
                  }}
                >
                  <Label
                    style={{
                      fontWeight: "bold",
                      fontSize: 12,
                      color: filter === f ? "#FFF5DC" : colors.ink,
                    }}
                  >
                    {f}
                  </Label>
                </Pressable>
              ))}
            </View>
            {["Tümü", "Külçe"].includes(filter) && (
              <>
                <Label style={{ fontWeight: "bold", fontSize: 17 }}>
                  Malzemeler
                </Label>
                <View style={styles.grid}>
                  {materials.map((m) => (
                    <ItemCard
                      key={m}
                      icon={`bar-${m}`}
                      name={`${METALS[m].name} ${m === "blackrock" || m === "bloodrock" ? "Blok" : "Külçe"}`}
                      quantity={g.bars[m]}
                      selected={selected === m}
                      onPress={() => setSelected(m)}
                    />
                  ))}
                </View>
              </>
            )}
            {["Tümü", "Taş"].includes(filter) && (
              <>
                <Label style={{ fontWeight: "bold", fontSize: 17 }}>
                  Değerli taşlar
                </Label>
                <View style={styles.grid}>
                  {gems.map((m) => (
                    <ItemCard
                      key={m}
                      icon={`gem-${m}`}
                      name={GEM_NAMES[m]}
                      quantity={g.gems[m]}
                      selected={selected === m}
                      onPress={() => setSelected(m)}
                    />
                  ))}
                </View>
              </>
            )}
            {["Tümü", "Ürün"].includes(filter) && (
              <>
                <Label style={{ fontWeight: "bold", fontSize: 17 }}>
                  Hazır ürünler
                </Label>
                <View style={styles.grid}>
                  {products.map((r) => (
                    <ItemCard
                      key={r.id}
                      icon={r.art}
                      name={r.name}
                      quantity={g.products[r.id]}
                      onPress={() =>
                        router.push(
                          r.bonus
                            ? "/equipment"
                            : { pathname: "/craft", params: { item: r.id } },
                        )
                      }
                    />
                  ))}
                </View>
              </>
            )}
            {selected && (
              <Panel kind="info" padding={11}>
                <Label style={{ fontWeight: "bold" }}>
                  {METALS[selected as keyof typeof METALS]?.name ??
                    GEM_NAMES[selected as keyof typeof GEM_NAMES]}{" "}
                  · Craft için depoda saklanır
                </Label>
              </Panel>
            )}
          </>
        )}
      </Panel>
    </Shell>
  );
}
export function EquipmentPage() {
  const { game: g, perform } = useGame(),
    [selected, setSelected] = useState<string | null>(null);
  if (!g) return <Shell active="equipment" />;
  const owned = RECIPES.filter((r) => r.bonus && (g.products[r.id] ?? 0) > 0),
    chosen = recipe(selected ?? g.equipped ?? owned[0]?.id ?? "");
  return (
    <Shell active="equipment" title="Eşyalar" back={false}>
      <Panel padding={15} style={{ gap: 16 }}>
        <Heading
          title="Özel eşyaların"
          icon="equipment"
          subtitle="Bir amulet takabilir, eserlerini koruyabilirsin."
        />
        <Panel
          kind="order"
          padding={17}
          style={{ alignItems: "center", gap: 8 }}
        >
          <Label style={{ fontWeight: "bold", fontSize: 18 }}>
            Takılı amulet
          </Label>
          <Sprite
            name={g.equipped ? recipe(g.equipped)!.art : "amulet-purple"}
            size={130}
          />
          <Label style={{ fontWeight: "bold", textAlign: "center" }}>
            {g.equipped
              ? recipe(g.equipped)!.name
              : "Henüz amulet takılı değil"}
          </Label>
          <Label style={{ color: colors.green, fontWeight: "bold" }}>
            {g.equipped
              ? `+%${activeBonus(g)} kombo puanı`
              : owned.length
                ? "Koleksiyonundan bir amulet seçip takabilirsin"
                : "İlk amulet tarifi 3. seviyede açılır"}
          </Label>
        </Panel>
        {owned.length ? (
          <>
            <Label style={{ fontWeight: "bold", fontSize: 17 }}>
              Amulet koleksiyonu
            </Label>
            <View style={styles.grid}>
              {owned.map((r) => (
                <ItemCard
                  key={r.id}
                  icon={r.art}
                  name={r.name}
                  quantity={g.products[r.id]}
                  selected={chosen?.id === r.id}
                  onPress={() => setSelected(r.id)}
                />
              ))}
            </View>
            {chosen && (
              <>
                <Label
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  {chosen.name}
                </Label>
                <Label style={{ textAlign: "center", color: colors.green }}>
                  +%{chosen.bonus} kombo puanı
                </Label>
                <View style={styles.row}>
                  <Button
                    title={g.equipped === chosen.id ? "Çıkar" : "Tak"}
                    onPress={() => perform({ type: "equip", item: chosen.id })}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title={
                      g.protected.includes(chosen.id)
                        ? "Korumayı kaldır"
                        : "Koru"
                    }
                    secondary
                    onPress={() =>
                      perform({ type: "protect", item: chosen.id })
                    }
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </>
        ) : (
          <Button
            title="Tarifleri gör"
            onPress={() => router.push("/recipes")}
          />
        )}
        <Label style={styles.muted}>
          Takılı amuletin bir kopyası satılmaz. Koruma, seçtiğin türün bütün
          kopyalarını sipariş tesliminden korur.
        </Label>
      </Panel>
    </Shell>
  );
}
export function MapPage() {
  const { game: g } = useGame(),
    { width } = useWindowDimensions(),
    w = width - 20;
  return (
    <Shell active="map" title="Harita" back={false}>
      {g && (
        <View
          style={{
            height: w * 1.5,
            borderRadius: 14,
            overflow: "hidden",
            borderWidth: 3,
            borderColor: "#B58D53",
          }}
        >
          <Image
            source={SOURCES["world-map"].image}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <Panel
            padding={10}
            style={{ position: "absolute", top: 12, left: 14, right: 14 }}
          >
            <Label style={{ fontWeight: "bold", fontSize: 17 }}>
              Karbasan · Atölye {g.workshop}/8
            </Label>
            <Progress value={g.workshop / 8} />
          </Panel>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Karbasan atölyesini geliştir"
            onPress={() => router.push("/workshop")}
            style={{
              position: "absolute",
              top: "28%",
              left: "27%",
              right: "22%",
            }}
          >
            <Sprite
              name={g.workshop >= 3 ? "workshop-after" : "workshop-before"}
              size={115}
              style={{ alignSelf: "center" }}
            />
            <Panel kind="title" padding={10}>
              <Label style={{ textAlign: "center", fontWeight: "bold" }}>
                Karbasan Atölyesi
              </Label>
            </Panel>
          </Pressable>
          {["57%", "73%"].map((top, i) => (
            <View
              key={top}
              style={{
                position: "absolute",
                top: top as `${number}%`,
                left: i ? "25%" : "45%",
                alignItems: "center",
              }}
            >
              <Sprite name="lock" size={36} />
              <Panel kind="pill" padding={7}>
                <Label style={{ fontWeight: "bold" }}>Yakında</Label>
              </Panel>
            </View>
          ))}
          <Button
            title="Atölyeye dön"
            onPress={() => router.replace("/")}
            style={{ position: "absolute", left: 24, right: 24, bottom: 18 }}
          />
        </View>
      )}
    </Shell>
  );
}
export function WorkshopPage() {
  const { game: g, perform } = useGame();
  if (!g) return <Shell title="Atölyeyi geliştir" />;
  const cost = workshopCost(g.workshop),
    required = workshopLevel(g.workshop),
    level = levelForXp(g.xp).level;
  return (
    <Shell title="Atölyeyi geliştir">
      <Panel padding={15} style={{ gap: 15 }}>
        <Label
          style={{ fontWeight: "bold", fontSize: 21, textAlign: "center" }}
        >
          Aşama {g.workshop}/8
        </Label>
        <View style={styles.row}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Sprite
              name={g.workshop >= 3 ? "workshop-after" : "workshop-before"}
              size={145}
            />
            <Label style={{ fontWeight: "bold", textAlign: "center" }}>
              Mevcut atölye
            </Label>
          </View>
          <Label style={{ fontSize: 25, color: colors.gold }}>›</Label>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Sprite name="workshop-after" size={145} />
            <Label style={{ fontWeight: "bold", textAlign: "center" }}>
              Geliştirilmiş atölye
            </Label>
          </View>
        </View>
        <Heading title="Geliştirme kazanımları" />
        <Panel kind="order" padding={12}>
          <Label style={{ fontWeight: "bold", fontSize: 17 }}>
            Daha verimli üretim
          </Label>
          <Label style={{ marginTop: 6 }}>
            2. seviye cevher üretme şansı aşama başına %2,5 artar. En çok %20.
          </Label>
        </Panel>
        <Label style={{ textAlign: "center", fontWeight: "bold" }}>
          {g.workshop >= 8
            ? "Karbasan atölyesi tamamlandı"
            : `${cost.toLocaleString("tr-TR")} altın · Seviye ${required}`}
        </Label>
        <Button
          title={g.workshop >= 8 ? "Tamamlandı" : "Geliştir"}
          disabled={g.workshop >= 8 || g.gold < cost || level < required}
          onPress={() => perform({ type: "upgrade" })}
        />
        <Label style={styles.muted}>
          Nadir madenler oyuncu seviyenle açılır. Kasabalar arası taşınma
          sonraki bölümde gelecek.
        </Label>
      </Panel>
    </Shell>
  );
}
export function ProfilePage() {
  const { game: g, perform } = useGame();
  if (!g) return <Shell title="Profil ve Unvanlar" />;
  const level = levelForXp(g.xp),
    achievements = [
      {
        name: "10 sipariş tamamla",
        n: g.stats.sold,
        target: 10,
        icon: "scroll",
      },
      {
        name: "5'li zincir kur",
        n: g.stats.best,
        target: 5,
        icon: "achievement",
      },
      {
        name: "4 maden keşfet",
        n: g.discovered.length,
        target: 4,
        icon: "pickaxe",
      },
    ];
  return (
    <Shell title="Profil ve Unvanlar">
      <Panel padding={15} style={{ gap: 15 }}>
        <View style={styles.row}>
          <Sprite name="npc-2" size={90} />
          <View style={{ flex: 1, gap: 5 }}>
            <Label style={styles.heading}>Karbasan Ustası</Label>
            <Label style={{ fontSize: 19, fontWeight: "bold" }}>
              {rankForLevel(level.level)}
            </Label>
            <Label>
              Seviye {level.level} · {level.current}/{level.needed} XP
            </Label>
            <Progress value={level.current / level.needed} />
          </View>
        </View>
        <Panel kind="purple" padding={16}>
          <Label
            style={{
              color: "#FFF5DF",
              fontWeight: "bold",
              fontSize: 23,
              textAlign: "center",
            }}
          >
            {g.title}
          </Label>
        </Panel>
        <Label style={{ fontWeight: "bold", fontSize: 18 }}>
          Kazandığın unvanlar
        </Label>
        <View style={{ gap: 6 }}>
          {titles(g).map((t) => (
            <Button
              key={t}
              title={`${g.title === t ? "✓ " : ""}${t}`}
              secondary={g.title !== t}
              onPress={() => perform({ type: "title", title: t })}
            />
          ))}
        </View>
        <Label style={{ fontWeight: "bold", fontSize: 18 }}>Başarımlar</Label>
        {achievements.map((a) => (
          <View key={a.name} style={styles.row}>
            <Sprite name={a.icon} size={40} />
            <View style={{ flex: 1, gap: 5 }}>
              <Label style={{ fontWeight: "bold" }}>
                {a.name} · {Math.min(a.n, a.target)}/{a.target}
              </Label>
              <Progress value={a.n / a.target} />
            </View>
          </View>
        ))}
        <Label style={{ fontWeight: "bold", fontSize: 18 }}>
          Prestij hitabı
        </Label>
        <Label style={styles.muted}>
          20. seviye ve 100 teslimatta hitabın unvan olarak açılır. Tercihini
          şimdi seçebilirsin.
        </Label>
        <View style={styles.row}>
          {(["Lord", "Leydi"] as const).map((h) => (
            <Button
              title={h}
              key={h}
              secondary={g.hitap !== h}
              onPress={() => perform({ type: "hitap", value: h })}
              style={{ flex: 1 }}
            />
          ))}
        </View>
        <Button
          title="Ayarlar"
          secondary
          icon="gear-icon"
          onPress={() => router.push("/settings")}
        />
      </Panel>
    </Shell>
  );
}
export function ShopPage() {
  const { game: g, perform } = useGame(),
    [confirm, setConfirm] = useState(false);
  return (
    <Shell title="Dükkan">
      {g && (
        <Panel padding={17} style={{ gap: 17, alignItems: "center" }}>
          <Sprite name="shop" size={130} />
          <Heading title="Biraz daha üretim" />
          <Panel
            kind="order"
            padding={15}
            style={{ alignSelf: "stretch", gap: 13 }}
          >
            <View style={styles.row}>
              <Sprite name="energy" size={65} />
              <View style={{ flex: 1 }}>
                <Label style={{ fontWeight: "bold", fontSize: 23 }}>
                  +{Math.min(ENERGY_PACK, 100 - g.energy)} enerji
                </Label>
                <View style={styles.row}>
                  <Sprite name="coin" size={25} />
                  <Label style={{ fontWeight: "bold", fontSize: 18 }}>
                    {ENERGY_PRICE} altın
                  </Label>
                </View>
              </View>
            </View>
            <Button
              title={g.energy >= 100 ? "Enerjin dolu" : "Al"}
              disabled={g.energy >= 100 || g.gold < ENERGY_PRICE}
              onPress={() => setConfirm(true)}
            />
          </Panel>
          <Label style={{ textAlign: "center" }}>
            Enerji yalnızca üretimde harcanır. Birleştirme, taşıma ve kırma
            ücretsizdir.
          </Label>
          <Button
            title="Power Hour"
            secondary
            icon="hourglass"
            onPress={() => router.push("/power")}
            style={{ alignSelf: "stretch" }}
          />
        </Panel>
      )}
      <Modal
        visible={confirm}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirm(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#172A4577",
            justifyContent: "center",
            padding: 30,
          }}
        >
          <Panel padding={20} style={{ gap: 14 }}>
            <Heading title="Alımı onayla" icon="energy" />
            <Label>
              {ENERGY_PRICE} altın harcanacak. Enerji kapasitesi 100’dür.
            </Label>
            <View style={styles.row}>
              <Button
                title="Vazgeç"
                secondary
                onPress={() => setConfirm(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Onayla"
                onPress={() => {
                  perform({ type: "buy-energy" });
                  setConfirm(false);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </Panel>
        </View>
      </Modal>
    </Shell>
  );
}
export function PowerPage() {
  const { game: g, now } = useGame();
  if (!g) return <Shell title="Power Hour" />;
  const active = powerActive(g, now),
    seconds = Math.max(0, Math.ceil((g.campaign.end - now) / 1000)),
    timer = [
      Math.floor(seconds / 3600),
      Math.floor(seconds / 60) % 60,
      seconds % 60,
    ]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  return (
    <Shell title="Power Hour">
      <Panel padding={20} style={{ alignItems: "center", gap: 18 }}>
        <Sprite name="event-hourglass" size={150} />
        <Label style={[styles.heading, { fontSize: 31 }]}>Power Hour</Label>
        <Panel kind="purple" padding={16}>
          <Label style={{ fontSize: 27, color: "#FFF2DD", fontWeight: "bold" }}>
            {active ? timer : "Etkinlik sona erdi"}
          </Label>
        </Panel>
        <Label style={{ fontSize: 18, fontWeight: "bold" }}>
          2× hızlı enerji dolumu
        </Label>
        <Label style={{ fontSize: 18, fontWeight: "bold" }}>
          Siparişlerde +%50 XP
        </Label>
        <Label style={{ textAlign: "center", color: colors.muted }}>
          Karbasan’a hoş geldin etkinliği ilk bir saat sürer. Bonuslar etkinlik
          süresince geçerlidir.
        </Label>
        <Button
          title="Atölyeye dön"
          onPress={() => router.replace("/")}
          style={{ alignSelf: "stretch" }}
        />
      </Panel>
    </Shell>
  );
}
export function SettingsPage() {
  const { game: g, perform, saveError, retry } = useGame();
  return (
    <Shell title="Ayarlar">
      {g && (
        <Panel padding={18} style={{ gap: 16 }}>
          {(
            [
              { key: "music", label: "Müzik" },
              { key: "sound", label: "Ses efektleri" },
              { key: "haptics", label: "Titreşim" },
              { key: "motion", label: "Azaltılmış hareket" },
            ] as const
          ).map((s) => (
            <View
              key={s.key}
              style={[
                styles.between,
                { minHeight: 49, borderBottomWidth: 1, borderColor: "#D6BE98" },
              ]}
            >
              <Label style={{ fontWeight: "bold", fontSize: 18 }}>
                {s.label}
              </Label>
              <Switch
                accessibilityLabel={s.label}
                value={
                  s.key === "motion" ? !g.settings.motion : g.settings[s.key]
                }
                onValueChange={(v) => {
                  perform({
                    type: "setting",
                    key: s.key,
                    value: s.key === "motion" ? !v : v,
                  });
                }}
                trackColor={{ true: "#7DAB39", false: "#AC967F" }}
              />
            </View>
          ))}
          <View style={styles.between}>
            <Label style={{ fontWeight: "bold" }}>Çevrimdışı kayıt</Label>
            <Label style={{ color: saveError ? "#A83E2D" : colors.green }}>
              {saveError ? "Yeniden dene" : "Bu cihazda"}
            </Label>
          </View>
          {saveError && <Button title="Kaydı yeniden dene" onPress={retry} />}
          <Button
            title="Yardım"
            secondary
            onPress={() => router.push("/help")}
          />
          <Button
            title="Profil ve Unvanlar"
            secondary
            onPress={() => router.push("/profile")}
          />
          <Label
            style={{ textAlign: "center", color: colors.muted, fontSize: 12 }}
          >
            Ultimatum · Karbasan 1.0
          </Label>
          <Label style={styles.muted}>
            Eski prototip kaydı korunur. Karbasan ilerlemesi bu cihazda ayrı
            saklanır.
          </Label>
        </Panel>
      )}
    </Shell>
  );
}
export function HelpPage() {
  return (
    <Shell title="Atölye rehberi">
      <Panel padding={18} style={{ gap: 17 }}>
        <View style={styles.row}>
          <Sprite name="npc-0" size={85} />
          <Label style={[styles.heading, { flex: 1 }]}>
            Değeri katla, büyüyü patlat!
          </Label>
        </View>
        {[
          {
            title: "1 · Üret",
            text: "Tahtadaki kazmaya dokun. Üretim 1 enerji harcar; yeni madenler seviyenle açılır.",
          },
          {
            title: "2 · Birleştir",
            text: "Aynı madenin aynı seviyedeki iki parçasını sürükleyerek veya seçip hedefe dokunarak birleştir.",
          },
          {
            title: "3 · Kır",
            text: "3–5. seviye cevheri seçip Kır’a dokun. Külçeler depoya gider; bazen değerli taş da çıkar.",
          },
          {
            title: "4 · Craft ve teslim",
            text: "Ocaktan veya NPC kartından tarifi aç. Üret, sonra siparişi ayrıca teslim ederek altın ve XP kazan.",
          },
          {
            title: "5 · Büyü zinciri",
            text: "Kırdıkça büyü göstergesi dolar. %100’de hazır cevheri seç; ZİNCİR ile yakın hazır cevherleri patlat. Düşük seviyeler korunur.",
          },
          {
            title: "6 · Eşyalar",
            text: "Ürettiğin bir amuleti takarak kombo bonusu kazan. Koru seçimi eşyanın bütün kopyalarını satıştan korur.",
          },
        ].map((s) => (
          <View key={s.title}>
            <Label
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}
            >
              {s.title}
            </Label>
            <Label style={{ lineHeight: 21 }}>{s.text}</Label>
          </View>
        ))}
        <Button title="Atölyeye dön" onPress={() => router.replace("/")} />
      </Panel>
    </Shell>
  );
}
