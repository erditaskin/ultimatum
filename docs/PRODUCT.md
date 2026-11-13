# Ultimatum — Karbasan ürün yönü

## Belge durumu

Karbasan uygulaması yeni Router girişine bağlandı. Uygulanan kurallar ve teknik sınırlar `KARBASAN_IMPLEMENTATION.md` içindedir. Önceki kurallar `design/archive/legacy-docs/PRODUCT-v1.md` içinde korunur.

## Kabul edilen temel kararlar

- iOS öncelikli Expo/React Native/TypeScript; Android sonra. Offline ve hesapsız başlangıç.
- Fantastik maden ve kuyumculuk evreni. Katla, değer ve komboyu katlamak anlamına gelir.
- İlk kasaba Karbasan, kar temalıdır. Sezonluk Santa/yılbaşı dekorları kalıcı tema üstüne eklenebilir.
- MVP ilk kasabayı kapsar; ana gelişimi 8–12 hafta hedeflenir. Süre garanti değildir, oturum alışkanlığı ve ekonomi ölçümü gerektirir. Sonraki iki kasaba yalnızca prototiptir.
- Sekiz malzeme: Demir, Bronz, Gölge Demiri, Agapit, Verit, Valorit, Karataş, Kızıltaş. Ayrı Bakır eklenmez. Demir/Bronz bol; diğerleri seviyelerle açılır ve nadir çıkar. Gelecek kasabalarda dağılımlar değişir.
- Aynı maden ve aynı basamaktaki iki cevher birleşir. Beş basamak vardır. Malzeme türü birleşerek başka metale dönüşmez.
- Basamak 3–5 kırılabilir. Kırılınca kendi külçesi veya işlenmiş bloğu ortak depoya gider. Cevher kırmak komşuları otomatik tüketmez.
- Madenler tek tahtada birlikte oynanır. Aile sekmeleri yoktur. Tahta 6×8 hücredir; hücre boyutu kullanılabilir ekran alanına göre hesaplanır.
- Craft, hazırlanmış malzemeler ve seçili tarifle tek dokunuşta yapılır. Teslim ayrı dokunuştur. İlk NPC istekleri belirli ürün tarifleridir.
- NPC siparişleri altın ve XP kazandırır. Altın atölyeyi geliştirir; dükkânda 250 altına kapasiteyi aşmadan 30 enerji alınabilir. Premium para ve gerçek para ödemesi yoktur.
- Ana patlama gösterisi büyü enerjisinin zincirle boşalmasıdır. Bitmiş takılar kendiliğinden patlamaz.
- Eşyalar bölümü vardır. Başlangıçta tek takılabilir amulet ve tek anlaşılır bonus; korunan/takılı eşya otomatik tüketilmez.
- XP ve başarımlar ilerleme/unvan kazandırır. Çırak, Kalfa, Usta, Büyük Usta; özel başarım unvanları ve seçilebilir Lord/Leydi hitabı. Uygulanan eşikler `src/karbasan/catalog.ts` içindedir.
- İleride taşınma, birikmiş malzemeyi korur ve yeni şehir kaynaklarını açar. Çoklu atölye eşzamanlı yönetimi MVP işi değildir.
- İlk açılıştaki bir saatlik Power Hour, enerji dolumunu iki katına çıkarır ve sipariş XP’sine %50 ekler.
- Logo C: yeşim yeşili K, menekşe moru P, taş yüzeyler; iki atla ortak sakin krem.

## Kesinleşen uygulama sözleşmesi

Üretici, kırma verimi, değerli taş garantisi, tarifler, sipariş kimlikleri, zincir menzili, enerji/altın dengesi ve kayıt ayrımı [KARBASAN_IMPLEMENTATION.md](KARBASAN_IMPLEMENTATION.md) içinde yazılıdır. Kullanıcı bu başlangıç sürümünün üretim, zincir ve sade dükkân kurallarını onaylamıştır.

Görsellerdeki örnek sayılar kural değildir. Gerçek para, reklam, çevrimiçi pazar ve yeni kasabalara taşınma bu sürümün dışında kalır.
