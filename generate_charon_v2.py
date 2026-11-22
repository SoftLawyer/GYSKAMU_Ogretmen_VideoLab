import os
import sys
import json
import wave
import asyncio
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

# Load .env if present (kept out of git)
_ENV_PATH = os.path.join(BASE_DIR, ".env")
if os.path.exists(_ENV_PATH):
    with open(_ENV_PATH, "r", encoding="utf-8") as _ef:
        for _line in _ef:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k.strip(), _v.strip().strip('"').strip("'"))

API_KEY = os.environ.get("GEMINI_API_KEY", _SETTINGS.get("gemini_api_key", ""))
TEMPO = 1.10
VOICE_NAME = _SETTINGS["tts"].get("voice_name", "Charon")
TTS_MODEL = _SETTINGS["tts"].get("model", "gemini-2.5-flash-preview-tts")

# ============================================================================
# DOSYA NO: 3 — Müdür Öğretmenin Şahsi Telefon Numarasını Velilere İzinsiz Dağıtabilir mi?
# Hedef: 7 Bölüm (Beat 0..6), 20 Segment, TEMPO = 1.10 (Charon / HukukLA ile birebir) -> 45.0s - 55.0s
# ============================================================================
PROMPT_TEXT = """Aşağıdaki metni genç, karizmatik, tok, merak uyandıran ve akıcı bir Türkçe belgesel/Reels anlatıcısı tonuyla oku. Her satır arasında çok kısa ve doğal bir es ver; aynı satır içinde duraksama yapma:

Gece saat on birde öğretmenin telefonu susmadan çalmaya başladı.
Okul müdürü, öğretmenden izinsiz şahsi numarasını velilere dağıtmıştı.
Yetmedi, öğretmeni bir de veli WhatsApp grubuna eklemişti.
Peki müdürün böyle bir hakkı var mı?

Çoğu öğretmen okul iletişimidir, mecburen verilir sanır.
Ama kanun burada çok ağır bir ceza öngörür.

Anayasa madde yirmi ve altı bin altı yüz doksan sekiz sayılı kanun açık.
Öğretmenin şahsi cep telefonu, korunan kişisel veridir.

Resmi iletişim yalnızca okulun kurumsal kanallarıyla yürütülür.
Açık rıza olmadan numarayı paylaşmak T C K madde yüz otuz altı suçudur.
Cezası iki yıldan dört yıla kadar hapistir.
Üstelik kamu görevlisi yetkisini kötüye kullanırsa ceza yarı oranında artar.

Peki sonuç ne olur?
Öğretmen mesai dışında veli aramalarına cevap vermek zorunda değildir.
İzinsiz paylaşım yapan amir hakkında savcılığa suç duyurusu yapılabilir.

Kısacası kurumsal iletişim var,
ama şahsi numarayı izinsiz dağıtma hakkı yok.

Senin numaran da iznin olmadan velilere verildi mi?
Yorumlarda paylaş, birlikte konuşalım.
Yeni öğretmen dosyaları için GYSKAMU'yu takip et."""

