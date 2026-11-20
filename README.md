# GYSKAMU Öğretmen VideoLab 🎓⚖️🎬

[@gyskamu](https://www.instagram.com/gyskamu/) için **EKYS (Eğitim Kurumu Yöneticiliği Sınavı)** ve **Genel Öğretmen Hakları (657 DMK / 7528 ÖMK / MEB Mevzuatı)** odaklı, 45–55 saniye aralığında, **Gemini 2.5 TTS (`Charon`)** seslendirmeli, lüks parşömen / koyu lacivert-espresso / antik altın editoryal estetiğinde, tam boy aksiyon animasyonlu (**Remotion 1080×1920 30fps**) Instagram Reels ve sabit kilitli **GYSKAMU** caption üretim fabrikası.

> Bu repo, [SoftLawyer/HukukLA_Dosya_VideoLab](https://github.com/SoftLawyer/HukukLA_Dosya_VideoLab) mimarisinin öğretmen hedef kitlesi ve GYSKAMU markası için özel olarak uyarlanmış hâlidir.

---

## 🚀 Başka Bir Bilgisayarda Anında Kurulum & Kullanım

Herhangi bir bilgisayarda sadece bu repo linkini AI asistanına (Antigravity, Claude Code, Cursor, Gemini vb.) vermeniz veya klonlamanız yeterlidir.

```bash
# 1. Repoyu klonla
git clone https://github.com/SoftLawyer/GYSKAMU_Ogretmen_VideoLab.git
cd GYSKAMU_Ogretmen_VideoLab

# 2. Bağımlılıkları yükle (Node.js + Python + ffmpeg)
npm install
pip install google-genai numpy
```

### AI Asistanına Söylemeniz Gereken Tek Şey:

- **"Bana EKYS konusu öner"** (veya *"öğretmen hakları konusu"*, *"izin ve tayin konusu"*, *"disiplin soruşturması konusu"*, *"ek ders ve nöbet konusu"*)
  - Sistem önce `registry/episodes.json` arşivini kontrol eder ve size daha önce işlenmemiş **10 çarpıcı öğretmenlik/EKYS vakası seçeneği** sunar.
- **"3 numaralı konuyu hazırla"** dediğinizde:
  1. Seçilen konunun güncel mevzuat maddesini ve yürürlük durumunu doğrular.
  2. Sıradaki `♦ DOSYA NO: X` numarasını otomatik verir.
  3. **45–55 saniye** aralığında `Charon` seslendirmesini ve sahne ses efektlerini (`public/audio/master_audio.mp3` + `src/timeline.json`) üretir.
  4. Olayın fiziksel aksiyonunu bizzat gösteren 7 bölümlü tam boy animasyonu (`src/OgretmenVideo.tsx`) kurgular ve `1080×1920` MP4 olarak render eder.
  5. Altında zorunlu `GYSKAMU size; ...` sabit bloğu bulunan Instagram Reels caption metnini hazır olarak sunar.

---

## 🛠️ CLI Komutları

```bash
# Şimdiye kadar üretilen dosyaları ve sıradaki Dosya No'yu gör
python3 scripts/ogretmen_studio.py list

# İstediğin öğretmen/EKYS alanında 10 aday konu seçeneği listele
# Kategoriler: ekys | ogretmen_haklari | izin_tayin | disiplin_sorusturma | ek_ders_nobet | all
python3 scripts/ogretmen_studio.py suggest --category ekys
python3 scripts/ogretmen_studio.py suggest --category ogretmen_haklari
python3 scripts/ogretmen_studio.py suggest --category izin_tayin
python3 scripts/ogretmen_studio.py suggest --category disiplin_sorusturma
python3 scripts/ogretmen_studio.py suggest --category ek_ders_nobet

# Seslendirme + SFX + timeline.json üret (Charon TTS)
python3 generate_charon_v2.py

# 45-55sn süre kilidini, 7 bölümü ve zorunlu GYSKAMU caption bloğunu doğrula
python3 scripts/ogretmen_studio.py validate

# Videoyu 1080x1920 Full HD MP4 olarak render et
npm run render
```

---

## 📁 Repo Yapısı

| Yol | Açıklama |
| --- | --- |
| [`MASTER_PROMPT.md`](MASTER_PROMPT.md) | AI ajanları için 2 aşamalı (10 seçenek → 45–55sn video + caption) zorunlu üretim protokolü |
| [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md) / [`GEMINI.md`](GEMINI.md) / [`.cursorrules`](.cursorrules) | Farklı AI araçlarının repoyu açar açmaz süreci otomatik tanıması için giriş dosyaları |
| [`.agent/skills/ogretmen-dosya-uretici/SKILL.md`](.agent/skills/ogretmen-dosya-uretici/SKILL.md) | Antigravity native skill tanımı |
| [`config/settings.json`](config/settings.json) | Gemini API, Charon TTS, 45–55sn video kilidi ve zorunlu GYSKAMU caption alt bloğu |
| [`locks/ogretmen_locks.json`](locks/ogretmen_locks.json) | Tasarım, mevzuat doğrulama, süre, aksiyon animasyonu, yazım ve caption kilitleri |
| [`registry/episodes.json`](registry/episodes.json) | Üretilen dosyaların (`DOSYA NO: 1..N`) arşivi |
| [`registry/topic_bank.json`](registry/topic_bank.json) | 5 kategoride (EKYS, Öğretmen Hakları, İzin/Tayin, Disiplin, Ek Ders/Nöbet) 50 aday vaka havuzu |
| [`generate_charon_v2.py`](generate_charon_v2.py) | Gemini 2.5 `Charon` TTS sentezleyici, prosedürel SFX mikseri ve otomatik `timeline.json` üretici |
| [`src/OgretmenVideo.tsx`](src/OgretmenVideo.tsx) | Lüks parşömen/lacivert/altın ilerleme paneli, `FullBodyCharacter` aksiyon motoru ve 7 bölümlü Remotion şablonu |
| [`scripts/ogretmen_studio.py`](scripts/ogretmen_studio.py) | 10 konu önerici, arşiv listesi, süre/kilit doğrulayıcı ve caption üretici CLI |
