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

const DOSYA_NO = 3;

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
  waGreen: "#1D7A46",
  subActive: "#FAF6EE",
  subMuted: "#B8C4D4",
};

const BEAT_META = [
  { code: "01/07", label: "GECE YARISI VELİ MESAJI" },
  { code: "02/07", label: "YAYGIN YANILGI" },
  { code: "03/07", label: "ANAYASA & KVKK KRİTERİ" },
  { code: "04/07", label: "TCK m. 136-137 CEZAİ SORUMLULUK" },
  { code: "05/07", label: "ÖĞRETMENİN HAKKI & SONUÇ" },
  { code: "06/07", label: "DOSYA BİLANÇOSU" },
  { code: "07/07", label: "ÖĞRETMENLER NE DİYOR?" },
];

// ============================================================================
// ARTICULATED FULL-BODY EDITORIAL CHARACTER (Teacher / Principal)
// ============================================================================
const FullBodyCharacter: React.FC<{
  x: number;
  y: number;
  coatColor: string;
  accentColor: string;
  trouserColor?: string;
  gesture?: "none" | "shareListRight" | "holdPhoneShock";
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
    gesture === "shareListRight"
      ? interpolate(gestureProg, [0, 1], [45, -24])
      : gesture === "holdPhoneShock"
      ? interpolate(gestureProg, [0, 1], [30, -95])
      : 20;

  const leftArmDeg =
    gesture === "holdPhoneShock"
      ? interpolate(gestureProg, [0, 1], [-20, 105])
      : -18;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={2} rx={40} ry={7} fill="rgba(16, 32, 51, 0.14)" />
      <ellipse cx={-15} cy={-3} rx={13} ry={6} fill="#101824" />
      <ellipse cx={15} cy={-3} rx={13} ry={6} fill="#101824" />

      <path d="M -22 -100 L -5 -100 L -8 -4 L -21 -4 Z" fill={trouserColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
      <path d="M 5 -100 L 22 -100 L 21 -4 L 8 -4 Z" fill={trouserColor} stroke={COLORS.navyDark} strokeWidth={2.5} />

      <path d="M -32 -178 Q 0 -186 32 -178 L 28 -95 L -28 -95 Z" fill={coatColor} stroke={COLORS.navyDark} strokeWidth={2.8} />
      <polygon points="-10,-178 10,-178 0,-138" fill={COLORS.creamCard} />
      <polygon points="-4,-176 4,-176 6,-142 0,-132 -6,-142" fill={accentColor} />

      {/* Left Arm */}
      <g transform={`translate(-28, -168) rotate(${leftArmDeg})`}>
        <rect x={-8} y={0} width={16} height={64} rx={8} fill={coatColor} stroke={COLORS.navyDark} strokeWidth={2.4} />
        <circle cx={0} cy={66} r={7} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2} />
        {gesture === "holdPhoneShock" && (
          <g transform="translate(-14, 52) rotate(-18)">
            <rect x={0} y={0} width={22} height={36} rx={4} fill={COLORS.navyDark} stroke={COLORS.crimson} strokeWidth={2.4} />
            <rect x={4} y={5} width={14} height={22} rx={2} fill={COLORS.goldBright} />
          </g>
        )}
      </g>

      {/* Right Arm */}
      <g transform={`translate(28, -168) rotate(${rightArmDeg})`}>
        <rect x={-8} y={0} width={16} height={64} rx={8} fill={coatColor} stroke={COLORS.navyDark} strokeWidth={2.4} />
        <circle cx={0} cy={66} r={7} fill="#E7C9AD" stroke={COLORS.navyDark} strokeWidth={2} />
        {gesture === "shareListRight" && (
          <g transform="translate(-4, 48) rotate(6)">
            <rect x={0} y={0} width={38} height={46} rx={4} fill={COLORS.creamCard} stroke={COLORS.waGreen} strokeWidth={2.6} />
            <line x1={6} y1={13} x2={32} y2={13} stroke={COLORS.navyDark} strokeWidth={2.2} />
            <line x1={6} y1={22} x2={30} y2={22} stroke={COLORS.navyDark} strokeWidth={2.2} />
            <text x={19} y={38} textAnchor="middle" fill={COLORS.crimson} fontFamily={monoFamily} fontSize={10} fontWeight={700}>
              05XX
            </text>
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
// LUXURY BALANCE SCALE (TCK m. 136-137)
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
    <svg width={740} height={300} viewBox="0 0 740 300">
      <rect x={295} y={260} width={150} height={22} rx={6} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={2} />
      <rect x={358} y={54} width={24} height={210} rx={4} fill={COLORS.goldDark} />
      <circle cx={370} cy={54} r={15} fill={COLORS.goldBright} stroke={COLORS.navyDark} strokeWidth={3} />

      <g transform={`translate(370, 54) rotate(${tiltDeg})`}>
        <rect x={-220} y={-7} width={440} height={14} rx={7} fill={COLORS.gold} stroke={COLORS.navyDark} strokeWidth={2.5} />
        <g transform={`translate(-200, 0) rotate(${-tiltDeg})`}>
          <line x1={0} y1={0} x2={-44} y2={92} stroke={COLORS.goldDark} strokeWidth={3} />
          <line x1={0} y1={0} x2={44} y2={92} stroke={COLORS.goldDark} strokeWidth={3} />
          <path d="M -68 92 Q 0 130 68 92 Z" fill={leftColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
          <rect x={-114} y={118} width={228} height={40} rx={8} fill={COLORS.creamCard} stroke={leftColor} strokeWidth={2.5} />
          <text x={0} y={144} textAnchor="middle" fill={leftColor} fontFamily={monoFamily} fontSize={15} fontWeight={700}>
            {leftLabel}
          </text>
        </g>

        <g transform={`translate(200, 0) rotate(${-tiltDeg})`}>
          <line x1={0} y1={0} x2={-44} y2={92} stroke={COLORS.goldDark} strokeWidth={3} />
          <line x1={0} y1={0} x2={44} y2={92} stroke={COLORS.goldDark} strokeWidth={3} />
          <path d="M -68 92 Q 0 130 68 92 Z" fill={rightColor} stroke={COLORS.navyDark} strokeWidth={2.5} />
          <rect x={-114} y={118} width={228} height={40} rx={8} fill={COLORS.creamCard} stroke={rightColor} strokeWidth={2.5} />
          <text x={0} y={144} textAnchor="middle" fill={rightColor} fontFamily={monoFamily} fontSize={15} fontWeight={700}>
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
}> = ({ text, color, progress, rotateDeg = -5 }) => {
  const scale = interpolate(progress, [0, 1], [1.85, 1]);
  const opacity = interpolate(progress, [0, 0.35, 1], [0, 1, 1]);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "12px 28px",
        border: `5px solid ${color}`,
        borderRadius: 12,
        color,
        fontFamily: monoFamily,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 3,
        textTransform: "uppercase",
        transform: `rotate(${rotateDeg}deg) scale(${scale})`,
        opacity,
        backgroundColor: "rgba(250, 246, 238, 0.96)",
        boxShadow: "0 12px 28px rgba(16, 32, 51, 0.16)",
      }}
    >
      {text}
    </div>
  );
};

