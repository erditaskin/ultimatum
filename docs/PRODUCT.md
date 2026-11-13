# Katla Patla — Karbasan ürün yönü

## Belge durumu

Bu belge yeni, üzerinde çalışılan ürün kararlarını anlatır. Çalışan kod hâlâ paket/biber/kapsül prototipidir. Önceki kurallar `design/archive/legacy-docs/PRODUCT-v1.md` içinde korunur. Yeni tasarım kodlanmamıştır; görsel referans ve sapma listesi `design/karbasan/README.md` içindedir.

## Kabul edilen temel kararlar

- iOS öncelikli Expo/React Native/TypeScript; Android sonra. Offline ve hesapsız başlangıç.
- Fantastik maden ve kuyumculuk evreni. Katla, değer ve komboyu katlamak anlamına gelir.
- İlk kasaba Karbasan, kar temalıdır. Sezonluk Santa/yılbaşı dekorları kalıcı tema üstüne eklenebilir.
- MVP ilk kasabayı kapsar; ana gelişimi 8–12 hafta hedeflenir. Süre garanti değildir, oturum alışkanlığı ve ekonomi ölçümü gerektirir. Sonraki iki kasaba yalnızca prototiptir.
- Sekiz malzeme: Demir, Bronz, Gölge Demiri, Agapit, Verit, Valorit, Karataş, Kızıltaş. Ayrı Bakır eklenmez. Demir/Bronz bol; diğerleri seviyelerle açılır ve nadir çıkar. Gelecek kasabalarda dağılımlar değişir.
- Aynı maden ve aynı basamaktaki iki cevher birleşir. Beş basamak vardır. Malzeme türü birleşerek başka metale dönüşmez.
- Basamak 3–5 kırılabilir. Kırılınca kendi külçesi veya işlenmiş bloğu ortak depoya gider. Cevher kırmak komşuları otomatik tüketmez.
- Madenler tek tahtada birlikte oynanır. Aile sekmeleri yoktur. Yeni çizim 6×8 önerir; mevcut kod 6×6'dır. Kesin ölçü cihaz yerleşimiyle doğrulanır.
- Craft, hazırlanmış malzemeler ve seçili tarifle tek dokunuşta yapılır. Teslim ayrı dokunuştur. İlk NPC istekleri belirli ürün tarifleridir.
- NPC siparişleri altın ve XP kazandırır. Altın atölye ve özellik açılışında kullanılır. Ek üretim hakkı alımı düşünülmektedir; maliyetleri kesinleşmemiştir.
- Ana patlama gösterisi büyü enerjisinin zincirle boşalmasıdır. Bitmiş takılar kendiliğinden patlamaz.
- Eşyalar bölümü vardır. Başlangıçta tek takılabilir amulet ve tek anlaşılır bonus; korunan/takılı eşya otomatik tüketilmez.
- XP ve başarımlar ilerleme/unvan kazandırır. Çırak, Kalfa, Usta, Büyük Usta; özel başarım unvanları ve seçilebilir Lord/Leydi hitabı. Eşikler belirlenmemiştir.
- İleride taşınma, birikmiş malzemeyi korur ve yeni şehir kaynaklarını açar. Çoklu atölye eşzamanlı yönetimi MVP işi değildir.
- Power Hour hızlı enerji yenilenmesi ve artırılmış XP/ödül için kullanılabilir. Katsayılar ve tarihler kesinleşmemiştir.
- Logo C: yeşim yeşili K, menekşe moru P, taş yüzeyler; iki atla ortak sakin krem.

## Kod öncesi kapatılacak iş kuralları

1. Cevher üretici sayısı, oyuncunun kaynak seçimi, açık maden olasılıkları ve tahta tıkanma çözümü.
2. Kırma verimi, bonus taş çıkışı ve depo modeli; değerli taş aileleri ve kesim basamakları.
3. Ürün tarifleri, sipariş üretimi/değiştirme ve ödül hesabı.
4. Büyü enerjisinin kazanımı, tetiklenmesi, zincir menzili ve çarpanları.
5. Enerji kapasitesi/yenilenmesi, altın harcama dengesi, premium para ve mağaza kapsamı.
6. XP/unvan eşikleri, ilk kasabanın 8–12 haftalık hedef eğrisi, Power Hour katsayıları.
7. Eski prototip kayıtlarının yeni ürün modeline nasıl taşınacağı. Kullanıcı ilerlemesi sessizce sıfırlanmaz.

Görsellerde görünen sayılar ve henüz onaylanmamış dükkân/bonus teklifleri bu listeyi kesinleştirmez. Gerçek para, reklam ve çevrimiçi pazar için yeni karar gerekir.
