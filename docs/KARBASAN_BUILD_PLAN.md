# Karbasan — tasarımdan uygulamaya üretim planı

## Kapsam ve mevcut durum

Bu planın çıktısı, repo temizliği, ekran bazlı görsel adayları, varlık sözleşmesi ve ölçülebilir uygulama aşamalarıdır. Bu aşama çalışan oyunu yeniden yazmaz. `src/` hâlâ önceki oynanabilir prototiptir; yeni sanat adayları uygulamaya import edilmez.

Görsel hedef `design/karbasan/screens/` altındaki onaylanan yöndür. Logo için C satırı ve tekil maden kartelaları kaynak kabul edilir. Ekran çizimlerinin içindeki yanlış nesne, ad ve XP simgeleri kopyalanmaz.

“Birebir” hedefi, aynı onaylı varlıkların aynı bileşenlerde ve ölçülü yerleşimde kullanılmasıdır. Yeniden üretilen bir görselin piksel düzeyinde aynı çıkacağı garanti edilemez. Bu nedenle aday ayrıştırma → referans karşılaştırması → onay → sabit dosya → uygulama sırası izlenir. Sonraki ekranlar için logo, NPC veya takı tekrar üretilmez.

## 1. Temizlik

Tamamlananlar:

- Eski denemeler `design/archive/` altında tutulur; çalışma zamanı bunları kullanmaz.
- Kullanılmadığı kod/config taramasıyla doğrulanan varsayılan `assets/icon.png` ve `assets/splash-icon.png`, `design/archive/template-assets/` altına taşındı. Aktif iOS/Android/web ikonları korunur.
- Geçici `output/` dosyaları git dışında kalır; teslim edilecek tasarımlar `design/karbasan/` içinde tutulur.
- Yeni üretim adayları `design/karbasan/production/` altında; eski atlas ve ses, çalışan prototip için `assets/` altında kalır.

Uygulama başladığında eski bileşenler, yeni karşılıkları testten geçtikçe kaldırılır. Yeni motor çıkmadan eski motoru, kayıt okuyucularını veya testleri silmek bu planın parçası değildir. Bağımlılık güncellemesi, format değişikliği ve genel refactor yapılmaz.

## 2. Ekran bazında sanat üretimi

Detaylı eşleme `design/karbasan/production/ASSET_PLAN.md` dosyasındadır. Tekrarlanan ekran rasterları yerine ortak skin, portre, ürün ve çevre varlıkları kullanılır. Yazı, adet, bakiye, sayaç, ilerleme, seçim ve etkileşim native bileşendir; raster içine gömülmez.

Her görselin kaydı: kimlik, kaynak referans, üretim promptu, çıktı yolu, piksel ölçüsü, alpha, kullanılan ekranlar, tasarım onayı ve export durumu. Üretilmiş sheet, ayrı dosya/atlas kesim koordinatları doğrulanmadan doğrudan üretim varlığı değildir.

Kesinleşmeyen tarifler, taş aileleri, premium para ve mağaza fiyatları yalnızca tasarım örneğidir. Görsel üretimi bu kuralları kesinleştirmez.

## 3. Ölçülü yerleşim

Referans telefon çalışma alanı: 402×874 mantıksal nokta. Bunlar sabit cihaz insets varsayımı değildir; gerçek safe-area değerleri çalışma zamanında okunur.

Tahta 6 sütun × 8 satır önerisidir. Çizimdeki kare olmayan hücreler ölçü hatasıdır. Uygulama formülü:

`cell = min((usableWidth - horizontalMargins) / 6, boardAvailableHeight / 8)`

Tahta `6*cell` × `8*cell` olur ve ortalanır. Birleştirme yüzeyi kaydırılmaz. Üst/alt alanlar çentik ve home indicator üzerine çıkmaz. Arka plan bütün ekranı doldurur.

402×874 örneğinde 62 üst / 34 alt güvenli alan kabul edilirse kullanılabilir yükseklik 778 olur. Yaklaşık dağılım: kaynak satırı 36, kasaba başlığı 54, NPC siparişleri 72, tahta 480 (60 hücre), nesne paneli 56, alt menü 60 ve toplam aralık 20 = 778. Bu, tasarım bütçesidir; cihaz ölçümü değildir. Tahta 360×480, nesne en fazla 48×48 nokta olur.

Küçük cihazda önce dekoratif kasaba alanı ve kart içi boşluk azalır; font ve dokunma hedefleri körlemesine küçültülmez. Gerekirse kare hücre küçülür, sprite optik boyutu hücre içine sığar. 48 piksel inceleme görselleriyle 48 mantıksal nokta birbirine karıştırılmaz: 3× ekranda 48 nokta için 144 piksel export gerekir.

