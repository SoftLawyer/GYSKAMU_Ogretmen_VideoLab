import os
import sys
import json
import wave
import subprocess
import numpy as np
from google import genai
from google.genai import types

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SETTINGS_PATH = os.path.join(BASE_DIR, "config", "settings.json")
OUT_DIR = os.path.join(BASE_DIR, "public", "audio")
os.makedirs(OUT_DIR, exist_ok=True)
RAW_WAV = os.path.join(OUT_DIR, "charon_v2_raw.wav")

with open(SETTINGS_PATH, "r", encoding="utf-8") as _sf:
    _SETTINGS = json.load(_sf)

API_KEY = os.environ.get("GEMINI_API_KEY", _SETTINGS.get("gemini_api_key", ""))
TEMPO = float(_SETTINGS["tts"].get("atempo", 1.10))
VOICE_NAME = _SETTINGS["tts"].get("voice_name", "Charon")
TTS_MODEL = _SETTINGS["tts"].get("model", "gemini-2.5-flash-preview-tts")

# ============================================================================
# ÖRNEK ŞABLON SENARYO (Yeni her Dosya No için burayı ve SEGMENTS_DEF'i güncelle)
# Hedef: 7 Bölüm (Beat 0..6), 16-20 Segment, 100-128 kelime -> 45.0s - 55.0s
# ============================================================================
PROMPT_TEXT = """Aşağıdaki metni genç, karizmatik, tok, merak uyandıran ve akıcı bir Türkçe belgesel/Reels anlatıcısı tonuyla oku. Her satır arasında çok kısa ve doğal bir es ver; aynı satır içinde duraksama yapma:

Müdür odaya çağırdı, önüne bir tutanak koydu.
Yarın sabaha kadar savunmanı getir dedi.
İki gün sonra da uyarma cezası tebliğ edildi.
Peki bu ceza hukuken geçerli mi?

Çoğu öğretmen müdür yazdıysa yapacak bir şey yok sanır.
Ama mevzuat burada bambaşka bir kırmızı çizgi çizer.

Anayasa madde yüz yirmi dokuz ve altı yüz elli yedi sayılı kanun açık.
Memura savunma hakkı tanınmadan disiplin cezası verilemez.

Üstelik bu savunma için süre keyfi belirlenemez.
Kanun en az yedi gün süre verilmesini zorunlu kılar.
Yarına kadar getir demek açık bir usul hatasıdır.
İdare bu kuralı çiğnerse işlem baştan sakattır.

Peki sonuç ne olur?
Yedi günden az süreyle verilen her disiplin cezası,
idare mahkemesinde doğrudan iptal edilir.

Kısacası tutanak var, imza var,
ama hukuken geçerli bir ceza yok.

Senin veya bir meslektaşının başına böyle bir durum geldi mi?
Deneyimini yorumlara yaz.
Yeni öğretmen dosyaları için GYSKAMU'yu takip et."""

