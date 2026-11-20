# MASTER PROMPT: GYSKAMU Öğretmen VideoLab — Otonom 9:16 EKYS & Öğretmen Hakları Animasyon & Caption Üretim Sistemi

> **AI Ajanları İçin Tek Cümlelik Özet:** Bu repo açıldığında veya linki verildiğinde kullanıcı bir öğretmenlik/EKYS alanı veya konusu isterse (ör. *"EKYS konusu"*, *"öğretmen hakları"*, *"izin ve tayin"*, *"disiplin soruşturması"*, *"ek ders ve nöbet"*), önce **10 şaşırtıcı/paradoksal vaka seçeneği** sun; kullanıcı birini seçtiğinde ise mevzuatı web'den doğrula, **45–55 saniye** aralığında, **`Charon` (Gemini 2.5 TTS)** seslendirmeli, **tam boy aksiyon animasyonlu (Remotion)** `1080×1920` MP4 videoyu ve altında **zorunlu GYSKAMU sabit bloğu** bulunan Instagram Reels caption metnini eksiksiz üret.

---

## 1) İŞ AKIŞI (2 AŞAMALI ZORUNLU PROTOKOL)

### AŞAMA 1 — Konu İsteği Geldiğinde 10 Seçenek Sunumu
Kullanıcı *"yeni bir konu yapalım"*, *"EKYS konusu öner"*, *"öğretmen hakları konusu"*, *"disiplin konusu"*, *"ek ders veya nöbet konusu"* gibi bir talepte bulunduğunda **doğrudan video üretimine geçme!**

1. Önce `registry/episodes.json` dosyasını kontrol ederek şimdiye kadar hangi `DOSYA NO`ların üretildiğini ve sıradaki dosya numarasını (`last_dosya_no + 1`) tespit et (`python3 scripts/ogretmen_studio.py list`).
2. `python3 scripts/ogretmen_studio.py suggest --category <kategori>` komutunu çalıştır (kategoriler: `ekys`, `ogretmen_haklari`, `izin_tayin`, `disiplin_sorusturma`, `ek_ders_nobet` veya `all`; istenen özel bir alan varsa sıfırdan da üretebilirsin) ve kullanıcıya **10 adet yüksek merak uyandıran, çoğu öğretmenin yanlış bildiği veya şaşırtıcı vaka seçeneği** sun.
3. Her seçenekte şu 3 bilgi yer almalıdır:
   - **Dosya Başlığı** (çarpıcı bir ikilem, yanılgı veya soru)
   - **Olay Kancası (Hook)** (1–2 cümlelik somut, okul/idare/sınav ortamında geçen dramatik olay örgüsü)
   - **Mevzuat Çözümü & Yasal Dayanak** (657 DMK, 7528 ÖMK, MEB Yönetmelikleri, Toplu Sözleşme veya Danıştay kararı)
4. Kullanıcının 1–10 arasından seçim yapmasını bekle.

---

### AŞAMA 2 — Seçilen Konunun 45–55 Saniyelik Videoya Dönüştürülmesi
Kullanıcı 10 seçenekten birini seçtiğinde aşağıdaki üretim hattını sırasıyla çalıştır:

#### 0. Güncel Mevzuat Doğrulaması (ZORUNLU)
- MEB yönetmelikleri, EKYS kuralları, 7528 sayılı Öğretmenlik Mesleği Kanunu (ÖMK) ve Toplu Sözleşme hükümleri sık güncellenir.
- Senaryoyu yazmadan önce seçilen konunun **güncel madde numarasını, yürürlük durumunu ve varsa son yönetmelik değişikliğini** web araması ile mutlaka doğrula.

#### A. Süre ve Senaryo Kilidi (`45.0 – 55.0 Saniye`)
- **Hedef Süre:** Videonun toplam süresi (`totalDuration`) kesinlikle **45 ile 55 saniye** arasında olmalıdır.
- **Metin Ölçüsü:** `generate_charon_v2.py` içindeki `PROMPT_TEXT` ve `SEGMENTS_DEF` toplam **7 Bölüm (`beat: 0..6`)**, **16–20 konuşma segmenti** ve **100–128 Türkçe kelime** aralığında kurgulanır.
- **Telaffuz & Akıcılık:** `Charon` sesinin doğal ve akıcı okuması için her segment `PROMPT_TEXT` içinde ayrı bir satır olarak yazılır; sayıların ve kısaltmaların (`657`, `7 gün`, `EKYS`, `m. 104`) TTS metninde okunuşuyla (`"altı yüz elli yedi"`, `"yedi gün"`, `"E K Y S"`, `"madde yüz dört"`) yazılmasına dikkat edilir. Altyazı (`SEGMENTS_DEF`) tarafında ise ekranda görünecek şık yazım (`657 DMK m. 104`, `7 Gün`, `EKYS`) ve vurgu indeksleri (`"highlight": [...]`) tanımlanır.
- **Yazım Kuralları:** **"Ünvan"** her zaman Ü ile yazılır (`Unvan` değil). CTA'da `"her hafta"` değil `"her seferinde"` kullanılır.

