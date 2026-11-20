# AGENTS.md — Otomatik AI Ajan Adaptasyon Kılavuzu

Bu repo açıldığında veya klonlandığında **HER ZAMAN** önce [`MASTER_PROMPT.md`](MASTER_PROMPT.md) ve [`config/settings.json`](config/settings.json) dosyalarını oku ve aşağıdaki protokole birebir uy:

1. **Konu İsteği -> 10 Seçenek Sunumu:**
   - Kullanıcı bir öğretmenlik/EKYS konusu veya alanı istediğinde (ör. *"EKYS konusu"*, *"öğretmen hakları"*, *"izin ve tayin"*, *"disiplin soruşturması"*, *"ek ders ve nöbet"*), doğrudan video üretimine geçme.
   - Önce `python3 scripts/ogretmen_studio.py list` ile son `DOSYA NO`yu kontrol et, ardından `python3 scripts/ogretmen_studio.py suggest --category <kategori>` çalıştırarak (veya o konuya özel üreterek) **10 adet şaşırtıcı, merak uyandıran öğretmen/EKYS vakası seçeneği** sun ve kullanıcının seçimini bekle.
2. **Güncel Mevzuat Doğrulaması + Senaryo & Kaynak Linkleri Onayı (ZORUNLU):**
   - Kullanıcı 10 seçenekten birini seçtiğinde **henüz ses veya video üretme!**
   - Önce ilgili kanun/yönetmelik maddesini (657 DMK, 7528 ÖMK, MEB yönetmelikleri, Danıştay kararları) web'den doğrula.
   - 7 bölümlü seslendirme/kurgu metnini, Instagram caption taslağını ve **kullanıcının bilgileri doğrulayabileceği kaynak linklerini** sun; kullanıcının onayını bekle. Kullanıcı metni düzenleyip geri gönderirse birebir (%100 sadakatle) o metni kullan.
3. **Onay Sonrası Video Üretimi (45–55 Saniye Kilidi):**
   - Sıradaki `♦ DOSYA NO: [X]` numarasını ver.
   - `generate_charon_v2.py` içindeki metni ve 7 bölümü (`beat: 0..6`, 16–20 segment, ~100–128 kelime) yeni konuya göre güncelle ve `python3 generate_charon_v2.py` ile **`Charon` (`gemini-2.5-flash-preview-tts`, `atempo=1.10`)** sesini + prosedürel ses efektlerini + `src/timeline.json` dosyasını üret.
   - Toplam sürenin **45 ile 55 saniye** arasında olduğunu doğrula.
   - `src/OgretmenVideo.tsx` içinde `♦ DOSYA NO: [X]` başlığını, `BEAT_META` başlıklarını ve 7 sahnenin tam boy aksiyon animasyonlarını (özellikle `Beat 0`da olayın fiziksel olarak gerçekleştiği sahneyi) yeni vakaya göre kurgula.
   - `npx remotion still` ile sahne karelerini kontrol et, ardından `npx remotion render src/index.ts OgretmenDosya episodes/dosya_00X/gyskamu_ogretmen_dosya_X.mp4 --codec=h264 --crf=18` komutuyla MP4 videoyu üret.
4. **Zorunlu Instagram Caption & Yazım Kuralları:**
   - Videoyla birlikte Instagram Reels açıklama metnini hazırla ve **altına her zaman** `config/settings.json` içindeki `Haklarını bil... GYSKAMU size; ...` sabit bloğunu kelimesi kelimesine ekle.
   - **"Ünvan"** her zaman Ü ile yazılır (`Unvan` değil); CTA'da `"her hafta"` değil `"her seferinde"` kullanılır.
