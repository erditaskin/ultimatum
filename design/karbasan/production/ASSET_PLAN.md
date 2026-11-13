# Karbasan — ekran bazlı görsel varlık planı

## Durum ve kullanım sınırı

Bu klasör uygulamaya bağlanmamış üretim adaylarını içerir. “Üretildi”, “tasarım olarak onaylandı” ve “export/alpha kontrolü tamamlandı” ayrı durumlardır. Kaynak ekranlar onaylı yönü gösterir; yeni ayrıştırılan adaylar ayrıca kıyaslanır. Yeni görüntü üretimi birebir piksel kopyası değildir.

Her ekrana özel bütün bir ekran resmi üretmek yerine aynı kaynaklar tekrar kullanılır. UI metni/sayı/ilerleme/dama/selection kodla çizilir. Sheet'ler kapak görseli değil, ileride tekil export/atlas için kaynak adaydır. Kesim, optik padding ve cap-inset koordinatları doğrulanmadan runtime asset olarak işaretlenmez.

## Ortak paketler

| Kimlik | Dosya | Kaynak ve içerik | Tüketen ekranlar |
| --- | --- | --- | --- |
| BRAND | shared/brand-cutouts-v1.png | Seçili C wordmark + KP, şeffaf; yeşim K/iris P | Açılış, küçük header |
| SKIN | shared/ui-skin-v1.png | Ahşap/parşömen panel, sipariş kartı, bilgi paneli, title plaque, 4 düğme, nav tile, pill, geri/kapat/ayar | Bütün paneller ve 4 ana bölüm |
| ENV | shared/karbasan-background-v1.png | UI'sız kış kasabası ve ocak çevresi | Ana ekran ve ortak arka plan |
| ICON | shared/icons-v1.png | Harita, depo, örs, eşya kutusu, enerji, altın, yıldız adayı, XP, kilit, tik, uyarı | Header/nav/profil/yardımcı durumlar |
| NPC | orders/npc-portraits-v1.png | Aynı üç NPC'nin şeffaf büstleri; portreler tekrar üretilmez | Sipariş kartı, sipariş detayı, öğretici |
| ITEM | orders/jewelry-v1.png | Referanstaki yüzük/bilezik/amulet ve amulet koleksiyonu | Sipariş, craft, depo, Eşyalar, seviye ödülü |
| MAT | gameplay/material-outputs-v1.png | Sekiz metalin külçe/blokları + ayrı zümrüt örneği | Depo, craft, kırma çıktısı |
| ORE | reference/ + gameplay/rare-ores-v1.png | Onaylı maden siluetleri; Karataş/Kızıltaş için ayrı şeffaf sheet | Tahta, keşif, malzeme bilgisi |
| MAP | map/karbasan-map-v1.png | Yazısız rota/şehir çevresi; kilit/pin native overlay | Harita |
| UPGRADE | progression/workshop-stages-v1.png | Aynı atölyenin başlangıç/geliştirilmiş görünümü | Atölye geliştirme |
| FEEDBACK | services/illustrations-v1.png | Dükkan, boş sandık, hourglass, unvan/level rozeti, tarif parşömeni | Dükkan, boş depo, Power Hour, profil, kutlama |

`reference/` yolları bu klasörün kardeşi olan `../reference/` dizinine karşılık gelir. MAT/ITEM çizimleri tarif/nadirlik/bonus değerlerini kesinleştirmez. Premium yıldız onaylanmış ekonomi kararı değildir.

## Ekran/durum eşlemesi