// ============================================================================
// MAIN VIDEO COMPOSITION — DOSYA NO: 3 (100% INSTAGRAM REELS SAFE-ZONE)
// ============================================================================
export const OgretmenVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const totalDur = timelineData.totalDuration || 51.0;
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

  // Beat 0 phone ring vibration & notification pop
  const b0s1Start = timelineData.segments.find((s) => s.id === "b0_s1")?.start ?? 2.6;
  const b0s2Start = timelineData.segments.find((s) => s.id === "b0_s2")?.start ?? 5.6;
  const ringShake =
    activeBeat === 0 && t > 0.3 && t < 2.2
      ? Math.sin(frame * 2.7) * 4.5
      : 0;
  const notifPulse = 0.9 + 0.12 * Math.sin(frame * 0.45);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        fontFamily: playfairFamily,
        color: COLORS.navyDark,
        transform: `translateX(${ringShake}px)`,
      }}
    >
      <Audio src={staticFile("audio/master_audio.mp3")} />

      {/* TOP LETTERHEAD (Safe Zone: below Instagram Reels top header) */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 58,
          right: 58,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${COLORS.gold}`,
          paddingBottom: 14,
        }}
      >
        <div style={{ fontFamily: monoFamily, fontSize: 25, fontWeight: 700, letterSpacing: 3, color: COLORS.navyDark }}>
          <span style={{ color: COLORS.goldDark }}>♦</span> DOSYA NO: {DOSYA_NO}
        </div>
        <div style={{ fontFamily: monoFamily, fontSize: 23, fontWeight: 700, color: COLORS.goldDark, letterSpacing: 1.5 }}>
          @gyskamu
        </div>
      </div>

      {/* LUXURY PROGRESS PANEL */}
      <div
        style={{
          position: "absolute",
          top: 202,
          left: 58,
          right: 58,
          backgroundColor: COLORS.navyDark,
          border: `2.5px solid ${COLORS.gold}`,
          borderRadius: 16,
          padding: "16px 26px",
          boxShadow: "0 14px 34px rgba(16, 32, 51, 0.22)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: monoFamily, fontSize: 19, fontWeight: 700, color: COLORS.goldBright, letterSpacing: 1.4 }}>
            BÖLÜM {BEAT_META[activeBeat].code} · {BEAT_META[activeBeat].label}
          </div>
          <div style={{ fontFamily: monoFamily, fontSize: 18, fontWeight: 700, color: COLORS.creamCard, letterSpacing: 1.4 }}>
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
                  height: 9,
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

      {/* MAIN STAGE (100% Reels Safe-Zone between top: 326 and bottom: 536) */}
      <div
        style={{
          position: "absolute",
          top: 326,
          left: 58,
          right: 58,
          bottom: 536,
          backgroundColor: COLORS.creamCard,
          border: `2.5px solid ${COLORS.divider}`,
          borderRadius: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 38px",
          boxShadow: "0 20px 50px rgba(16, 32, 51, 0.10)",
          opacity: interpolate(beatEnter, [0, 1], [0.25, 1]),
          transform: `translateY(${interpolate(beatEnter, [0, 1], [14, 0])}px)`,
        }}
      >
        {/* BEAT 0: ACTION SCENE — Gece 23:00 Veli Mesaj Yağmuru & İzinsiz Numara Dağıtımı */}
        {activeBeat === 0 && (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: monoFamily, fontSize: 20, color: COLORS.crimson, fontWeight: 700, letterSpacing: 2.8 }}>
                GECE 23:00 · İZİNSİZ NUMARA PAYLAŞIMI
              </div>
              <div style={{ fontSize: 44, fontWeight: 700, color: COLORS.navyDark, marginTop: 6, lineHeight: 1.15 }}>
                Şahsi Numarası Velilere Dağıtıldı!
              </div>
            </div>

            <svg width={840} height={510} viewBox="0 0 840 510">
              {/* Nighttime WhatsApp / Call Banner */}
              <rect x={44} y={10} width={752} height={154} rx={14} fill={COLORS.navyDark} stroke={COLORS.gold} strokeWidth={4} />
              <rect x={68} y={32} width={130} height={44} rx={8} fill={COLORS.crimson} />
              <text x={133} y={61} textAnchor="middle" fill={COLORS.creamCard} fontFamily={monoFamily} fontSize={22} fontWeight={700}>
                23:00
              </text>
              <text x={485} y={62} textAnchor="middle" fill={COLORS.goldBright} fontFamily={monoFamily} fontSize={23} fontWeight={700} letterSpacing={2}>
                VELİ WHATSAPP GRUBU (+47 MESAJ)
              </text>
              <text x={420} y={122} textAnchor="middle" fill={COLORS.creamCard} fontFamily={playfairItalicFamily} fontSize={26}>
                “Hocam çocuğun ödevini şimdi kontrol eder misiniz?”
              </text>

              {/* Notification transfer arrow from Principal to Teacher */}
              <g transform={`translate(420, 265) scale(${notifPulse})`}>
                <rect x={-96} y={-28} width={192} height={54} rx={12} fill={COLORS.waGreen} stroke={COLORS.navyDark} strokeWidth={2.5} />
                <text x={0} y={5} textAnchor="middle" fill="#FFFFFF" fontFamily={monoFamily} fontSize={18} fontWeight={700}>
                  📞 05XX XXX XX XX
                </text>
              </g>

              {/* Floor Line */}
              <line x1={32} y1={454} x2={808} y2={454} stroke={COLORS.divider} strokeWidth={4} />

              {/* Principal sharing phone number list */}
              <FullBodyCharacter
                x={205}
                y={454}
                coatColor={COLORS.navyDark}
                accentColor={COLORS.crimson}
                gesture="shareListRight"
                gestureProg={Math.min(1, Math.max(0, (t - b0s1Start + 0.6) * 1.8))}
                scale={1.0}
                label="OKUL MÜDÜRÜ"
              />

              {/* Teacher shocked with ringing phone */}
              <FullBodyCharacter
                x={635}
                y={454}
                coatColor={COLORS.navySoft}
                accentColor={COLORS.gold}
                gesture="holdPhoneShock"
                gestureProg={Math.min(1, beatLocalFrame / 28)}
                scale={1.0}
                label="ÖĞRETMEN"
              />
            </svg>

            <div style={{ minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {t >= b0s2Start + 0.1 && (
                <OfficialStamp
                  text="İZİNSİZ PAYLAŞIM · YASAL MI?"
                  color={COLORS.crimson}
                  progress={spring({
                    frame: Math.max(0, Math.round((t - (b0s2Start + 0.1)) * fps)),
                    fps,
                    config: { damping: 12 },
                  })}
                  rotateDeg={-3}
                />
              )}
            </div>
          </div>
        )}

        {/* BEAT 1: YAYGIN YANILGI */}
        {activeBeat === 1 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ backgroundColor: COLORS.crimson, color: COLORS.creamCard, fontFamily: monoFamily, fontSize: 23, fontWeight: 700, padding: "10px 26px", borderRadius: 8, letterSpacing: 2.5 }}>
              İLK AKLA GELEN YANILGI
            </div>
            <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.2, maxWidth: 800 }}>
              “Okul iletişimidir, numara mecburen verilir!”
            </div>
            <OfficialStamp
              text="KANUNSUZ İŞLEM"
              color={COLORS.crimson}
              progress={spring({ frame: Math.max(0, beatLocalFrame - 14), fps, config: { damping: 11 } })}
            />
            <div style={{ marginTop: 8, padding: "16px 32px", borderRadius: 999, border: `3px solid ${COLORS.gold}`, backgroundColor: COLORS.navyDark, color: COLORS.goldBright, fontFamily: monoFamily, fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
              ? KANUN NE ÖNGÖRÜYOR ?
            </div>
          </div>
        )}

        {/* BEAT 2: ANAYASA & KVKK KRİTERİ */}
        {activeBeat === 2 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 21, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 2.8 }}>
              ANAYASAL GÜVENCE · KİŞİSEL VERİ
            </div>
            <div style={{ display: "flex", gap: 24, width: "100%", justifyContent: "center" }}>
              <div style={{ flex: 1, backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.navyDark}`, borderRadius: 18, padding: 28 }}>
                <div style={{ fontFamily: monoFamily, fontSize: 22, fontWeight: 700, color: COLORS.navyDark }}>ANAYASA m. 20</div>
                <div style={{ fontSize: 29, fontWeight: 600, marginTop: 12, lineHeight: 1.3 }}>
                  Herkes kişisel verilerinin korunmasını isteme hakkına sahiptir.
                </div>
              </div>
              <div style={{ flex: 1, backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.gold}`, borderRadius: 18, padding: 28 }}>
                <div style={{ fontFamily: monoFamily, fontSize: 22, fontWeight: 700, color: COLORS.crimson }}>6698 KVKK m. 12</div>
                <div style={{ fontSize: 29, fontWeight: 600, marginTop: 12, lineHeight: 1.3 }}>
                  Şahsi cep telefonu kişisel veridir; açık rızasız paylaşılamaz.
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: COLORS.navyDark, color: COLORS.goldBright, padding: "15px 32px", borderRadius: 12, fontFamily: monoFamily, fontSize: 22, fontWeight: 700 }}>
              RESMİ İLETİŞİM KURUMSAL KANALLA YÜRÜTÜLÜR
            </div>
          </div>
        )}

        {/* BEAT 3: TCK m. 136-137 CEZAİ SORUMLULUK */}
        {activeBeat === 3 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 19, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 2.4 }}>
              TCK m. 136 & m. 137 · YARGITAY İÇTİHADI
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, color: COLORS.navyDark, lineHeight: 1.15 }}>
              2–4 Yıl Hapis + Kamu Görevlisine <span style={{ color: COLORS.crimson }}>+%50 ARTIRIM!</span>
            </div>
            <LuxuryBalanceScale
              tiltDeg={interpolate(beatEnter, [0, 1], [-12, 11])}
              leftLabel="İZİNSİZ PAYLAŞIM"
              rightLabel="TCK m. 136-137 (3-6 YIL)"
            />
            <OfficialStamp
              text="RESEN SORUŞTURULAN SUÇ"
              color={COLORS.crimson}
              progress={spring({ frame: Math.max(0, beatLocalFrame - 36), fps, config: { damping: 12 } })}
            />
          </div>
        )}

        {/* BEAT 4: ÖĞRETMENİN HAKKI & SONUÇ */}
        {activeBeat === 4 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 22, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 2.8 }}>
              ÖĞRETMENİN YASAL HAKKI
            </div>
            <div style={{ fontSize: 38, color: COLORS.textMuted, textDecoration: "line-through", textDecorationColor: COLORS.crimson, textDecorationThickness: 6 }}>
              “7/24 Veliye Ulaşılabilir Olma Dayatması”
            </div>
            <div
              style={{
                backgroundColor: COLORS.navyDark,
                border: `3px solid ${COLORS.gold}`,
                borderRadius: 20,
                padding: "30px 40px",
                color: COLORS.creamCard,
                boxShadow: "0 18px 40px rgba(16, 32, 51, 0.25)",
                maxWidth: 820,
              }}
            >
              <div style={{ fontFamily: monoFamily, fontSize: 21, color: COLORS.goldBright, letterSpacing: 1.8 }}>
                MESAİ DIŞI ZORUNLULUK YOK
              </div>
              <div style={{ fontSize: 42, fontWeight: 700, marginTop: 10, lineHeight: 1.2 }}>
                SAVCILIĞA SUÇ DUYURUSU & KVKK ŞİKÂYETİ
              </div>
              <div style={{ fontFamily: monoFamily, fontSize: 20, color: COLORS.goldLight, marginTop: 12 }}>
                TCK m. 136–137 · 6698 KVKK m. 12 · Anayasa m. 20
              </div>
            </div>
          </div>
        )}

        {/* BEAT 5: DOSYA BİLANÇOSU */}
        {activeBeat === 5 && (
          <div style={{ width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ fontFamily: monoFamily, fontSize: 23, color: COLORS.goldDark, fontWeight: 700, letterSpacing: 3 }}>
              DOSYA BİLANÇOSU
            </div>
            <div style={{ display: "flex", gap: 26, width: "100%" }}>
              <div style={{ flex: 1, backgroundColor: COLORS.navyDark, color: COLORS.creamCard, borderRadius: 20, padding: "34px 20px", border: `3px solid ${COLORS.gold}` }}>
                <div style={{ fontFamily: monoFamily, fontSize: 74, fontWeight: 700, color: COLORS.goldBright }}>1</div>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>KURUMSAL İLETİŞİM</div>
              </div>
              <div style={{ flex: 1, backgroundColor: COLORS.crimson, color: COLORS.creamCard, borderRadius: 20, padding: "34px 20px", border: `3px solid ${COLORS.navyDark}` }}>
                <div style={{ fontFamily: monoFamily, fontSize: 74, fontWeight: 700, color: COLORS.creamCard }}>0</div>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>İZİNSİZ DAĞITMA HAKKI</div>
              </div>
            </div>
            <div style={{ fontSize: 31, fontStyle: "italic", fontFamily: playfairItalicFamily, color: COLORS.navy }}>
              “Şahsi telefon numarası kişisel veridir, rızasız paylaşılamaz.”
            </div>
          </div>
        )}

        {/* BEAT 6: ÖĞRETMENLER NE DİYOR? & CTA */}
        {activeBeat === 6 && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: COLORS.navyDark, lineHeight: 1.2 }}>
              Senin numaran da iznin olmadan velilere verildi mi?
            </div>
            <div style={{ backgroundColor: COLORS.bg, border: `2.5px solid ${COLORS.gold}`, borderRadius: 16, padding: "18px 34px", fontFamily: monoFamily, fontSize: 24, fontWeight: 700, color: COLORS.navyDark }}>
              💬 Yorumlarda Paylaş, Birlikte Konuşalım
            </div>
            <div style={{ marginTop: 10, backgroundColor: COLORS.navyDark, border: `3px solid ${COLORS.goldBright}`, borderRadius: 20, padding: "26px 44px", color: COLORS.creamCard, boxShadow: "0 18px 40px rgba(16, 32, 51, 0.25)" }}>
              <div style={{ fontFamily: monoFamily, fontSize: 28, fontWeight: 700, color: COLORS.goldBright, letterSpacing: 2 }}>
                + TAKİP ET · @gyskamu
              </div>
              <div style={{ fontSize: 25, marginTop: 8, color: COLORS.creamCard }}>
                EKYS & Öğretmen Hakları Dosyaları
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC WORD-SYNCED SUBTITLE BAR (100% Reels Safe-Zone: bottom: 355px, well above IG overlay!) */}
      <div
        style={{
          position: "absolute",
          bottom: 355,
          left: 58,
          right: 120,
          minHeight: 150,
          backgroundColor: COLORS.navyDark,
          border: `2.5px solid ${COLORS.gold}`,
          borderRadius: 20,
          padding: "22px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(16, 32, 51, 0.28)",
        }}
      >
        {activeChunk ? (
          <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.28, letterSpacing: 0.3 }}>
            {activeChunk.words.map((w, i) => {
              const isHi = activeChunk!.highlight.includes(i);
              return (
                <span
                  key={i}
                  style={{
                    color: isHi ? COLORS.goldBright : COLORS.subActive,
                    marginRight: 11,
                    display: "inline-block",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ) : (
          <div style={{ fontFamily: monoFamily, fontSize: 21, color: COLORS.subMuted, letterSpacing: 2 }}>
            GYSKAMU · ÖĞRETMEN DOSYASI
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