SEGMENTS_DEF = [
    # Beat 0
    {"id": "b0_s0", "beat": 0, "text": "Gece saat 23:00'te öğretmenin telefonu susmadan çalmaya başladı.", "sub_chunks": [
        {"words": ["Gece", "saat", "23:00'te", "öğretmenin"], "highlight": [0, 2]},
        {"words": ["telefonu", "susmadan", "çalmaya", "başladı."], "highlight": [0, 1]}
    ], "pause_after": 0.12},
    {"id": "b0_s1", "beat": 0, "text": "Okul müdürü, öğretmenden izinsiz şahsi numarasını velilere dağıtmıştı.", "sub_chunks": [
        {"words": ["Okul", "müdürü,", "öğretmenden", "izinsiz"], "highlight": [0, 1, 3]},
        {"words": ["şahsi", "numarasını", "velilere", "dağıtmıştı."], "highlight": [0, 1, 3]}
    ], "pause_after": 0.12},
    {"id": "b0_s2", "beat": 0, "text": "Yetmedi, öğretmeni bir de veli WhatsApp grubuna eklemişti.", "sub_chunks": [
        {"words": ["Yetmedi,", "öğretmeni", "bir", "de"], "highlight": [0]},
        {"words": ["veli", "WhatsApp", "grubuna", "eklemişti."], "highlight": [0, 1, 2]}
    ], "pause_after": 0.12},
    {"id": "b0_s3", "beat": 0, "text": "Peki müdürün böyle bir hakkı var mı?", "sub_chunks": [
        {"words": ["Peki", "müdürün", "böyle", "bir", "hakkı", "var", "mı?"], "highlight": [4, 5, 6]}
    ], "pause_after": 0.20},

    # Beat 1
    {"id": "b1_s0", "beat": 1, "text": "Çoğu öğretmen okul iletişimidir, mecburen verilir sanır.", "sub_chunks": [
        {"words": ["Çoğu", "öğretmen", "okul", "iletişimidir,"], "highlight": [0, 1]},
        {"words": ["mecburen", "verilir", "sanır."], "highlight": [0, 2]}
    ], "pause_after": 0.12},
    {"id": "b1_s1", "beat": 1, "text": "Ama kanun burada çok ağır bir ceza öngörür.", "sub_chunks": [
        {"words": ["Ama", "kanun", "burada", "çok"], "highlight": [1]},
        {"words": ["ağır", "bir", "ceza", "öngörür."], "highlight": [0, 2]}
    ], "pause_after": 0.20},

    # Beat 2
    {"id": "b2_s0", "beat": 2, "text": "Anayasa m. 20 ve 6698 sayılı KVKK açık.", "sub_chunks": [
        {"words": ["Anayasa", "m.", "20", "ve"], "highlight": [0, 2]},
        {"words": ["6698", "sayılı", "KVKK", "açık."], "highlight": [0, 2, 3]}
    ], "pause_after": 0.12},
    {"id": "b2_s1", "beat": 2, "text": "Öğretmenin şahsi cep telefonu, korunan kişisel veridir.", "sub_chunks": [
        {"words": ["Öğretmenin", "şahsi", "cep", "telefonu,"], "highlight": [1, 3]},
        {"words": ["korunan", "kişisel", "veridir."], "highlight": [1, 2]}
    ], "pause_after": 0.20},

    # Beat 3
    {"id": "b3_s0", "beat": 3, "text": "Resmi iletişim yalnızca okulun kurumsal kanallarıyla yürütülür.", "sub_chunks": [
        {"words": ["Resmi", "iletişim", "yalnızca", "okulun"], "highlight": [0, 2]},
        {"words": ["kurumsal", "kanallarıyla", "yürütülür."], "highlight": [0, 1]}
    ], "pause_after": 0.10},
    {"id": "b3_s1", "beat": 3, "text": "Açık rıza olmadan numarayı paylaşmak TCK m. 136 suçudur.", "sub_chunks": [
        {"words": ["Açık", "rıza", "olmadan", "numarayı", "paylaşmak"], "highlight": [0, 1]},
        {"words": ["TCK", "m.", "136", "suçudur."], "highlight": [0, 2, 3]}
    ], "pause_after": 0.12},
    {"id": "b3_s2", "beat": 3, "text": "Cezası 2 yıldan 4 yıla kadar hapistir.", "sub_chunks": [
        {"words": ["Cezası", "2", "yıldan", "4", "yıla", "kadar", "hapistir."], "highlight": [1, 3, 6]}
    ], "pause_after": 0.12},
    {"id": "b3_s3", "beat": 3, "text": "Üstelik kamu görevlisi yetkisini kötüye kullanırsa ceza yarı oranında artar.", "sub_chunks": [
        {"words": ["Üstelik", "kamu", "görevlisi", "yetkisini", "kötüye", "kullanırsa"], "highlight": [1, 2, 4]},
        {"words": ["ceza", "yarı", "oranında", "artar."], "highlight": [1, 2, 3]}
    ], "pause_after": 0.20},

    # Beat 4
    {"id": "b4_s0", "beat": 4, "text": "Peki sonuç ne olur?", "sub_chunks": [
        {"words": ["Peki", "sonuç", "ne", "olur?"], "highlight": [1, 2]}
    ], "pause_after": 0.12},
    {"id": "b4_s1", "beat": 4, "text": "Öğretmen mesai dışında veli aramalarına cevap vermek zorunda değildir.", "sub_chunks": [
        {"words": ["Öğretmen", "mesai", "dışında", "veli", "aramalarına"], "highlight": [1, 2]},
        {"words": ["cevap", "vermek", "zorunda", "değildir."], "highlight": [2, 3]}
    ], "pause_after": 0.12},
    {"id": "b4_s2", "beat": 4, "text": "İzinsiz paylaşım yapan amir hakkında savcılığa suç duyurusu yapılabilir.", "sub_chunks": [
        {"words": ["İzinsiz", "paylaşım", "yapan", "amir", "hakkında"], "highlight": [0, 1, 3]},
        {"words": ["savcılığa", "suç", "duyurusu", "yapılabilir."], "highlight": [0, 1, 2]}
    ], "pause_after": 0.20},

    # Beat 5
    {"id": "b5_s0", "beat": 5, "text": "Kısacası kurumsal iletişim var,", "sub_chunks": [
        {"words": ["Kısacası", "kurumsal", "iletişim", "var,"], "highlight": [1, 2]}
    ], "pause_after": 0.08},
    {"id": "b5_s1", "beat": 5, "text": "ama şahsi numarayı izinsiz dağıtma hakkı yok.", "sub_chunks": [
        {"words": ["ama", "şahsi", "numarayı", "izinsiz", "dağıtma", "hakkı", "yok."], "highlight": [1, 3, 6]}
    ], "pause_after": 0.20},

    # Beat 6
    {"id": "b6_s0", "beat": 6, "text": "Senin numaran da iznin olmadan velilere verildi mi?", "sub_chunks": [
        {"words": ["Senin", "numaran", "da", "iznin", "olmadan"], "highlight": [1, 3, 4]},
        {"words": ["velilere", "verildi", "mi?"], "highlight": [0, 1]}
    ], "pause_after": 0.12},
    {"id": "b6_s1", "beat": 6, "text": "Yorumlarda paylaş, birlikte konuşalım.", "sub_chunks": [
        {"words": ["Yorumlarda", "paylaş,", "birlikte", "konuşalım."], "highlight": [0, 1]}
    ], "pause_after": 0.12},
    {"id": "b6_s2", "beat": 6, "text": "Yeni öğretmen dosyaları için GYSKAMU'yu takip et.", "sub_chunks": [
        {"words": ["Yeni", "öğretmen", "dosyaları", "için"], "highlight": [1, 2]},
        {"words": ["GYSKAMU'yu", "takip", "et."], "highlight": [0, 1]}
    ], "pause_after": 0.30},
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


def _spoken_lines():
    # Extract the exact spoken lines from PROMPT_TEXT (skipping the first instruction line)
    lines = [l.strip() for l in PROMPT_TEXT.strip().splitlines()[1:] if l.strip()]
    if len(lines) == len(SEGMENTS_DEF):
        return lines
    return [s["text"] for s in SEGMENTS_DEF]


def _alignment_score(segs, spoken_lines):
    total_dur = sum(b - a for a, b in segs)
    char_lens = [len(l) for l in spoken_lines]
    total_chars = max(1, sum(char_lens))
    err = 0.0
    for (a, b), c in zip(segs, char_lens):
        exp = total_dur * (c / total_chars)
        err += ((b - a) - exp) ** 2
    return err


def find_best_segments(samples, sr):
    target_n = len(SEGMENTS_DEF)
    spoken_lines = _spoken_lines()

    # Evaluate ALL candidate thresholds/min_sil that yield target_n islands AND pick lowest duration-mismatch score,
    # plus compare against DP merge of fine islands so a comma pause NEVER shifts all subsequent subtitles!
    candidates = []
    for thresh in [0.012, 0.010, 0.015, 0.008, 0.018]:
        for min_sil in range(180, 620, 20):
            segs = detect_islands(samples, sr, min_sil_ms=min_sil, thresh=thresh)
            if len(segs) == target_n:
                sc = _alignment_score(segs, spoken_lines)
                candidates.append((sc, f"sweep(thresh={thresh}, min_sil={min_sil}ms)", segs))

    # Also build DP merge from fine islands (120ms) using SPOKEN line lengths (not display text!)
    fine = detect_islands(samples, sr, min_sil_ms=120, thresh=0.012)
    if len(fine) >= target_n:
        M = len(fine)
        K = target_n
        total_speech_dur = sum(b - a for a, b in fine)
        char_lens = [len(l) for l in spoken_lines]
        total_chars = max(1, sum(char_lens))
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
                    # Penalize large silence gaps inside merged island & duration mismatch strongly
                    cost = dp[k - 1][i] + ((dur_ij - exp_d) ** 2) * 3.0 + (internal_sil * 2.5) ** 2
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
        sc = _alignment_score(bounds, spoken_lines)
        candidates.append((sc, f"DP({M}->{K})", bounds))

    if candidates:
        candidates.sort(key=lambda x: x[0])
        best_sc, best_label, best_segs = candidates[0]
        print(f"Selected best alignment: {best_label} (score={best_sc:.3f})")
        return best_segs

    # Final proportional fallback
    t0 = fine[0][0] if fine else 0.0
    t1 = fine[-1][1] if fine else len(samples) / sr
    total_chars = max(1, sum(len(l) for l in spoken_lines))
    cur = t0
    res = []
    for l in spoken_lines:
        d = (t1 - t0) * (len(l) / total_chars)
        res.append((round(cur, 3), round(cur + d, 3)))
        cur += d
    return res


def make_sfx_bell(sr=44100):
    t = np.linspace(0, 0.45, int(sr * 0.45), endpoint=False)
    env = np.exp(-t * 7.5)
    tone = (
        np.sin(2 * np.pi * 880 * t) * 0.50
        + np.sin(2 * np.pi * 1760 * t) * 0.30
        + np.sin(2 * np.pi * 2640 * t) * 0.15
    ) * env
    return tone * 0.15


def make_sfx_impact(sr=44100):
    t = np.linspace(0, 0.22, int(sr * 0.22), endpoint=False)
    env = np.exp(-t * 22)
    thud = np.sin(2 * np.pi * np.linspace(115, 40, len(t)) * t) * env
    return thud * 0.32


def make_sfx_stamp(sr=44100):
    t = np.linspace(0, 0.16, int(sr * 0.16), endpoint=False)
    env = np.exp(-t * 30)
    wave_data = (np.sin(2 * np.pi * 95 * t) * 0.72 + np.random.normal(0, 0.20, len(t))) * env
    return wave_data * 0.30


def make_sfx_gavel(sr=44100):
    t = np.linspace(0, 0.24, int(sr * 0.24), endpoint=False)
    env = np.exp(-t * 26)
    wood = (np.sin(2 * np.pi * 180 * t) * 0.6 + np.sin(2 * np.pi * 420 * t) * 0.3) * env
    return wood * 0.32


def make_sfx_alert(sr=44100):
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


def synthesize_edge_segments(voice="tr-TR-AhmetNeural", rate="+6%", pitch="-2Hz"):
    import edge_tts

    async def _gen_all():
        for seg in SEGMENTS_DEF:
            mp3_tmp = os.path.join(OUT_DIR, f"edge_{seg['id']}.mp3")
            wav_out = os.path.join(OUT_DIR, f"charon_v2_{seg['id']}.wav")
            spoken = seg.get("spoken_text", seg["text"])
            comm = edge_tts.Communicate(spoken, voice=voice, rate=rate, pitch=pitch)
            await comm.save(mp3_tmp)
            subprocess.run([
                "ffmpeg", "-y", "-i", mp3_tmp,
                "-af", "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,afade=t=in:st=0:d=0.015",
                "-ar", "44100", "-ac", "1", wav_out
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            if os.path.exists(mp3_tmp):
                os.remove(mp3_tmp)

    asyncio.run(_gen_all())
    print(f"✅ Edge Neural TTS ({voice}) synthesized {len(SEGMENTS_DEF)} segments.")


def build_audio_and_timeline(engine="charon"):
    sr = 44100
    master_samples = []
    cur_t = 0.18
    master_samples.append(np.zeros(int(sr * cur_t)))

    timeline_segments = []
    beat_ranges = {}

    if engine == "charon":
        with wave.open(RAW_WAV, "rb") as wf:
            raw_sr = wf.getframerate()
            raw_samples = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
        ranges = find_best_segments(raw_samples, raw_sr)
    else:
        ranges = [(0.0, 0.0)] * len(SEGMENTS_DEF)

    for seg, (t0, t1) in zip(SEGMENTS_DEF, ranges):
        seg_wav = os.path.join(OUT_DIR, f"charon_v2_{seg['id']}.wav")
        if engine == "charon":
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
    # Beat 0: school bell + tutanak slam + kınama stamp
    mix_at(seg_map["b0_s0"]["start"], make_sfx_bell(sr))
    mix_at(seg_map["b0_s1"]["end"] - 0.15, make_sfx_impact(sr))
    mix_at(seg_map["b0_s2"]["start"] + 0.35, make_sfx_stamp(sr))

    # Beat 1: myth stamp + red-line pop
    mix_at(seg_map["b1_s0"]["end"] - 0.15, make_sfx_stamp(sr))
    mix_at(seg_map["b1_s1"]["start"] + 0.15, make_sfx_pop(sr, 480))

    # Beat 2: conflict barrier slam
    mix_at(seg_map["b2_s1"]["start"] + 0.15, make_sfx_impact(sr))

    # Beat 3: legal principle alert + Danıştay stamp
    mix_at(seg_map["b3_s1"]["start"], make_sfx_alert(sr))
    mix_at(seg_map["b3_s3"]["start"] + 0.15, make_sfx_stamp(sr))

    # Beat 4: gavel on İdare Mahkemesi cancellation
    mix_at(seg_map["b4_s2"]["sub_chunks"][1]["start"] + 0.10, make_sfx_gavel(sr))

    # Beat 5: spotlight counters
    mix_at(seg_map["b5_s0"]["start"] + 0.18, make_sfx_pop(sr, 440))
    mix_at(seg_map["b5_s1"]["start"] + 0.18, make_sfx_pop(sr, 540))

    # Beat 6: CTA pops
    mix_at(seg_map["b6_s1"]["start"], make_sfx_pop(sr, 600))
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
    engine = "edge" if "--engine" in sys.argv and "edge" in sys.argv else "charon"
    if engine == "edge":
        synthesize_edge_segments()
        build_audio_and_timeline(engine="edge")
    else:
        if "--skip-tts" not in sys.argv or not os.path.exists(RAW_WAV):
            synthesize_charon()
        build_audio_and_timeline(engine="charon")
