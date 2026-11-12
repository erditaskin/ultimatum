# KatlaPatla görsel kimliği

## Onaylanan yön

Neon ve yuvarlak `KatlaPatla!` yazısı; büyük K pembe, büyük P lime yeşili. P'nin hemen sağındaki a magentadır. Logo ve KP ikonu siyah/gri harf içermez. Arayüz açık pembe-lila, metinler okunabilir koyu mürdüm tonundadır.

Üç tür aynı 6×6 tahtada bulunur; tür seçme sekmesi yoktur. Her üretim, eşit olasılıkla bu üç türden seviye 1 parça çıkarır. Üretim konumu ve türü rastgele seçimden sonra motora açık parametre olarak verilir.

- Katlı paketler: pembe-mor katlı kâğıt, konfeti ve kurdele patlaması.
- Biberler: yeşilden acı kırmızıya gelişim; kırmızı-turuncu patlama ve yeşil yapraklar.
- Kozmik kapsüller: grafit griden parlak metalik gümüşe gelişim, pembe detaylar. Patlamada gümüş parçalar, mor içermeyen camgöbeği/mavi enerji ve renkli kayan yıldızlar.

Birleşme aynı tür ve aynı seviyeyi gerektirir. Patlama menzilindeki diğer hazır türleri de tetikler. Her dalga, tetiklenen türlerin kendi efektlerini gösterir. İlk iki seviye patlamadan korunur.

## Dosyalar

- `assets/brand/art-direction-approved.png`: onaylanan kartela.
- `assets/brand/game-atlas-v1.png`: 1254×1254, gerçek alfa kanallı 5×5 atlas.
- `assets/brand/kp-icon-v1.png`: tam zeminli, kare KP uygulama ikonu.
- `src/ui/art.tsx`: atlas koordinatları, tür adları ve efekt paletleri.

Atlas satır 0: dört hücre boyunca logo, son hücre KP. Satır 1: beş paket. Satır 2: beş biber. Satır 3: beş kapsül. Satır 4: ilk üç hücre sırasıyla paket, biber ve kozmik patlama. Logo görünümü, komşu ikon kenarını almamak için ilk 3,9 hücreyi kırpar. Sprite kırpma native görünümde yapılır; dosyalarda arka plan silme veya yeniden boyama yapılmadı.

Görseller yerleşik Imagegen ile onaylı karteladan üretildi. Üretim promptları `docs/art-prompts.md` içindedir. Çalışma zamanında görsel üretimi, uzaktan indirme veya görsel servis çağrısı yoktur.

## Kayıt geçişi

V2 her hücrede `{ level, family }` saklar. Eski V1 genel Pof'ları, yan yana çiftler aynı tür olacak şekilde konuma göre üç aileye dağıtılır. Kareler, seviyeler, puan, altın, görev ve atölye ilerlemesi korunur. V1 kaydı kurtarma kopyası olarak tutulur. V2 yalnızca doğrulamadan sonra yazılır. Geçersiz kayıt sessizce sıfırlanmaz.

## Doğrulama sınırı

Bu atlas ilk oyun içi sanat uygulamasıdır. Karteladaki resimler animasyon kareleri değildir; efekt atlası Reanimated ölçek, dönme, parçacık ve yıldız hareketleriyle canlandırılır. Fiziksel telefon testi, kullanıcının simülatör onayından sonra yapılacaktır.
