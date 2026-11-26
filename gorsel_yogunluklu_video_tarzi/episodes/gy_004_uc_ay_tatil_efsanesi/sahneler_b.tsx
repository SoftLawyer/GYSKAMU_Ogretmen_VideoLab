import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { INK } from "../../motor/art/Person";
import { Art, Check, Speech, Sparkle, M, D } from "../../motor/art/kit";

/** S06: 5 Kitle Aynası — Öğrenci, Veli, İdareci, Aile -> Merkezde Öğretmen */
export const S06BesKitle: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const pulse = 1 + 0.04 * Math.sin(frame * 0.25);

  const nodes = [
    { x: 220, y: 205, title: "ÖĞRENCİ", sub: "GELECEK & REHBER", bg: C.teal, fg: C.cream },
    { x: 752, y: 205, title: "VELİ", sub: "GÜVEN & İLETİŞİM", bg: C.rust, fg: C.cream },
    { x: 220, y: 575, title: "İDARECİ", sub: "DÜZEN & EĞİTİM", bg: C.espresso, fg: C.goldBright },
    { x: 752, y: 575, title: "AİLESİ", sub: "EVDEKİ EMEK", bg: C.coral, fg: C.cream },
  ];

  return (
    <Art bg={C.cream}>
      {/* Bağlantı çizgileri */}
      {nodes.map((nd) => (
        <line
          key={nd.title}
          x1={486} y1={390}
          x2={lerp(486, nd.x, p1)} y2={lerp(390, nd.y, p1)}
          stroke={C.gold} strokeWidth={7} strokeDasharray="12 10"
        />
      ))}

      {/* 4 Köşe Kartı */}
      {nodes.map((nd) => (
        <g key={nd.title} transform={`translate(${nd.x},${nd.y}) scale(${p1})`} opacity={Math.min(1, p1 * 2)}>
          <rect x={-152} y={-68} width={304} height={136} rx={24} fill={nd.bg} stroke={INK} strokeWidth={5} />
          <text y={-4} textAnchor="middle" fontFamily={D} fontSize={42} fill={nd.fg}>{nd.title}</text>
          <text y={36} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={18} fill={C.paper}>{nd.sub}</text>
        </g>
      ))}

      {/* Merkez Altın Öğretmen Madalyonu */}
      <g transform={`translate(486,390) scale(${p0 * pulse})`}>
        <circle r={128} fill={C.goldBright} stroke={INK} strokeWidth={7} />
        <circle r={106} fill={C.espresso} stroke={C.gold} strokeWidth={4} />
        <Sparkle x={-150} y={-85} s={0.9 * p2} />
        <Sparkle x={150} y={85} s={0.9 * p2} />
        <text y={-14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} letterSpacing={3} fill={C.goldBright}>
          KALBİ & MERKEZİ
        </text>
        <text y={36} textAnchor="middle" fontFamily={D} fontSize={46} fill={C.cream}>
          ÖĞRETMEN
        </text>
      </g>

      {p2 > 0.05 && (
        <g transform={`translate(486,725) scale(${p2})`}>
          <text y={8} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.espresso}>
            BİR ÇOCUĞUN KADERİ O SINIFTA DEĞİŞİR
          </text>
        </g>
      )}
    </Art>
  );
};

/** S07: 180 İş Günü -> Pil %5 Kırmızıdan -> 2 Ay Yenilenme ile %100 Yeşile! */
export const S07PilDolum: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  // Beat 1'de pil kırmızı %12; Beat 2'de %100 yeşile dolar
  const pct = p2 > 0.05 ? lerp(0.12, 1.0, p2) : lerp(0.85, 0.12, p1);
  const barColor = p2 > 0.25 ? C.green : C.coral;
  const labelPct = Math.round(pct * 100);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(486,155) scale(${p0})`}>
        <rect x={-360} y={-48} width={720} height={96} rx={20} fill={C.espresso} stroke={C.gold} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.goldBright}>
          180 İŞ GÜNÜ KESİNTİSİZ EMEK
        </text>
      </g>

      {/* Dev Pil Göstergesi */}
      <g transform={`translate(486,395) scale(${p0})`}>
        <rect x={-295} y={-110} width={560} height={220} rx={32} fill={C.paper} stroke={INK} strokeWidth={8} />
        <rect x={265} y={-46} width={34} height={92} rx={10} fill={INK} />
        {/* Dolum çubuğu */}
        <rect x={-273} y={-88} width={Math.max(24, 516 * pct)} height={176} rx={20} fill={barColor} />
        <text x={-15} y={24} textAnchor="middle" fontFamily={D} fontSize={84} fill={p2 > 0.25 ? C.cream : C.espresso}>
          %{labelPct}
        </text>
      </g>

      {/* Alt Açıklama Bandı */}
      {p2 > 0.05 && (
        <g transform={`translate(486,635) scale(${lerp(1.3, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
          <rect x={-370} y={-64} width={740} height={128} rx={24} fill={C.teal} stroke={INK} strokeWidth={6} />
          <Sparkle x={-315} y={0} s={0.95} />
          <Sparkle x={315} y={0} s={0.95} />
          <text y={-10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.goldBright}>
            GELECEK NESİL İÇİN ZORUNLU YENİLENME
          </text>
          <text y={40} textAnchor="middle" fontFamily={D} fontSize={46} fill={C.cream}>
            LÜKS DEĞİL, NEFES MOLASI!
          </text>
        </g>
      )}
    </Art>
  );
};

