import React from "react";
import { C } from "../tokens";
import { mono, display, displayItalic, text, FALLBACK } from "../fonts";
import { INK } from "./Person";

export const AW = 972; // illüstrasyon alanı genişliği
export const AH = 800; // illüstrasyon alanı yüksekliği
export const M = `${mono}${FALLBACK}`;
export const D = `${display}${FALLBACK}`;

type T = { x?: number; y?: number; r?: number; s?: number; o?: number };
const tf = ({ x = 0, y = 0, r = 0, s = 1 }: T) => `translate(${x},${y}) rotate(${r}) scale(${s})`;

/** Çizim alanı sarmalayıcı */
export const Art: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <svg viewBox={`0 0 ${AW} ${AH}`} width="100%" height="100%" style={{ display: "block", background: bg }}>{children}</svg>
);

/** Oda arka planı: duvar + zemin. night=true pencerede ay */
export const Room: React.FC<{ wall?: string; floor?: string; floorY?: number; stripes?: boolean; children?: React.ReactNode }> = ({ wall = C.wallA, floor = C.floorA, floorY = 590, stripes, children }) => (
  <g>
    <rect width={AW} height={AH} fill={wall} />
    {stripes ? Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 90} y={0} width={45} height={floorY} fill="rgba(120,90,50,.07)" />) : null}
    <rect y={floorY} width={AW} height={AH - floorY} fill={floor} />
    <rect y={floorY - 4} width={AW} height={14} fill="rgba(43,27,18,.18)" />
    <line x1={0} y1={floorY} x2={AW} y2={floorY} stroke={INK} strokeWidth={5} />
    {children}
  </g>
);

export const Win: React.FC<T & { moon?: boolean; w?: number; h?: number }> = ({ moon = true, w = 150, h = 200, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-w / 2} y={0} width={w} height={h} rx={8} fill={moon ? C.night : "#BFE0EE"} stroke={INK} strokeWidth={6} />
    {moon ? (<><circle cx={w * 0.12} cy={h * 0.28} r={26} fill={C.goldBright} /><circle cx={w * 0.12 + 12} cy={h * 0.28 - 6} r={22} fill={C.night} />
      {[[-30, 90], [30, 50], [-45, 40]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3} fill="#fff" opacity={0.85} />)}</>) : null}
    <line x1={0} y1={0} x2={0} y2={h} stroke={INK} strokeWidth={5} /><line x1={-w / 2} y1={h / 2} x2={w / 2} y2={h / 2} stroke={INK} strokeWidth={5} />
    <path d={`M${-w / 2 - 26} -10 h${w + 52} v18 h-${w + 52} Z`} fill={C.coral} stroke={INK} strokeWidth={5} />
    <path d={`M${-w / 2 - 22} 8 q10 ${h * 0.5} 4 ${h * 0.9} h26 q-8 -${h * 0.4} 0 -${h * 0.9} Z`} fill={C.coral} stroke={INK} strokeWidth={5} opacity={0.96} />
    <path d={`M${w / 2 + 22} 8 q-10 ${h * 0.5} -4 ${h * 0.9} h-26 q8 -${h * 0.4} 0 -${h * 0.9} Z`} fill={C.coral} stroke={INK} strokeWidth={5} opacity={0.96} />
  </g>
);

export const Lamp: React.FC<T & { glow?: number }> = ({ glow = 1, ...t }) => (
  <g transform={tf(t)}>
    <circle cx={0} cy={-70} r={120 * glow} fill="rgba(255,226,140,.28)" />
    <path d="M-34 -100 L34 -100 L52 -50 L-52 -50 Z" fill={C.goldBright} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <line x1={0} y1={-50} x2={0} y2={0} stroke={INK} strokeWidth={7} />
    <ellipse cx={0} cy={2} rx={34} ry={9} fill={C.espresso2} stroke={INK} strokeWidth={4} />
  </g>
);

export const Clock: React.FC<T & { time?: number }> = ({ time = 0, ...t }) => (
  <g transform={tf(t)}>
    <circle r={44} fill={C.cream} stroke={INK} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={-35} x2={0} y2={-30} stroke={INK} strokeWidth={3} transform={`rotate(${i * 30})`} />)}
    <line x1={0} y1={0} x2={0} y2={-30} stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${time * 6})`} />
    <line x1={0} y1={0} x2={0} y2={-20} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${time / 2})`} />
  </g>
);

export const Chair: React.FC<T & { color?: string }> = ({ color = C.green, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-70} y={-170} width={150} height={190} rx={34} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={-100} y={-90} width={210} height={90} rx={30} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={-120} y={-120} width={50} height={120} rx={24} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={80} y={-120} width={50} height={120} rx={24} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={-84} y={0} width={20} height={26} rx={6} fill={C.espresso2} stroke={INK} strokeWidth={4} />
    <rect x={92} y={0} width={20} height={26} rx={6} fill={C.espresso2} stroke={INK} strokeWidth={4} />
  </g>
);

