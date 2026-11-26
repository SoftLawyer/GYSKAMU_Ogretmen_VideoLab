#!/usr/bin/env python3
"""Görsel Yoğunluklu Video Tarzı — seslendirme + SFX + timeline üretici.

Kullanım:
  python3 gorsel_yogunluklu_video_tarzi/araclar/tts_ve_timeline.py <episode_klasoru> [--provider auto|gemini|say]

Girdi : <episode>/episode.json   (her beat için "say" metni; opsiyonel "sfx": ["stamp", ...])
Çıktı : <episode>/timeline.json  (Remotion motoru okur)
        public/gv/<id>/master.mp3 (ses + efekt miksi)

SES KİLİDİ (gorsel_yogunluklu_video_tarzi/ses_kilidi.json):
  Tüm videolar kilitli sesle (Gemini 2.5 TTS "Charon", aynı stil talimatı, aynı tempo) seslendirilir.
  - Bir videonun TÜM ifadeleri aynı sesle üretilir; yarıda başka sese geçilmez.
  - Kilitli ses kullanılamıyorsa (GEMINI_API_KEY yok / anahtar geçersiz) araç DURUR, sessizce başka sese geçmez.
  - Yalnızca --gecici-yedek-ses bayrağıyla macOS "Yelda" ile TÜM video üretilir ve timeline'a voice.locked=false yazılır.
  - Tek anahtar kaynağı: GEMINI_API_KEY ortam değişkeni veya repo kökündeki .env (gitignore'lu). Anahtarı ASLA commit etme.
Her beat ayrı seslendirilir (cache/ altında saklanır), kelime zamanlaması için tam süre bilinir.
"""
import argparse, hashlib, json, os, re, subprocess, sys, time, wave
import numpy as np

SR = 44100
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FPS = 30
BEAT_GAP = 0.10     # aynı sahnedeki ifadeler arası sessizlik (sn)
SCENE_GAP = 0.32    # sahneler arası
SCENE_LEAD = 0.28   # sahne görseli sesten bu kadar önce başlar
INTRO = 0.55        # ilk sahnede ses başlamadan önce
OUTRO = 1.0
def load_env():
    """GEMINI_API_KEY ortamda yoksa repo kökündeki .env (gitignore'lu) dosyasından oku. Başka anahtar/kaynak kullanılmaz."""
    if os.environ.get("GEMINI_API_KEY"):
        return
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            m = re.match(r"\s*GEMINI_API_KEY\s*=\s*(\S+)", line)
            if m:
                os.environ["GEMINI_API_KEY"] = m.group(1).strip("'\""); return


load_env()
LOCK_PATH = os.path.join(ROOT, "gorsel_yogunluklu_video_tarzi", "ses_kilidi.json")
LOCK = json.load(open(LOCK_PATH, encoding="utf-8"))
TEMPO = float(LOCK["tempo"])  # atempo (kilitli)
MIN_INTERVAL = 6.6  # sn; Gemini TTS Tier 1 = 10 istek/dk
_LAST_CALL = 0.0


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_wav(path):
    with wave.open(path, "rb") as w:
        n = w.getnframes(); sr = w.getframerate(); ch = w.getnchannels()
        data = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768.0
        if ch > 1:
            data = data.reshape(-1, ch).mean(axis=1)
    return data, sr


def voice_id(provider):
    return f"gemini:{LOCK['model']}:{LOCK['voice']}" if provider == "gemini" else f"say:{LOCK['yedek_ses_sadece_izinle']['voice']}"


# ---------- TTS sağlayıcıları ----------
def tts_say(text, out_wav):
    aiff = out_wav + ".aiff"
    y = LOCK["yedek_ses_sadece_izinle"]; run(["say", "-v", y["voice"], "-r", str(y["rate"]), "-o", aiff, text])
    af = (f"silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.02,"
          f"areverse,silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03,areverse,"
          f"atempo={TEMPO:.2f},afade=t=in:d=0.01,afade=t=out:st=0:d=0.001")
    run(["ffmpeg", "-y", "-i", aiff, "-ac", "1", "-ar", str(SR), "-af", af, out_wav])
    os.remove(aiff)