SEGMENTS_DEF = [
    # Beat 0
    {"id": "b0_s0", "beat": 0, "text": "Müdür odaya çağırdı, önüne bir tutanak koydu.", "sub_chunks": [
        {"words": ["Müdür", "odaya", "çağırdı,"], "highlight": [0]},
        {"words": ["önüne", "bir", "tutanak", "koydu."], "highlight": [2, 3]}
    ], "pause_after": 0.12},
    {"id": "b0_s1", "beat": 0, "text": "Yarın sabaha kadar savunmanı getir dedi.", "sub_chunks": [
        {"words": ["Yarın", "sabaha", "kadar"], "highlight": [0, 1]},
        {"words": ["savunmanı", "getir", "dedi."], "highlight": [0, 1]}
    ], "pause_after": 0.12},
    {"id": "b0_s2", "beat": 0, "text": "İki gün sonra da uyarma cezası tebliğ edildi.", "sub_chunks": [
        {"words": ["İki", "gün", "sonra", "da"], "highlight": [0, 1]},
        {"words": ["uyarma", "cezası", "tebliğ", "edildi."], "highlight": [0, 1]}
    ], "pause_after": 0.12},
    {"id": "b0_s3", "beat": 0, "text": "Peki bu ceza hukuken geçerli mi?", "sub_chunks": [
        {"words": ["Peki", "bu", "ceza", "hukuken", "geçerli", "mi?"], "highlight": [2, 4, 5]}
    ], "pause_after": 0.22},

    # Beat 1
    {"id": "b1_s0", "beat": 1, "text": "Çoğu öğretmen müdür yazdıysa yapacak bir şey yok sanır.", "sub_chunks": [
        {"words": ["Çoğu", "öğretmen", "müdür", "yazdıysa"], "highlight": [0, 1]},
        {"words": ["yapacak", "bir", "şey", "yok", "sanır."], "highlight": [3, 4]}
    ], "pause_after": 0.12},
    {"id": "b1_s1", "beat": 1, "text": "Ama mevzuat burada bambaşka bir kırmızı çizgi çizer.", "sub_chunks": [
        {"words": ["Ama", "mevzuat", "burada"], "highlight": [1]},
        {"words": ["bambaşka", "bir", "kırmızı", "çizgi", "çizer."], "highlight": [2, 3]}
    ], "pause_after": 0.22},

    # Beat 2
    {"id": "b2_s0", "beat": 2, "text": "Anayasa m. 129 ve 657 sayılı Kanun açık.", "sub_chunks": [
        {"words": ["Anayasa", "m.", "129", "ve"], "highlight": [0, 2]},
        {"words": ["657", "sayılı", "Kanun", "açık."], "highlight": [0, 2, 3]}
    ], "pause_after": 0.12},
    {"id": "b2_s1", "beat": 2, "text": "Memura savunma hakkı tanınmadan disiplin cezası verilemez.", "sub_chunks": [
        {"words": ["Memura", "savunma", "hakkı", "tanınmadan"], "highlight": [1, 2]},
        {"words": ["disiplin", "cezası", "verilemez."], "highlight": [0, 1, 2]}
    ], "pause_after": 0.22},

    # Beat 3
    {"id": "b3_s0", "beat": 3, "text": "Üstelik bu savunma için süre keyfi belirlenemez.", "sub_chunks": [
        {"words": ["Üstelik", "bu", "savunma", "için"], "highlight": [2]},
        {"words": ["süre", "keyfi", "belirlenemez."], "highlight": [1, 2]}
    ], "pause_after": 0.12},
    {"id": "b3_s1", "beat": 3, "text": "Kanun en az 7 gün süre verilmesini zorunlu kılar.", "sub_chunks": [
        {"words": ["Kanun", "en", "az", "7", "gün"], "highlight": [2, 3, 4]},
        {"words": ["süre", "verilmesini", "zorunlu", "kılar."], "highlight": [2, 3]}
    ], "pause_after": 0.12},
    {"id": "b3_s2", "beat": 3, "text": "Yarına kadar getir demek açık bir usul hatasıdır.", "sub_chunks": [
        {"words": ["Yarına", "kadar", "getir", "demek"], "highlight": [0, 1]},
        {"words": ["açık", "bir", "usul", "hatasıdır."], "highlight": [2, 3]}
    ], "pause_after": 0.10},
    {"id": "b3_s3", "beat": 3, "text": "İdare bu kuralı çiğnerse işlem baştan sakattır.", "sub_chunks": [
        {"words": ["İdare", "bu", "kuralı", "çiğnerse"], "highlight": [2, 3]},
        {"words": ["işlem", "baştan", "sakattır."], "highlight": [1, 2]}
    ], "pause_after": 0.22},

    # Beat 4
    {"id": "b4_s0", "beat": 4, "text": "Peki sonuç ne olur?", "sub_chunks": [
        {"words": ["Peki", "sonuç", "ne", "olur?"], "highlight": [1, 2]}
    ], "pause_after": 0.12},
    {"id": "b4_s1", "beat": 4, "text": "7 günden az süreyle verilen her disiplin cezası,", "sub_chunks": [
        {"words": ["7", "günden", "az", "süreyle"], "highlight": [0, 1, 2]},
        {"words": ["verilen", "her", "disiplin", "cezası,"], "highlight": [2, 3]}
    ], "pause_after": 0.10},
    {"id": "b4_s2", "beat": 4, "text": "İdare Mahkemesinde doğrudan iptal edilir.", "sub_chunks": [
        {"words": ["İdare", "Mahkemesinde"], "highlight": [0, 1]},
        {"words": ["doğrudan", "iptal", "edilir."], "highlight": [1, 2]}
    ], "pause_after": 0.22},

    # Beat 5
    {"id": "b5_s0", "beat": 5, "text": "Kısacası tutanak var, imza var,", "sub_chunks": [
        {"words": ["Kısacası", "tutanak", "var,", "imza", "var,"], "highlight": [1, 3]}
    ], "pause_after": 0.08},
    {"id": "b5_s1", "beat": 5, "text": "ama hukuken geçerli bir ceza yok.", "sub_chunks": [
        {"words": ["ama", "hukuken", "geçerli", "bir", "ceza", "yok."], "highlight": [2, 4, 5]}
    ], "pause_after": 0.22},

    # Beat 6
    {"id": "b6_s0", "beat": 6, "text": "Senin veya bir meslektaşının başına böyle bir durum geldi mi?", "sub_chunks": [
        {"words": ["Senin", "veya", "bir", "meslektaşının"], "highlight": [0, 3]},
        {"words": ["başına", "böyle", "bir", "durum", "geldi", "mi?"], "highlight": [3, 4]}
    ], "pause_after": 0.12},
    {"id": "b6_s1", "beat": 6, "text": "Deneyimini yorumlara yaz.", "sub_chunks": [
        {"words": ["Deneyimini", "yorumlara", "yaz."], "highlight": [0, 1]}
    ], "pause_after": 0.12},
    {"id": "b6_s2", "beat": 6, "text": "Yeni öğretmen dosyaları için GYSKAMU'yu takip et.", "sub_chunks": [
        {"words": ["Yeni", "öğretmen", "dosyaları", "için"], "highlight": [1, 2]},
        {"words": ["GYSKAMU'yu", "takip", "et."], "highlight": [0, 1]}
    ], "pause_after": 0.35},
]