export const Table: React.FC<T & { w?: number }> = ({ w = 220, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-w / 2} y={-110} width={w} height={22} rx={8} fill="#9A6A43" stroke={INK} strokeWidth={5} />
    <rect x={-w / 2 + 16} y={-88} width={16} height={92} fill="#7E5434" stroke={INK} strokeWidth={5} />
    <rect x={w / 2 - 32} y={-88} width={16} height={92} fill="#7E5434" stroke={INK} strokeWidth={5} />
  </g>
);

export const Bill: React.FC<T & { label?: string; color?: string }> = ({ label = "", color = C.sage, o = 1, ...t }) => (
  <g transform={tf(t)} opacity={o}>
    <rect x={-60} y={-30} width={120} height={60} rx={8} fill={color} stroke={INK} strokeWidth={4} />
    <rect x={-50} y={-21} width={100} height={42} rx={5} fill="none" stroke={INK} strokeWidth={2} opacity={0.4} />
    <circle r={15} fill="rgba(255,255,255,.4)" stroke={INK} strokeWidth={2.5} />
    <text y={6} textAnchor="middle" fontFamily={M} fontWeight={500} fontSize={label.length > 3 ? 14 : 18} fill={INK}>{label || "₺"}</text>
  </g>
);

export const Wallet: React.FC<T & { open?: boolean }> = ({ open, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-48} y={-32} width={96} height={64} rx={12} fill="#8A5A3A" stroke={INK} strokeWidth={5} />
    <path d={`M-48 -10 h96 v${open ? -6 : 6} h-96 Z`} fill="#6E4529" stroke={INK} strokeWidth={4} />
    <circle cx={30} cy={6} r={8} fill={C.goldBright} stroke={INK} strokeWidth={3} />
    {open ? <rect x={-34} y={-44} width={68} height={16} rx={4} fill={C.sage} stroke={INK} strokeWidth={3} /> : null}
  </g>
);

export const Knife: React.FC<T> = ({ o = 1, ...t }) => (
  <g transform={tf(t)} opacity={o}>
    <path d="M10 -9 H118 Q142 -9 150 6 L10 12 Z" fill="#D5DBE0" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M18 -3 H110" stroke="#fff" strokeWidth={3} opacity={0.7} strokeLinecap="round" />
    <rect x={-34} y={-12} width={46} height={26} rx={9} fill="#6B3E26" stroke={INK} strokeWidth={4.5} />
    <rect x={8} y={-18} width={10} height={38} rx={3} fill={C.goldDeep} stroke={INK} strokeWidth={4} />
  </g>
);

export const Stamp: React.FC<T & { label: string; color?: string; w?: number; fs?: number; p?: number }> = ({ label, color = C.coral, w = 280, fs = 44, p = 1, ...t }) => {
  const k = 2.4 - 1.4 * Math.min(1, p);
  return (
    <g transform={tf({ ...t })} opacity={Math.min(1, p * 3)}>
      <g transform={`scale(${k})`}>
        <rect x={-w / 2} y={-fs * 0.95} width={w} height={fs * 1.9} rx={12} fill="rgba(255,255,255,.5)" stroke={color} strokeWidth={8} />
        <rect x={-w / 2 + 9} y={-fs * 0.95 + 9} width={w - 18} height={fs * 1.9 - 18} rx={7} fill="none" stroke={color} strokeWidth={3} />
        <text y={fs * 0.34} textAnchor="middle" fontFamily={M} fontWeight={500} fontSize={fs} letterSpacing={3} fill={color}>{label}</text>
      </g>
    </g>
  );
};

export const Tag: React.FC<T & { label: string; bg?: string; fg?: string; fs?: number; icon?: string; stroke?: string }> = ({ label, bg = C.espresso, fg = C.cream, fs = 28, icon, stroke = "none", ...t }) => {
  const w = label.length * fs * 0.62 + 44 + (icon ? 34 : 0);
  return (
    <g transform={tf(t)}>
      <rect x={-w / 2} y={-fs * 0.95} width={w} height={fs * 1.9} rx={fs} fill={bg} stroke={stroke === "none" ? INK : stroke} strokeWidth={stroke === "none" ? 0 : 4} />
      <text x={icon ? 14 : 0} y={fs * 0.34} textAnchor="middle" fontFamily={M} fontWeight={500} fontSize={fs} letterSpacing={2} fill={fg}>{label}</text>
      {icon ? <text x={-w / 2 + 28} y={fs * 0.34} textAnchor="middle" fontFamily={M} fontSize={fs} fill={fg}>{icon}</text> : null}
    </g>
  );
};