Metin büyütmede depo/sipariş/ayar panelleri kayabilir. Tahtanın ana eylemleri için sesli etiket, seç-ve-hedefe-dokun alternatifi, dört köşe seçimi ve renk dışı durum belirteci bulunur. Dokunulabilir kontroller için en az 44×44 nokta tasarım hedefi vardır.

## 4. Ortak UI yapısı

Dört ana Expo Router bölümü: Atölye, Harita, Depo, Eşyalar. Sipariş/üretim, profil, ayarlar, tarifler ve dükkan ikincil ekran/paneldir. Kombo, öğretici ve level-up ayrı navigasyon rotası değildir.

Yalnızca tekrar eden sorumluluklar ortaklaştırılır: `GameShell`, `ResourceBar`, `BottomNavigation`, `ParchmentPanel`, `GameButton`, `ItemIcon`, `OrderCard`, `SelectedItemPanel`, `RewardPresentation`. 22 durumu 22 ayrı screen class'a dönüştürmeyiz.

Çerçeveler uygun cap-inset veya köşe/kenar parçası exportuyla ölçeklenir; tek panel resmi farklı en-boy oranlarında ezilmez. Tahtanın daması, progress dolumu, seçim köşeleri ve metin kodla çizilir. Fantezi fontu gerçek lisanslı font dosyası olmalıdır; AI görselindeki yazı font dosyası yerine kullanılamaz. Türkçe karakter ve sayı okunurluğu kontrol edilir; başlık ve gövde fontu seçimi açık üretim işidir.

## 5. Domain ve içerik

Mevcut TypeScript/Expo tabanı korunur. İlk uygulama kesiti için ayrı backend, ECS oyun motoru, yeni state kütüphanesi veya yeni veritabanı gerekmez. React state/reducer, mevcut Gesture Handler, Reanimated, expo-audio, expo-haptics ve AsyncStorage kullanımı yeterlilik ölçümüyle değerlendirilir.

Önerilen sınırlar:

- `game/`: saf kurallar, komutlar ve sonuç olayları. React/native import etmez.
- `content/`: maden, ürün, tarif, sipariş ve ilerleme tabloları. Kararlı kimlikler; Türkçe görünen adlar kimlik yerine kullanılmaz.
- `storage/`: doğrulanmış sürümlü snapshot, sıralı yazma ve hata durumu.
- `features/`: tahta, sipariş, craft, depo, eşya ve ilerleme sunumu.
- `ui/`: ortak skin bileşenleri ve varlık eşlemesi.
- `app/`: yalnızca Router ekranları ve layout.

Öğeler discriminated union ile ayrılır: cevher (material, stage), külçe/blok, değerli taş, üretilmiş takı ve amulet. Malzeme türü, maden seviyesi, nadirlik, işçilik ve büyü gücü aynı sayı yapılmaz. Verit metalidir; zümrüt değildir.

Saat ve RNG kurallara dışarıdan verilir. Testlerde deterministik örnekler kullanılır. Olaylar (birleşme, kırma, üretim, teslim, seviye) sunuma bildirilir; animasyon sonucu belirlemez.

## 6. Kaynak ve kayıt tutarlılığı

Her komut, mevcut state üzerinde bütün koşulları doğrular ve tek yeni state üretir. Örnek: craft malzemeleri eksikse hiçbirini tüketmez; başarılıysa bütün girdiler ve çıktı aynı işlemde değişir. Sipariş teslimi, ürün tüketimi/altın/XP/sipariş yenilemesini birlikte yapar. Hızlı çift dokunmada aynı sipariş iki kez ödül vermez. Animasyon bitiş callback'i kaynak eklemez.

Kayıtlar sürümlü ve doğrulanır; yazmalar sıraya girer. Kayıt hatası ayrı durumdur, başarısız yazma olmuş gibi onay verilmez. Yeniden deneme, uygulama arkaplana girişi ve kapanış sonrası geri yükleme test edilir. Bellekteki state'i korumak disk garantisi diye sunulmaz.

Eski V1/V2 kayıtları yeni maden modeline anlamlı biçimde kendiliğinden dönüşmez. Puanı rastgele XP'ye veya biberi rastgele madene çevirme yapılmaz. Eski snapshot yedeklenir; yeni kayıt slotu veya açık dönüşüm kuralı kod başlamadan kararlaştırılır. Sessiz reset yoktur.

## 7. Performans ve hareket

48 hücre, sabit anahtarlar, memo edilmiş nesne sunumu ve kararlı etkileşim callback'leri. Sürükleme pozisyonu UI thread'de; her karede tüm oyun state'i güncellenmez. React değişiklikleri yalnızca hamle tamamlanınca yapılır. Alt ekranların görselleri ihtiyaç oldukça yüklenir; bütün yüksek çözünürlüklü sheet'ler aynı anda decode edilmez.

