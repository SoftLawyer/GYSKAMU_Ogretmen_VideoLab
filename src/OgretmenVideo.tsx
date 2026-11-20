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
  { code: "01/07", label: "OKULDA KRİZ / OLAY ANI" },
  { code: "02/07", label: "YAYGIN YANILGI" },
  { code: "03/07", label: "MEVZUAT KRİTERİ" },
  { code: "04/07", label: "HUKUKİ DAYANAK & TERAZİ" },
  { code: "05/07", label: "RESMİ KARAR / SONUÇ" },
  { code: "06/07", label: "ÖĞRETMEN BİLANÇOSU" },
  { code: "07/07", label: "ÖĞRETMENLER NE DİYOR?" },
];

// ============================================================================
// ARTICULATED FULL-BODY EDITORIAL CHARACTER (Teacher / Principal / Inspector)
// Origin (x, y) is ground contact point between feet. Total height ~245px.
// ============================================================================
const FullBodyCharacter: React.FC<{
  x: number;
  y: number;
  coatColor: string;
  accentColor: string;
  trouserColor?: string;
  gesture?: "none" | "handDocumentRight" | "handDocumentLeft" | "pointRight" | "shock" | "shield";
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
    gesture === "handDocumentRight" || gesture === "pointRight"
      ? interpolate(gestureProg, [0, 1], [55, -10])
      : gesture === "shock"
      ? interpolate(gestureProg, [0, 1], [40, -110])
      : 22;

  const leftArmDeg =
    gesture === "handDocumentLeft"
      ? interpolate(gestureProg, [0, 1], [-55, 10])
      : gesture === "shock"
      ? interpolate(gestureProg, [0, 1], [-40, 110])
      : gesture === "shield"
      ? interpolate(gestureProg, [0, 1], [-25, 45])
      : -22;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Shadow */}
      <ellipse cx={0} cy={2} rx={42} ry={8} fill="rgba(16, 32, 51, 0.14)" />

      {/* Shoes */}
      <ellipse cx={-15} cy={-3} rx={14} ry={6} fill="#101824" />
      <ellipse cx={15} cy={-3} rx={14} ry={6} fill="#101824" />

      {/* Trousers */}
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

      {/* Tailored Coat / Blazer */}
      <path
        d="M -32 -178 Q 0 -186 32 -178 L 28 -95 L -28 -95 Z"
        fill={coatColor}
        stroke={COLORS.navyDark}
        strokeWidth={2.8}
      />
      {/* Shirt V-neck & Tie/Scarf */}
      <polygon points="-10,-178 10,-178 0,-138" fill={COLORS.creamCard} />
      <polygon points="-4,-176 4,-176 6,-142 0,-132 -6,-142" fill={accentColor} />

      {/* Left Arm */}
      <g transform={`translate(-28, -168) rotate(${leftArmDeg})`}>
        <rect
          x={-8}
          y={0}
          width={16}
          height={64}
          rx={8}
          fill={coatColor}
          stroke={COLORS.navyDark}
          strokeWidth={2.4}
        />
        <circle cx={0} cy={66} r={7} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2} />
        {gesture === "handDocumentLeft" && (
          <g transform="translate(-30, 48) rotate(-8)">
            <rect
              x={0}
              y={0}
              width={34}
              height={44}
              rx={3}
              fill={COLORS.creamCard}
              stroke={COLORS.crimson}
              strokeWidth={2.5}
            />
            <line x1={6} y1={12} x2={28} y2={12} stroke={COLORS.navyDark} strokeWidth={2} />
            <line x1={6} y1={21} x2={24} y2={21} stroke={COLORS.navyDark} strokeWidth={2} />
            <circle cx={22} cy={33} r={5} fill={COLORS.crimson} />
          </g>
        )}
      </g>

      {/* Right Arm */}
      <g transform={`translate(28, -168) rotate(${rightArmDeg})`}>
        <rect
          x={-8}
          y={0}
          width={16}
          height={64}
          rx={8}
          fill={coatColor}
          stroke={COLORS.navyDark}
          strokeWidth={2.4}
        />
        <circle cx={0} cy={66} r={7} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2} />
        {gesture === "handDocumentRight" && (
          <g transform="translate(-4, 48) rotate(8)">
            <rect
              x={0}
              y={0}
              width={36}
              height={46}
              rx={3}
              fill={COLORS.creamCard}
              stroke={COLORS.crimson}
              strokeWidth={2.5}
            />
            <line x1={6} y1={12} x2={30} y2={12} stroke={COLORS.navyDark} strokeWidth={2} />
            <line x1={6} y1={22} x2={26} y2={22} stroke={COLORS.navyDark} strokeWidth={2} />
            <circle cx={24} cy={35} r={5} fill={COLORS.crimson} />
          </g>
        )}
      </g>

      {/* Head */}
      <circle cx={0} cy={-204} r={22} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2.5} />
      {/* Editorial Hair Cap */}
      <path
        d="M -22 -206 Q -20 -230 0 -230 Q 20 -230 22 -206 Q 10 -216 -22 -206 Z"
        fill={COLORS.navyDark}
      />
      {/* Glasses Accent */}
      <rect x={-13} y={-208} width={11} height={7} rx={2} fill="none" stroke={COLORS.navyDark} strokeWidth={2} />
      <rect x={2} y={-208} width={11} height={7} rx={2} fill="none" stroke={COLORS.navyDark} strokeWidth={2} />
      <line x1={-2} y1={-204} x2={2} y2={-204} stroke={COLORS.navyDark} strokeWidth={2} />

      {/* Role Pill */}
      {label && (
        <g transform="translate(0, 28)">
          <rect
            x={-68}
            y={-15}
            width={136}
            height={28}
            rx={6}
            fill={COLORS.navyDark}
            stroke={COLORS.gold}
            strokeWidth={1.6}
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fill={COLORS.goldBright}
            fontFamily={monoFamily}
            fontSize={13}
            fontWeight={700}
            letterSpacing="1.2"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// ============================================================================
// LUXURY BALANCE SCALE (Mevzuat & Adalet Terazisi)
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
    <svg width={760} height={360} viewBox="0 0 760 360">
      {/* Base Pedestal */}
      <rect x={305} y={310} width={150} height={24} rx={6} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={2} />
      <rect x={368} y={76} width={24} height={238} rx={4} fill={COLORS.goldDark} />
      <circle cx={380} cy={76} r={16} fill={COLORS.goldBright} stroke={COLORS.navyDark} strokeWidth={3} />

      {/* Beam */}
      <g transform={`translate(380, 76) rotate(${tiltDeg})`}>
        <rect x={-230} y={-7} width={460} height={14} rx={7} fill={COLORS.gold} stroke={COLORS.navyDark} strokeWidth={2.5} />
        {/* Left Pan */}
        <g transform={`translate(-210, 0) rotate(${-tiltDeg})`}>
          <line x1={0} y1={0} x2={-48} y2={115} stroke={COLORS.goldDark} strokeWidth={3} />
          <line x1={0} y1={0} x2={48} y2={115} stroke={COLORS.goldDark} strokeWidth={3} />
          <path d="M -72 115 Q 0 155 72 115 Z" fill={leftColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
          <rect x={-96} y={145} width={192} height={42} rx={8} fill={COLORS.creamCard} stroke={leftColor} strokeWidth={2.5} />
          <text
            x={0}
            y={172}
            textAnchor="middle"
            fill={leftColor}
            fontFamily={monoFamily}
            fontSize={18}
            fontWeight={700}
          >
            {leftLabel}
          </text>
        </g>

        {/* Right Pan */}
        <g transform={`translate(210, 0) rotate(${-tiltDeg})`}>
          <line x1={0} y1={0} x2={-48} y2={115} stroke={COLORS.goldDark} strokeWidth={3} />
          <line x1={0} y1={0} x2={48} y2={115} stroke={COLORS.goldDark} strokeWidth={3} />
          <path d="M -72 115 Q 0 155 72 115 Z" fill={rightColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
          <rect x={-96} y={145} width={192} height={42} rx={8} fill={COLORS.creamCard} stroke={rightColor} strokeWidth={2.5} />
          <text
            x={0}
            y={172}
            textAnchor="middle"
            fill={rightColor}
            fontFamily={monoFamily}
            fontSize={18}
            fontWeight={700}
          >
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
}> = ({ text, color, progress, rotateDeg = -9 }) => {
  const scale = interpolate(progress, [0, 1], [1.9, 1]);
  const opacity = interpolate(progress, [0, 0.35, 1], [0, 1, 1]);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "14px 34px",
        border: `6px solid ${color}`,
        borderRadius: 12,
        color,
        fontFamily: monoFamily,
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: 4,
        textTransform: "uppercase",
        transform: `rotate(${rotateDeg}deg) scale(${scale})`,
        opacity,
        backgroundColor: "rgba(250, 246, 238, 0.92)",
        boxShadow: "0 12px 28px rgba(16, 32, 51, 0.14)",
      }}
    >
      {text}
    </div>
  );
};