/** Mutlak sayı etiketi kartı (CEZA ? / 0 YIL gibi, çevrilebilir) */
export const VerdictCard: React.FC<T & { title?: string; value: string; color?: string; w?: number; h?: number; flip?: number; q?: boolean }> = ({ title = "CEZA", value, color = C.ink, w = 300, h = 170, flip = 1, q, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={C.cream} stroke={INK} strokeWidth={6} />
    <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={14} fill="none" stroke={INK} strokeWidth={2} opacity={0.25} />
    <text y={-h / 2 + 46} textAnchor="middle" fontFamily={M} fontWeight={500} fontSize={26} letterSpacing={6} fill={C.muted}>{title}</text>
    <text y={h / 2 - 28} textAnchor="middle" fontFamily={D} fontSize={q ? 96 : value.length > 7 ? 64 : 84} fill={color}>{value}</text>
  </g>
);

export const Handcuffs: React.FC<T & { open?: number }> = ({ open = 0, ...t }) => (
  <g transform={tf(t)}>
    <circle cx={-34 - open * 26} cy={0} r={26} fill="none" stroke="#9AA3AB" strokeWidth={10} />
    <circle cx={-34 - open * 26} cy={0} r={26} fill="none" stroke={INK} strokeWidth={3} />
    <circle cx={34 + open * 26} cy={0} r={26} fill="none" stroke="#9AA3AB" strokeWidth={10} />
    <circle cx={34 + open * 26} cy={0} r={26} fill="none" stroke={INK} strokeWidth={3} />
    <path d={`M${-12 - open * 26} 0 h24`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
  </g>
);

export const Gavel: React.FC<T> = (t) => (
  <g transform={tf(t)}>
    <rect x={-8} y={-10} width={16} height={130} rx={6} fill="#9A6A43" stroke={INK} strokeWidth={5} />
    <rect x={-58} y={-62} width={116} height={56} rx={14} fill="#7E5434" stroke={INK} strokeWidth={5} />
    <rect x={-66} y={-70} width={16} height={72} rx={6} fill={C.goldDeep} stroke={INK} strokeWidth={4} />
    <rect x={50} y={-70} width={16} height={72} rx={6} fill={C.goldDeep} stroke={INK} strokeWidth={4} />
  </g>
);

export const Sweat: React.FC<T> = (t) => (
  <path transform={tf(t)} d="M0 -22 C16 -2 16 14 0 14 C-16 14 -16 -2 0 -22 Z" fill="#BFE5F5" stroke={INK} strokeWidth={3.5} />
);
export const Anger: React.FC<T> = (t) => (
  <g transform={tf(t)} stroke={C.coral} strokeWidth={7} strokeLinecap="round" fill="none">
    <path d="M-16 -4 q10 -10 16 0 M16 -4 q-10 -10 -16 0 M-16 6 q10 10 16 0 M16 6 q-10 10 -16 0" transform="scale(1.1)" />
  </g>
);
export const Zzz: React.FC<T & { p?: number }> = ({ p = 0, ...t }) => (
  <g transform={tf(t)} fontFamily={D} fill={C.muted}>
    {[0, 1, 2].map((i) => {
      const q = (p + i * 0.33) % 1;
      return <text key={i} x={q * 30} y={-q * 70} fontSize={34 + i * 12} opacity={Math.sin(q * Math.PI)}>z</text>;
    })}
  </g>
);

export const Check: React.FC<T & { color?: string }> = ({ color = C.green, ...t }) => (
  <g transform={tf(t)}><circle r={28} fill={color} stroke={INK} strokeWidth={4} /><path d="M-13 1 l9 10 l18 -20" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></g>
);
export const Cross: React.FC<T & { color?: string }> = ({ color = C.coral, ...t }) => (
  <g transform={tf(t)}><circle r={28} fill={color} stroke={INK} strokeWidth={4} /><path d="M-12 -12 l24 24 M12 -12 l-24 24" stroke="#fff" strokeWidth={8} strokeLinecap="round" /></g>
);

export const Sparkle: React.FC<T & { c?: string }> = ({ c = C.goldBright, ...t }) => (
  <path transform={tf(t)} d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26 Z" fill={c} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
);

export const Bars: React.FC<{ x: number; y: number; w: number; h: number; p: number; n?: number }> = ({ x, y, w, h, p, n = 7 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const bx = x + (w / (n - 1)) * i;
      return <rect key={i} x={bx - 9} y={y - h * (1 - p)} width={18} height={h} rx={5} fill="#5B6670" stroke={INK} strokeWidth={4} />;
    })}
    <rect x={x - 18} y={y - h * (1 - p)} width={w + 36} height={18} rx={6} fill="#47515A" stroke={INK} strokeWidth={4} />
    <rect x={x - 18} y={y - h * (1 - p) + h - 18} width={w + 36} height={18} rx={6} fill="#47515A" stroke={INK} strokeWidth={4} />
  </g>
);