| No | Ekran/durum | Görsel kaynaklar | Canlı çizilen bilgi ve etkileşim |
| --- | --- | --- | --- |
| 01 | Ana tahta | ENV, BRAND, SKIN, ICON, NPC, ORE | 6×8 dama, seçili hücre, adetler, kaynaklar |
| 02 | Eksik sipariş | NPC, ITEM, MAT, SKIN | Eksik/hazır miktar, ödül, disabled Üret |
| 03 | Üretime hazır | ITEM, MAT, SKIN | Girdi miktarları, Üret komutu |
| 04 | Teslime hazır | NPC, ITEM, SKIN | Hazır ürün sayısı, altın/XP, Teslim Et |
| 05 | Depo | MAT, ITEM, SKIN, ICON | Kategori filtresi, miktarlar, seçili bilgi |
| 06 | Eşyalar | ITEM, SKIN, ICON | Tek aktif amulet, bonus, Tak/Koru |
| 07 | Tarifler | ITEM, MAT, FEEDBACK, SKIN | Tarif listesi, kilit eşiği, gereksinimler |
| 08 | Harita | MAP, ICON, SKIN | Pin, rota ilerlemesi, kilitler, başlık |
| 09 | Atölye geliştirme | UPGRADE, MAT, ITEM, SKIN | Önce/sonra, maliyet, açılış, Geliştir |
| 10 | Profil/unvan | NPC, FEEDBACK, ICON, SKIN | İsim, rank, XP, başarım sayaçları |
| 11 | Dükkan/alım onayı | FEEDBACK, ICON, SKIN | Teklif, tutar, onay/iptal |
| 12 | Power Hour | FEEDBACK, ENV, SKIN | Kalan zaman, gerçek etkinlik bonusu |
| 13 | Ayarlar | ICON, SKIN | Switch durumları, kayıt, sürüm |
| 14 | Öğretici | NPC, ORE, SKIN | Odak alanı, sürükleme oku, kısa metin |
| 15 | Büyü kombosu | ORE, küçük effect texture gerekirse | Bağlantı, parçacık, puan/çarpan, zamanlama |
| 16 | Seviye yükselme | FEEDBACK, ITEM, MAT, SKIN | Seviye/rank/açılış ödülleri |
| 17 | Enerji yok | ICON, SKIN | Sayaç, açık kalan birleşme, geri dön |
| 18 | Tahta dolu | ORE, SKIN | Bilgi toast, eşleşme vurgusu; enerji tüketilmez |
| 19 | Boş depo | FEEDBACK, SKIN | Açıklama, atölyeye dönüş |
| 20 | Kırma/çıktı | ORE, MAT, SKIN | Hazır seviye, verim, Kır |
| 21 | İlk keşif | ORE, FEEDBACK, SKIN | Maden adı, keşif kaydı, Devam |
| 22 | Kayıt yazma hatası | ICON, SKIN | Doğru hata metni, Yeniden dene, kapatma |

Ek panel varyantları (yetersiz altın, boş eşya, alınmış başarım, etkinlik bitti, korunmuş ürün) yeni illüstrasyon gerektirmez. Onaylı skin ve mevcut ikonlar kullanılır.

## Yeni varlık üretim sırası

1. Ortak skin, UI'sız arka plan ve seçili marka cutout'u.
2. NPC büstleri, navigasyon/kaynak ikonları, takılar ve depo çıktıları.
3. Harita, atölye aşamaları, yardımcı illüstrasyonlar.
4. Nadir maden cutout'ları ve onaylı maden referanslarının birleştirilmesi.
5. Görsel onaydan sonra deterministik tekil export, atlas packing ve kayıpsız optimizasyon. Optimizasyonun görünüş değiştirmediği kontrol edilir.

## Teknik export sözleşmesi

- Küçük nesne için hedef sunum 48 nokta; ilk üretim export hedefi 144×144 piksel (@3x), şeffaf ve tutarlı optik padding. Kaynak sheet bu boyutta olmak zorunda değildir.
- NPC büstü 72–96 nokta sunum için yeterli çözünürlükte ayrılır. Yüz, saç/sakal, kıyafet, bakış yönü referansla kıyaslanır.
- Arka plan tam ekran altında aspect-fill; kesilmemesi gereken ocak/bina için odak noktası manifestte belirtilir. Paneller metin taşmasında esnetilir/kaydırılır.
- PNG alpha korunur. Sheet'in ekranda siyah görünen şeffaf zemini, gerçek siyah arka planla karıştırılmaz. Beyaz/koyu/tahta zeminlerde kenar halo kontrolü yapılır.
- Her sprite aynı atlas koordinatında ve kararlı asset kimliğinde kalır. Türkçe görünen ad dosya kimliği değildir.
- Kaynaklar büyük olabilir; runtime'a yalnızca onaylı ve ölçülendirilmiş export eklenir. Dosya boyutu ve decode belleği ayrı ölçülür.

## Görsel kabul kapısı

1. Malzeme rengi/siluet, NPC kimliği, logo C ve çerçeve kalınlığı referansla eşleşir.
2. Hiçbir UI metni, rozet sayısı, bakiye veya deneme açıklaması resme gömülü değildir.
3. Alpha kenarlarında kare fon, bulanık renk halesi veya komşu sprite yoktur.
4. 48 px ve 48 nokta cihaz örneklerinde nesneler ayırt edilir.
5. Dosya boyutu, çözünürlük, alpha ve hash manifestte kayıtlıdır.
6. Kabul edilmemiş aday, uygulama varlığına yükseltilmez. Mevcut paket üretim adaylarıdır; otomatik olarak son export sayılmaz.
