# Katla Patla — MVP kararları

## Kimlik ve kapsam

Katla Patla, katlı paketler, biberler ve kozmik kapsüllerin bulunduğu bir dönüşüm atölyesinde geçen, iOS öncelikli bir üretme, birleştirme ve zincir patlatma oyunudur. Expo, React Native ve TypeScript kullanılır. Android sonraki aşamadır. İlk sürüm çevrimdışı, hesapsızdır. Reklam, satın alma ve bulut kayıt yoktur.

## Oyun döngüsü

1. Üreticiye dokunarak 6×6 tahtanın boş bir karesine üç türden bir seviye 1 parça üret.
2. Aynı tür ve seviyedeki iki parçayı birleştirerek üst seviyeye çıkar. En yüksek seviye 5'tir.
3. Parçaları boş karelere taşıyarak zincir hazırla.
4. Seviye 3–5 parçaya 250 ms basılı tutarak patlat. Erken bırakma veya taşıma patlamayı iptal eder.
5. Patlama menzilindeki hazır parçalar zincire katılır. Her parça yalnızca bir kez tetiklenir. Seviye 1–2 parçalar korunur.
6. Puanla tek aktif görevi tamamla, altın kazan. Tahta görev sonunda korunur.
7. Altınla atölyeyi sabit sırayla dönüştür. MVP beş atölye dönüşümü içerir; sergilenen nesne ve atölye sunumu değişir. Beş parça seviyesi başlangıçtan itibaren kullanılabilir. Yeni üretici açılması sonraki sürümlere bırakılmıştır. İkinci bir yönetim oyunu yoktur.

## Parçalar

Katlı paketler, biberler ve kozmik kapsüller aynı tahtada oynanır. Her türün beş seviyesi vardır. Görsel ayrıntılar `ART_DIRECTION.md` içindedir. İlk iki seviye patlatılamaz. Seviye 3–5 menzilleri sırasıyla 1, 2, 3 kare Manhattan uzaklığıdır. Yalnızca hazır parçalar patlamada tüketilir. Dolu karede farklı tür veya seviyeler yer değiştirmez; geçersiz hamle kaynak tüketmez.

## Ekonomi ve başlangıç dengesi

Yalnızca üretim hak harcar. Kapasite 60; normal yenilenme 30 saniyede bir haktır. Birleştirme, taşıma ve patlatma ücretsizdir. Dolu tahtaya üretim hak tüketmez. Başlangıçta öğretici zincir için iki seviye 3 parça bulunur. Bunlar tek seferliktir.

Puan harcanmaz; altın harcanır. Basamak puanı = parçanın temel puanı × min(zincir derinliği + 1, 8). Aynı dalga aynı çarpanı kullanır. Temel puanlar 100, 300, 900'dür. Görevler başlangıçta 500 puan ister; sonraki hedefler kademeli büyür. Görev ödülü yalnızca açıkça talep edilince bir kez verilir; fazla puan sonraki göreve taşınır.

Power Hour yerel paketlenmiş tarih aralıklarıyla açılır. Üretim hakkı iki kat hızlı dolar; görev altını %50 artar. Görev tamamlandığı andaki bonus sabitlenir. XP yoktur. Üretim hakkı yenilenirken pencere sınırları hesaba katılır. Çevrimdışı cihaz saati güvenilirdir; saati değiştirmeye karşı sunucu güvencesi yoktur.

## Sunum ve erişilebilirlik

Dikey ekran, Türkçe arayüz, tek tahta. Patlama öncesi menzil vurgusu. Zincirde artan ses ve çarpan; kısa kutlama. Ses, titreşim ve azaltılmış hareket kontrolleri. Renk yanında seviye ve şekil kullanılır. Seç ve hedef kareye dokun erişilebilir taşıma alternatifidir.

## Ertelenenler

Mors/ritim etkileşimi, hesap, bulut kayıt, gerçek para, reklam, liderlik tablosu, çoklu kaynak, kapsamlı kasaba yönetimi ve Android doğrulaması.

## Referanslar

- https://support.traveltowngame.com/hc/en-us/articles/6187057873810-How-do-I-upgrade-my-Town
- https://support.traveltowngame.com/hc/en-us/articles/4833678076434-What-are-Orders
- https://candycrush.zendesk.com/hc/en-us/articles/360002087578-How-do-I-collect-Sugar-Stars
- https://docs.expo.dev/get-started/create-a-project/

Sayısal denge değerleri ürün vaadi değil, oynanabilir prototip varsayımlarıdır.
