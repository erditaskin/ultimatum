# Karbasan uygulama sözleşmesi

## Kapsam

Expo 58, React Native 0.88, TypeScript ve Expo Router kullanılır. İlk sürüm çevrimdışı ve hesapsızdır. Çalışma zamanı `src/karbasan/` ve `src/ui/karbasan/` altındadır. Eski motor ve testleri, eski kayıtların ve geçmiş davranışın referansı olarak korunur; yeni Router girişinde kullanılmaz.

## Oyun kuralları

- Tahta 6 × 8 hücredir. Kazma ve ocak sabittir. Bütün açık madenler birlikte oynanır.
- Kazma 1 enerji tüketir. Yalnızca boş hücre varsa üretir. Başlangıç enerji kapasitesi 100'dür.
- Demir ve Bronz 1. seviyede açıktır. Gölge Demiri 3, Agapit 5, Verit 7, Valorit 10, Karataş 14, Kızıltaş 18. seviyede açılır.
- Üretim ağırlıkları sırasıyla 48, 34, 8, 5, 4, 3, 2, 2'dir; yalnızca açık madenler arasında normalize edilir.
- Aynı metalin aynı basamağındaki iki cevher birleşir. En yüksek basamak 5'tir. Sürükleme veya seçip hedefe dokunma desteklenir.
- 3, 4 ve 5. basamaklar normal kırmada sırasıyla 1, 3 ve 8 külçe verir. Komşular normal kırmadan etkilenmez.
- Kırma büyü göstergesini sırasıyla 18, 35 ve 60 artırır; kapasite 100'dür.
- Büyü 100 olduğunda oyuncu hazır bir cevherden zincir başlatır. Zincir yalnızca 3–5. basamak cevherleri tüketir. Manhattan menzili basamak eksi 2'dir. Her cevher bir kez işlenir. Düşük basamaklar ve üreticiler korunur.
- Değerli taş çıkma şansı %35'tir; en geç üçüncü kırmada taş garantilenir. Zümrüt, Yakut ve Ametist ayrı depo kaynaklarıdır.
- Tarif malzemeleri tek atomik işlemde tüketilir; üretilmiş takı depoya eklenir. Üretim ve NPC teslimi ayrı işlemlerdir.
- Üç NPC siparişi bulunur. Sipariş yenilenebilir. Teslim, ürün tüketimi/altın/XP/yeni siparişi tek işlemde değiştirir. Sipariş kimlikleri tekrar kullanılmaz.
- Tek amulet takılabilir. Bonus zincir puanına uygulanır. Takılı bir kopya satılmaz. Koruma seçilen türün bütün kopyalarını korur.
- Altın atölye geliştirmesine ve enerjiye harcanır. Dükkânda 250 altına 30 enerji alınır; kapasite üstünde enerji veya tam kapasitede satın alma yoktur. Gerçek para ve premium bakiye yoktur.
- Atölye sekiz aşamalıdır. Her aşama 2. basamak cevher üretme ihtimalini %2,5 artırır; en fazla %20. Geliştirme altın ve seviye ister.
- Normal enerji dolumu dakikada 1'dir. İlk Karbasan açılışından itibaren bir saat Power Hour etkindir: enerji iki kat hızlı dolar, teslim XP'si %50 artar. Uygulamayı yeniden açmak süreyi uzatmaz.
- XP, unvanlar ve seçilebilir Lord/Leydi hitabı yereldir. Sonraki iki kasaba kilitli görsel prototiptir; taşınma uygulanmamıştır.

Tarifler, eşikler ve katsayıların tek kaynağı `src/karbasan/catalog.ts` dosyasıdır. 8–12 haftalık kasaba hedefi canlı oyuncu verisiyle henüz doğrulanmamıştır.

## Mimari ve kayıt

Saf oyun motoru saat ve rastgelelik kaynağını dışarıdan alır. Görsel ve ses efektleri sonuç üretmez. UI komutları güncel state referansından yürütülür; React render zamanlaması çift ödül doğurmaz.

Yeni kayıt anahtarı `katlapatla:karbasan:v3`, yedeği `katlapatla:karbasan:v3:backup` şeklindedir. Eski V1/V2 anahtarlarına yazılmaz. Kayıt şeması yükleme ve yazmada doğrulanır. Yazmalar sıralıdır. Son başarılı kayıt sonraki yazmadan önce yedeklenir. Bozuk kayıt sessizce sıfırlanmaz; yeniden deneme ve açık yedek geri yükleme sunulur. Disk hatasında bellek ilerlemesi korunur ve hata görünür kalır. İşletim sistemi işlemi son yazma tamamlanmadan sonlandırırsa son hamlenin kalıcılığı garanti edilemez.

## Görsel, hareket ve ses

Onaylı PNG kaynakları değiştirilmeden `assets/karbasan/` içine alınmıştır. `sprites.ts` koordinatları native view clipping ile bu kaynakları gösterir. Pan hareketi Reanimated shared values ile UI thread üzerinde çalışır; oyun state'i hamle tamamlanınca değişir. Hücreler memo edilir. Çerçeveler dokuz parçayla esner; metin ve etkileşimler React Native bileşenleridir.

