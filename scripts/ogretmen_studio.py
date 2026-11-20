#!/usr/bin/env python3
"""
GYSKAMU Öğretmen VideoLab — CLI Yönetim, 10 Konu Öneri, Süre Kilidi (45-55sn) ve Caption Üretim Aracı
"""
import os
import sys
import json
import argparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETTINGS_PATH = os.path.join(BASE_DIR, "config", "settings.json")
LOCKS_PATH = os.path.join(BASE_DIR, "locks", "ogretmen_locks.json")
EPISODES_PATH = os.path.join(BASE_DIR, "registry", "episodes.json")
TOPIC_BANK_PATH = os.path.join(BASE_DIR, "registry", "topic_bank.json")
TIMELINE_PATH = os.path.join(BASE_DIR, "src", "timeline.json")


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def cmd_list(_args):
    reg = load_json(EPISODES_PATH)
    print(f"📁 GYSKAMU ÖĞRETMEN DOSYA ARŞİVİ (Son Dosya No: {reg['last_dosya_no']} -> Sıradaki: DOSYA NO: {reg['last_dosya_no'] + 1})")
    print("-" * 85)
    if not reg["episodes"]:
        print("  Henüz üretilmiş dosya yok. İlk dosya için 'suggest' komutuyla 10 konu seçebilirsin.")
        print("-" * 85)
        return
    for ep in reg["episodes"]:
        print(f"  ♦ DOSYA NO: {ep['dosya_no']} | [{ep['category'].upper()}] {ep['title']}")
        print(f"    Süre: {ep['duration_sec']} sn | Ses: {ep['voice']} | Video: {ep['video_path']}")
        print(f"    Mevzuat/İlke: {', '.join(ep['laws'])}")
        print("-" * 85)


def cmd_suggest(args):
    bank = load_json(TOPIC_BANK_PATH)
    reg = load_json(EPISODES_PATH)
    done_titles = {ep["title"].lower() for ep in reg["episodes"]}
    cat = (args.category or "ekys").lower()

    if cat == "all":
        items = []
        for cat_items in bank["categories"].values():
            for item in cat_items:
                if item["title"].lower() not in done_titles:
                    items.append(item)
    elif cat not in bank["categories"]:
        print(f"⚠️ '{cat}' kategorisi sabit havuzda yok. Mevcut kategoriler: {', '.join(bank['categories'].keys())}, all")
        return
    else:
        items = [item for item in bank["categories"][cat] if item["title"].lower() not in done_titles]

    selected = items[:10]
    next_no = reg["last_dosya_no"] + 1
    print(f"🎓 DOSYA NO: {next_no} İÇİN [{cat.upper()}] KATEGORİSİNDE {len(selected)} ADAY KONU SEÇENEĞİ:")
    print("=" * 88)
    for idx, item in enumerate(selected, 1):
        print(f"{idx}. {item['title']}")
        print(f"   🔥 Kanca (Hook): {item['hook']}")
        print(f"   ⚖️  Mevzuat Çözümü: {item['summary']}")
        print(f"   📜 Dayanak: {', '.join(item['laws'])}")
        print("-" * 88)


def cmd_validate(_args):
    settings = load_json(SETTINGS_PATH)
    errors = []
    if not os.path.exists(TIMELINE_PATH):
        errors.append("src/timeline.json bulunamadı.")
    else:
        tl = load_json(TIMELINE_PATH)
        dur = tl.get("totalDuration", 0)
        min_d = settings["video"]["min_duration_sec"]
        max_d = settings["video"]["max_duration_sec"]
        if not (min_d <= dur <= max_d + 0.5):
            errors.append(f"Süre kilidi ihlali: {dur}s (Hedef: {min_d}s - {max_d}s)")
        beats = tl.get("beats", [])
        if len(beats) != 7:
            errors.append(f"Beat sayısı 7 olmalı, mevcut: {len(beats)}")

    mp3_path = os.path.join(BASE_DIR, "public", "audio", "master_audio.mp3")
    if not os.path.exists(mp3_path):
        errors.append("public/audio/master_audio.mp3 bulunamadı (önce 'python3 generate_charon_v2.py' çalıştırın).")

    reg = load_json(EPISODES_PATH)
    footer = settings["caption_mandatory_footer"].strip()
    for ep in reg["episodes"]:
        cap_file = os.path.join(BASE_DIR, ep["caption_path"])
        if not os.path.exists(cap_file):
            errors.append(f"Caption dosyası eksik: {ep['caption_path']}")
        else:
            with open(cap_file, "r", encoding="utf-8") as f:
                content = f.read()
            if footer not in content:
                errors.append(f"DOSYA NO {ep['dosya_no']} caption içinde zorunlu GYSKAMU alt bloğu eksik!")

    if errors:
        print("❌ DOĞRULAMA HATALARI:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        tl = load_json(TIMELINE_PATH)
        print(f"✅ TÜM KİLİTLER DOĞRULANDI! (Aktif Timeline Süresi: {tl['totalDuration']}s | 7 Bölüm | Sabit GYSKAMU Caption Bloğu Tamam)")


def cmd_caption(args):
    settings = load_json(SETTINGS_PATH)
    reg = load_json(EPISODES_PATH)
    dosya_no = args.dosya or (reg["last_dosya_no"] + 1)
    footer = settings["caption_mandatory_footer"]
    text = f"""♦ DOSYA NO: {dosya_no} | {args.title} 🎓⚖️

{args.intro}

Peki mevzuat bu durumda ne diyor?

{args.points}

💬 {args.question} 👇

{footer}

{args.tags}
"""
    print(text)


def main():
    parser = argparse.ArgumentParser(description="GYSKAMU Öğretmen VideoLab CLI")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("list", help="Üretilen tüm dosyaları ve sıradaki Dosya No'yu listele")

    p_sug = sub.add_parser("suggest", help="Kategoriye göre 10 aday öğretmen/EKYS dosyası öner")
    p_sug.add_argument(
        "--category",
        default="ekys",
        help="Kategori (ekys, ogretmen_haklari, izin_tayin, disiplin_sorusturma, ek_ders_nobet, all)",
    )

    sub.add_parser("validate", help="45-55sn süre kilidini, 7 bölümü ve zorunlu GYSKAMU caption bloğunu doğrula")

    p_cap = sub.add_parser("caption", help="Zorunlu GYSKAMU alt bloğuyla tam Instagram caption üret")
    p_cap.add_argument("--dosya", type=int, default=None)
    p_cap.add_argument("--title", required=True)
    p_cap.add_argument("--intro", required=True)
    p_cap.add_argument("--points", required=True)
    p_cap.add_argument("--question", default="Senin veya bir meslektaşının başına benzer bir durum geldi mi? Yorumlarda paylaş, birlikte konuşalım!")
    p_cap.add_argument("--tags", default="#ekys #gyskamu #öğretmen #öğretmenhakları #meb #657dmk #ömk #müdürlük #eğitim #mevzuat")

    args = parser.parse_args()
    if args.cmd == "list":
        cmd_list(args)
    elif args.cmd == "suggest":
        cmd_suggest(args)
    elif args.cmd == "validate":
        cmd_validate(args)
    elif args.cmd == "caption":
        cmd_caption(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