/** S08: Gerçek Hesap Bilançosu */
export const S08Bilanco: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 10, 8);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <text x={486} y={102} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={5} fill={C.rust}>
          GERÇEK HESAP BİLANÇOSU
        </text>

        <g transform={`translate(262,375) scale(${p0})`}>
          <rect x={-200} y={-210} width={400} height={400} rx={30} fill={C.teal} stroke={INK} strokeWidth={7} />
          <text y={-18} textAnchor="middle" fontFamily={D} fontSize={140} fill={C.goldBright}>2</text>
          <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={30} letterSpacing={2} fill={C.cream}>AY YAZ İZNİ</text>
          <text y={106} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.tealSoft}>1739 SAYILI KANUN m.50/A</text>
        </g>

        {p1 > 0.05 && (
          <g transform={`translate(710,375) scale(${p1})`}>
            <rect x={-200} y={-210} width={400} height={400} rx={30} fill={C.coral} stroke={INK} strokeWidth={7} />
            <text y={-18} textAnchor="middle" fontFamily={D} fontSize={140} fill={C.cream}>0</text>
            <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={30} letterSpacing={2} fill={C.cream}>GÜN YILLIK İZİN</text>
            <text y={106} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.coralSoft}>657 SAYILI DMK m.103</text>
          </g>
        )}

        {p2 > 0.05 && (
          <g transform={`translate(486,690) scale(${lerp(1.25, 1, p2)})`}>
            <rect x={-380} y={-46} width={760} height={92} rx={20} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
            <Check x={-320} y={0} s={0.95} color={C.goldBright} />
            <text x={22} y={11} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.goldBright}>
              + EVDE HİÇ BİTMEYEN GÖRÜNMEZ MESAİ!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S09: Viral Paylaşım & Yorum Kapanışı */
export const S09Kapanis: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <Speech x={486} y={195} w={770} h={172} tailX={0} s={p0}>
        <text y={-12} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>
          Sence öğretmenlik dışarıdan
        </text>
        <text y={42} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.coral}>
          göründüğü kadar kolay mı?
        </text>
      </Speech>

      {p1 > 0.05 && (
        <g transform={`translate(486,415) scale(${p1})`}>
          <rect x={-355} y={-52} width={710} height={104} rx={24} fill={C.paper} stroke={C.gold} strokeWidth={6} />
          <text y={-2} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.rust}>
            ÖĞRETMEN · VELİ · ÖĞRENCİ · YAKINI
          </text>
          <text y={34} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} fill={C.espresso}>
            💬 YORUMLARDA BULUŞALIM!
          </text>
        </g>
      )}

      {p2 > 0.05 && (
        <g transform={`translate(486,600) scale(${lerp(1.25, 1, p2)})`}>
          <rect x={-375} y={-78} width={750} height={156} rx={28} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <Sparkle x={-320} y={0} s={0.95} />
          <text y={-14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.cream}>
            ✈️ “3 AY YATIYORSUNUZ” DİYENE GÖNDER
          </text>
          <text y={38} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={2.5} fill={C.goldBright}>
            + TAKİP ET · @gyskamu
          </text>
          <Sparkle x={320} y={0} s={0.95} />
        </g>
      )}

      <text x={486} y={755} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.muted}>
        Genel bilgilendirme amaçlıdır · 657 DMK m.103 & 1739 sayılı Kanun m.50/A
      </text>
    </Art>
  );
};