Orijinal sesler `scripts/generate-audio.py` ile deterministik üretilir. Beş birleşme basamağında süre ve perde yükselir. Kırma, zincir, teslim, seviye ve ortam sesleri ayrıdır. Müzik, efekt, titreşim ve azaltılmış hareket ayrı ayarlanır. Uygulama arka plana geçince müzik durur. Ses hatası oyun sonucunu değiştirmez.

## Ölçüm

`npm run benchmark:karbasan`, 46 hazır cevher ve iki sabit üreticili zinciri ve sonuç şeması doğrulamasını 10.000 kez ölçer. 13 Kasım 2026, Node 22.23.5/macOS ölçümü: p50 0,054 ms, p95 0,073 ms, en yüksek 1,653 ms. Bunlar masaüstü JavaScript motoru ölçümleridir; telefon FPS'i veya GPU performansı değildir.

`npm test`, eski 14 regresyon testiyle yeni 16 Karbasan testi toplam 30 testi kapsar. Kaynak tüketimi, kilitli maden, normal kırma, zincir, craft, tek teslim, koruma, enerji sınırları, kayıt sırası, bozuk kayıt ve 1.000 hamlelik invariant testi vardır.

## Kalan ürün doğrulamaları

Gerçek telefon hissiyatı, uzun süreli ekonomi, 8–12 haftalık ilerleme, gerçek cihaz enerji/titreşim/ses karışımı ve Android doğrulaması ayrı aşamalardır. Simülatör onayından önce fiziksel telefona geçilmez.

## Simülatör doğrulama kaydı

13 Kasım 2026, izole `KatlaPatla-Visual-QA` / iOS 26.3.1:

- Aynı cevheri dokunarak ve sürükleyerek birleştirme doğrulandı. Son yerleşimde yatay ve düşey hücre ölçüleri ayrı hesaplanır; tahta kullanılabilir genişliği doldurur, nesneler kendi oranlarını korur.
- Normal kırma, depo külçesi, tarif üretimi ve NPC teslimi uçtan uca denendi. İlk Demir Yüzük tesliminde +85 altın ve Power Hour sırasında +68 XP görüldü.
- Atölye geliştirmesi altın tüketti ve aşamayı artırdı. Kilitli sonraki geliştirme devre dışı kaldı.
- Uygulama kapatılıp açılınca tahta, altın ve siparişler korundu.
- Ayrı QA örneğinde 40 cevherlik zincir, büyünün sıfırlanması, amulet takma/çıkarma ve satış koruması denendi. Bu örnek ana kullanıcı kaydına yüklenmedi.
- Dükkânda enerji alımı tek altın harcamasıyla kapasitede durdu. Tam kapasitede alım kapandı.
- Müzik ve azaltılmış hareket anahtarları değişti. Simülatör gerçek cihaz titreşimini ve sessiz mod davranışını doğrulamaz.
- Release native derlemesi tamamlandı. Metro kapatıldıktan sonra uygulama yeniden açıldı ve paket içindeki görseller yüklendi.
- TypeScript, lint ve 30 otomatik test geçti. Expo Doctor 20/20 kontrolü geçti.

Görsel kontrol, onaylı ana oyun referansıyla yapıldı. Üst atölye, Karbasan levhası, krem dama, kaynak göstergeleri, NPC kartları, seçim köşeleri ve dört menü ortak sanat kaynaklarından kuruldu. Görsel referans raster konsepttir; özgün font dosyası ve ölçülü tasarım kaynağı içermez. Georgia ve responsive native yerleşim kullanılır. Bu nedenle sonuç matematiksel olarak yüzde yüz piksel eşitliği diye raporlanmaz. Premium gösterge kullanıcı onayıyla kaldırılmıştır; kavram çizimindeki örnek sayılar ve yanlış cevher şekilleri bilinçli olarak kopyalanmaz.

Küçük ekran için oluşturulan SE QA simülatörü açılış/Device Hub bağlantısında yanıt vermedi; bu cihazda doğrulama tamamlandı diye raporlanmaz. Fiziksel telefon ve Android testleri yapılmadı.

## Yerel derleme ortamı notu

Bu Mac'teki önceki `node_modules` klasöründe aynı adlı ` 2.podspec` kopyaları ve daha sonra eksik okunan bir `core-js-compat` JSON dosyası görüldü. Bağımlılıklar aynı `package-lock.json` ile temiz yerel klasöre kuruldu; proje `node_modules` bağlantısından kullanır. Bu bağlantı Git'e girmez. Kaynak sürümleri değiştirilmedi. Başka bilgisayarda standart kurulum `npm ci` şeklindedir. Silinmiş yerel cache varsa `node_modules` bağlantısını kaldırıp `npm ci` ile yeniden kurulmalıdır. Kurulu standalone simülatör uygulaması bu geliştirme klasörüne bağlı değildir.

Ek görsel sözleşmesi kontrolü: `npm run verify:assets`, 19 PNG kaynağının gerçek boyutlarını, 107 sprite alanının tam sayı ve atlas sınırı koşullarını, 40 cevher basamağının ve 9 tarif görselinin varlığını doğruladı. Takı düzeltme atlası, malzemesiyle eşleşmeyen dört eski gösterimi değiştirdi; PNG pikselleri native kırpma dışında dönüştürülmedi.
