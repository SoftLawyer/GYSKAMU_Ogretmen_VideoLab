import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../tokens";

export const INK = C.ink;
export type Mood = "neutral" | "smile" | "smug" | "shock" | "angry" | "sad" | "grin" | "worry" | "sleep";
export type HairStyle = "short" | "bald" | "gray" | "beanie" | "messy" | "long";

export type HeadProps = {
  skin?: string; hair?: string; hairStyle?: HairStyle; mood?: Mood;
  glasses?: boolean; mustache?: boolean; beanie?: string; blink?: boolean;
};

/** Merkezi (0,0) olan, r=60 yuvarlak kafa. Yüz ifadeleri mood ile. */
export const Head: React.FC<HeadProps> = ({ skin = C.skin, hair = "#2B1B12", hairStyle = "short", mood = "neutral", glasses, mustache, beanie, blink }) => {
  const eyeY = -6, browY = -30, mouthY = 28;
  const closed = mood === "sleep" || blink;
  const shock = mood === "shock";
  const brow = (side: -1 | 1) => {
    const x = side * 24;
    let a = 0, y = browY;
    if (mood === "angry") a = -side * 22; // iç uçlar aşağı
    if (mood === "worry" || mood === "sad") a = side * 16; // iç uçlar yukarı
    if (shock) y -= 10;
    return <line x1={x - 13} y1={y - a * 0.35} x2={x + 13} y2={y + a * 0.35} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
  };
  const eye = (side: -1 | 1) => {
    const x = side * 24;
    if (closed) return <path d={`M${x - 11} ${eyeY} q11 9 22 0`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    if (shock) return (<g><circle cx={x} cy={eyeY} r={14} fill="#fff" stroke={INK} strokeWidth={4} /><circle cx={x} cy={eyeY} r={4.5} fill={INK} /></g>);
    if (mood === "smug") return (<g><ellipse cx={x} cy={eyeY + 2} rx={9} ry={9} fill={INK} /><path d={`M${x - 13} ${eyeY - 4} h26`} stroke={INK} strokeWidth={6} strokeLinecap="round" /></g>);
    return <ellipse cx={x} cy={eyeY} rx={8.5} ry={11} fill={INK} />;
  };
  const mouth = () => {
    switch (mood) {
      case "smile": return <path d={`M-19 ${mouthY - 4} Q0 ${mouthY + 16} 19 ${mouthY - 4}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
      case "smug": return <path d={`M-17 ${mouthY} Q3 ${mouthY + 9} 21 ${mouthY - 10}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
      case "shock": return <ellipse cx={0} cy={mouthY + 4} rx={11} ry={15} fill={INK} />;
      case "angry": return <path d={`M-19 ${mouthY + 8} Q0 ${mouthY - 12} 19 ${mouthY + 8}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
      case "sad": case "worry": return <path d={`M-14 ${mouthY + 7} Q0 ${mouthY - 6} 14 ${mouthY + 7}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
      case "grin": return <path d={`M-24 ${mouthY - 6} Q0 ${mouthY + 22} 24 ${mouthY - 6} Z`} fill="#fff" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />;
      case "sleep": return <ellipse cx={4} cy={mouthY + 3} rx={7} ry={5} fill={INK} opacity={0.85} />;
      default: return <path d={`M-13 ${mouthY} h26`} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    }
  };
  const hairShape = () => {
    if (hairStyle === "bald") return null;
    if (hairStyle === "gray") return (
      <g fill={hair} stroke={INK} strokeWidth={4.5} strokeLinejoin="round">
        <path d="M-60 -6 C-70 -34 -58 -46 -46 -40 C-52 -22 -52 -10 -52 4 Z" />
        <path d="M60 -6 C70 -34 58 -46 46 -40 C52 -22 52 -10 52 4 Z" />
      </g>
    );
    if (hairStyle === "messy") return (
      <path d="M-62 -14 C-72 -62 -30 -78 -6 -66 C10 -82 56 -70 62 -14 C48 -40 30 -44 12 -42 C-6 -36 -38 -40 -62 -14 Z" fill={hair} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    );
    if (hairStyle === "long") return (
      <path d="M-64 20 C-80 -50 -40 -78 0 -74 C44 -78 80 -50 64 20 C60 -10 44 -36 0 -40 C-44 -36 -60 -10 -64 20 Z" fill={hair} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    );
    return <path d="M-62 -12 C-66 -66 66 -66 62 -12 C44 -38 -6 -48 -62 -12 Z" fill={hair} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />;
  };
  return (
    <g>
      <ellipse cx={-60} cy={4} rx={9} ry={13} fill={skin} stroke={INK} strokeWidth={4.5} />
      <ellipse cx={60} cy={4} rx={9} ry={13} fill={skin} stroke={INK} strokeWidth={4.5} />
      <circle r={60} fill={skin} stroke={INK} strokeWidth={5} />
      {hairShape()}
      {beanie ? (
        <g>
          <path d="M-63 -14 C-66 -78 66 -78 63 -14 Z" fill={beanie} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-65} y={-26} width={130} height={22} rx={10} fill={beanie} stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-70} r={9} fill={beanie} stroke={INK} strokeWidth={4} />
        </g>
      ) : null}
      <ellipse cx={-38} cy={20} rx={11} ry={7} fill="rgba(217,72,43,.28)" />
      <ellipse cx={38} cy={20} rx={11} ry={7} fill="rgba(217,72,43,.28)" />
      {eye(-1)}{eye(1)}
      {mood !== "sleep" ? <>{brow(-1)}{brow(1)}</> : null}
      {mustache ? <path d="M-26 20 Q-12 8 0 18 Q12 8 26 20 Q14 32 0 24 Q-14 32 -26 20 Z" fill={hair} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" /> : null}
      {mouth()}
      {glasses ? (
        <g fill="rgba(255,255,255,.28)" stroke={INK} strokeWidth={4.5}>
          <circle cx={-24} cy={eyeY} r={19} /><circle cx={24} cy={eyeY} r={19} /><path d="M-5 -8 h10" fill="none" />
        </g>
      ) : null}
    </g>
  );
};

export type PersonProps = HeadProps & {
  x: number; y: number; s?: number; face?: 1 | -1;
  top?: string; pants?: string; shoes?: string; style?: "hoodie" | "cardigan" | "tee";
  /** [omuz açısı, dirsek açısı]  0=aşağı, 90=ileri, 180=yukarı */
  armF?: [number, number]; armB?: [number, number];
  heldF?: React.ReactNode; heldB?: React.ReactNode;
  bob?: number; rotate?: number; opacity?: number; lean?: number;
  /** ayak hareketi: yürüme salınımı */
  walk?: number;
};

const Arm: React.FC<{ x: number; a: number; b: number; side?: 1 | -1; color: string; skin: string; held?: React.ReactNode }> = ({ x, a, b, side = 1, color, skin, held }) => (
  <g transform={`translate(${x},-236) rotate(${-a * side})`}>
    <line x1={0} y1={0} x2={0} y2={58} stroke={INK} strokeWidth={37} strokeLinecap="round" />
    <line x1={0} y1={0} x2={0} y2={58} stroke={color} strokeWidth={27} strokeLinecap="round" />
    <g transform={`translate(0,58) rotate(${-b * side})`}>
      <line x1={0} y1={0} x2={0} y2={54} stroke={INK} strokeWidth={37} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={54} stroke={color} strokeWidth={27} strokeLinecap="round" />
      <circle cx={0} cy={62} r={17} fill={skin} stroke={INK} strokeWidth={4.5} />
      {held ? <g transform="translate(0,62)">{held}</g> : null}
    </g>
  </g>
);

export const Person: React.FC<PersonProps> = (p) => {
  const f = useCurrentFrame();
  const { x, y, s = 1, face = 1, top = C.teal, pants = "#3C4A5E", shoes = "#2B1B12", style = "hoodie",
    armF = [14, 10], armB = [14, 10], heldF, heldB, bob = 3, rotate = 0, opacity = 1, lean = 0, walk = 0, ...head } = p;
  const skin = head.skin ?? C.skin;
  const by = Math.sin(f / 9) * bob;
  const blink = f % 96 > 92;
  const w = Math.sin(f / 5) * walk;
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${s * face},${s})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={86} ry={13} fill="rgba(43,27,18,.14)" />
      <g transform={`translate(0,${by * 0.4})`}>
        {/* bacaklar */}
        <g stroke={INK} strokeWidth={5} strokeLinejoin="round">
          <rect x={-36 + w} y={-136} width={32} height={118} rx={14} fill={pants} />
          <rect x={4 - w} y={-136} width={32} height={118} rx={14} fill={pants} />
          <path d={`M${-44 + w} -10 q0 -14 18 -14 q22 0 28 14 q0 12 -10 12 h-26 q-10 0 -10 -12 Z`} fill={shoes} />
          <path d={`M${-4 - w} -10 q0 -14 18 -14 q22 0 28 14 q0 12 -10 12 h-26 q-10 0 -10 -12 Z`} fill={shoes} />
        </g>
        <g transform={`translate(${lean},${by}) `}>
          {/* arka / sol kol (dışa doğru açılır, gövde arkasında kaybolmaz) */}
          <Arm x={-56} a={armB[0]} b={armB[1]} side={-1} color={top} skin={skin} held={heldB} />
          {/* gövde */}
          {style === "hoodie" ? <path d="M-66 -236 q66 -38 132 0 l-8 16 q-58 -24 -116 0 Z" fill={C.ink} opacity={0.0} /> : null}
          <rect x={-60} y={-262} width={120} height={140} rx={42} fill={top} stroke={INK} strokeWidth={5} />
          {style === "hoodie" ? (
            <g>
              <path d="M-52 -258 Q0 -224 52 -258" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
              <path d="M-14 -242 v34 M14 -242 v34" stroke={C.cream} strokeWidth={4} strokeLinecap="round" />
              <rect x={-34} y={-168} width={68} height={30} rx={12} fill="rgba(0,0,0,.10)" stroke={INK} strokeWidth={3.5} />
            </g>
          ) : null}
          {style === "cardigan" ? (
            <g>
              <path d="M0 -258 V-122" stroke={INK} strokeWidth={4} />
              {[-228, -196, -164].map((yy) => <circle key={yy} cx={10} cy={yy} r={5} fill={C.cream} stroke={INK} strokeWidth={2.5} />)}
              <path d="M-26 -262 L0 -232 L26 -262" fill={C.cream} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            </g>
          ) : null}
          {/* ön / sağ kol */}
          <Arm x={56} a={armF[0]} b={armF[1]} side={1} color={top} skin={skin} held={heldF} />
          <g transform="translate(0,-318)">
            <Head {...head} skin={skin} blink={blink} />
          </g>
        </g>
      </g>
    </g>
  );
};
