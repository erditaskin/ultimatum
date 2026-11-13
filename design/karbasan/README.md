# Karbasan — tasarım paketi

Bu paket yeni ürün yönünün görsel referansıdır. Mevcut uygulama hâlâ eski oynanabilir prototiptir. Bu çalışmada uygulama kodu değiştirilmemiştir.

Ekran bazlı yeni varlık adayları ve üretim planı [production/README.md](production/README.md) altında toplanmıştır. Yazılımın ayrıntılı geçiş planı [KARBASAN_BUILD_PLAN.md](../../docs/KARBASAN_BUILD_PLAN.md) içindedir.

## Seçili kimlik

- İlk kasaba Karbasan: kar, çam, sıcak ocaklar, pastel çevre; yılbaşı dekoru ayrı sezon katmanıdır.
- Logo seçimi C: yeşim/nane yeşili K, menekşe/iris moru P, köşeli taş yüzeyler. İki “atla” grubu aynı sakin krem dilindedir. Kesin renk referansı `reference/logo-c-selection.png` dosyasının C satırıdır; diğer logolar üretilmiş türevdir.
- Tek tahta, bütün açılmış maden türleri birlikte. Maden ailesi tabları yoktur.
- Alt menü Harita, Depo, Atölye, Eşyalar. Eşyalar içindeki ilk takılabilir tür amulettir; başlangıçta tek yuva vardır.

## Ekran ve durum dizini

Görseller, belirtilen sırada soldan sağa okunur. Toplam 22 ekran/durum görünümü vardır; bunlar 22 ayrı navigasyon rotası anlamına gelmez.

| Dosya | İçerik |
| --- | --- |
| [01-gameplay.png](screens/01-gameplay.png) | Ana tahta, kaynaklar, NPC kartları, seçim ve kırma paneli |
| [02-orders-crafting.png](screens/02-orders-crafting.png) | Eksik malzeme; üretime hazır; teslimata hazır |
| [03-inventory-equipment-recipes.png](screens/03-inventory-equipment-recipes.png) | Depo; Eşyalar; Tarifler |
| [04-map-upgrade-profile.png](screens/04-map-upgrade-profile.png) | Harita; atölye geliştirme; profil ve unvanlar |
| [05-shop-powerhour-settings.png](screens/05-shop-powerhour-settings.png) | Dükkan ve alım onayı; Power Hour; Ayarlar |
| [06-tutorial-combo-levelup.png](screens/06-tutorial-combo-levelup.png) | Öğretici; büyü kombosu; seviye yükselme |
| [07-empty-full-energy.png](screens/07-empty-full-energy.png) | Enerji yok; tahta dolu; boş depo |
| [08-break-discovery-save-error.png](screens/08-break-discovery-save-error.png) | Kırma/çıktı detayı; ilk maden keşfi; kayıt yazma hatası |

Yardım, öğreticiyi yeniden açar; ayrı içerik ürünü değildir. Kayıt yükleme/yazma hataları için kısa durum paneli ve yeniden deneme gereklidir; kayıt sessizce sıfırlanmaz. Yazma hatası çizimi bellekte korunan oturumu anlatır; bozuk veya okunamayan kayıt yüklemesinde aynı güvence metni kullanılmaz. Açılış/splash, seçili logo ve Karbasan arka planını tekrar kullanır; ek bir ana ekran değildir.

## Akış

Ana tahta → NPC siparişi → gerekli malzemeler → üretim → depodaki hazır ürün → oyuncunun ayrı teslim dokunuşu → altın ve XP.

Seçili cevher → seviye uygunsa Kır → külçeler ortak depoya. Malzeme yoksa üretim kapalıdır. Takılı veya korunan eşya teslimatta tüketilmez.

Harita → Karbasan atölyesi → altınla geliştirme. Sonraki iki şehir MVP'de kilitli görsel prototiptir. Profil, seviye rozetinden; Ayarlar, profil içinden; Tarifler, üretim alanından açılır. Alt menüye ilave ana sekmeler eklenmez.

## Görsel kabul kontrolü ve bilinen sapmalar

Görseller Imagegen ile üretilmiş konseptlerdir. Aşağıdaki ayrıntılar kabul edilmiş iş kuralı sayılmaz:

