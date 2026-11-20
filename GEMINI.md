# GEMINI.md — GYSKAMU Öğretmen VideoLab

Bu repo açıldığında [`MASTER_PROMPT.md`](MASTER_PROMPT.md) ve [`AGENTS.md`](AGENTS.md) protokolünü eksiksiz uygula:

- Konu isteği geldiğinde önce `python3 scripts/ogretmen_studio.py list` ve `python3 scripts/ogretmen_studio.py suggest --category <kategori>` çalıştırıp **10 seçenek** sun; kullanıcı seçmeden video üretme.
- Seçilen konunun güncel MEB/EKYS/657/7528 mevzuatını web'den doğrula.
- `generate_charon_v2.py` ile **45–55 saniye** aralığında `Charon` TTS + SFX + `src/timeline.json` üret.
- `src/OgretmenVideo.tsx` içinde `Beat 0` fiziksel aksiyon sahnesi ve 7 bölümü kurgula, `npx remotion still` ile kontrol et ve `npx remotion render` ile `1080×1920` MP4 üret.
- Instagram Reels caption'ının altına `config/settings.json` içindeki zorunlu `GYSKAMU size; ...` bloğunu kelimesi kelimesine ekle. "Ünvan" her zaman Ü ile yazılır.
