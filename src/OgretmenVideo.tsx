import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import timelineData from "./timeline.json";

const { fontFamily: playfairFamily } = loadPlayfair("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "latin-ext"],
});
const { fontFamily: playfairItalicFamily } = loadPlayfair("italic", {
  weights: ["400", "600"],
  subsets: ["latin", "latin-ext"],
});
const { fontFamily: monoFamily } = loadJetBrains("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

const DOSYA_NO = 1;

const COLORS = {
  bg: "#F3EEE4",
  grid: "rgba(150, 132, 102, 0.11)",
  navyDark: "#102033",
  navy: "#1C3552",
  navySoft: "#2C4C70",
  espresso: "#1C1510",
  goldDark: "#8C6D32",
  gold: "#B6924C",
  goldBright: "#E5C882",
  goldLight: "#D4BE8D",
  creamCard: "#FAF6EE",
  creamDark: "#EAE1D0",
  textMuted: "#6E655A",
  divider: "#DED5C5",
  crimson: "#9E212B",
  forest: "#1F5E3B",
  subActive: "#FAF6EE",
  subMuted: "#B8C4D4",
};

const BEAT_META = [
  { code: "01/07", label: "OKULDA KRİZ / TARTIŞMA ANI" },
  { code: "02/07", label: "YAYGIN YANILGI" },
  { code: "03/07", label: "MEVZUAT KRİTERİ" },
  { code: "04/07", label: "TARAFSIZLIK İLKESİ & DANIŞTAY" },
  { code: "05/07", label: "RESMİ KARAR / İPTAL" },
  { code: "06/07", label: "DOSYA BİLANÇOSU" },
  { code: "07/07", label: "ÖĞRETMENLER NE DİYOR?" },
];

// ============================================================================
// ARTICULATED FULL-BODY EDITORIAL CHARACTER (Teacher / Principal)
// Origin (x, y) is ground contact point between feet. Total height ~245px.
// ============================================================================
const FullBodyCharacter: React.FC<{
  x: number;
  y: number;
  coatColor: string;
  accentColor: string;
  trouserColor?: string;
  gesture?: "none" | "argueRight" | "argueLeft" | "handDocumentRight" | "shock";
  gestureProg?: number;
  scale?: number;
  label?: string;
}> = ({
  x,
  y,
  coatColor,
  accentColor,
  trouserColor = "#162436",
  gesture = "none",
  gestureProg = 1,
  scale = 1,
  label,
}) => {
  const rightArmDeg =
    gesture === "argueRight"
      ? interpolate(gestureProg, [0, 1], [45, -45])
      : gesture === "handDocumentRight"
      ? interpolate(gestureProg, [0, 1], [55, -18])
      : gesture === "shock"
      ? interpolate(gestureProg, [0, 1], [40, -115])
      : 20;

  const leftArmDeg =
    gesture === "argueLeft"
      ? interpolate(gestureProg, [0, 1], [-45, 45])
      : gesture === "shock"
      ? interpolate(gestureProg, [0, 1], [-40, 115])
      : -20;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={2} rx={42} ry={8} fill="rgba(16, 32, 51, 0.14)" />
      <ellipse cx={-15} cy={-3} rx={14} ry={6} fill="#101824" />
      <ellipse cx={15} cy={-3} rx={14} ry={6} fill="#101824" />

      <path
        d="M -22 -100 L -5 -100 L -8 -4 L -21 -4 Z"
        fill={trouserColor}
        stroke={COLORS.navyDark}
        strokeWidth={2.5}
      />
      <path
        d="M 5 -100 L 22 -100 L 21 -4 L 8 -4 Z"
        fill={trouserColor}
        stroke={COLORS.navyDark}
        strokeWidth={2.5}
      />

      <path
        d="M -32 -178 Q 0 -186 32 -178 L 28 -95 L -28 -95 Z"
        fill={coatColor}
        stroke={COLORS.navyDark}
        strokeWidth={2.8}
      />
      <polygon points="-10,-178 10,-178 0,-138" fill={COLORS.creamCard} />
      <polygon points="-4,-176 4,-176 6,-142 0,-132 -6,-142" fill={accentColor} />

      {/* Left Arm */}
      <g transform={`translate(-28, -168) rotate(${leftArmDeg})`}>
        <rect x={-8} y={0} width={16} height={64} rx={8} fill={coatColor} stroke={COLORS.navyDark} strokeWidth={2.4} />
        <circle cx={0} cy={66} r={7} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2} />
      </g>

      {/* Right Arm */}
      <g transform={`translate(28, -168) rotate(${rightArmDeg})`}>
        <rect x={-8} y={0} width={16} height={64} rx={8} fill={coatColor} stroke={COLORS.navyDark} strokeWidth={2.4} />
        <circle cx={0} cy={66} r={7} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2} />
        {gesture === "handDocumentRight" && (
          <g transform="translate(-4, 48) rotate(8)">
            <rect x={0} y={0} width={38} height={48} rx={3} fill={COLORS.creamCard} stroke={COLORS.crimson} strokeWidth={2.6} />
            <line x1={6} y1={12} x2={32} y2={12} stroke={COLORS.navyDark} strokeWidth={2.2} />
            <line x1={6} y1={22} x2={28} y2={22} stroke={COLORS.navyDark} strokeWidth={2.2} />
            <circle cx={26} cy={36} r={6} fill={COLORS.crimson} />
          </g>
        )}
      </g>

      {/* Head */}
      <circle cx={0} cy={-204} r={22} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2.5} />
      <path d="M -22 -206 Q -20 -230 0 -230 Q 20 -230 22 -206 Q 10 -216 -22 -206 Z" fill={COLORS.navyDark} />
      <rect x={-13} y={-208} width={11} height={7} rx={2} fill="none" stroke={COLORS.navyDark} strokeWidth={2} />
      <rect x={2} y={-208} width={11} height={7} rx={2} fill="none" stroke={COLORS.navyDark} strokeWidth={2} />
      <line x1={-2} y1={-204} x2={2} y2={-204} stroke={COLORS.navyDark} strokeWidth={2} />

      {label && (
        <g transform="translate(0, 28)">
          <rect x={-76} y={-15} width={152} height={28} rx={6} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={1.6} />
          <text x={0} y={4} textAnchor="middle" fill={COLORS.goldBright} fontFamily={monoFamily} fontSize={13} fontWeight={700} letterSpacing="1.2">
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// ============================================================================
// LUXURY BALANCE SCALE (Tarafsızlık & Danıştay Terazisi)
// ============================================================================
const LuxuryBalanceScale: React.FC<{
  tiltDeg: number;
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
}> = ({
  tiltDeg,
  leftLabel,
  rightLabel,
  leftColor = COLORS.crimson,
  rightColor = COLORS.forest,
}) => {
  return (
    <svg width={760} height={340} viewBox="0 0 760 340">
      <rect x={305} y={292} width={150} height={24} rx={6} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={2} />
      <rect x={368} y={66} width={24} height={230} rx={4} fill={COLORS.goldDark} />
      <circle cx={380} cy={66} r={16} fill={COLORS.goldBright} stroke={COLORS.navyDark} strokeWidth={3} />

      <g transform={`translate(380, 66) rotate(${tiltDeg})`}>
        <rect x={-230} y={-7} width={460} height={14} rx={7} fill={COLORS.gold} stroke={COLORS.navyDark} strokeWidth={2.5} />
        <g transform={`translate(-210, 0) rotate(${-tiltDeg})`}>
          <line x1={0} y1={0} x2={-48} y2={108} stroke={COLORS.goldDark} strokeWidth={3} />
          <line x1={0} y1={0} x2={48} y2={108} stroke={COLORS.goldDark} strokeWidth={3} />
          <path d="M -72 108 Q 0 148 72 108 Z" fill={leftColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
          <rect x={-105} y={136} width={210} height={42} rx={8} fill={COLORS.creamCard} stroke={leftColor} strokeWidth={2.5} />
          <text x={0} y={163} textAnchor="middle" fill={leftColor} fontFamily={monoFamily} fontSize={17} fontWeight={700}>
            {leftLabel}
          </text>
        </g>

        <g transform={`translate(210, 0) rotate(${-tiltDeg})`}>
          <line x1={0} y1={0} x2={-48} y2={108} stroke={COLORS.goldDark} strokeWidth={3} />
          <line x1={0} y1={0} x2={48} y2={108} stroke={COLORS.goldDark} strokeWidth={3} />
          <path d="M -72 108 Q 0 148 72 108 Z" fill={rightColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
          <rect x={-105} y={136} width={210} height={42} rx={8} fill={COLORS.creamCard} stroke={rightColor} strokeWidth={2.5} />
          <text x={0} y={163} textAnchor="middle" fill={rightColor} fontFamily={monoFamily} fontSize={17} fontWeight={700}>
            {rightLabel}
          </text>
        </g>
      </g>
    </svg>
  );
};

// ============================================================================
// OFFICIAL STAMP
// ============================================================================
const OfficialStamp: React.FC<{
  text: string;
  color: string;
  progress: number;
  rotateDeg?: number;
}> = ({ text, color, progress, rotateDeg = -8 }) => {
  const scale = interpolate(progress, [0, 1], [1.85, 1]);
  const opacity = interpolate(progress, [0, 0.35, 1], [0, 1, 1]);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "14px 32px",
        border: `6px solid ${color}`,
        borderRadius: 12,
        color,
        fontFamily: monoFamily,
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: 3.5,
        textTransform: "uppercase",
        transform: `rotate(${rotateDeg}deg) scale(${scale})`,
        opacity,
        backgroundColor: "rgba(250, 246, 238, 0.95)",
        boxShadow: "0 12px 28px rgba(16, 32, 51, 0.16)",
      }}
    >
      {text}
    </div>
  );
};

// ============================================================================
// MAIN VIDEO COMPOSITION — DOSYA NO: 1
// ============================================================================
export const OgretmenVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const totalDur = timelineData.totalDuration || 49.0;
  const overallPct = Math.min(100, Math.round((t / totalDur) * 100));

  let activeBeat = 0;
  for (let i = 0; i < timelineData.beats.length; i++) {
    const b = timelineData.beats[i];
    if (t >= b.start && t <= b.end) {
      activeBeat = i;
      break;
    }
    if (t > b.end) activeBeat = i;
  }

  const beatStart = timelineData.beats[activeBeat]?.start ?? 0;
  const beatLocalFrame = Math.max(0, Math.round((t - beatStart) * fps));
  const beatEnter = spring({
    frame: beatLocalFrame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // Active subtitle sub-chunk
  let activeChunk: { words: string[]; highlight: number[] } | null = null;
  for (const seg of timelineData.segments) {
    for (const ch of seg.sub_chunks) {
      if (t >= ch.start && t <= ch.end + 0.08) {
        activeChunk = ch;
        break;
      }
    }
    if (activeChunk) break;
  }

  // Beat 0 camera shake on argument & tutanak slam
  const b0s1End = timelineData.segments.find((s) => s.id === "b0_s1")?.end ?? 5.5;
  const b0s2Start = timelineData.segments.find((s) => s.id === "b0_s2")?.start ?? 5.8;
  const slamShake =
    activeBeat === 0 && t > b0s1End - 0.2 && t < b0s1End + 0.25
      ? Math.sin(frame * 2.8) * 7
      : 0;

  // Argument spark oscillation in Beat 0
  const arguePhase = Math.min(1, beatLocalFrame / 30);
  const sparkPulse = 0.75 + 0.25 * Math.sin(frame * 0.45);
  const handedDoc = t >= b0s1End - 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        fontFamily: playfairFamily,
        color: COLORS.navyDark,
        transform: `translateX(${slamShake}px)`,
      }}
    >
      <Audio src={staticFile("audio/master_audio.mp3")} />

      {/* TOP LETTERHEAD */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 58,
          right: 58,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${COLORS.gold}`,
          paddingBottom: 18,
        }}
      >
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 3,
            color: COLORS.navyDark,
          }}
        >
          <span style={{ color: COLORS.goldDark }}>♦</span> DOSYA NO: {DOSYA_NO}
        </div>
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.goldDark,
            letterSpacing: 1.5,
          }}
        >
          @gyskamu
        </div>
      </div>

      {/* LUXURY PROGRESS PANEL */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 58,
          right: 58,
          backgroundColor: COLORS.navyDark,
          border: `2.5px solid ${COLORS.gold}`,
          borderRadius: 16,
          padding: "20px 28px",
          boxShadow: "0 14px 34px rgba(16, 32, 51, 0.22)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: monoFamily, fontSize: 20, fontWeight: 700, color: COLORS.goldBright, letterSpacing: 1.8 }}>
            BÖLÜM {BEAT_META[activeBeat].code} · {BEAT_META[activeBeat].label}
          </div>
          <div style={{ fontFamily: monoFamily, fontSize: 19, fontWeight: 700, color: COLORS.creamCard, letterSpacing: 1.5 }}>
            %{overallPct} TAMAMLANDI
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {BEAT_META.map((_, idx) => {
            const isPast = idx < activeBeat;
            const isCurr = idx === activeBeat;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: 10,
                  borderRadius: 6,
                  backgroundColor: isPast
                    ? COLORS.gold
                    : isCurr
                    ? COLORS.goldBright
                    : "rgba(229, 200, 130, 0.2)",
                  boxShadow: isCurr ? "0 0 12px rgba(229, 200, 130, 0.7)" : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* MAIN STAGE */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 58,
          right: 58,
          bottom: 340,
          backgroundColor: COLORS.creamCard,
          border: `2.5px solid ${COLORS.divider}`,
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 44,
          boxShadow: "0 20px 50px rgba(16, 32, 51, 0.10)",
          opacity: interpolate(beatEnter, [0, 1], [0.25, 1]),
          transform: `translateY(${interpolate(beatEnter, [0, 1], [16, 0])}px)`,
        }}
      >
        {/* BEAT 0: ACTION SCENE — Öğretmenler Odasında Tartışma + Tutanak + Kınama Cezası */}
        {activeBeat === 0 && (
          <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: monoFamily, fontSize: 21, color: COLORS.crimson, fontWeight: 700, letterSpacing: 3 }}>
                OKULDA TARTIŞMA · HEMEN CEZA
              </div>
              <div style={{ fontSize: 50, fontWeight: 700, color: COLORS.navyDark, marginTop: 10, lineHeight: 1.15 }}>
                Tartıştığı Öğretmene Kendi Cezayı Kesti!
              </div>
            </div>

            <svg width={860} height={580} viewBox="0 0 860 580">
              {/* School Board / Wall */}
              <rect x={60} y={14} width={740} height={175} rx={12} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={4} />
              <text x={430} y={80} textAnchor="middle" fill={COLORS.goldBright} fontFamily={monoFamily} fontSize={25} fontWeight={700} letterSpacing={3}>
                OLAY TESPİT TUTANAĞI
              </text>
              <text x={430} y={130} textAnchor="middle" fill={COLORS.creamCard} fontFamily={playfairItalicFamily} fontSize={29}>
                Tutanak: Okul Müdürü · Ceza: Kınama Cezası
              </text>

              {/* Conflict Lightning / Tension Sparks between them */}
              {!handedDoc && (
                <g transform={`translate(430, 290) scale(${sparkPulse})`}>
                  <polygon points="-14,-44 10,-8 -4,-8 18,40 -14,4 2,4" fill={COLORS.crimson} stroke={COLORS.goldBright} strokeWidth={2.5} />
                  <circle cx={0} cy={0} r={46} fill="none" stroke={COLORS.crimson} strokeWidth={2.5} strokeDasharray="8 6" opacity={0.65} />
                </g>
              )}

              {/* Floor Line */}
              <line x1={40} y1={500} x2={820} y2={500} stroke={COLORS.divider} strokeWidth={4} />

              {/* Principal */}
              <FullBodyCharacter
                x={245}
                y={500}
                coatColor={COLORS.navyDark}
                accentColor={COLORS.crimson}
                gesture={handedDoc ? "handDocumentRight" : "argueRight"}
                gestureProg={arguePhase}
                scale={1.12}
                label="OKUL MÜDÜRÜ"
              />

              {/* Desk */}
              <rect x={368} y={400} width={124} height={100} rx={6} fill={COLORS.goldDark} stroke={COLORS.navyDark} strokeWidth={3} />
              <rect x={354} y={388} width={152} height={18} rx={4} fill={COLORS.gold} stroke={COLORS.navyDark} strokeWidth={2.5} />

              {/* Teacher */}
              <FullBodyCharacter
                x={615}
                y={500}
                coatColor={COLORS.navySoft}
                accentColor={COLORS.gold}
                gesture={handedDoc ? "shock" : "argueLeft"}
                gestureProg={arguePhase}
                scale={1.12}
                label="ÖĞRETMEN"
              />
            </svg>

            <div style={{ minHeight: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {t >= b0s2Start + 0.3 && (
                <OfficialStamp
                  text="KINAMA CEZASI · GEÇERLİ Mİ?"
                  color={COLORS.crimson}
                  progress={spring({
                    frame: Math.max(0, Math.round((t - (b0s2Start + 0.3)) * fps)),
                    fps,
                    config: { damping: 12 },
                  })}
                  rotateDeg={-4}
                />
              )}
            </div>
          </div>
        )}

        {/* BEAT 1: YAYGIN YANILGI */}
        {activeBeat === 1 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div
              style={{
                backgroundColor: COLORS.crimson,
                color: COLORS.creamCard,
                fontFamily: monoFamily,
                fontSize: 24,
                fontWeight: 700,
                padding: "10px 26px",
                borderRadius: 8,
                letterSpacing: 2.5,
              }}
            >
              İLK AKLA GELEN YANILGI
            </div>
            <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.2, maxWidth: 820 }}>
              “Okul müdürü disiplin amiridir, istediği gibi ceza kesebilir!”
            </div>
            <OfficialStamp
              text="HER ZAMAN DEĞİL"
              color={COLORS.crimson}
              progress={spring({ frame: Math.max(0, beatLocalFrame - 14), fps, config: { damping: 11 } })}
            />
            <div
              style={{
                marginTop: 14,
                padding: "18px 34px",
                borderRadius: 999,
                border: `3px solid ${COLORS.gold}`,
                backgroundColor: COLORS.navyDark,
                color: COLORS.goldBright,
                fontFamily: monoFamily,
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              ? İDARE HUKUKU NE DİYOR ?
            </div>
          </div>
        )}

        {/* BEAT 2: MEVZUAT KRİTERİ */}
        {activeBeat === 2 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 22, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 3 }}>
              YETKİ vs. TARAF OLMA ÇELİŞKİSİ
            </div>
            <div style={{ display: "flex", gap: 26, width: "100%", justifyContent: "center" }}>
              <div style={{ flex: 1, backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.navyDark}`, borderRadius: 18, padding: 30 }}>
                <div style={{ fontFamily: monoFamily, fontSize: 23, fontWeight: 700, color: COLORS.navyDark }}>657 DMK m. 126</div>
                <div style={{ fontSize: 31, fontWeight: 600, marginTop: 14, lineHeight: 1.3 }}>
                  Normal şartlarda okul müdürü uyarma ve kınama amiridir.
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.crimson}`, borderRadius: 18, padding: 30 }}>
                <div style={{ fontFamily: monoFamily, fontSize: 23, fontWeight: 700, color: COLORS.crimson }}>AMA BU OLAYDA</div>
                <div style={{ fontSize: 31, fontWeight: 600, marginTop: 14, lineHeight: 1.3 }}>
                  Müdür tartışmanın bizzat tarafı, mağduru ve şikâyetçisidir!
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: COLORS.navyDark, color: COLORS.goldBright, padding: "16px 34px", borderRadius: 12, fontFamily: monoFamily, fontSize: 23, fontWeight: 700 }}>
              HEM ŞİKÂYETÇİ HEM CEZALANDIRICI OLUNAMAZ
            </div>
          </div>
        )}

        {/* BEAT 3: TARAFSIZLIK İLKESİ & DANIŞTAY TERAZİSİ */}
        {activeBeat === 3 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 20, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 2.5 }}>
              NEMO IUDEX IN CAUSA SUA · DANIŞTAY İÇTİHADI
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.navyDark, lineHeight: 1.15 }}>
              “Kimse Kendi Davasının Hâkimi Olamaz!”
            </div>
            <LuxuryBalanceScale
              tiltDeg={interpolate(beatEnter, [0, 1], [-12, 11])}
              leftLabel="TARAF MÜDÜR"
              rightLabel="TARAFSIZLIK İLKESİ"
            />
            <OfficialStamp
              text="TARAFSIZLIK İHLALİ"
              color={COLORS.crimson}
              progress={spring({ frame: Math.max(0, beatLocalFrame - 45), fps, config: { damping: 12 } })}
            />
          </div>
        )}

        {/* BEAT 4: RESMİ KARAR / İPTAL */}
        {activeBeat === 4 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 23, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 3 }}>
              DOĞRU USUL & İDARE MAHKEMESİ KARARI
            </div>
            <div
              style={{
                fontSize: 42,
                color: COLORS.textMuted,
                textDecoration: "line-through",
                textDecorationColor: COLORS.crimson,
                textDecorationThickness: 6,
              }}
            >
              “Tartıştığı Müdürün Kestiği Kınama Cezası”
            </div>
            <div
              style={{
                backgroundColor: COLORS.navyDark,
                border: `3px solid ${COLORS.gold}`,
                borderRadius: 20,
                padding: "34px 44px",
                color: COLORS.creamCard,
                boxShadow: "0 18px 40px rgba(16, 32, 51, 0.25)",
                maxWidth: 840,
              }}
            >
              <div style={{ fontFamily: monoFamily, fontSize: 23, color: COLORS.goldBright, letterSpacing: 2 }}>
                YETKİLİ MERCİ: ÜST AMİR / TARAFSIZ MUHAKKİK
              </div>
              <div style={{ fontSize: 46, fontWeight: 700, marginTop: 12, lineHeight: 1.18 }}>
                CEZA, İDARE MAHKEMESİNDE İPTAL EDİLİR
              </div>
              <div style={{ fontFamily: monoFamily, fontSize: 21, color: COLORS.goldLight, marginTop: 14 }}>
                7 Gün İtiraz (657 m. 135) · 60 Gün İptal Davası (İYUK m. 7)
              </div>
            </div>
          </div>
        )}

        {/* BEAT 5: DOSYA BİLANÇOSU */}
        {activeBeat === 5 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 24, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 3 }}>
              DOSYA BİLANÇOSU
            </div>
            <div style={{ display: "flex", gap: 28, width: "100%" }}>
              <div style={{ flex: 1, backgroundColor: COLORS.navyDark, color: COLORS.creamCard, borderRadius: 20, padding: "40px 24px", border: `3px solid ${COLORS.gold}` }}>
                <div style={{ fontFamily: monoFamily, fontSize: 78, fontWeight: 700, color: COLORS.goldBright }}>1</div>
                <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>TUTANAK & İMZA</div>
              </div>
              <div style={{ flex: 1, backgroundColor: COLORS.crimson, color: COLORS.creamCard, borderRadius: 20, padding: "40px 24px", border: `3px solid ${COLORS.navyDark}` }}>
                <div style={{ fontFamily: monoFamily, fontSize: 78, fontWeight: 700, color: COLORS.creamCard }}>0</div>
                <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>GEÇERLİ CEZA</div>
              </div>
            </div>
            <div style={{ fontSize: 34, fontStyle: "italic", fontFamily: playfairItalicFamily, color: COLORS.navy }}>
              “Tarafsızlık olmadan disiplin adaleti olmaz.”
            </div>
          </div>
        )}

        {/* BEAT 6: ÖĞRETMENLER NE DİYOR? & CTA */}
        {activeBeat === 6 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ fontSize: 50, fontWeight: 700, color: COLORS.navyDark, lineHeight: 1.2 }}>
              Senin veya bir meslektaşının başına böyle bir olay geldi mi?
            </div>
            <div
              style={{
                backgroundColor: COLORS.bg,
                border: `2.5px solid ${COLORS.gold}`,
                borderRadius: 16,
                padding: "20px 36px",
                fontFamily: monoFamily,
                fontSize: 26,
                fontWeight: 700,
                color: COLORS.navyDark,
              }}
            >
              💬 Deneyimini Yorumlara Yaz
            </div>
            <div
              style={{
                marginTop: 14,
                backgroundColor: COLORS.navyDark,
                border: `3px solid ${COLORS.goldBright}`,
                borderRadius: 20,
                padding: "28px 46px",
                color: COLORS.creamCard,
                boxShadow: "0 18px 40px rgba(16, 32, 51, 0.25)",
              }}
            >
              <div style={{ fontFamily: monoFamily, fontSize: 30, fontWeight: 700, color: COLORS.goldBright, letterSpacing: 2 }}>
                + TAKİP ET · @gyskamu
              </div>
              <div style={{ fontSize: 26, marginTop: 8, color: COLORS.creamCard }}>
                EKYS & Öğretmen Hakları Dosyaları
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC WORD-SYNCED SUBTITLE BAR */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 58,
          right: 58,
          minHeight: 170,
          backgroundColor: COLORS.navyDark,
          border: `2.5px solid ${COLORS.gold}`,
          borderRadius: 20,
          padding: "26px 34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(16, 32, 51, 0.28)",
        }}
      >
        {activeChunk ? (
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.28, letterSpacing: 0.3 }}>
            {activeChunk.words.map((w, i) => {
              const isHi = activeChunk!.highlight.includes(i);
              return (
                <span
                  key={i}
                  style={{
                    color: isHi ? COLORS.goldBright : COLORS.subActive,
                    marginRight: 12,
                    display: "inline-block",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ) : (
          <div style={{ fontFamily: monoFamily, fontSize: 22, color: COLORS.subMuted, letterSpacing: 2 }}>
            GYSKAMU · ÖĞRETMEN DOSYASI
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