def synthesize_charon():
    client = genai.Client(api_key=API_KEY)
    response = client.models.generate_content(
        model=TTS_MODEL,
        contents=PROMPT_TEXT,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=VOICE_NAME)
                )
            ),
        ),
    )
    pcm_data = response.candidates[0].content.parts[0].inline_data.data
    with wave.open(RAW_WAV, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        wf.writeframes(pcm_data)
    dur = len(pcm_data) / 2 / 24000.0
    print(f"Saved {RAW_WAV}, duration: {dur:.2f}s")


def detect_islands(samples, sr, min_sil_ms=260, thresh=0.012):
    win = int(sr * 0.02)
    n_wins = len(samples) // win
    rms = np.array([np.sqrt(np.mean(samples[i * win:(i + 1) * win] ** 2)) for i in range(n_wins)])
    min_sil_wins = max(1, min_sil_ms // 20)
    is_speech = rms > thresh
    segments = []
    in_seg = False
    start_w = 0
    sil_count = 0
    for i, sp in enumerate(is_speech):
        if sp:
            if not in_seg:
                in_seg = True
                start_w = i
            sil_count = 0
        else:
            if in_seg:
                sil_count += 1
                if sil_count >= min_sil_wins:
                    end_w = i - sil_count + 1
                    if (end_w - start_w) * 0.02 >= 0.18:
                        segments.append((round(max(0.0, start_w * 0.02 - 0.04), 3), round(min(len(samples) / sr, end_w * 0.02 + 0.04), 3)))
                    in_seg = False
    if in_seg:
        segments.append((round(max(0.0, start_w * 0.02 - 0.04), 3), round(len(samples) / sr, 3)))
    return segments


def find_best_segments(samples, sr):
    target_n = len(SEGMENTS_DEF)
    for thresh in [0.012, 0.010, 0.015, 0.008]:
        for min_sil in range(180, 560, 20):
            segs = detect_islands(samples, sr, min_sil_ms=min_sil, thresh=thresh)
            if len(segs) == target_n:
                print(f"Matched {target_n} segments cleanly at thresh={thresh}, min_sil={min_sil}ms")
                return segs

    fine = detect_islands(samples, sr, min_sil_ms=140, thresh=0.012)
    print(f"Sweeping fallback: fine has {len(fine)} islands (target={target_n})")
    if len(fine) < target_n:
        t0 = fine[0][0] if fine else 0.0
        t1 = fine[-1][1] if fine else len(samples) / sr
        total_chars = sum(len(s["text"]) for s in SEGMENTS_DEF)
        cur = t0
        res = []
        for s in SEGMENTS_DEF:
            d = (t1 - t0) * (len(s["text"]) / total_chars)
            res.append((round(cur, 3), round(cur + d, 3)))
            cur += d
        return res

    M = len(fine)
    K = target_n
    total_speech_dur = sum(b - a for a, b in fine)
    char_lens = [len(s["text"]) for s in SEGMENTS_DEF]
    total_chars = sum(char_lens)
    expected_durs = [total_speech_dur * (c / total_chars) for c in char_lens]

    INF = 1e18
    dp = [[INF] * (M + 1) for _ in range(K + 1)]
    parent = [[-1] * (M + 1) for _ in range(K + 1)]
    dp[0][0] = 0.0
    for k in range(1, K + 1):
        exp_d = expected_durs[k - 1]
        for j in range(k, M + 1):
            for i in range(k - 1, j):
                dur_ij = fine[j - 1][1] - fine[i][0]
                internal_sil = sum(fine[idx + 1][0] - fine[idx][1] for idx in range(i, j - 1))
                cost = dp[k - 1][i] + ((dur_ij - exp_d) ** 2) + (internal_sil * 4.0) ** 2
                if cost < dp[k][j]:
                    dp[k][j] = cost
                    parent[k][j] = i

    bounds = []
    cur_j = M
    for k in range(K, 0, -1):
        prev_i = parent[k][cur_j]
        bounds.append((fine[prev_i][0], fine[cur_j - 1][1]))
        cur_j = prev_i
    bounds.reverse()
    print(f"DP merged {M} islands into {len(bounds)} segments.")
    return bounds


# ============================================================================
# PROSEDÜREL SES EFEKTLERİ (Okul / Mevzuat / Resmi Belge & Karar Temalı)
# ============================================================================
def make_sfx_bell(sr=44100):
    # Subtle metallic school bell chime
    t = np.linspace(0, 0.45, int(sr * 0.45), endpoint=False)
    env = np.exp(-t * 7.5)
    tone = (
        np.sin(2 * np.pi * 880 * t) * 0.50
        + np.sin(2 * np.pi * 1760 * t) * 0.30
        + np.sin(2 * np.pi * 2640 * t) * 0.15
    ) * env
    return tone * 0.16


def make_sfx_impact(sr=44100):
    # Heavy folder/desk thud
    t = np.linspace(0, 0.22, int(sr * 0.22), endpoint=False)
    env = np.exp(-t * 22)
    thud = np.sin(2 * np.pi * np.linspace(115, 40, len(t)) * t) * env
    return thud * 0.32


def make_sfx_stamp(sr=44100):
    # Official rubber stamp slam
    t = np.linspace(0, 0.16, int(sr * 0.16), endpoint=False)
    env = np.exp(-t * 30)
    wave_data = (np.sin(2 * np.pi * 95 * t) * 0.72 + np.random.normal(0, 0.20, len(t))) * env
    return wave_data * 0.30


def make_sfx_gavel(sr=44100):
    # Crisp wood gavel knock
    t = np.linspace(0, 0.24, int(sr * 0.24), endpoint=False)
    env = np.exp(-t * 26)
    wood = (np.sin(2 * np.pi * 180 * t) * 0.6 + np.sin(2 * np.pi * 420 * t) * 0.3) * env
    return wood * 0.32


def make_sfx_alert(sr=44100):
    # Subtle notification / red-line alert ping
    t = np.linspace(0, 0.30, int(sr * 0.30), endpoint=False)
    env = np.sin(np.pi * np.minimum(1.0, t / 0.03)) * np.exp(-t * 9.0)
    tone = (np.sin(2 * np.pi * 740 * t) * 0.7 + np.sin(2 * np.pi * 1110 * t) * 0.3) * env
    return tone * 0.14


def make_sfx_pop(sr=44100, freq=520):
    t = np.linspace(0, 0.08, int(sr * 0.08), endpoint=False)
    env = np.exp(-t * 45)
    f_sweep = np.linspace(freq * 0.7, freq * 1.25, len(t))
    return np.sin(2 * np.pi * f_sweep * t) * env * 0.18


def make_sfx_whoosh(sr=44100):
    t = np.linspace(0, 0.18, int(sr * 0.18), endpoint=False)
    env = np.sin(np.pi * t / 0.18)
    noise = np.random.normal(0, 1, len(t))
    kernel = np.ones(18) / 18
    filtered = np.convolve(noise, kernel, mode="same")
    return filtered * env * 0.12


def build_audio_and_timeline():
    with wave.open(RAW_WAV, "rb") as wf:
        raw_sr = wf.getframerate()
        raw_samples = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0

    ranges = find_best_segments(raw_samples, raw_sr)
    sr = 44100
    master_samples = []
    cur_t = 0.18
    master_samples.append(np.zeros(int(sr * cur_t)))

    timeline_segments = []
    beat_ranges = {}

    for seg, (t0, t1) in zip(SEGMENTS_DEF, ranges):
        seg_wav = os.path.join(OUT_DIR, f"charon_v2_{seg['id']}.wav")
        raw_dur = max(0.20, (t1 - t0) / TEMPO)
        fade_out_st = max(0.05, raw_dur - 0.03)
        subprocess.run([
            "ffmpeg", "-y",
            "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}",
            "-i", RAW_WAV,
            "-af", f"atempo={TEMPO:.2f},afade=t=in:st=0:d=0.02,afade=t=out:st={fade_out_st:.3f}:d=0.025",
            "-ar", str(sr), "-ac", "1",
            seg_wav
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        with wave.open(seg_wav, "rb") as wf:
            raw = wf.readframes(wf.getnframes())
            samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0

        dur = len(samples) / sr
        start_t = round(cur_t, 4)
        end_t = round(cur_t + dur, 4)

        total_chars = sum(len(" ".join(c["words"])) for c in seg["sub_chunks"])
        chunk_cursor = start_t
        computed_chunks = []
        for idx, c in enumerate(seg["sub_chunks"]):
            c_chars = len(" ".join(c["words"]))
            c_dur = dur * (c_chars / max(1, total_chars))
            c_end = end_t if idx == len(seg["sub_chunks"]) - 1 else round(chunk_cursor + c_dur, 4)
            computed_chunks.append({
                "words": c["words"],
                "highlight": c["highlight"],
                "start": round(chunk_cursor, 4),
                "end": c_end
            })
            chunk_cursor = c_end

        b = seg["beat"]
        if b not in beat_ranges:
            beat_ranges[b] = {"start": start_t if b > 0 else 0.0, "end": end_t}
        else:
            beat_ranges[b]["end"] = end_t

        timeline_segments.append({
            "id": seg["id"],
            "beat": b,
            "text": seg["text"],
            "raw_range": [t0, t1],
            "start": start_t,
            "end": end_t,
            "duration": round(dur, 4),
            "sub_chunks": computed_chunks
        })

        master_samples.append(samples)
        pause = seg["pause_after"]
        master_samples.append(np.zeros(int(sr * pause)))
        cur_t += dur + pause
        beat_ranges[b]["end"] = round(cur_t, 4)

    full_audio = np.concatenate(master_samples)
    max_v = np.max(np.abs(full_audio))
    if max_v > 0:
        full_audio = full_audio / max_v * 0.90

    def mix_at(t_sec, sfx_arr):
        idx = int(t_sec * sr)
        end_idx = min(len(full_audio), idx + len(sfx_arr))
        if idx < len(full_audio) and end_idx > idx:
            full_audio[idx:end_idx] += sfx_arr[:end_idx - idx]

    for b_idx, br in beat_ranges.items():
        if b_idx > 0:
            mix_at(max(0, br["start"] - 0.04), make_sfx_whoosh(sr))

    seg_map = {s["id"]: s for s in timeline_segments}
    # Beat 0: school bell + folder slam + stamp
    if "b0_s0" in seg_map:
        mix_at(seg_map["b0_s0"]["start"], make_sfx_bell(sr))
        mix_at(seg_map["b0_s0"]["end"] - 0.15, make_sfx_impact(sr))
    if "b0_s2" in seg_map:
        mix_at(seg_map["b0_s2"]["start"] + 0.25, make_sfx_stamp(sr))

    # Beat 1: common myth stamp + pop
    if "b1_s0" in seg_map:
        mix_at(seg_map["b1_s0"]["end"] - 0.20, make_sfx_stamp(sr))
    if "b1_s1" in seg_map:
        mix_at(seg_map["b1_s1"]["start"] + 0.15, make_sfx_pop(sr, 480))

    # Beat 2: legal barrier slam
    if "b2_s1" in seg_map:
        mix_at(seg_map["b2_s1"]["start"] + 0.15, make_sfx_impact(sr))

    # Beat 3: scan alert + official stamp
    if "b3_s1" in seg_map:
        mix_at(seg_map["b3_s1"]["start"] + 0.20, make_sfx_alert(sr))
    if "b3_s3" in seg_map:
        mix_at(seg_map["b3_s3"]["start"], make_sfx_stamp(sr))

    # Beat 4: gavel / verdict
    if "b4_s2" in seg_map:
        mix_at(seg_map["b4_s2"]["start"] + 0.15, make_sfx_gavel(sr))

    # Beat 5: spotlight counters
    if "b5_s0" in seg_map:
        mix_at(seg_map["b5_s0"]["start"] + 0.20, make_sfx_pop(sr, 440))
    if "b5_s1" in seg_map:
        mix_at(seg_map["b5_s1"]["start"] + 0.20, make_sfx_pop(sr, 540))

    # Beat 6: comment & CTA pops
    if "b6_s1" in seg_map:
        mix_at(seg_map["b6_s1"]["start"], make_sfx_pop(sr, 600))
    if "b6_s2" in seg_map:
        mix_at(seg_map["b6_s2"]["start"], make_sfx_pop(sr, 660))

    full_audio = np.clip(full_audio, -0.98, 0.98)
    master_wav = os.path.join(OUT_DIR, "master_audio.wav")
    master_mp3 = os.path.join(OUT_DIR, "master_audio.mp3")
    with wave.open(master_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes((full_audio * 32767).astype(np.int16).tobytes())

    subprocess.run([
        "ffmpeg", "-y", "-i", master_wav, "-c:a", "libmp3lame", "-b:a", "192k", master_mp3
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    timeline_data = {
        "totalDuration": round(len(full_audio) / sr, 4),
        "beats": [beat_ranges[i] for i in range(7)],
        "segments": timeline_segments
    }
    timeline_json_path = os.path.join(BASE_DIR, "src", "timeline.json")
    with open(timeline_json_path, "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, ensure_ascii=False, indent=2)

    tot = timeline_data["totalDuration"]
    print(f"✅ GYSKAMU Charon v2 Master Audio built: {tot}s (Target window: 45.0s - 55.0s)")
    for b_idx, br in enumerate(timeline_data["beats"]):
        print(f"  Beat {b_idx}: {br['start']:.2f}s -> {br['end']:.2f}s")
    for s in timeline_segments:
        print(f"  {s['id']} (Beat {s['beat']}): {s['start']:.2f}s -> {s['end']:.2f}s | raw={s['raw_range']} | {s['text']}")


if __name__ == "__main__":
    if "--skip-tts" not in sys.argv or not os.path.exists(RAW_WAV):
        synthesize_charon()
    build_audio_and_timeline()