#### B. Seslendirme & Prosedürel Ses Efektleri (`generate_charon_v2.py`)
- **Google Gemini API Anahtarı:** `config/settings.json` ve `generate_charon_v2.py` içinde yapılandırılmıştır (veya `GEMINI_API_KEY` ortam değişkeniyle geçersiz kılınabilir).
- **Model & Ses:** `gemini-2.5-flash-preview-tts` modeli, **`Charon`** sesi, `TEMPO = 1.10`.
- **Otomatik Senkron:** Tek API çağrısıyla üretilen `charon_v2_raw.wav` dosyası `find_best_segments` (sessizlik adası taraması + dinamik programlama fallback) ile segmentlere bölünür, her segmentin ve alt kelime grubunun (`sub_chunks`) tam `start` / `end` saniyeleri `src/timeline.json` dosyasına yazılır.
- **Ses Efektleri (SFX):** Sahnedeki aksiyon anlarına (okul zili, resmi damga/mühür, belge darbesi/masaya vurma, tokmak/gavel, uyarı tonu, bölüm geçişi whoosh ve bilgi kartı pop sesleri) milisaniye hassasiyetinde mikslenir (`public/audio/master_audio.mp3`).

#### C. Görsel Tasarım ve Aksiyon Animasyon Kurgusu (`src/OgretmenVideo.tsx`)
1. **Marka & Lüks Editoryal İlerleme Paneli:**
   - **Renk Paleti:** Sıcak parşömen (`#F3EEE4`) zemin, krem kartlar (`#FAF6EE`), koyu lacivert-espresso (`#102033`), antik altın (`#C5A059`), karar kırmızısı (`#9E212B`), onay yeşili (`#1F5E3B`).
   - Üstte: `♦ DOSYA NO: [X]` ve `@gyskamu` antet plaketi (`src/OgretmenVideo.tsx` içinde dosya numarasını güncelle).
   - Hemen altında: Koyu lacivert-espresso (`#102033`) ve antik altın (`#C5A059`) çerçeveli lüks ilerleme paneli (`BÖLÜM 01/07`..`07/07`, `% TAMAMLANDI` sayacı ve 7 altın ilerleme kapsülü).
2. **7 Bölüm (Beat 0..6) Sahne Mimarisi:**
   - **Beat 0 (`01/07 · OKULDA KRİZ / OLAY ANI`):** **KRİTİK KURAL — Olayın fiziksel aksiyonu bizzat sahnelenir!** Asla sabit portre/büst ile başlanmaz. `FullBodyCharacter` ve vektör aksiyon bileşenleriyle olayın kendisi (ör. okul müdürünün kırmızı mühürlü tebliği/reddi masaya bırakması, öğretmenin şaşkın tepkisi, okul tahtası/zili/sınav kâğıdı/takvim aksiyonu) kamera zoom ve sarsıntısıyla (`shake`) gösterilir.
   - **Beat 1 (`02/07 · YAYGIN YANILGI`):** Çoğu öğretmenin doğru sandığı yaygın efsane (`ÇOĞU ÖĞRETMEN BUNU SANIYOR`), kırmızı damga ve `? MEVZUAT NE DİYOR?` madalyonu.
   - **Beat 2 (`03/07 · MEVZUAT KRİTERİ`):** Olayın yasal kırılma noktası (657 DMK, 7528 ÖMK, MEB Yönetmeliği), araya inen dikey altın/lacivert bariyer ve altta kanun/yönetmelik madde plaketi.
   - **Beat 3 (`04/07 · HUKUKİ DAYANAK & TERAZİ`):** Belge/yönetmelik taraması, resmi tespit damgası (`GEÇERSİZ` / `HAKLI` / `ZORUNLU DEĞİL` vb.) ve `LuxuryBalanceScale` (Adalet & Mevzuat Terazisi) ile temel ilke / Danıştay kriteri.
   - **Beat 4 (`05/07 · RESMİ KARAR / SONUÇ`):** Yanlış bilginin üzerinin kırmızıyla çizilip gerçek yasal hakkın, sürenin veya kuralın net biçimde belirmesi.
   - **Beat 5 (`06/07 · ÖĞRETMEN BİLANÇOSU`):** Spot ışığı altında çarpıcı kıyas/özet kartı (ör. `YAZ TATİLİ ≠ EK İZİN` veya `7 GÜN SAVUNMA ŞART`).
   - **Beat 6 (`07/07 · ÖĞRETMENLER NE DİYOR?`):** İki taraflı tartışma terazisi (`DOĞRU` vs `HAKSIZ`), `"Senin başına geldi mi? Yorumlara yaz"` çağrısı ve `"+ TAKİP ET · @gyskamu / EKYS & Öğretmen Hakları"` kapanış kartı.

