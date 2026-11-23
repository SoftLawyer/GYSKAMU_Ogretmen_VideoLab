#!/usr/bin/env python3
"""Görsel yoğunluklu bölüm doğrulayıcı.

Kullanım: python3 gorsel_yogunluklu_video_tarzi/araclar/dogrula.py <episode_klasoru> [--siki]
Kontroller: ses kilidi, süre (45–70 sn), tempo (ifade başına ≤ 2.6 sn ort.), ifade/başlık uzunlukları,
art.ts eşlemesi, caption sabit bloğu, MP4 boyutu/süresi.  --siki: uyarıları da hata say.
"""
import json, os, re, subprocess, sys
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ROOT = os.path.abspath(os.path.join(BASE, ".."))
d = os.path.abspath(sys.argv[1]); strict = "--siki" in sys.argv
errs, warns = [], []
ep = json.load(open(os.path.join(d, "episode.json"), encoding="utf-8"))
tlp = os.path.join(d, "timeline.json")
lock = json.load(open(os.path.join(BASE, "ses_kilidi.json"), encoding="utf-8"))
want = f"gemini:{lock['model']}:{lock['voice']}"

if not os.path.exists(tlp): errs.append("timeline.json yok → önce tts_ve_timeline.py çalıştır")
else:
    tl = json.load(open(tlp, encoding="utf-8"))
    v = tl.get("voice", {})
    if v.get("id") != want or not v.get("locked"):
        (errs if strict else warns).append(f"SES KİLİDİ İHLALİ: kullanılan '{v.get('id')}' ≠ kilitli '{want}'")
    tot = tl["total"]
    if not 45 <= tot <= 70: errs.append(f"süre {tot:.1f} sn (hedef 45–70)")
    nb = sum(len(s["beats"]) for s in tl["scenes"])
    if tot / nb > 2.6: warns.append(f"ritim yavaş: ifade başına {tot/nb:.2f} sn (hedef ≤ 2.6) → daha çok kısa ifade/görsel değişimi ekle")
    for s in ep["scenes"]:
        if len(s["headline"]) > 2: errs.append(f"{s['id']}: başlık ≤ 2 satır")
        if not 1 <= len(s["beats"]) <= 6: warns.append(f"{s['id']}: ifade sayısı {len(s['beats'])} (1–6 önerilir)")
        for b in s["beats"]:
            if len(b["pill"].replace('*', '').split()) > 9: warns.append(f"{s['id']}: ifade çok uzun → '{b['pill'][:40]}…'")
    print(f"süre {tot:.1f} sn · {len(ep['scenes'])} sahne · {nb} ifade · ifade başına {tot/nb:.2f} sn · ses {v.get('id')}")

art = open(os.path.join(d, "art.ts"), encoding="utf-8").read() if os.path.exists(os.path.join(d, "art.ts")) else ""
for s in ep["scenes"]:
    if not re.search(r"\b" + re.escape(s["art"]) + r"\b", art): errs.append(f"art.ts içinde '{s['art']}' yok ({s['id']})")

cap = os.path.join(d, "caption.txt")
settings = json.load(open(os.path.join(ROOT, "config", "settings.json"), encoding="utf-8"))
if not os.path.exists(cap): errs.append("caption.txt yok")
elif settings["caption_mandatory_footer"] not in open(cap, encoding="utf-8").read(): errs.append("caption.txt sabit HukukLA bloğunu KELİMESİ KELİMESİNE içermiyor")

mp4 = next((os.path.join(d, f) for f in os.listdir(d) if f.endswith(".mp4")), None)
if mp4:
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", mp4], capture_output=True, text=True)
    j = json.loads(o.stdout); w, h = j["streams"][0]["width"], j["streams"][0]["height"]
    if (w, h) != (1080, 1920): errs.append(f"MP4 boyutu {w}x{h} ≠ 1080x1920")
    if os.path.exists(tlp) and abs(float(j["format"]["duration"]) - tl["total"]) > 0.6: warns.append("MP4 süresi timeline'dan farklı → yeniden render")
else: warns.append("MP4 henüz yok")

for w in warns: print("UYARI:", w)
for e in errs: print("HATA :", e)
if errs or (strict and warns): sys.exit(1)
print("✓ doğrulama geçti" + (" (uyarılarla)" if warns else ""))