def tts_gemini(text, out_wav):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    def call(t):
        # Gemini TTS: Tier 1'de dakikada 10 istek sınırı var → istekleri aralıklı gönder, 429'da "retry in N s" kadar bekle.
        # Ayrıca bazen boş yanıt (content=None) döner → yeniden dene.
        global _LAST_CALL
        last, attempts_empty = None, 0
        for _ in range(12):
            wait = MIN_INTERVAL - (time.time() - _LAST_CALL)
            if wait > 0: time.sleep(wait)
            _LAST_CALL = time.time()
            try:
                r = client.models.generate_content(
                    model=LOCK["model"], contents=t,
                    config=types.GenerateContentConfig(
                        response_modalities=["AUDIO"],
                        speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=LOCK["voice"])))))
                c = r.candidates[0].content if r.candidates else None
                if c and c.parts and c.parts[0].inline_data and c.parts[0].inline_data.data:
                    return c.parts[0].inline_data.data
                last = RuntimeError("boş ses yanıtı"); attempts_empty += 1
                if attempts_empty >= 3: raise last
                time.sleep(2)
            except RuntimeError:
                raise
            except Exception as e:  # noqa
                msg = str(e)
                if "PERMISSION_DENIED" in msg or "API key not valid" in msg: raise
                m = re.search(r"retry in ([0-9.]+)s", msg)
                if "429" in msg or "RESOURCE_EXHAUSTED" in msg:
                    d = float(m.group(1)) + 2 if m else 30
                    print(f"  … hız sınırı, {d:.0f} sn bekleniyor"); time.sleep(d); last = e; continue
                last = e; time.sleep(3)
        raise last

    words = len(text.split())

    def first_sentence(pcm_bytes):
        """Taşıyıcı kelimeli üretimde yalnızca ilk cümleyi (ilk konuşma adası) bırak."""
        x = np.frombuffer(pcm_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        w = 240  # 10 ms @ 24 kHz
        n = len(x) // w
        e = np.sqrt((x[: n * w].reshape(n, w) ** 2).mean(axis=1))
        thr = 0.012
        idx = np.where(e > thr)[0]
        if len(idx) == 0: raise RuntimeError("sessiz yanıt")
        st = idx[0]; sil = 0
        for i in range(st, n):
            sil = sil + 1 if e[i] <= thr else 0
            if sil >= 16 and i - st > 20:  # ≥160 ms sessizlik = cümle sonu
                return x[: (i - sil + 4) * w].__mul__(32767).astype(np.int16).tobytes()
        return pcm_bytes

    pcm = None
    for variant in ("style", "plain", "carrier"):
        try:
            if variant == "style":
                pcm = call(LOCK["style_prompt"] + text)
            elif variant == "plain":
                pcm = call(text)
            else:
                print(f"  ~ kısa ifade boş döndü; taşıyıcıyla (aynı Charon sesi) üretiliyor: '{text[:40]}'")
                pcm = first_sentence(call(text + " Evet."))
            break
        except RuntimeError:
            continue
    if pcm is None:
        raise RuntimeError(f"Gemini bu ifadeyi üretemedi: '{text}'")
    if len(pcm) / 2 / 24000 > words * 0.95 + 1.6 and variant == "style":  # talimat okunmuş olabilir → düz metinle yeniden dene
        pcm = call(text)
    raw = out_wav + ".raw.wav"
    with wave.open(raw, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
    af = (f"silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.02,"
          f"areverse,silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.03,areverse,"
          f"atempo={TEMPO:.2f}")
    run(["ffmpeg", "-y", "-i", raw, "-ac", "1", "-ar", str(SR), "-af", af, out_wav])
    os.remove(raw)


def synth(text, cache_dir, provider):
    key = hashlib.md5((voice_id(provider) + "|" + str(TEMPO) + "|" + LOCK["style_prompt"] + "|" + text).encode()).hexdigest()[:16]
    path = os.path.join(cache_dir, f"{key}.wav")
    if os.path.exists(path):
        return path, provider
    if provider == "gemini":
        tts_gemini(text, path)
    else:
        tts_say(text, path)
    return path, provider


# ---------- TEK İSTEK MODU: tüm senaryo tek parça → sessizliklerden ifadelere böl ----------
def gemini_full_take(texts, cache_dir):
    """Tüm ifadeleri TEK istekle seslendirir (satır başına bir ifade). 44.1 kHz mono float döner."""
    from google import genai
    from google.genai import types
    key = hashlib.md5((voice_id("gemini") + "|take|" + str(TEMPO) + "|" + LOCK["style_prompt_tek_istek"] + "|" + "\n".join(texts)).encode()).hexdigest()[:16]
    path = os.path.join(cache_dir, f"take_{key}.wav")
    if not os.path.exists(path):
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        prompt = LOCK["style_prompt_tek_istek"] + "\n\n" + "\n".join(texts)
        last = None
        for attempt in range(6):
            try:
                r = client.models.generate_content(
                    model=LOCK["model"], contents=prompt,
                    config=types.GenerateContentConfig(
                        response_modalities=["AUDIO"],
                        speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=LOCK["voice"])))))
                c = r.candidates[0].content if r.candidates else None
                if c and c.parts and c.parts[0].inline_data and c.parts[0].inline_data.data:
                    pcm = c.parts[0].inline_data.data; break
                last = RuntimeError("boş ses yanıtı")
            except Exception as e:  # noqa
                msg = str(e)
                if "PERMISSION_DENIED" in msg or "API key not valid" in msg: raise
                m = re.search(r"retry in ([0-9.]+)s", msg)
                last = e
                if m: print(f"  … hız sınırı, {float(m.group(1)) + 2:.0f} sn bekleniyor"); time.sleep(float(m.group(1)) + 2); continue
            time.sleep(4 * (attempt + 1))
        else:
            raise last
        raw = path + ".raw.wav"
        with wave.open(raw, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        run(["ffmpeg", "-y", "-i", raw, "-ac", "1", "-ar", str(SR), "-af", f"atempo={TEMPO:.2f}", path]); os.remove(raw)
    data, _ = read_wav(path)
    return data


def split_take(x, n_beats, weights):
    """Tek parça kaydı n_beats ifadeye böler: sessizlik boşluklarını bulur, metin uzunluğu oranlarına en uygun
    n_beats-1 boşluğu dinamik programlamayla seçer. [(start_sn, end_sn), ...] döner."""
    win = int(SR * 0.01)
    n = len(x) // win
    e = np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(axis=1))
    thr = max(0.006, 0.05 * float(np.percentile(e, 92)))
    voiced = np.where(e > thr)[0]
    t0, t1 = voiced[0] * 0.01, (voiced[-1] + 1) * 0.01
    gaps, i = [], voiced[0]
    while i <= voiced[-1]:
        if e[i] <= thr:
            j = i
            while j <= voiced[-1] and e[j] <= thr: j += 1
            if (j - i) >= 9: gaps.append((i * 0.01, j * 0.01))  # ≥ 90 ms
            i = j
        else:
            i += 1
    if len(gaps) < n_beats - 1:
        raise RuntimeError(f"Tek parça kayıtta yeterli sessizlik yok ({len(gaps)} boşluk < {n_beats - 1}). Metni/satırları gözden geçir.")
    # beklenen kesim konumları: konuşma süresi içinde kümülatif ağırlık oranı
    cum = np.cumsum(weights)[:-1] / np.sum(weights)
    # gap'lerdeki toplam sessizlik zamanı da dağılır; ilk yaklaşım: konuşma-zamanı ekseni
    gap_len = np.array([b - a for a, b in gaps]); gap_mid = np.array([(a + b) / 2 for a, b in gaps])
    spoken_before = np.array([(m - t0) - gap_len[:k].sum() - 0.5 * gap_len[k] for k, m in enumerate(gap_mid)])
    speech_total = (t1 - t0) - gap_len.sum()
    exp = cum * speech_total
    G, K = len(gaps), n_beats - 1
    INF = 1e18
    cost = np.full((K, G), INF); prev = np.zeros((K, G), dtype=int)
    sig = max(1.2, 0.04 * speech_total)
    def c(k, g): return ((spoken_before[g] - exp[k]) / sig) ** 2 - 3.0 * min(gap_len[g], 0.7)
    for g in range(G): cost[0, g] = c(0, g)
    for k in range(1, K):
        best, bi = INF, -1
        for g in range(k, G):
            if cost[k - 1, g - 1] < best: best, bi = cost[k - 1, g - 1], g - 1
            cost[k, g] = best + c(k, g); prev[k, g] = bi
    g = int(np.argmin(cost[K - 1])); sel = [g]
    for k in range(K - 1, 0, -1):
        g = int(prev[k, g]); sel.append(g)
    sel = sel[::-1]
    cuts = [gaps[g] for g in sel]
    segs, start = [], t0
    for (a, b) in cuts:
        segs.append((start, a)); start = b
    segs.append((start, t1))
    return segs


