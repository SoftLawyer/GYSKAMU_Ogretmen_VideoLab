import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, W, CARD } from "../tokens";
import { display, displayItalic, text, textItalic, mono } from "../fonts";
import { useScene } from "../anim";

/** "*vurgu*" işaretli metni parçalara ayırır */
export const parseAccent = (s: string): { t: string; a: boolean }[] => {
  const out: { t: string; a: boolean }[] = [];
  s.split(/(\*[^*]+\*)/g).forEach((p) => {
    if (!p) return;
    if (p.startsWith("*") && p.endsWith("*")) out.push({ t: p.slice(1, -1), a: true });
    else out.push({ t: p, a: false });
  });
  return out;
};

export const Background: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    style={{
      position: "absolute", inset: 0,
      background: dark ? C.espresso : C.paper,
      backgroundImage: dark
        ? "linear-gradient(rgba(235,203,139,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(235,203,139,.045) 1px, transparent 1px)"
        : `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
      backgroundSize: "54px 54px",
    }}
  >
    <div style={{ position: "absolute", inset: 0, background: dark
      ? "radial-gradient(ellipse at 50% 35%, rgba(197,160,89,.10), rgba(0,0,0,.35) 80%)"
      : "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.35), rgba(120,95,60,.10) 85%)" }} />
  </div>
);

export const ProgressDots: React.FC<{ index: number; total: number; dark?: boolean; sceneProgress: number }> = ({ index, total, dark, sceneProgress }) => {
  const x0 = 92, x1 = 930, y = 104;
  const step = (x1 - x0) / (total - 1);
  const fillTo = x0 + step * (index + sceneProgress);
  const line = dark ? "rgba(251,247,238,.25)" : "rgba(43,27,18,.22)";
  return (
    <svg width={W} height={200} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={line} strokeWidth={4} strokeLinecap="round" />
      <line x1={x0} y1={y} x2={fillTo} y2={y} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
      {Array.from({ length: total }).map((_, i) => {
        const cx = x0 + step * i;
        const done = i < index, cur = i === index;
        return (
          <circle key={i} cx={cx} cy={y} r={cur ? 15 : done ? 9 : 8}
            fill={cur ? C.gold : done ? (dark ? C.goldBright : C.espresso) : (dark ? C.espresso : C.paper)}
            stroke={cur ? (dark ? C.cream : C.espresso) : (dark ? "rgba(251,247,238,.5)" : "rgba(43,27,18,.45)")}
            strokeWidth={cur ? 4 : 3} />
        );
      })}
      {/* ses simgesi */}
      <circle cx={988} cy={y} r={26} fill="none" stroke={dark ? "rgba(251,247,238,.55)" : "rgba(43,27,18,.5)"} strokeWidth={3} />
      <path d="M976 98 h6 l9 -8 v28 l-9 -8 h-6 z" fill={dark ? C.cream : C.ink} opacity={0.75} />
      <path d="M996 96 q6 8 0 16" fill="none" stroke={dark ? C.cream : C.ink} strokeWidth={3} strokeLinecap="round" opacity={0.75} />
    </svg>
  );
};

export const Kicker: React.FC<{ children: string; dark?: boolean }> = ({ children, dark }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, top: 192, fontFamily: mono, fontWeight: 500, fontSize: 31, letterSpacing: 5,
      color: dark ? C.goldBright : C.rust, opacity: o, textTransform: "uppercase" }}>{children}</div>
  );
};

export const Headline: React.FC<{ lines: string[]; dark?: boolean }> = ({ lines, dark }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxLen = Math.max(...lines.map((l) => l.replace(/\*/g, "").length));
  const size = Math.min(lines.length > 1 ? 98 : 112, Math.floor(930 / (0.5 * maxLen)));
  let wi = 0;
  return (
    <div style={{ position: "absolute", left: 70, top: lines.length > 1 ? 244 : 290, width: 950, lineHeight: 1.04 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap", fontSize: size, height: size * 1.06 }}>
          {parseAccent(line).map((seg, si) =>
            seg.t.split(/(\s+)/).map((w, k) => {
              if (/^\s+$/.test(w) || w === "") return <span key={`${si}-${k}`}>{w}</span>;
              const d = wi++ * 3;
              const p = spring({ frame: f - d, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } });
              return (
                <span key={`${si}-${k}`} style={{
                  display: "inline-block",
                  fontFamily: seg.a ? displayItalic : display,
                  color: seg.a ? (dark ? C.goldBright : C.gold) : (dark ? C.cream : C.espresso),
                  transform: `translateY(${(1 - p) * 34}px)`, opacity: Math.min(1, p * 1.4),
                }}>{w}</span>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
};

export const CardFrame: React.FC<{ dark?: boolean; children: React.ReactNode }> = ({ dark, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 15, stiffness: 190, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h,
      transform: `scale(${0.955 + 0.045 * p})`, opacity: Math.min(1, p * 2.2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 46, background: dark ? C.espresso2 : C.cream,
        border: `7px solid ${dark ? C.gold : C.ink}`, boxShadow: `0 10px 0 ${dark ? "rgba(0,0,0,.45)" : "rgba(43,27,18,.20)"}`, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};

export const HandleTag: React.FC<{ handle: string }> = ({ handle }) => (
  <div style={{ position: "absolute", left: CARD.x + CARD.w - 360, top: CARD.y + CARD.h - 2, height: 58, padding: "0 26px 0 22px",
    display: "flex", alignItems: "center", gap: 14, background: C.espresso, color: C.cream, borderRadius: "0 0 18px 18px",
    fontFamily: mono, fontWeight: 500, fontSize: 28, letterSpacing: 1.5 }}>
    <span style={{ width: 13, height: 13, borderRadius: 13, background: C.gold, display: "inline-block" }} />
    {handle}
  </div>
);

export const Footer: React.FC<{ children: string; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ position: "absolute", left: 70, top: CARD.y + CARD.h + 28, width: 560, fontFamily: mono, fontSize: 24, letterSpacing: 3,
    color: dark ? "rgba(251,247,238,.6)" : C.muted, textTransform: "uppercase", lineHeight: 1.35 }}>{children}</div>
);

/** Kelime kelime yanan altyazı hapı */
export const Pill: React.FC<{ pill: string; since: number; voiceLen: number; voiceLead: number; dark?: boolean }> = ({ pill, since, voiceLen, voiceLead, dark }) => {
  const { fps } = useScene();
  const p = spring({ frame: since, fps, config: { damping: 12, stiffness: 220, mass: 0.55 } });
  const segs = parseAccent(pill);
  // kelimeler ve ağırlıkları
  const words: { w: string; a: boolean }[] = [];
  segs.forEach((s) => s.t.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, a: s.a })));
  const weights = words.map((x) => x.w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const t = since / fps - voiceLead; // ses başlangıcından beri sn
  let acc = 0;
  const cur = (() => {
    for (let i = 0; i < words.length; i++) {
      const a = (acc / total) * voiceLen; acc += weights[i]; const b = (acc / total) * voiceLen;
      if (t < b) return { i, k: Math.max(0, Math.min(1, (t - a) / Math.max(0.05, b - a))) };
    }
    return { i: words.length, k: 1 };
  })();
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: 1432, display: "flex", justifyContent: "center",
      transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 2) }}>
      <div style={{ maxWidth: 940, padding: "26px 54px 30px", background: dark ? C.cream : C.espresso, borderRadius: 26,
        border: `4px solid ${dark ? C.gold : C.gold}`, boxShadow: `10px 12px 0 ${dark ? "rgba(197,160,89,.55)" : "rgba(28,21,16,.28)"}`,
        textAlign: "center", lineHeight: 1.18 }}>
        {words.map((x, i) => {
          const spoken = i < cur.i, now = i === cur.i;
          const col = dark ? (spoken || now ? C.espresso : "rgba(28,21,16,.35)") : (spoken || now ? C.cream : "rgba(251,247,238,.34)");
          return (
            <span key={i} style={{ display: "inline-block", marginRight: 18, fontFamily: x.a ? textItalic : text, fontSize: 66,
              color: x.a && (spoken || now) ? (dark ? C.goldDeep : C.goldBright) : col,
              textDecoration: now ? "underline" : "none", textDecorationColor: C.gold, textDecorationThickness: 5, textUnderlineOffset: 8,
              transform: now ? `translateY(${-4 * Math.sin(cur.k * Math.PI)}px)` : "none" }}>{x.w}</span>
          );
        })}
      </div>
    </div>
  );
};
