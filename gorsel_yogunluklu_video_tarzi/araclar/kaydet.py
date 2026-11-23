#!/usr/bin/env python3
"""episodes/ altındaki tüm bölümleri tarar ve motor/registry.generated.ts dosyasını üretir.

Bir bölümün kaydedilmesi için klasöründe episode.json + timeline.json + art.ts bulunmalı.
Kullanım: python3 gorsel_yogunluklu_video_tarzi/araclar/kaydet.py
Composition kimliği: episode.json "id" değerinde "_" yerine "-" (gy_001 → gy-001).
"""
import json, os, re
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EPS = os.path.join(BASE, "episodes")
rows = []
for d in sorted(os.listdir(EPS)):
    p = os.path.join(EPS, d)
    if all(os.path.exists(os.path.join(p, f)) for f in ("episode.json", "timeline.json", "art.ts")):
        ep = json.load(open(os.path.join(p, "episode.json"), encoding="utf-8"))
        rows.append((d, ep["id"]))
lines = ["// OTOMATİK ÜRETİLDİ — araclar/kaydet.py. Elle düzenleme.", 'import type { Episode, Timeline } from "./types";', 'import type React from "react";']
for i, (d, _) in enumerate(rows):
    lines += [f'import ep{i} from "../episodes/{d}/episode.json";', f'import tl{i} from "../episodes/{d}/timeline.json";', f'import {{ art as art{i} }} from "../episodes/{d}/art";']
lines.append("export const EPISODES: { id: string; ep: Episode; tl: Timeline; art: Record<string, React.FC> }[] = [")
for i, (d, eid) in enumerate(rows):
    lines.append(f'  {{ id: "{eid.replace("_", "-")}", ep: ep{i} as Episode, tl: tl{i} as unknown as Timeline, art: art{i} as Record<string, React.FC> }},')
lines.append("];")
open(os.path.join(BASE, "motor", "registry.generated.ts"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
print("Kayıtlı bölümler:", ", ".join(e for _, e in rows) or "(yok)")