# ---------- SFX (prosedürel) ----------
def _t(d): return np.linspace(0, d, int(SR * d), endpoint=False)

def sfx_pop(f=520):
    t = _t(0.09); return np.sin(2 * np.pi * np.linspace(f * .7, f * 1.3, len(t)) * t) * np.exp(-t * 42) * 0.16
def sfx_tick():
    t = _t(0.04); return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * 0.10
def sfx_whoosh():
    t = _t(0.24); n = np.convolve(np.random.normal(0, 1, len(t)), np.ones(20) / 20, mode="same")
    sweep = np.sin(2 * np.pi * np.linspace(220, 680, len(t)) * t) * 0.08
    return (n * 0.24 + sweep) * np.sin(np.pi * t / 0.24)
def sfx_stamp():
    t = _t(0.18); return (np.sin(2 * np.pi * 88 * t) * .75 + np.random.normal(0, .25, len(t))) * np.exp(-t * 28) * 0.36
def sfx_thud():
    t = _t(0.26); return np.sin(2 * np.pi * np.linspace(125, 36, len(t)) * t) * np.exp(-t * 17) * 0.42
def sfx_slash():
    t = _t(0.20); n = np.convolve(np.random.normal(0, 1, len(t)), np.ones(4) / 4, mode="same")
    return n * np.exp(-t * 16) * np.linspace(0.4, 1, len(t)) * 0.28
