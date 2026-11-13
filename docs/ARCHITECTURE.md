# Karbasan mimarisi

Güncel uygulama sözleşmesi ve ölçümler [KARBASAN_IMPLEMENTATION.md](KARBASAN_IMPLEMENTATION.md) içindedir. Önceki prototip mimarisi [arşivde](../design/archive/legacy-docs/ARCHITECTURE-v2.md) korunur.

- `src/karbasan/catalog.ts`: madenler, tarifler, seviye eşikleri ve ekonomi sabitleri.
- `src/karbasan/engine.ts`: React/native bağımlılığı olmayan immutable komut motoru. Saat ve RNG dışarıdan verilir.
- `src/karbasan/persistence.ts`: V3 şema doğrulaması, sıralı AsyncStorage yazmaları, önceki başarılı kayıt yedeği ve açık geri yükleme.
- `src/karbasan/context.tsx`: güncel state referansı, komut/kayıt orkestrasyonu, foreground enerji hesabı ve hata durumları.
- `src/ui/karbasan/`: native ekranlar, ortak çerçeve/sprite bileşenleri, UI thread sürükleme, ses ve efektler.
- `src/app/`: yalnızca Expo Router rotaları ve kök provider bağlantısı.

Animasyon callback'leri kaynak kazandırmaz. Craft ve teslim bütün kontrolleri aynı işlemde yapar. Sipariş kimliğiyle tekrarlı teslim önlenir. Kayıt hatası görünürdür; bozuk kayıt sessizce sıfırlanmaz. Eski prototip kayıt anahtarları değiştirilmez.

48 hücre memo edilir. Sürükleme her karede React state güncellemez. Kaynak PNG'ler native view kırpmasıyla paylaşılır. Saf motor benchmark sonucu cihaz FPS'i sayılmaz. Gerçek telefon ve Android ölçümleri simülatör onayı sonrası yapılır.

iOS/Android klasörleri Expo CNG çıktısıdır ve Git'e girmez. Yerel native dosyalar elle değiştirilmez. Mikrofon ve arka plan ses yetkisi istenmez. Hesap, ağ servisi, reklam veya ödeme SDK'sı yoktur.
