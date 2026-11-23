# Stil Kılavuzu — Görsel Yoğunluklu Video

Ölçüler 1080×1920 (30 fps) içindir. Uygulama: `motor/chrome/Chrome.tsx`, `motor/tokens.ts`.

## 1) Ritim (tarzın kalbi)
- **Sahne**: 3–7 sn, bir başlık + bir illüstrasyon fikri. Bir video 11–15 sahne.
- **İfade (beat)**: 1–2.5 sn, tek kısa cümle/parça (≤ 9 kelime, ideal 3–6). Her ifade **görselde bir olay** tetikler: obje belirir, karakter hareket eder, sayaç döner, damga vurur, kart çevrilir.
- Hedef: **ifade başına ort. ≤ 2.6 sn** (`dogrula.py` kontrol eder). Ekran 2 saniyeden uzun hareketsiz kalmaz; boşta bile ögeler **sürekli** hafifçe yaşar (nefes alan karakter, süzülen paralar, dönen siren).
- Süre: 45–70 sn. Kanca ilk 2 saniyede: ilk sahne konunun çelişkisini (ör. 50.000 ₺ → ceza yok) hemen gösterir. İkinci sahne çelişkinin diğer yüzünü verir; üçüncü sahne "neden?" sorusunu açar.
- Akış şablonu: **Kanca A → Kanca B → Çelişki/soru → Kanun/ilke → Kimler/neler (liste) → Ayrım (A≠B) → İstisna (koyu sahne, dramatik) → İstisnanın mekanizması → Sayısal/yaptırım → 2–3 "ince ayar" → Sence adil mi? + takip et**.

## 2) Sahne kabuğu (her karede sabit düzen)
| Katman | Yer (px) | Biçim |
|---|---|---|
| İlerleme noktaları | y≈104, x 92–930 | Sahne sayısı kadar nokta + altın dolgu çizgisi, aktif nokta büyük altın; sağda ses simgesi |
| Kicker | y≈192 | Mono, BÜYÜK HARF, aralıklı (5px), pas rengi; konu/alt başlık |
| Başlık | y≈246–290 | Serif display, 1 satır ≤112px, 2 satır ≤98px; **vurgu kelimesi altın italik**; kelimeler 3 kare arayla aşağıdan yaylanarak girer |
| Çizim kartı | x54 y470 972×800 | 7px mürekkep çerçeve, 46px köşe, krem zemin, 10px sert gölge; sahne başında 8 karede yay ile belirir |
| Handle etiketi | kartın sağ alt kenarı | Koyu espresso, altın nokta + `@hukukla.app` |
| Dipnot | kart altı sol | Mono küçük harf: `TCK m.167 · ŞAHSİ CEZASIZLIK` (kanun dayanağı her sahnede görünür) |
| Altyazı hapı | y≈1432, ortalı | Espresso zemin, altın çerçeve, serif 66px; **kelime kelime karaoke**: söylenen kelime krem, şimdiki kelime altı çizili, gelecekler soluk; ifade değişince yaylanarak girer |
| Güvenli alan | y > 1560 boş | Instagram arayüzü için bırakılır |
- Koyu (dramatik) sahne: espresso zemin, altın kicker, krem başlık, krem hap. Videoda **en fazla 1–2 kez**, sadece istisna/şok anında.

## 3) Hareket dili
- Giriş: **yaylanma** (spring; damping 11–15, stiffness 160–220) — hafif aşım hissi. Doğrusal kaydırma yok.
- Her ifade başında bir "vuruş": belirme (scale 0.6→1), damga (scale 2.4→1 + sarsıntı), kart çevirme (scaleX 1→0→1, içerik ortada değişir), sayaç (0→değer, 30 kare), kayma.
- **Sarsıntı** yalnızca çarpma anlarında (damga, bıçak, tokmak): genlik 8–16 px, 10–14 kare, sönümlü.
- Sürekli yaşam: karakter nefesi (±3px, sin), göz kırpma (96 karede 1), süzülen/dönen objeler, `Zzz`, yağmur.
- Karakter jestleri: kol açıları ile (omuz/dirsek), ifade (mood) ile; şaşkınlık = eller yukarı + ter damlası; öfke = kaşlar + bıçak uzanır.

## 4) Palet ve çizim dili
- Marka: kâğıt `#F5F0E6`, espresso `#1C1510`, altın `#C5A059`. Aksanlar: çinko yeşili `#1F6F6B`, mercan `#D9482B`, adaçayı `#A8C99B`, pas `#8C3A22`.
- Semantik: **yeşil = ceza yok/korunuyor**, **mercan = ceza/istisna/tehlike**, altın = vurgu/anahtar kavram.
- Çizim: düz dolgu + **5px koyu kahve kontur** (`#2B1B12`), yuvarlak köşe, gölge yok (yalnız zemin gölgesi), yüzler: nokta göz, kalın kaş, basit ağız, yanak ruju. Karakterler büyük kafalı, ~370px boy.
- Tipografi: DM Serif Display (başlık/sayılar), DM Serif Text (hap), DM Mono (kicker/dipnot/etiket). Türkçe karakterler (İ ı ş ğ) `latin-ext` ile yüklenir.

## 5) Ses
- Tek anlatıcı, **kilitli ses (Charon)**, tempo 1.10. Her ifade ayrı üretilir; ifadeler arası 0.10 sn, sahneler arası 0.32 sn; sahne görseli sesten 0.28 sn önce başlar (görsel ses'i "karşılar"), ifade görseli sesten 0.05 sn önce.
- Müzik yok; yalnızca **tasarlanmış efektler**: her sahne geçişinde whoosh, her ifadede yumuşak pop, olaylarda özel (stamp, thud, slash, cash, lock, siren, ding, cuff, snip, flip). Efektler sesi bastırmaz (voice ≈ 0.88, sfx ≤ 0.4).
- TTS metni telaffuza göre yazılır ("elli bin lira", "madde yüz altmış yedi"), ekran yazısı (`pill`) şık yazılır ("50.000 lira", "madde 167").

## 6) İçerik kuralları
- Her sahne **bir hukuki iddia + dayanak** taşır (dipnot). Madde numaraları ve ceza aralıkları yayından önce resmî metinden doğrulanır.
- Kapanış: "Sence adil mi?" + yorum çağrısı + takip et + **yasal uyarı satırı** kartın içinde ("Genel bilgilendirme amaçlıdır… olay ve kişiler canlandırmadır").
- Kişi/olay kurgudur; gerçek kişi, marka, kurum adı kullanılmaz.
