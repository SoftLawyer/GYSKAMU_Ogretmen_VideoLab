import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useScene, lerp } from "../../motor/anim";
import { INK } from "../../motor/art/Person";
import { Art, Speech, Sparkle, M, D } from "../../motor/art/kit";

/** S06: Taşa Değil İnsana Şekil Verir — Altın Terazi */
export const S06Kutsal: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const tilt = lerp(-12, 16, p1);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(486,155) scale(${p0})`}>
        <rect x={-12} y={40} width={24} height={435} rx={8} fill={C.goldDeep} stroke={INK} strokeWidth={5} />
        <rect x={-120} y={462} width={240} height={36} rx={12} fill={C.espresso} stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={46} r={22} fill={C.goldBright} stroke={INK} strokeWidth={5} />

        <g transform={`translate(0,46) rotate(${tilt})`}>
          <rect x={-315} y={-10} width={630} height={20} rx={10} fill={C.gold} stroke={INK} strokeWidth={5} />

          {/* Sol Kefe: Taş, Kâğıt, Demir */}
          <g transform={`translate(-270,0) rotate(${-tilt})`}>
            <line x1={0} y1={0} x2={-64} y2={150} stroke={INK} strokeWidth={4} />
            <line x1={0} y1={0} x2={64} y2={150} stroke={INK} strokeWidth={4} />
            <path d="M-96 150 Q0 200 96 150 Z" fill={C.muted} stroke={INK} strokeWidth={5} />
            <rect x={-110} y={62} width={220} height={82} rx={14} fill={C.paper} stroke={INK} strokeWidth={4} />
            <text y={98} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.espresso}>TAŞ & KÂĞIT</text>
            <text y={128} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.muted}>Zamanla eskir</text>
          </g>

          {/* Sağ Kefe: İNSAN İNŞA ETMEK (Ağır Basar) */}
          <g transform={`translate(270,0) rotate(${-tilt})`}>
            <line x1={0} y1={0} x2={-64} y2={150} stroke={INK} strokeWidth={4} />
            <line x1={0} y1={0} x2={64} y2={150} stroke={INK} strokeWidth={4} />
            <path d="M-96 150 Q0 200 96 150 Z" fill={C.teal} stroke={INK} strokeWidth={5} />
            {p1 > 0.05 && (
              <g transform={`scale(${p1})`}>
                <rect x={-122} y={50} width={244} height={96} rx={16} fill={C.espresso} stroke={C.goldBright} strokeWidth={5} />
                <text y={92} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.goldBright}>İNSAN</text>
                <text y={128} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.cream}>NESİL İNŞA EDER</text>
              </g>
            )}
          </g>
        </g>
      </g>

      {p2 > 0.05 && (
        <g transform={`translate(486,710) scale(${p2})`}>
          <Sparkle x={-310} y={0} s={0.95} />
          <rect x={-275} y={-42} width={550} height={84} rx={18} fill={C.teal} stroke={INK} strokeWidth={5} />
          <text y={12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={29} letterSpacing={3} fill={C.cream}>
            DÜNYANIN EN KUTSAL MESLEĞİ
          </text>
          <Sparkle x={310} y={0} s={0.95} />
        </g>
      )}
    </Art>
  );
};

/** S07: Karanlıkta Yol Aydınlatan Fener — Bir Ömürlük İz */
export const S07Isik: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const wave = 1 + 0.06 * Math.sin(frame * 0.16);
  const lightRadius = lerp(90, 340, Math.max(p0 * 0.35, p1 * 0.75, p2));

  return (
    <Art bg={C.espresso2}>
      {/* Büyüyen sıcak altın ışık halkaları */}
      <circle cx={486} cy={340} r={lightRadius * wave} fill={C.goldBright} opacity={0.14} />
      <circle cx={486} cy={340} r={lightRadius * 0.68 * wave} fill={C.goldBright} opacity={0.22} />
      <circle cx={486} cy={340} r={lightRadius * 0.42 * wave} fill={C.goldBright} opacity={0.34} />

      {/* Klasik Altın Fener */}
      <g transform={`translate(486,340) scale(${p0})`}>
        {/* Üst halka & kapak */}
        <circle cx={0} cy={-168} r={22} fill="none" stroke={C.goldBright} strokeWidth={7} />
        <path d="M-78 -118 Q0 -168 78 -118 Z" fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
        {/* Cam gövde */}
        <rect x={-66} y={-118} width={132} height={190} rx={18} fill={C.goldBright} stroke={C.gold} strokeWidth={6} />
        {/* İç alev */}
        <path d="M0 -72 C34 -22 34 32 0 46 C-34 32 -34 -22 0 -72 Z" fill={C.cream} />
        <path d="M0 -40 C18 -10 18 24 0 34 C-18 24 -18 -10 0 -40 Z" fill={C.coral} opacity={0.85} />
        {/* Alt taban */}
        <rect x={-84} y={72} width={168} height={28} rx={10} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
      </g>

      {/* Yıldız kıvılcımları */}
      {p1 > 0.05 && (
        <g opacity={Math.min(1, p1 * 2)}>
          <Sparkle x={220} y={210} s={1.0 * p1} />
          <Sparkle x={752} y={220} s={1.1 * p1} />
          <Sparkle x={260} y={450} s={0.85 * p1} />
          <Sparkle x={715} y={445} s={0.95 * p1} />
        </g>
      )}

      {/* Beat 2: BİR ÖMÜRLÜK İZ */}
      {p2 > 0.05 && (
        <g transform={`translate(486,645) scale(${p2})`}>
          <rect x={-360} y={-68} width={720} height={136} rx={24} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <text y={-12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={23} letterSpacing={4} fill={C.goldBright}>
            ÖĞRETMENLİK BİR İŞ DEĞİL
          </text>
          <text y={44} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.cream}>
            Bir Ömürlük İzdir
          </text>
        </g>
      )}
    </Art>
  );
};

/** S08: 24 Kasım Kutlama Zirvesi — Altın Çelenk & Kutlama Plaketi */
export const S08Kutlama: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const twinkle = 0.8 + 0.2 * Math.sin(frame * 0.2);

  return (
    <Art bg={C.cream}>
      {/* Arka altın hale */}
      <circle cx={486} cy={385} r={300} fill={C.goldBright} opacity={0.16} />

      {/* Altın defne halkası */}
      <g transform={`translate(486,348) scale(${p0})`}>
        <circle r={276} fill={C.paper} stroke={C.gold} strokeWidth={8} />
        <circle r={254} fill="none" stroke={C.goldDeep} strokeWidth={3} strokeDasharray="12 10" />

        <text y={-92} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} letterSpacing={3} fill={C.rust}>
          BAŞÖĞRETMEN ATATÜRK’ÜN İZİNDE
        </text>

        <text y={22} textAnchor="middle" fontFamily={D} fontSize={104} fill={C.espresso}>
          24 KASIM
        </text>

        {p1 > 0.05 && (
          <g transform={`translate(0,92) scale(${p1})`}>
            <rect x={-188} y={-30} width={376} height={60} rx={16} fill={C.teal} stroke={INK} strokeWidth={4} />
            <text y={9} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={25} letterSpacing={3} fill={C.cream}>
              ÖĞRETMENLER GÜNÜ
            </text>
          </g>
        )}
      </g>

      {/* Yıldızlar */}
      <Sparkle x={175} y={175} s={1.1 * twinkle * p0} />
      <Sparkle x={797} y={175} s={1.1 * twinkle * p0} />
      <Sparkle x={165} y={530} s={0.9 * twinkle * p1} />
      <Sparkle x={807} y={530} s={0.9 * twinkle * p1} />

      {/* Beat 2: KUTLU OLSUN alt bandı */}
      {p2 > 0.05 && (
        <g transform={`translate(486,700) scale(${lerp(1.4, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
          <rect x={-350} y={-52} width={700} height={104} rx={22} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <text y={16} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.goldBright}>
            Kutlu Olsun!
          </text>
        </g>
      )}
    </Art>
  );
};

