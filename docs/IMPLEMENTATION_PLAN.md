# Karbasan uygulama sırası

## 1. Tasarım ve kural kilidi

Ekran paketini incele; açık ekonomi, craft, büyü ve taş kurallarını kapat. Görsel yön onayı, bütün örnek sayıları onaylamış sayılmaz. İlk sürüm kapsamını belirle; mağaza ve yeni para birimi karara bağlıdır.

## 2. Üretim varlıkları ve ölçüler

Onaylı logoyu, maden sprite'larını, külçeleri, takıları, NPC portrelerini, arka planları, çerçeveleri ve ikonları tek kaynaklı varlıklara ayır. Gerçek UI metni canlı çizilir. Cihaz referansını, tipografiyi, 6×8 tahta hücrelerini, güvenli alanları ve dokunma hedeflerini ölç. Küçük ekranda sprite ayrımını doğrula. Animasyon/ses dosyalarını üret ve lisans kaydını tut.

## 3. Motor ve kayıt

Yeni maden, depo, tarif, NPC sipariş, XP, unvan ve tek amulet modelini saf TypeScript kurallarıyla kur. Kayıt sürümü ve eski ilerleme geçişi açıkça tanımlansın. Kaynak tüketimi/ödül tek işlemde tutarlı ve yeniden açılışta tekrarsız olsun. Anlamlı ekonomi ve kayıt testleri yaz.

## 4. Ana oynanabilir kesit

Önce Demir/Bronz: üret, birleştir, kır, depola, bir ürün üret ve NPC'ye teslim et. Tek tahta ve seçili nesne panelini referans ekranla karşılaştır. Sonra seviye açılışları, diğer madenler, büyü kombosu ve ekipman ekle.

## 5. Destek ekranları

Harita, atölye geliştirme, profil/unvan, ayarlar, öğretici ve boş/hata durumlarını bağla. Dükkan ve Power Hour yalnızca kararlaştırılmış kurallarla eklenir. İkinci/üçüncü kasabalar oynanabilir vaat değil prototiptir.

## 6. Doğrulama

Lint, typecheck, motor/kayıt testleri ve iOS simülatörde uçtan uca akış. Referans boyutta ekran görüntülerini yan yana/üst üste kontrol et; küçük/büyük cihazlarda taşma, erişilebilirlik ve düşük hareket kontrolü yap. Release performansını ölç; geliştirme render süresini FPS diye raporlama. Kullanıcı simülatörü onayladıktan sonra fiziksel cihaz testi.

## Repo düzeni

- `src/`, `tests/`, `assets/`: çalışan eski prototip; yerinde korunur.
- `design/karbasan/`: güncel görsel paket ve promptlar.
- `design/archive/`: önceki denemeler ve belge snapshot'ları; çalışma zamanına import edilmez.
- `docs/PRODUCT.md`: yeni ürün yönü ve açık kararlar.
- `docs/ARCHITECTURE.md`, `docs/VALIDATION.md`: mevcut prototipin teknik/QA geçmişi; yeni motorun hazır olduğu anlamına gelmez.

Bu aşamada eski motoru silmek veya uygulamayı baştan boşaltmak gerekli değildir. Değişim, doğrulanan kesitler hâlinde yapılır.
