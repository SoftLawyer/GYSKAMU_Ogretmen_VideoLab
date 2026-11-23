# Sahne Kütüphanesi — Kavram → Görsel Mecaz

Önce bir mecaz seç, sonra ifade başına olay planla. Hazır bileşenler: `motor/art/kit.tsx` (obje), `motor/art/Person.tsx` (karakter). Çalışan örnekler: [`episodes/gy_001_aile_ici_hirsizlik/sahneler_a.tsx`](episodes/gy_001_aile_ici_hirsizlik/sahneler_a.tsx), [`sahneler_b.tsx`](episodes/gy_001_aile_ici_hirsizlik/sahneler_b.tsx).

## A) Hazır sahne desenleri (kopyala-uyarla)
| Desen (gy_001'de) | Ne anlatır | İfade → olay planı |
|---|---|---|
| `HookWallet` | Kanca A: eylem + sayaç + ceza kartı | 1 sahne kur, 2 sayaç 0→tutar, 3 "CEZA ?" kartı, 4 kart çevrilir → sonuç + onay işareti |
| `HookKnife` | Kanca B: aynı kişiler, ağırlaşan eylem | 1 aktörler, 2 tutar kartı, 3 silah uzanır + sarsıntı, 4 "CEZA ?", 5 kart → ceza + çelik parmaklık iner |
| `Seesaw` | Çelişki (ters orantı) | kiriş eğilir → ek obje düşer → kiriş ters yöne → etiketler → "?" → damga |
| `LawPaper` | Madde metni | kâğıt + başlık; ifade başına satır vurgusu (mercan=istisna, yeşil=sonuç); sonda damga |
| `Polaroids` | Kimler kapsamda / liste | her ifade yeni polaroid(ler) düşer + onay rozeti |
| `Switches` | A ve B ayrı şeyler (suç ≠ ceza) | ilk anahtar açılır; ikincisi kapanır; tokmak kilide çarpar |
| `SirenDark` | İstisna / şok (koyu sahne) | siren yanar → dev kelime sarsılarak çarpar + beyaz flaş |
| `Umbrella` | Koruma kalkar | koruyucu şemsiye + kural etiketi → bıçak/ihlal → kanopi ikiye ayrılıp uçar, yağmur başlar |
| `Gauge` | Yaptırım aralığı | gösterge + sol/sağ etiketler → ibre kırmızı bölgeye sallanarak gider + büyük sayı |
| `Friend` | Üçüncü kişi sorumluluğu | yardımcı kayarak girer → "akraba değil" etiketi → kelepçe + damga |
| `Repay` | Tazminat/geri ödeme | "ceza yok" rozeti → paralar yay çizerek karşıya uçar → tutar kartı |
| `HalfCut` | İndirim/oran | satırlar sırayla girer → ceza çubuğu → makas keser, yarısı düşer |
| `Verdict` | Kapanış | iki sonuç kartı + `≠`, yorum balonu, takip et butonu, yasal uyarı |

## B) Kavram → mecaz fikirleri
| Hukuki kavram | Görsel fikir |
|---|---|
| Meşru savunma sınırı | Çizgili halat/şerit: savunan çizgiyi aşınca kırmızıya döner; orantı terazisi |
| Zamanaşımı | Kum saati/ takvim yaprakları dökülür, dosya tozlanır, "DÜŞTÜ" damgası |
| Nedensellik bağı | Domino zinciri; bir taş çekilince zincir kopar |
| Kast / taksir | Hedefe nişan alan ok vs. kayan muz kabuğu |
| Şüpheden sanık yararlanır | Bulanık delil lupu; terazi kefesindeki "?" ağırlığı yok sayılır |
| Zincirleme suç / içtima | Halka zinciri birleşir/ayrılır; tek mühür mü çoklu mühür mü |
| Etkin pişmanlık | Geri sarılan saat/ paranın geri uçması, ceza çubuğu kısalır |
| Haksız tahrik | Kaynayan çaydanlık + ceza indirim ölçeği |
| Miras payları | Pasta dilimleri, dilimler kişilere uçar; saklı pay = kilitli dilim |
| İş akdi feshi | Kapı + kutu (karton) + ihbar takvimi; tazminat çantası |
| Kira artışı | Yükselen çıta/merdiven + tavan çizgisi (yasal sınır) |
| Delil yasağı | Yasadışı elde edilmiş delil "çürük elma" gibi sepetten atılır |
| Şikâyet hakkı/süre | Zarf + geri sayım çubuğu (6 ay) |
| Suça teşebbüs | Yarım kalmış merdiven/köprü; yaptırım yarıya iner |

## C) Karakter ve obje kitaplığı (`motor/art`)
- `Person`: `top/pants/hair/hairStyle(short|messy|gray|long|bald)/beanie/glasses/mustache/style(hoodie|cardigan|tee)`, `mood(neutral|smile|smug|shock|angry|sad|grin|worry|sleep)`, kollar `armF/armB=[omuz,dirsek]` (0=aşağı, 90=ileri, 180=yukarı), `heldF/heldB` ile eline obje ver, `face=-1` aynalar (elindeki objede **yazı olmasın**).
- `Head` (avatar/polaroid), `Room, Win, Lamp, Clock, Chair*, Table`, `Bill, Wallet, Knife, Handcuffs, Gavel, Scissors, Bars`, `Stamp, Tag, VerdictCard, Toggle, Polaroid, Speech`, `Check, Cross, Sparkle, Sweat, Anger, Zzz`.
- Yeni nesne eklerken: 972×800 koordinat sistemi, 5px `INK` kontur, düz dolgu, merkezli çizim, `x,y,r,s,o` ortak parametreleri.