/** S09: Viral DM & Paylaşım Finali — Kâğıt Uçak + Vefa Balonu + @gyskamu */
export const S09Paylasim: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Kesikli uçuş izi */}
      <path
        d="M150 320 Q360 150 760 220"
        fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="14 12" opacity={p0}
      />

      {/* Beat 0: Uçan Altın Kâğıt Uçak (DM Paylaşım İkonu) */}
      <g transform={`translate(${lerp(220, 745, p0)},${lerp(305, 220, p0)}) rotate(-12) scale(${1.15 * p0})`}>
        <polygon points="-78,-34 86,0 -78,42 -42,4" fill={C.goldBright} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <line x1={-42} y1={4} x2={86} y2={0} stroke={INK} strokeWidth={4} />
      </g>

      {/* Beat 1: Vefa Konuşma Balonu */}
      {p1 > 0.05 && (
        <Speech x={486} y={420} w={760} h={168} tailX={180} s={p1}>
          <text y={-12} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>
            Hayatını değiştiren o öğretmenine gönder;
          </text>
          <text y={44} textAnchor="middle" fontFamily={D} fontSize={46} fill={C.teal}>
            hâlâ unutmadığını bilsin.
          </text>
        </Speech>
      )}

      {/* Beat 2: Zarif @gyskamu İmza Kartı */}
      {p2 > 0.05 && (
        <g transform={`translate(486,655) scale(${p2})`}>
          <rect x={-350} y={-64} width={700} height={128} rx={26} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <Sparkle x={-295} y={0} s={0.95} />
          <text y={-6} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={3} fill={C.goldBright}>
            SONSUZ SAYGI VE MİNNETLE
          </text>
          <text y={38} textAnchor="middle" fontFamily={M} fontSize={26} letterSpacing={2} fill={C.cream}>
            @gyskamu · 24 KASIM
          </text>
          <Sparkle x={295} y={0} s={0.95} />
        </g>
      )}
    </Art>
  );
};