Atlas veya tekil export seçimi ölçüme göre yapılır. RGBA doku belleği yaklaşık `width*height*4`; PNG dosya boyutu decode maliyeti değildir. Bir ekranda görünür sanat için başlangıç hedefi 64 MiB altında decode bütçesidir; kesin sınır cihaz ölçümünde belirlenir. Adayların büyük kaynak dosyaları uygulama paketine körlemesine eklenmez.

60 Hz hedefinde frame bütçesi 16,7 ms'dir; ölçüm release build'de yapılır. Birleşme/kırma/craft/teslim kurallarının p95 süresi ve sürükleme/kombo frame süreleri ayrı raporlanır. Geliştirme React render süresi FPS olarak raporlanmaz. Particle sayısı sınırlanır; azaltılmış hareket, titreşim ve ses ayarları bütün efektlere uygulanır.

Ses planı: maden başına kısa/orta/üst birleşme varyantları; kırma darbesi ve metal kuyruğu; ritmik kombo yükselişi; teslim/seviye onayları. Maksimum eşzamanlı ses ve normalize loudness sınırı dinleme testiyle belirlenir. Ses dosyaları bu görsel üretim paketinin çıktısı değildir.

## 8. Uygulama kilometre taşları

Başlangıç ön koşulu: mevcut typecheck/lint süreçleri bu tasarım turunda ayrı ayrı 45 saniyede çıktı üretmeden zaman aşımına uğradı. Bu araç başlangıç sorunu çözülüp temiz baseline alınmadan uygulama kodu aşamasına geçilmez. Varlık ve referans dosya kontrolleri bundan bağımsız tamamlandı; sonuçlar `design/karbasan/production/QA.md` içinde.

| Aşama | Çıktı | Kabul ölçütü |
| --- | --- | --- |
| A | Temizlik, kaynak kilidi, varlık adayları | Uygulama/config referansları kırılmaz; prompt ve dosya kökeni kayıtlı |
| B | Onaylı export + ölçülü UI kabuğu | Ana ekran referans karşılaştırması; küçük/büyük iPhone'da taşma yok |
| C | Demir/Bronz uçtan uca kesit | Üret → birleştir → kır → depola → craft → NPC teslim; çift ödül yok |
| D | Diğer madenler + XP + tek amulet | Kilitli kaynak üretilmez; takılı/korunan eşya tüketilmez |
| E | Büyü kombosu, ses ve ilerleme | Kesinleşen kurala göre deterministik sonuç; hareket azaltma çalışır |
| F | Harita, depo, tarif, profil ve yardımcı durumlar | Ekran matrisi bütün durumları kapsar; kayıt hata akışı doğrulanır |
| G | Dükkan/Power Hour | Yalnızca onaylı ekonomi; etkinlik sınırlarında tutarlı hesap |
| H | Release QA | Lint/typecheck/test; simülatör görsel kıyas ve performans; kullanıcı onayından sonra telefon |

Her aşama çalışır bir commit'tir; main üzerinde kullanıcı talimatına göre ilerlenir. Görsel referans onayından önce yeni oyun kodu bağlanmaz.

## 9. Test stratejisi

Saf kural testleri: aynı tür/seviye birleşme; dolu tahta; yetersiz enerji; kırma verimi; depo ekleme; eksik craft girdisi; geçersiz/korunan teslim; tekrarlı komut; XP eşiği; kilitli kaynak; Power Hour başlangıç/bitiş. Kayıt testleri: şema doğrulama, sıralı yazma, hata/yeniden deneme, eski slot korunması, yeniden başlatma.

Ekran kabulü: sabit seed ve saatle aynı referans state; ana ekran ve alt ekran screenshot kıyası. Metin, sprite, hizalama ve safe-area ayrı kontrol listeleri. Snapshot testi oyun doğruluğunun yerine geçmez. Görsel değişiklik için uygulamayı taklit eden yüzlerce gereksiz test yazılmaz.

## 10. Kod öncesi açık kararlar

- Taş aileleri, kesim gelişimleri, kesin takı tarifleri.
- Üretici etkileşimi ve maden seçimi/olasılığı.
- Kırma çıktısı, büyü enerjisinin nasıl biriktiği ve zincir kuralları.
- NPC sipariş yenileme/değiştirme, altın/XP ve 8–12 haftalık ilerleme eğrisi.
- Enerji, premium para, dükkan ve Power Hour değerleri.
- Eski kayıt politikasının kullanıcı tarafından anlaşılır seçimi.

Bunlar görsel dosyalar üretmeyi engellemez; ekonomi motorunu üretime hazır diye sunmayı engeller.

## İncelenen teknik kaynaklar

- Expo SDK 58: https://docs.expo.dev/versions/v58.0.0/
- Expo Router: https://docs.expo.dev/router/introduction/
- Reanimated performans rehberi: https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/

Yeni API kodu yazılırken ilgili sürümlü sayfa ayrıca okunacaktır. Bu plan API imzası veya uyumluluk garantisi yerine geçmez.
