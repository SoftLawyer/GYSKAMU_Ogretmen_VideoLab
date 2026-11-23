# Üretim Protokolü — Görsel Yoğunluklu Video

Kullanıcı bu tarzda video istediğinde sırayla uygula. Önce [`STIL_KILAVUZU.md`](STIL_KILAVUZU.md) ve [`OZGUNLUK_KURALLARI.md`](OZGUNLUK_KURALLARI.md) oku.

## 0) Ön kontrol
1. `python3 gorsel_yogunluklu_video_tarzi/araclar/liste.py` → sıradaki bölüm no (`gy_00X`) ve daha önce işlenen konular.
2. Kurulum: `npm install` (yoksa), `pip install google-genai numpy`, `ffmpeg` var mı, `GEMINI_API_KEY` ortam değişkeni var mı. **Anahtar yoksa kullanıcıdan iste**; `--gecici-yedek-ses` yalnızca kullanıcı izin verirse ve sonuç "geçici" diye işaretlenerek kullanılır.
3. Konu verilmediyse (yalnızca alan: "ceza hukuku") 10 paradoksal vaka öner (başlık + kanca + kanun dayanağı), seçimi bekle. Konu verildiyse doğrudan üret.
4. Referans video/link verilirse: **yalnızca tekniği** çıkar (ritim, yerleşim, hareket); içerik, karakter, mizanpaj, renk ve metni birebir alma (bkz. özgünlük kuralları).

## 1) Hukuki doğruluk
Madde numaralarını, ceza aralıklarını ve istisnaları resmî mevzuat/Yargıtay kaynağından doğrula. Emin olmadığın paragraf numarasını yazma (ör. "m.40" yeter). Doğrulanamayan iddiayı videoya koyma; kullanıcıya not düş.

## 2) Senaryo → sahneler → ifadeler (`episode.json`)
```jsonc
{
  "id": "gy_002", "title": "...", "handle": "@hukukla.app",
  "scenes": [{
    "id": "s01_kanca", "art": "BilesenAdi",            // sahneler*.tsx'te dışa aktarılan bileşen
    "kicker": "CEZA HUKUKU · AİLE İÇİ",                 // BÜYÜK HARF görünür
    "headline": ["Satır 1", "*vurgu* satır 2"],        // ≤ 2 satır, *…* = altın italik
    "footer": "TCK m.167 · KISA DAYANAK",
    "dark": false,                                     // yalnız dramatik sahnede true
    "beats": [{ "say": "elli bin lira aldın.", "pill": "*50.000* lira aldın.", "sfx": ["cash"] }]
  }]
}
```
- Akış: Kanca A → Kanca B → çelişki → kanun/ilke → kimler/neler → ayrım → istisna (koyu) → mekanizma → yaptırım → 2–3 ince ayar → "Sence adil mi?" + takip.
- 11–15 sahne, 35–45 ifade, ≈140–170 kelime, 50–65 sn. İfade ≤ 9 kelime.
- `say` telaffuza göre (sayılar yazıyla), `pill` ekran yazımı. `sfx` opsiyonel: `["stamp"]`, `[["thud",0.3]]` (0.3 sn gecikmeli). İsimler: pop tick whoosh stamp thud slash cash lock siren ding cuff snip flip.
- **Her ifade görselde bir olay tetiklemeli** (aşağıda).

## 3) Sahne görselleri (`sahneler*.tsx`)
Her sahne bir bileşen: `<Art>` (972×800 SVG) içinde `Room`, `Person`, objeler. Zamanlama kancaları (`motor/anim.tsx`):
- `useBeatPop(i, delay?)` → i. ifade başlayınca 0→1 yaylanan değer (belirme/ölçek için)
- `useSince(i)` → i. ifadeden beri geçen kare (negatifse henüz başlamadı) → `prog(since, a, b)` ile 0→1 ilerleme
- `useScene().frame` → sürekli hareket (sin dalgası, döngüler); `shake(since, amp, dur)`
Kurallar:
1. **Ifade i başlayınca yeni bir şey olur** (obje/etiket/poz/sayaç/damga). Ardışık iki ifade aynı kareyi bırakmaz.
2. Sahne başlar başlamaz kart boş değil: ilk ifade için arka plan + ana aktör hazır.
3. Etiket/sayaç/damga çakışmaları: karakter kafaları ve kart kenarlarından uzak tut (yaklaşık 40 px boşluk). Render sonrası kare kontrolü şart.
4. Mecaz bul ([`SAHNE_KUTUPHANESI.md`](SAHNE_KUTUPHANESI.md)): soyut kavramı somut nesneye çevir. Aynı mecazı iki videoda tekrar etme.
5. Yeni nesne gerekiyorsa `motor/art/kit.tsx`'e genel bir bileşen olarak ekle (diğer videolar da kullansın); bölüme özel şeyler `sahneler*.tsx`'te kalsın.
6. `art.ts`: `export const art = { BilesenAdi, ... }` — `episode.json`'daki her `art` adı burada olmalı.

## 4) Ses, kayıt, önizleme
```bash
python3 gorsel_yogunluklu_video_tarzi/araclar/tts_ve_timeline.py gorsel_yogunluklu_video_tarzi/episodes/gy_00X_slug   # kilitli ses: Charon, TEK istek (~1 dk)
python3 gorsel_yogunluklu_video_tarzi/araclar/kaydet.py        # registry.generated.ts + composition "gy-00X"
npm run gy:studio                                              # canlı önizleme
```
Süre 45–70 sn dışındaysa metni kısalt/uzat. Ses kilidi ihlali (Charon dışı) varsa **kullanıcıya açıkça söyle**.

## 5) Kare kontrolü (zorunlu) ve render
1. Düşük çözünürlüklü taslak: `npx remotion render gorsel_yogunluklu_video_tarzi/motor/index.ts gy-00X out_stills/draft.mp4 --scale=0.5 --crf=26` (macOS'ta sorun olursa `--browser-executable` ile sistem Chrome'u; `render.sh` bunu otomatik yapar).
2. Her ifade için kare çıkar (ffmpeg `-ss`) ve kontaktlevha yap; **gör**: çakışan yazı, kart dışına taşan öğe, yanlış poz, boş kare, okunmayan yazı. Düzelt, tekrarla.
3. Final: `araclar/render.sh gy-00X <bölüm_klasörü>/gy_00X_slug.mp4` → 1080×1920, h264, CRF 18.
4. `python3 gorsel_yogunluklu_video_tarzi/araclar/dogrula.py <bölüm_klasörü>` hatasız geçmeli (uyarıları kullanıcıya bildir).

## 6) Caption ve kayıt
- `caption.txt`: kanca satırı, 2–3 cümle özet, 3× 📌 hukuki tespit (+ madde), soru/yorum çağrısı, yasal uyarı, **ardından `config/settings.json → caption_mandatory_footer` bloğu kelimesi kelimesine**, hashtagler. (`dogrula.py` kontrol eder.)
- `registry/gorsel_yogunluklu_episodes.json` dosyasına bölümü ekle (`last_no` artır).
- Kullanıcıya: MP4 yolu, süre, ses durumu (kilitli mi), caption, doğrulanamayan/varsayılan noktalar.