def sfx_cash():
    t = _t(0.5); a = np.sin(2 * np.pi * 1568 * t) * np.exp(-t * 9); t2 = np.clip(t - 0.09, 0, None)
    b = np.sin(2 * np.pi * 2093 * t) * np.exp(-t2 * 9) * (t >= 0.09); return (a + b) * 0.14
def sfx_lock():
    t = _t(0.22); return (np.sin(2 * np.pi * 640 * t) + .6 * np.sin(2 * np.pi * 1210 * t)) * np.exp(-t * 20) * 0.14
def sfx_siren():
    t = _t(0.9); f = 700 + 280 * np.sin(2 * np.pi * 2.2 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.minimum(1, t * 12) * np.exp(-np.clip(t - 0.5, 0, None) * 5) * 0.10
def sfx_ding():
    t = _t(0.55); return (np.sin(2 * np.pi * 988 * t) + .4 * np.sin(2 * np.pi * 1976 * t)) * np.exp(-t * 7) * 0.14
def sfx_cuff():
    t = _t(0.16); return (np.sin(2 * np.pi * 900 * t) + np.random.normal(0, .3, len(t))) * np.exp(-t * 35) * 0.20
def sfx_snip():
    t = _t(0.12); n = np.random.normal(0, 1, len(t)); return n * np.exp(-t * 40) * np.sin(2 * np.pi * 6 * t).clip(0) * 0.25
def sfx_flip():
    t = _t(0.12); return np.sin(2 * np.pi * np.linspace(300, 720, len(t)) * t) * np.exp(-t * 25) * 0.15
def sfx_notif():
    t = _t(0.26)
    a = np.sin(2 * np.pi * 1175 * t) * np.exp(-t * 22) * (t < 0.11)
    t2 = np.clip(t - 0.085, 0, None)
    b = np.sin(2 * np.pi * 1568 * t2) * np.exp(-t2 * 18) * (t >= 0.085)
    return (a + b) * 0.18
def sfx_bell():
    t = _t(0.45)
    sig = (np.sin(2 * np.pi * 1318 * t) + 0.55 * np.sin(2 * np.pi * 2637 * t) + 0.25 * np.sin(2 * np.pi * 3951 * t))
    return sig * np.exp(-t * 8) * 0.13
def sfx_riser():
    t = _t(0.32)
    f = np.linspace(260, 880, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    n = np.convolve(np.random.normal(0, 1, len(t)), np.ones(16) / 16, mode="same")
    env = (t / 0.32) ** 1.4 * np.exp(-np.clip(t - 0.27, 0, None) * 40)
    return (np.sin(ph) * 0.12 + n * 0.16) * env
def sfx_powerup():
    t = _t(0.42)
    notes = [(0.0, 523.25), (0.08, 659.25), (0.16, 783.99), (0.24, 1046.5)]
    out = np.zeros_like(t)
    for st, freq in notes:
        dt = np.clip(t - st, 0, None)
        out += np.sin(2 * np.pi * freq * dt) * np.exp(-dt * 12) * (t >= st)
    return out * 0.11

SFX = dict(pop=sfx_pop, tick=sfx_tick, whoosh=sfx_whoosh, stamp=sfx_stamp, thud=sfx_thud, slash=sfx_slash, cash=sfx_cash,
           lock=sfx_lock, siren=sfx_siren, ding=sfx_ding, cuff=sfx_cuff, snip=sfx_snip, flip=sfx_flip,
           notif=sfx_notif, bell=sfx_bell, riser=sfx_riser, powerup=sfx_powerup)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode_dir")
    ap.add_argument("--gecici-yedek-ses", action="store_true",
                    help="Kilitli ses (Charon) kullanılamıyorsa TÜM videoyu macOS yedek sesiyle üret (voice.locked=false yazılır)")
    a = ap.parse_args()
    ep_dir = os.path.abspath(a.episode_dir)
    ep = json.load(open(os.path.join(ep_dir, "episode.json"), encoding="utf-8"))
    cache = os.path.join(ep_dir, "audio", "cache"); os.makedirs(cache, exist_ok=True)

    # Sağlayıcıyı TEK SEFER seç; tüm ifadeler aynı sesle üretilir (yarıda geçiş yok).
    first_text = ep["scenes"][0]["beats"][0]["say"]
    beats_flat = [b["say"] for sc in ep["scenes"] for b in sc["beats"]]
    single = LOCK.get("mod", "tek_istek") == "tek_istek"
    take_cached = None
    provider, locked = "gemini", True
    ok = False
    if os.environ.get("GEMINI_API_KEY"):
        try:
            if single:
                print(f"Tek istekle seslendiriliyor ({len(beats_flat)} ifade, tek parça)…")
                take_cached = gemini_full_take(beats_flat, cache); ok = True   # tek istek = prob
            else:
                synth(first_text, cache, "gemini"); ok = True                   # prob: kilitli ses çalışıyor mu?
        except Exception as e:
            print(f"  ! Kilitli ses ({LOCK['voice']}) üretilemedi: {str(e)[:120]}")
    else:
        print("  ! GEMINI_API_KEY yok (ortam değişkeni veya .env).")
    if not ok:
        if a.gecici_yedek_ses:
            provider, locked = "say", False
            print(f"  ⚠ GEÇİCİ YEDEK SES: tüm video macOS '{LOCK['yedek_ses_sadece_izinle']['voice']}' ile üretilecek (kilitli ses değil!)")
        else:
            sys.exit(f"DURDU: Kilitli ses '{LOCK['voice']}' kullanılamıyor. Geçerli bir GEMINI_API_KEY ayarla "
                     f"(export GEMINI_API_KEY=...) ya da bilinçli olarak --gecici-yedek-ses ver. Sesler karıştırılmaz.")
    used = provider
    clips = []
    if provider == "gemini" and single:
        take = take_cached
        weights = [len(t) + 4 for t in beats_flat]
        segs = split_take(take, len(beats_flat), weights)
        exp_dur = np.array(weights, dtype=float) / sum(weights) * sum(b - a for a, b in segs)
        flat = []
        for (a, b), ex in zip(segs, exp_dur):
            seg = take[max(0, int((a - 0.02) * SR)): int((b + 0.04) * SR)]
            flat.append(seg.astype(np.float32))
        bad = [i for i, (sgm, ex) in enumerate(zip(flat, exp_dur)) if not 0.45 <= (len(sgm) / SR) / max(ex, 0.2) <= 2.2]
        if bad: print("  ! UYARI: şu ifadelerin süresi beklentiden çok farklı, bölme hatalı olabilir:", [beats_flat[i] for i in bad][:6])
        k = 0
        for sc in ep["scenes"]:
            clips.append(flat[k:k + len(sc["beats"])]); k += len(sc["beats"])
    else:
        for si, sc in enumerate(ep["scenes"]):
            row = []
            for bi, b in enumerate(sc["beats"]):
                p, _ = synth(b["say"], cache, provider)
                data, _ = read_wav(p); row.append(data)
            clips.append(row)
    # ifadeler arası seviye farkını gider (aynı ses, aynı seviye)
    rms = [float(np.sqrt(np.mean(d ** 2))) for r in clips for d in r]
    target = float(np.median(rms))
    for r in clips:
        for k, d in enumerate(r):
            g = target / max(1e-6, float(np.sqrt(np.mean(d ** 2))))
            r[k] = np.clip(d * min(1.6, max(0.6, g)), -1, 1).astype(np.float32)
    print(f"Ses: {voice_id(provider)}  (kilitli={locked})")

    # --- zaman çizelgesi ---
    cursor = INTRO
    scenes_tl, sfx_events = [], []
    voice_events = []  # (start_sec, data)
    for si, sc in enumerate(ep["scenes"]):
        beats = []
        for bi, data in enumerate(clips[si]):
            dur = len(data) / SR
            vs, ve = cursor, cursor + dur
            voice_events.append((vs, data))
            beats.append({"voiceStart": round(vs, 3), "voiceEnd": round(ve, 3)})
            cursor = ve + (BEAT_GAP if bi < len(clips[si]) - 1 else SCENE_GAP)
        scenes_tl.append(beats)
    total = scenes_tl[-1][-1]["voiceEnd"] + OUTRO

    out_scenes = []
    for si, beats in enumerate(scenes_tl):
        sc_start = 0.0 if si == 0 else max(0.0, beats[0]["voiceStart"] - SCENE_LEAD)
        tb = []
        for bi, b in enumerate(beats):
            st = sc_start if bi == 0 else b["voiceStart"] - 0.05
            tb.append({"start": round(st, 3), "voiceStart": b["voiceStart"], "voiceEnd": b["voiceEnd"]})
        for bi in range(len(tb)):
            tb[bi]["end"] = tb[bi + 1]["start"] if bi + 1 < len(tb) else None
        out_scenes.append({"id": ep["scenes"][si]["id"], "start": round(sc_start, 3), "end": None, "beats": tb})
    for si, s in enumerate(out_scenes):
        s["end"] = out_scenes[si + 1]["start"] if si + 1 < len(out_scenes) else round(total, 3)
        if s["beats"][-1]["end"] is None: s["beats"][-1]["end"] = s["end"]

    # --- ses miksi ---
    n = int((total + 0.5) * SR)
    mix = np.zeros(n, dtype=np.float32)
    voice = np.zeros(n, dtype=np.float32)
    for vs, data in voice_events:
        i = int(vs * SR); voice[i:i + len(data)] += data[: n - i]
    peak = np.max(np.abs(voice)) or 1.0
    voice = voice / peak * 0.88
    mix += voice

    def put(t, arr):
        i = max(0, int(t * SR)); e = min(n, i + len(arr))
        if e > i: mix[i:e] += arr[: e - i].astype(np.float32)

    np.random.seed(7)
    for si, s in enumerate(out_scenes):
        if si > 0: put(s["start"] - 0.03, sfx_whoosh())
        for bi, b in enumerate(s["beats"]):
            spec = ep["scenes"][si]["beats"][bi].get("sfx")
            if spec is None: spec = ["pop"]
            for item in spec:
                name, off = (item, 0.0) if isinstance(item, str) else (item[0], item[1])
                put(b["start"] + 0.05 + off, SFX[name]())
    mix = np.clip(mix, -1, 1)
    pcm = (mix * 32767).astype(np.int16)
    out_dir = os.path.join(ROOT, "public", "gv", ep["id"]); os.makedirs(out_dir, exist_ok=True)
    wavp = os.path.join(out_dir, "master.wav")
    with wave.open(wavp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    mp3 = os.path.join(out_dir, "master.mp3")
    run(["ffmpeg", "-y", "-i", wavp, "-b:a", "192k", mp3]); os.remove(wavp)

    tl = {"fps": FPS, "total": round(total, 3), "audio": f"gv/{ep['id']}/master.mp3", "voice": {"id": voice_id(provider), "locked": locked}, "scenes": out_scenes}
    json.dump(tl, open(os.path.join(ep_dir, "timeline.json"), "w"), ensure_ascii=False, indent=1)
    print(f"Toplam süre: {total:.2f} sn · {sum(len(s['beats']) for s in out_scenes)} ifade · {len(out_scenes)} sahne")
    print("→", os.path.join(ep_dir, "timeline.json"))


if __name__ == "__main__":
    main()