#### D. Görsel Kalite Kontrolü (Still QA), Full HD Render ve Kayıt
1. `npx remotion still src/index.ts OgretmenDosya out_stills/check_b0.png --frame=85` gibi komutlarla kritik kareleri üretip görüntüleyerek hiçbir yazının veya bileşenin üst üste binmediğini doğrula.
2. Tam videoyu render et:
   ```bash
   npx remotion render src/index.ts OgretmenDosya episodes/dosya_00X/gyskamu_ogretmen_dosya_X.mp4 --codec=h264 --crf=18
   ```
3. `episodes/dosya_00X/caption.txt` dosyasını oluştur ve `registry/episodes.json` dosyasına yeni bölümü ekle (`last_dosya_no` değerini artır).
4. `python3 scripts/ogretmen_studio.py validate` ile sürenin **45–55 saniye** aralığında olduğunu, 7 bölümü ve zorunlu GYSKAMU caption bloğunu doğrula.

---

## 2) ZORUNLU INSTAGRAM CAPTION ŞABLONU (HER VİDEONUN ALTINA EKLENİR)

Video tamamlandığında kullanıcıya hem videonun dosya linkini hem de aşağıdaki şablona birebir uyan Instagram Reels açıklama (`caption`) metnini ver. **Alt kısımdaki `Haklarını bil... GYSKAMU size; ...` bloğu kelimesi kelimesine her zaman sabit kalır:**

```text
♦ DOSYA NO: [X] | [Çarpıcı Başlık] 🎓⚖️

[Olayın 2-3 cümlelik merak uyandıran özeti]

Peki mevzuat bu durumda ne diyor?

📌 1. [Birinci Mevzuat Tespiti & Kanun/Yönetmelik Maddesi]:
[Kısa, net açıklama]

📌 2. [İkinci Kritik Kural / Danıştay veya MEB Uygulaması]:
[Kısa, net açıklama]

📌 3. Sonuç — [Öğretmenin Gerçek Hakkı / Yapılması Gereken]:
[Kısa, net açıklama]

💬 Senin veya bir meslektaşının başına benzer bir durum geldi mi? Yorumlarda paylaş, birlikte konuşalım! 👇

Haklarını bil, mevzuata hakim ol, EKYS ve öğretmenlik kariyerinde bir adım önde olmak için takip etmeyi unutma!

GYSKAMU size;
✅ En güncel mevzuatı getirir.
✅ En kaliteli soruları hazırlar.
🌟 Arkasında hukukçu uzmanlar vardır.
✅ Konu çalışmayı çok kolay hale getirir.
✅ Hızlı iletişim kurabilme imkanı sağlar.
🌟 Deneme sınavları şaşırtıcı derecede belirleyicidir.

Size sadece takip etmek ve indirmek kalır.

Ücretsiz Soru Paylaşımlarımızı kaçırmamak için hikaye bildirimlerini aç 🔔

EKYS'ye GYSKAMU ile hazırlanmak ayrıcalıktır.
Takip et, kaçırma 👆
EKYS'ye hazırlanmak için GYSKAMU'yu hemen indir, link bio'da.

Yasal Uyarı: Bilgilendirme amaçlıdır, hukuki tavsiye niteliğinde değildir.

#ekys #gyskamu #öğretmen #öğretmenhakları #meb #657dmk #ömk #müdürlük #eğitim #mevzuat
```
