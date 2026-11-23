# Görsel Yoğunluklu Video Tarzı 🎞️⚖️

> **Yapay zekâ ajanları için tek cümle:** Kullanıcı *"görsel yoğunluklu video yap"*, *"gorsel_yogunluklu_video_tarzi ile …"* ya da *"o akıcı çizimli/animasyonlu tarzda"* derse **bu klasörü kullan**: önce [`URETIM_PROTOKOLU.md`](URETIM_PROTOKOLU.md), [`STIL_KILAVUZU.md`](STIL_KILAVUZU.md) ve [`OZGUNLUK_KURALLARI.md`](OZGUNLUK_KURALLARI.md) dosyalarını oku, sonra konuya özgü senaryo + illüstrasyonlarla **1080×1920 MP4** ve **caption** üret.

## Tarz nedir?
Anlatıcı sesi boyunca **her 1,5–2 saniyede görsel değişen** 9:16 hukuk videosu. Sabit bir "kabuk" (ilerleme noktaları, kicker, serif başlık, çerçeveli çizim kartı, dipnot, kelime kelime yanan altyazı hapı) içinde, her cümlenin kendi **çizilmiş/animasyonlu sahnesi** vardır: karakterler oynar, objeler belirir, damgalar vurur, göstergeler döner. Anlatılan her kavram **mecaz bir görsele** dönüştürülür (şemsiye = koruma, ters terazi = tutar/ceza çelişkisi, anahtar = suç/ceza ayrımı…).

İlk örnek: [`episodes/gy_001_aile_ici_hirsizlik/`](episodes/gy_001_aile_ici_hirsizlik/) — *Babanın cüzdanından 50.000 ₺ almak cezasız, 10 ₺ için bıçak çekmek 10–15 yıl* (TCK 167 ↔ 149), 62 sn, 13 sahne, 40 ifade.

## Yeni bir video nasıl yapılır (özet)
```bash
# 0) kur (bir kez)
npm install && pip install google-genai numpy
cp .env.example .env && (.env içine GEMINI_API_KEY=... yaz)   # Charon sesi için; .env gitignore'lu, commit edilmez

# 1) bölüm klasörü: episodes/gy_00X_<slug>/ → episode.json (senaryo+sahneler), sahneler.tsx, art.ts  (bkz. URETIM_PROTOKOLU.md)
# 2) ses + efekt + zaman çizelgesi (kilitli ses: Charon)
python3 gorsel_yogunluklu_video_tarzi/araclar/tts_ve_timeline.py gorsel_yogunluklu_video_tarzi/episodes/gy_00X_<slug>
# 3) kaydet + önizle
python3 gorsel_yogunluklu_video_tarzi/araclar/kaydet.py
npm run gy:studio
# 4) render + doğrula
gorsel_yogunluklu_video_tarzi/araclar/render.sh gy-00X gorsel_yogunluklu_video_tarzi/episodes/gy_00X_<slug>/gy_00X_<slug>.mp4
python3 gorsel_yogunluklu_video_tarzi/araclar/dogrula.py gorsel_yogunluklu_video_tarzi/episodes/gy_00X_<slug>
```

## 🔒 SES KİLİDİ
Tüm videolar **aynı sesle** üretilir: `ses_kilidi.json` → Gemini 2.5 TTS **Charon**, aynı stil talimatı, aynı tempo (1.10). Senaryo **TEK istekle, tek parça** seslendirilir (`mod: tek_istek`; ~50 sn, tek ses/tek ton) ve sessizliklerden ifadelere bölünür (metin oranlarıyla dinamik programlama; şüpheli bölmede uyarı verir). İfade başına ayrı istek yöntemi kısa cümlelerde boş yanıt verdiği ve Tier 1'de dakikada 10 istekle sınırlı olduğu için kullanılmaz; ses kullanılamazsa araç **durur**, sessizce başka sese geçmez. Yalnızca `--gecici-yedek-ses` ile (macOS "Yelda") üretilir ve `timeline.json`'a `voice.locked=false` yazılır; `dogrula.py` bunu **SES KİLİDİ İHLALİ** olarak işaretler. Yedek sesle üretilmiş bir video yayına girmeden Charon ile yeniden üretilmelidir.

## Klasör haritası
| Yol | Ne işe yarar |
|---|---|
| [`URETIM_PROTOKOLU.md`](URETIM_PROTOKOLU.md) | Konu → senaryo → sahne tasarımı → ses → render → caption adım adım protokol |
| [`STIL_KILAVUZU.md`](STIL_KILAVUZU.md) | Tarzın ölçülü tarifi: yerleşim, ritim, hareket, palet, tipografi, ses |
| [`SAHNE_KUTUPHANESI.md`](SAHNE_KUTUPHANESI.md) | Hukuk kavramı → görsel mecaz kataloğu + hazır sahne desenleri |
| [`OZGUNLUK_KURALLARI.md`](OZGUNLUK_KURALLARI.md) | Telif/benzerlik güvenliği: tekniği al, içeriği özgünleştir |
| [`referans/analiz_babanin_cuzdani.md`](referans/analiz_babanin_cuzdani.md) | İlham alınan videonun yapısal analizi (görsel/ses dosyası içermez) |
| [`ses_kilidi.json`](ses_kilidi.json) | Kilitli ses ayarı |
| `motor/` | Remotion motoru: kabuk (`chrome/`), animasyon yardımcıları (`anim.tsx`), karakter + obje kitaplığı (`art/Person.tsx`, `art/kit.tsx`) |
| `episodes/` | Her video: `episode.json` + `sahneler*.tsx` + `art.ts` + `timeline.json` + `caption.txt` + MP4 |
| `araclar/` | `tts_ve_timeline.py` (ses+SFX+zaman), `kaydet.py`, `render.sh`, `dogrula.py`, `liste.py` |

## Notlar
- Remotion'ın kendi Chrome'u macOS'ta açılmazsa `render.sh` sistem Chrome'unu kullanır.
- Her videonun caption'ı, kök dizindeki `config/settings.json` → `caption_mandatory_footer` bloğunu **kelimesi kelimesine** içerir (`dogrula.py` kontrol eder).
