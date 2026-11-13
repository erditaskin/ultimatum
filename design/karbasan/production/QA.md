# Üretim hazırlığı doğrulaması

## Bu aşamada doğrulananlar

- 11 PNG dosyası decode edildi; genişlik/yükseklik, byte boyutu ve SHA-256 kaydedildi.
- Şeffaf olması gereken 9 sheet'in her birinde alpha=0 pikseller bulunuyor. 2 çevre zemini opak.
- Marka ve nadir maden sheet'inde tek bir köşe alpha=1; son export temizliği gerekiyor. Bu kontrol otomatik alpha varlığı kontrolüdür, tam kenar kalitesi onayı değildir.
- Manifestteki kaynak referans yolları mevcut.
- Kaynak kodundaki PNG/WAV require yolları ve app.json platform ikon yolları temizlikten sonra mevcut.
- Uygulama TypeScript dosyaları, oyun verisi ve bağımlılıklar değiştirilmedi.

## Uygulama ön kontrolü

Typecheck ve lint, mevcut Node 22 binary ile ayrı ayrı çalıştırıldı. Her biri 45 saniye içinde sonuç üretmedi; timeout ile sonlandırıldı. İkisi de geçmiş sayılmadı. Bu davranış önceki tasarım turunda da gözlendi. Uygulama koduna başlamadan bağımlılık/dosya erişimi ve araç başlangıcı kontrol edilerek nedeni giderilmeli, ardından iki kontrol tamamlanmalıdır.

Ek tanılamada TypeScript 6.0.3 sürüm çıktısı ve `--showConfig` tamamlandı; yapılandırma 12 kaynak dosyası seçiyor. Compile cache kapalı ek denemeler de tamamlanmadı. Sınırlı çözümleme izi `undici-types` modüllerine kadar ilerledi; bu son satır kök neden kanıtı değildir. Açık kalan deneme süreçleri kapatıldı. Bağımlılık veya compiler ayarı, doğrulamayı görünürde geçirmek için değiştirilmedi.

Bu tur oyun kodu değiştirilmediği için yeni motor testi yazılmadı. Mevcut testlerin geçmiş turdaki sonucu bu tur için yeni bir geçiş kanıtı değildir.

## Sonraki kabul kontrolleri

- Koyu/açık/tahta zeminde alpha kenarları; 48 px ve @3x ekran okunurluğu.
- Sheet koordinatları, cap-inset, dokunma hedefleri, fontlar ve gerçek safe area.
- C logo kimliği, NPC yüzleri, özgün maden siluetleri ve aynı amulet çerçevesi.
- Kodlandıktan sonra sabit seed ile screenshot kıyası; release performansı ve kayıt tutarlılığı.
