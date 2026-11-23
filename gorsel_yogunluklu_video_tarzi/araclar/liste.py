#!/usr/bin/env python3
"""Üretilmiş görsel yoğunluklu bölümleri ve sıradaki numarayı gösterir (registry/gorsel_yogunluklu_episodes.json)."""
import json, os
p = os.path.join(os.path.dirname(__file__), "..", "..", "registry", "gorsel_yogunluklu_episodes.json")
r = json.load(open(p, encoding="utf-8"))
print(f"Son bölüm no: {r['last_no']} → sıradaki: {r['last_no'] + 1}")
for e in r["episodes"]:
    print(f"  #{e['no']:>2}  {e['id']:<8} {e['duration_sec']:>5.1f} sn  {e['title']}")
