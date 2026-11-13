# Karbasan — ekran varlığı adayları

11 görsel paket üretildi. 9 cutout sheet'te gerçek şeffaf pikseller doğrulandı; 2 çevre/harita zemini opaktır. Kaynak dosyalar toplam yaklaşık 19,2 MB'tır. Bunlar uygulamaya import edilmemiş, onay ve export bekleyen adaylardır.

## Paketler

| Paket | Önizleme | Nerede kullanılacak? |
| --- | --- | --- |
| Ortak panel ve düğmeler | [UI skin](shared/ui-skin-v1.png) | Ana ekran, siparişler, bütün paneller |
| UI'sız Karbasan çevresi | [Arka plan](shared/karbasan-background-v1.png) | Ana tahta ve ortak ekran zemini |
| C logosu ve KP | [Marka cutout](shared/brand-cutouts-v1.png) | Açılış ve header |
| Navigasyon/kaynak/durum ikonları | [İkonlar](shared/icons-v1.png) | Alt menü, kaynaklar, ayarlar ve durumlar |
| Üç NPC | [Portreler](orders/npc-portraits-v1.png) | Sipariş kartı, detay, öğretici |
| Takılar ve amuletler | [Ürünler](orders/jewelry-v1.png) | Craft, sipariş, depo, Eşyalar |
| Külçeler ve işlenmiş bloklar | [Depo çıktıları](gameplay/material-outputs-v1.png) | Depo, craft ve kırma sonucu |
| Karataş/Kızıltaş | [Nadir cevherler](gameplay/rare-ores-v1.png) | Tahta ve keşif |
| Yazısız harita | [Karbasan haritası](map/karbasan-map-v1.png) | Harita ve ilerleme pinleri |
| Atölye öncesi/sonrası | [Atölye aşamaları](progression/workshop-stages-v1.png) | Geliştirme ekranı |
| Yardımcı illüstrasyonlar | [İllüstrasyonlar](services/illustrations-v1.png) | Dükkan, Power Hour, boş depo, unvan ve seviye |

## Bir sonraki export adımı

Onaylı tekil varlıklar koordinatları belirlenerek ayrılır; padding, @3x ölçüler ve panel köşeleri hazırlanır. Ham sheet'in @3x export olduğu varsayılmaz. Final uygulama ikonunun opak ve platform gereksinimlerine uygun ayrı export'u gerekir.

Külçe ve illüstrasyon PNG'lerinin bazı önizleyicilerinde alpha=0 piksellerin RGB renkleri fon gibi görünebilir. PNG decode kontrolü gerçek şeffaf pikseller olduğunu doğruladı. Bu kontrol, bütün yarı şeffaf kenarların temiz olduğunu garanti etmez. Markanın ve nadir maden sheet'inin bir köşesinde alpha=1 kalıntısı vardır; son export öncesi canvas/kenar temizliği yapılmalıdır. Hiçbir aday bu nedenle final-ready olarak işaretlenmemiştir.

Takı bandı örnekteki sarı altından koyu Bronz'a düzeltildi. Külçeler, çizimde yanlışlıkla kullanılan cevher ikonlarının yerine özel üretildi. Bunlar izin verilen düzeltmelerdir; özgün maden şekilleri ve C marka kimliği yeniden tasarlanmamalıdır.

## Sınırlar ve inceleme

- Üç NPC aynı karakter kimliğine bağlıdır; yeni portrelerin yüz/bakış ayrıntıları kaynakla yan yana onaylanır.
- Amulet çerçevesi bütün renklerde aynı kaynaktan final olarak türetilmelidir. Bu sheet'teki küçük üretim farklılıkları final export'ta kabul edilmez.
- Harita ve çevre, kaynak kompozisyonuna yakın üretilmiş türevlerdir; piksel kopyası değildir. Final ana ekran yerleşimi referans görüntüyle kıyaslanacaktır.
- Tam 8–12 haftalık atölye aşamaları henüz tariflenmemiştir; iki bina görseli yalnızca önce/sonra çiftidir.
- Külçe, özel blok, zümrüt, taç ve premium yıldız çizimleri içerik/ekonomi onayı değildir. Kesinleşmeyenler manifestte aday kalır.
- Ses ve hareket planlandı; bu klasörde ses dosyası veya oynatılabilir animasyon yoktur. Efektler, sınırlı prosedürel katmanlarla uygulanacak; gerekli ek texture'lar ölçümden sonra üretilecektir.
- İlk altı madenin onaylı kaynakları `../reference/` içindedir. Onların tekil kesim koordinatları ve son çözünürlükleri ayrıca doğrulanacaktır.

## Kaynaklar ve kayıt

- [Ekran bazında eşleme](ASSET_PLAN.md)
- [Tam prompt seti](PROMPTS.md)
- [Dosya boyutu, alpha ve SHA-256 manifesti](manifest.json)
- [Yazılım ve doğrulama planı](../../../docs/KARBASAN_BUILD_PLAN.md)

Üretim aracı: built-in Imagegen. Yeni paket, API anahtarı, CLI fallback veya çalışma zamanı bağımlılığı eklenmedi.