1. Bazı çizimlerde XP yerine KP logosu vardır. Üretimde XP ayrı simge/metin kullanacaktır.
2. Depoda cevher görselleri külçe diye çizilmiş; Gölge Taş, Siyankaya, Kan Taşı gibi kabul edilmeyen adlar üretilmiştir. Doğru adlar Gölge Demiri, Karataş, Kızıltaş; depodaki çıktı külçe/işlenmiş blok olmalıdır.
3. Verit metalidir; zümrüt ile aynı kaynak değildir. Tarif çizimindeki “Verit (işlenmiş taş)” yanlıştır. Taş aileleri ve kesin tarifler ayrı kararlaştırılacaktır.
4. Öğreticide birinci seviye için Kır görünür; bu yanlıştır. Yalnızca 3–5 kırılır. Öğretici ilk aşamada sadece uygun nesneleri gösterecektir.
5. Kombo puanının yanında altın simgesi çizilmiştir; puan doğrudan para değildir. Ekonomi kararı verilmeden bu simge kullanılmaz.
6. Dükkan sayıları, premium yıldız para birimi, %5 amulet bonusu, seviye/aşama sayıları ve ödüller örnektir. Dükkanın tasarım açıklamaları ürün metni değildir ve kaldırılacaktır. Yardımcı kazmanın kesin görevi henüz belirlenmemiştir.
7. Enerji paneli kapatılabilir olmalı, birleşmeyi engellememelidir. Bazı çizimlerdeki telefon çerçeveleri uygulama varlığı değildir.
8. Kırık kaya ve ham taşlar bazı ekranlarda onaylı özgün siluetlerden sapar. Üretimde tekil onaylı sprite'lar kullanılır; ekran görselinden yeniden nesne çıkarılmaz.
9. Karataş'ın son çekirdeğinin havada durması görsel öneridir; kesin davranış değildir.
10. Öğretici, eşya seçimi, tam depo, koruma, başarım ödülü, etkinlik sonu ve yetersiz altın gibi durumlar gerçek bileşenlerde de doğrulanmalıdır. Görsel paket cihaz üzerinde ölçülmüş bir prototip değildir.
11. Kırma/keşif çizimi tahta yanına yeni bir panel koymuş ve seçili cevher türünü yanlış çizmiştir. Ana ekranın alttaki bilgi paneli korunur; beşinci seviye Demir'in onaylı çekirdek görseli kullanılır. Keşifteki Agapit de onaylı koruyucu kabuk tasarımıyla değiştirilir.

## Üretim standardına geçiş

Önce ekranlar ve açık kurallar onaylanır. Ardından ölçülü yerleşim, tipografi, güvenli alanlar, dokunma hedefleri ve ayrı varlık envanteri çıkarılır. UI metni raster görsele gömülmez. Kaydırılabilir panel ile sabit üst/alt alanlar ayrılır. Aynı logo, NPC ve sprite dosyası bütün ekranlarda tekrar kullanılır.

Sabit bir referans iPhone ekranında yan yana görüntü ve üst üste fark kontrolü yapılır; daha küçük/büyük ekranlarda erişilebilirlik ve taşma ayrıca doğrulanır. Çizimdeki yanlışları birebir kopyalamak yerine bu kabul notları esas alınır.

## Ses ve hareket

- Birleşme: alt basamaklarda kısa tok ses; üstte daha uzun, parlak ve katmanlı varyantlar. Her madenin malzeme tınısı ayrıdır.
- Cevher kırılması: taş darbesi, kabuk ayrılması, kısa metal çınlaması ve depoya aktarım.
- Büyü kombosu: ritmik yükseliş, görünür bağlantılar ve final çözülmesi. Takılar kırılmaz.
- Teslim: kısa onay ve altın/XP aktarımı. Seviye yükselme, kombo finaliyle üst üste binmez.
- Azaltılmış hareket: kamera sarsıntısı ve yaygın parçacık kaldırılır; durum ve ödül metni korunur. Ses/titreşim ayrı ayarlanır.

Bunlar ses/hareket yönüdür; bu pakette gerçek ses dosyası veya animasyon üretilmemiştir.

## Arşiv

`../archive/art-review/` önceki denemeleri korur. `../archive/legacy-docs/` önceki ürün ve sanat belgelerinin kopyalarını içerir. Arşivdeki eski mutlak yollar tarihsel kayıttır, güncel uygulama referansı değildir. Eski çalışan kod ve kayıt geçişleri korunmuştur.

Üretim aracı: built-in Imagegen. Tam yeni ekran promptları [PROMPTS.md](PROMPTS.md) dosyasındadır.