// ============================================================================
// MAIN VIDEO COMPOSITION
// ============================================================================
export const OgretmenVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const totalDur = timelineData.totalDuration || 49.5;
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

  // Beat 0 camera shake on folder slam
  const slamShake =
    activeBeat === 0 && t > 2.2 && t < 2.65
      ? Math.sin(frame * 2.6) * 7 * (1 - (t - 2.2) / 0.45)
      : 0;

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
      {/* Master Audio (generated via generate_charon_v2.py) */}
      <Audio src={staticFile("audio/master_audio.mp3")} />

      {/* ====================================================================
          TOP LETTERHEAD (♦ DOSYA NO: X  |  @gyskamu)
         ==================================================================== */}
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

      {/* ====================================================================
          LUXURY PROGRESS PANEL (Deep Navy-Espresso + Gold Capsules)
         ==================================================================== */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 21,
              fontWeight: 700,
              color: COLORS.goldBright,
              letterSpacing: 2,
            }}
          >
            BÖLÜM {BEAT_META[activeBeat].code} · {BEAT_META[activeBeat].label}
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.creamCard,
              letterSpacing: 1.5,
            }}
          >
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

      {/* ====================================================================
          MAIN STAGE (7-Beat Animated Editorial Canvas)
         ==================================================================== */}
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
          transform: `translateY(${interpolate(beatEnter, [0, 1], [18, 0])}px)`,
        }}
      >
        {/* BEAT 0: ACTION SCENE — Okulda Kriz / Tutanak & Savunma Anı */}
        {activeBeat === 0 && (
          <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: monoFamily, fontSize: 20, color: COLORS.crimson, fontWeight: 700, letterSpacing: 3 }}>
                OKUL MÜDÜRLÜĞÜ · ANLIK TUTANAK
              </div>
              <div style={{ fontSize: 50, fontWeight: 700, color: COLORS.navyDark, marginTop: 8, lineHeight: 1.15 }}>
                “Yarın Sabaha Kadar Savunmanı Getir!”
              </div>
            </div>

            <svg width={860} height={540} viewBox="0 0 860 540">
              {/* Classroom / Office Chalkboard & Wall */}
              <rect x={70} y={24} width={720} height={190} rx={12} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={4} />
              <text x={430} y={96} textAnchor="middle" fill={COLORS.goldBright} fontFamily={monoFamily} fontSize={26} fontWeight={700} letterSpacing={3}>
                DİSİPLİN TUTANAĞI
              </text>
              <text x={430} y={145} textAnchor="middle" fill={COLORS.creamCard} fontFamily={playfairItalicFamily} fontSize={30}>
                Süre: Sadece 24 Saat · Sonuç: Uyarma Cezası
              </text>

              {/* Floor Line */}
              <line x1={40} y1={450} x2={820} y2={450} stroke={COLORS.divider} strokeWidth={4} />

              {/* Principal handing document */}
              <FullBodyCharacter
                x={250}
                y={450}
                coatColor={COLORS.navyDark}
                accentColor={COLORS.crimson}
                gesture="handDocumentRight"
                gestureProg={Math.min(1, beatLocalFrame / 35)}
                scale={1.08}
                label="OKUL MÜDÜRÜ"
              />

              {/* Desk in between */}
              <rect x={365} y={348} width={130} height={102} rx={6} fill={COLORS.goldDark} stroke={COLORS.navyDark} strokeWidth={3} />
              <rect x={352} y={336} width={156} height={18} rx={4} fill={COLORS.gold} stroke={COLORS.navyDark} strokeWidth={2.5} />

              {/* Teacher reacting */}
              <FullBodyCharacter
                x={615}
                y={450}
                coatColor={COLORS.navySoft}
                accentColor={COLORS.gold}
                gesture={t > 3.0 ? "shock" : "none"}
                gestureProg={Math.min(1, Math.max(0, (t - 3.0) * 2.2))}
                scale={1.08}
                label="ÖĞRETMEN"
              />
            </svg>

            {t > 5.8 && (
              <div style={{ position: "absolute", bottom: 30 }}>
                <OfficialStamp
                  text="UYARMA CEZASI · GEÇERLİ Mİ?"
                  color={COLORS.crimson}
                  progress={spring({ frame: Math.max(0, Math.round((t - 5.8) * fps)), fps, config: { damping: 12 } })}
                />
              </div>
            )}
          </div>
        )}

        {/* BEAT 1: YAYGIN YANILGI */}
        {activeBeat === 1 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
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
              ÇOĞU ÖĞRETMEN BUNU SANIYOR
            </div>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.2, maxWidth: 820 }}>
              “Müdür tutanağı yazdıysa artık yapacak bir şey yok!”
            </div>
            <OfficialStamp
              text="YANLIŞ BİLGİ"
              color={COLORS.crimson}
              progress={spring({ frame: Math.max(0, beatLocalFrame - 12), fps, config: { damping: 11 } })}
            />
            <div
              style={{
                marginTop: 18,
                padding: "18px 34px",
                borderRadius: 999,
                border: `3px solid ${COLORS.gold}`,
                backgroundColor: COLORS.navyDark,
                color: COLORS.goldBright,
                fontFamily: monoFamily,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              ? MEVZUAT NE DİYOR ?
            </div>
          </div>
        )}

        {/* BEAT 2: MEVZUAT KRİTERİ */}
        {activeBeat === 2 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 22, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 3 }}>
              ANAYASAL GÜVENCE · KIRMIZI ÇİZGİ
            </div>
            <div style={{ display: "flex", gap: 28, width: "100%", justifyContent: "center" }}>
              <div style={{ flex: 1, backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.navyDark}`, borderRadius: 18, padding: 32 }}>
                <div style={{ fontFamily: monoFamily, fontSize: 24, fontWeight: 700, color: COLORS.crimson }}>ANAYASA m. 129/2</div>
                <div style={{ fontSize: 32, fontWeight: 600, marginTop: 14, lineHeight: 1.3 }}>
                  Memura savunma hakkı tanınmadan disiplin cezası verilemez.
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.gold}`, borderRadius: 18, padding: 32 }}>
                <div style={{ fontFamily: monoFamily, fontSize: 24, fontWeight: 700, color: COLORS.navyDark }}>657 DMK m. 130</div>
                <div style={{ fontSize: 32, fontWeight: 600, marginTop: 14, lineHeight: 1.3 }}>
                  Savunma süresi idarenin keyfine bırakılamaz.
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: COLORS.navyDark, color: COLORS.goldBright, padding: "16px 36px", borderRadius: 12, fontFamily: monoFamily, fontSize: 24, fontWeight: 700 }}>
              SAVUNMASIZ CEZA = USULDEN SAKAT İŞLEM
            </div>
          </div>
        )}

        {/* BEAT 3: HUKUKİ DAYANAK & TERAZİ */}
        {activeBeat === 3 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 54, fontWeight: 700, color: COLORS.navyDark }}>
              Zorunlu Savunma Süresi: <span style={{ color: COLORS.forest }}>EN AZ 7 GÜN</span>
            </div>
            <LuxuryBalanceScale
              tiltDeg={interpolate(beatEnter, [0, 1], [-12, 11])}
              leftLabel="24 SAAT (USULSÜZ)"
              rightLabel="7 GÜN (KANUNİ)"
            />
            <OfficialStamp
              text="AÇIK USUL HATASI"
              color={COLORS.crimson}
              progress={spring({ frame: Math.max(0, beatLocalFrame - 40), fps, config: { damping: 12 } })}
            />
          </div>
        )}

        {/* BEAT 4: RESMİ KARAR / SONUÇ */}
        {activeBeat === 4 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 24, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 3 }}>
              İDARE MAHKEMESİ KARARI
            </div>
            <div
              style={{
                fontSize: 44,
                color: COLORS.textMuted,
                textDecoration: "line-through",
                textDecorationColor: COLORS.crimson,
                textDecorationThickness: 6,
              }}
            >
              “1 Günlük Süreyle Verilen Uyarma Cezası”
            </div>
            <div
              style={{
                backgroundColor: COLORS.navyDark,
                border: `3px solid ${COLORS.gold}`,
                borderRadius: 20,
                padding: "36px 48px",
                color: COLORS.creamCard,
                boxShadow: "0 18px 40px rgba(16, 32, 51, 0.25)",
              }}
            >
              <div style={{ fontFamily: monoFamily, fontSize: 24, color: COLORS.goldBright, letterSpacing: 2 }}>
                KESİN SONUÇ
              </div>
              <div style={{ fontSize: 56, fontWeight: 700, marginTop: 12 }}>
                DOĞRUDAN İPTAL EDİLİR
              </div>
              <div style={{ fontFamily: monoFamily, fontSize: 22, color: COLORS.goldLight, marginTop: 14 }}>
                657 DMK m. 130 · 60 Gün İçinde İdare Mahkemesi
              </div>
            </div>
          </div>
        )}

        {/* BEAT 5: ÖĞRETMEN BİLANÇOSU */}
        {activeBeat === 5 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
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
              “Usul, esasın koruyucusudur.”
            </div>
          </div>
        )}

        {/* BEAT 6: ÖĞRETMENLER NE DİYOR? & CTA */}
        {activeBeat === 6 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ fontSize: 52, fontWeight: 700, color: COLORS.navyDark, lineHeight: 1.2 }}>
              Senin veya bir meslektaşının başına geldi mi?
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
                marginTop: 18,
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

      {/* ====================================================================
          DYNAMIC WORD-SYNCED SUBTITLE BAR (Bottom Safe Zone)
         ==================================================================== */}
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