export const Toggle: React.FC<T & { on: number; label: string; onText: string; offText: string; onColor?: string; offColor?: string }> = ({ on, label, onText, offText, onColor = C.green, offColor = C.coral, ...t }) => {
  const col = on > 0.5 ? onColor : offColor;
  return (
    <g transform={tf(t)}>
      <rect x={-380} y={-86} width={760} height={172} rx={36} fill={C.cream} stroke={INK} strokeWidth={6} />
      <text x={-340} y={-8} fontFamily={M} fontWeight={500} fontSize={36} letterSpacing={6} fill={C.muted}>{label}</text>
      <text x={-340} y={52} fontFamily={D} fontSize={58} fill={col}>{on > 0.5 ? onText : offText}</text>
      <g transform="translate(250,0)">
        <rect x={-96} y={-48} width={192} height={96} rx={48} fill={col} stroke={INK} strokeWidth={6} />
        <circle cx={-48 + 96 * on} cy={0} r={38} fill={C.cream} stroke={INK} strokeWidth={5} />
      </g>
    </g>
  );
};

export const Polaroid: React.FC<T & { label: string; sub?: string; children?: React.ReactNode; tint?: string }> = ({ label, sub, children, tint = C.tealSoft, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-100} y={-120} width={200} height={250} rx={8} fill="rgba(43,27,18,.16)" transform="translate(8,10)" />
    <rect x={-100} y={-120} width={200} height={250} rx={8} fill={C.cream} stroke={INK} strokeWidth={5} />
    <rect x={-84} y={-104} width={168} height={158} rx={4} fill={tint} stroke={INK} strokeWidth={3} />
    {children}
    <text y={96} textAnchor="middle" fontFamily={M} fontWeight={500} fontSize={26} letterSpacing={3} fill={C.ink}>{label}</text>
    {sub ? <text y={120} textAnchor="middle" fontFamily={M} fontSize={16} letterSpacing={1} fill={C.muted}>{sub}</text> : null}
    <circle cx={0} cy={-124} r={10} fill={C.coral} stroke={INK} strokeWidth={3.5} />
  </g>
);

export const Scissors: React.FC<T & { open?: number }> = ({ open = 0.5, ...t }) => (
  <g transform={tf(t)}>
    <g transform={`rotate(${-8 - open * 18})`}><path d="M0 0 L120 -9 L120 3 Z" fill="#D5DBE0" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><circle cx={-22} cy={10} r={18} fill="none" stroke={C.coral} strokeWidth={9} /><circle cx={-22} cy={10} r={18} fill="none" stroke={INK} strokeWidth={2} /></g>
    <g transform={`rotate(${8 + open * 18})`}><path d="M0 0 L120 9 L120 -3 Z" fill="#D5DBE0" stroke={INK} strokeWidth={4} strokeLinejoin="round" /><circle cx={-22} cy={-10} r={18} fill="none" stroke={C.coral} strokeWidth={9} /><circle cx={-22} cy={-10} r={18} fill="none" stroke={INK} strokeWidth={2} /></g>
    <circle r={7} fill={INK} />
  </g>
);

export const Speech: React.FC<T & { w?: number; h?: number; children?: React.ReactNode; tailX?: number }> = ({ w = 300, h = 150, children, tailX = -60, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill={C.cream} stroke={INK} strokeWidth={6} />
    <path d={`M${tailX - 22} ${h / 2 - 3} L${tailX - 40} ${h / 2 + 40} L${tailX + 16} ${h / 2 - 3}`} fill={C.cream} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d={`M${tailX - 20} ${h / 2 - 4} L${tailX + 12} ${h / 2 - 4}`} stroke={C.cream} strokeWidth={9} />
    {children}
  </g>
);

export const ChairBack: React.FC<T & { color?: string }> = ({ color = C.green, ...t }) => (
  <g transform={tf(t)}><rect x={-80} y={-190} width={170} height={210} rx={40} fill={color} stroke={INK} strokeWidth={6} /></g>
);
export const ChairFront: React.FC<T & { color?: string }> = ({ color = C.green, ...t }) => (
  <g transform={tf(t)}>
    <rect x={-100} y={-92} width={210} height={92} rx={30} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={-124} y={-122} width={54} height={122} rx={26} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={80} y={-122} width={54} height={122} rx={26} fill={color} stroke={INK} strokeWidth={6} />
    <rect x={-96} y={0} width={20} height={26} rx={6} fill={C.espresso2} stroke={INK} strokeWidth={4} />
    <rect x={92} y={0} width={20} height={26} rx={6} fill={C.espresso2} stroke={INK} strokeWidth={4} />
  </g>
);

export { tf };
export const _fonts = { display, displayItalic, text };
