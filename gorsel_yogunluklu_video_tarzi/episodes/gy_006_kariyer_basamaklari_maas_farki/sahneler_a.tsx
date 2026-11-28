import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, shake, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Speech, Check, Sparkle, M, D } from "../../motor/art/kit";

/** S01: Yan Yana İki Sınıf (3-A ve 3-B) — Aynı Ders, Farklı Maaş! */
export const S01Kanca: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 11, 9);

  return (
    <Art>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <Room wall="#EFE6D6" floor="#D8C6A6" floorY={665} stripes>
          {/* Ortada sınıf duvarı çizgisi */}
          <line x1={486} y1={40} x2={486} y2={665} stroke={INK} strokeWidth={7} strokeDasharray="16 12" opacity={0.6} />

          {/* Sol Sınıf Tabelası */}
          <g transform={`translate(245,120) scale(${p0})`}>
            <rect x={-160} y={-44} width={320} height={88} rx={18} fill={C.espresso} stroke={INK} strokeWidth={5} />
            <text y={-4} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>SINIF 3-A · 30 ÖĞRENCİ</text>
            <text y={28} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={19} fill={C.cream}>ÖĞRETMEN (9 YIL)</text>
          </g>

          {/* Sağ Sınıf Tabelası */}
          <g transform={`translate(728,120) scale(${p0})`}>
            <rect x={-160} y={-44} width={320} height={88} rx={18} fill={C.teal} stroke={INK} strokeWidth={5} />
            <text y={-4} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>SINIF 3-B · 30 ÖĞRENCİ</text>
            <text y={28} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={19} fill={C.cream}>BAŞÖĞRETMEN (20 YIL)</text>
          </g>

          {/* Soldaki Öğretmen */}
          <Person
            x={245} y={665} s={0.94 * p1} face={1}
            top={C.rust} pants="#2C3C4E" style="cardigan"
            hairStyle="short" mood={p2 > 0.2 ? "worry" : "neutral"}
            armF={[lerp(16, 75, p1), 22]}
            armB={[18, 14]}
          />

          {/* Sağdaki Başöğretmen */}
          <Person
            x={728} y={665} s={0.94 * p1} face={-1}
            top={C.teal} pants="#1F2937" style="cardigan"
            hairStyle="gray" glasses mood="neutral"
            armF={[lerp(16, 75, p1), 22]}
            armB={[18, 14]}
          />

          {/* Beat 2: Ortada Patlayan MAAŞ FARKI Damgası */}
          {p2 > 0.05 && (
            <g transform={`translate(486,445) rotate(-6) scale(${lerp(2.1, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
              <rect x={-280} y={-62} width={560} height={124} rx={22} fill={C.coral} stroke={INK} strokeWidth={7} />
              <text y={-8} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.goldBright}>
                AYNI DERS · AYNI SAAT
              </text>
              <text y={42} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.cream}>
                NEDEN MAAŞ FARKI?
              </text>
            </g>
          )}
        </Room>
      </g>
    </Art>
  );
};

/** S02: 7528 ÖMK m. 20 — 3 Kariyer Basamağı + Kademe Cezası Almamak & Akademi Eğitimi Şartı */
export const S02Sartlar: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Üstte 3 Kariyer Basamağı */}
      <g transform={`translate(175,260) scale(${p0})`}>
        <rect x={-125} y={-80} width={250} height={160} rx={22} fill={C.paper} stroke={INK} strokeWidth={6} />
        <text y={-14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.muted}>1. BASAMAK</text>
        <text y={36} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.espresso}>Öğretmen</text>
      </g>

      <g transform={`translate(486,230) scale(${p1})`} opacity={Math.min(1, p1 * 2)}>
        <rect x={-135} y={-95} width={270} height={190} rx={22} fill={C.teal} stroke={INK} strokeWidth={6} />
        <text y={-34} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.goldBright}>EN AZ 10 YIL</text>
        <text y={18} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.cream}>Uzman</text>
        <text y={62} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.tealSoft}>ÖĞRETMEN</text>
      </g>

      <g transform={`translate(797,200) scale(${p1})`} opacity={Math.min(1, p1 * 2)}>
        <rect x={-135} y={-110} width={270} height={220} rx={22} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
        <text y={-44} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.goldBright}>TOPLAM 20 YIL</text>
        <text y={14} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.goldBright}>Başöğretmen</text>
        <text y={64} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={19} fill={C.cream}>UZMANLIKTA 10 YIL</text>
      </g>

      {/* Beat 2: 7528 m. 20 Zorunlu 2 Ek Şart Kartları */}
      {p2 > 0.05 && (
        <g>
          <g transform={`translate(486,495) scale(${p2})`}>
            <rect x={-410} y={-56} width={820} height={112} rx={22} fill={C.paper} stroke={C.coral} strokeWidth={6} />
            <Check x={-345} y={0} s={1.05} color={C.coral} />
            <text x={32} y={-6} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.espresso}>
              Kademe İlerlemesinin Durdurulması
            </text>
            <text x={32} y={34} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={21} fill={C.coral}>
              CEZASI ALMAMIŞ OLMAK ŞART!
            </text>
          </g>

          <g transform={`translate(486,645) scale(${p2})`}>
            <rect x={-410} y={-56} width={820} height={112} rx={22} fill={C.tealSoft} stroke={C.teal} strokeWidth={6} />
            <Check x={-345} y={0} s={1.05} color={C.teal} />
            <text x={32} y={-6} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.espresso}>
              Millî Eğitim Akademisi Eğitimi
            </text>
            <text x={32} y={34} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={21} fill={C.teal}>
              AKADEMİ PROGRAMINI TAMAMLAMAK ŞART!
            </text>
          </g>
        </g>
      )}
    </Art>
  );
};

/** S03: 657 DMK m. 152 — +%60 Uzman vs +%120 Başöğretmen Tazminatı */
export const S03Tazminat: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <text x={486} y={98} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.rust}>
        657 SAYILI DMK · MADDE 152
      </text>

      {/* Sol Bar: +%60 Uzman Öğretmen */}
      <g transform={`translate(268,420) scale(${p1})`} opacity={Math.min(1, p1 * 2)}>
        <rect x={-185} y={-155} width={370} height={310} rx={28} fill={C.teal} stroke={INK} strokeWidth={7} />
        <text y={-42} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.goldBright}>UZMAN ÖĞRETMEN</text>
        <text y={46} textAnchor="middle" fontFamily={D} fontSize={102} fill={C.cream}>+%60</text>
        <text y={108} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.tealSoft}>İLAVE TAZMİNAT · +1 DERECE</text>
      </g>

      {/* Sağ Bar: +%120 Başöğretmen */}
      {p2 > 0.05 && (
        <g transform={`translate(704,380) scale(${lerp(1.3, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
          <rect x={-185} y={-195} width={370} height={390} rx={28} fill={C.espresso} stroke={C.goldBright} strokeWidth={7} />
          <Sparkle x={-135} y={-135} s={0.9} />
          <Sparkle x={135} y={-135} s={0.9} />
          <text y={-68} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.goldBright}>BAŞÖĞRETMEN</text>
          <text y={32} textAnchor="middle" fontFamily={D} fontSize={98} fill={C.goldBright}>+%120</text>
          <text y={104} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.cream}>İLAVE TAZMİNAT · +1 DERECE</text>
          <text y={144} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.paperDark}>EN YÜKSEK MEMUR AYLIĞINDAN</text>
        </g>
      )}

      <g transform={`translate(486,685) scale(${p0})`}>
        <rect x={-370} y={-40} width={740} height={80} rx={18} fill={C.paper} stroke={INK} strokeWidth={5} />
        <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.espresso}>
          AYNI OKULDA İKİ KATI TAZMİNAT FARKI!
        </text>
      </g>
    </Art>
  );
};

/** S04: 1. Görüş — "Eşit İşe Eşit Ücret!" */
export const S04Cephe1: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 10, 8);

  return (
    <Art>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <Room wall="#EFE6D6" floor="#D8C6A6" floorY={665} stripes>
          <Person
            x={215} y={665} s={0.96 * p0} face={1}
            top={C.coral} pants="#2C3C4E" style="cardigan"
            hairStyle="short" mood="angry"
            armF={[lerp(18, 95, p1), 20]}
            armB={[20, 14]}
          />

          <Speech x={605} y={240} w={540} h={175} tailX={-175} s={p1}>
            <text y={-22} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.coral}>
              1. GÖRÜŞ · EŞİTLİK SAVUNUCULARI
            </text>
            <text y={30} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>
              “Aynı sınıfta aynı emek!”
            </text>
          </Speech>

          {p2 > 0.05 && (
            <g transform={`translate(605,505) scale(${lerp(1.3, 1, p2)})`}>
              <rect x={-270} y={-95} width={540} height={190} rx={26} fill={C.coral} stroke={INK} strokeWidth={6} />
              <text y={-20} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={2.5} fill={C.goldBright}>
                ÖĞRETMENLER ODASI ELEŞTİRİSİ
              </text>
              <text y={34} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.cream}>
                Ünvan Ayrımı Adaleti Zedeler!
              </text>
            </g>
          )}
        </Room>
      </g>
    </Art>
  );
};

/** S05: 2. Görüş — "Kıdem ve Uzmanlık Ödülü Şart!" */
export const S05Cephe2: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art>
      <Room wall="#EFE6D6" floor="#D8C6A6" floorY={665} stripes>
        <Person
          x={755} y={665} s={0.96 * p0} face={-1}
          top={C.teal} pants="#1F2937" style="cardigan"
          hairStyle="gray" glasses mood="smile"
          armF={[lerp(18, 95, p1), 20]}
          armB={[20, 14]}
        />

        <Speech x={365} y={240} w={540} h={175} tailX={175} s={p1}>
          <text y={-22} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.teal}>
            2. GÖRÜŞ · KIDEM SAVUNUCULARI
          </text>
          <text y={30} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.espresso}>
            “20 yıllık tecrübe bir olmamalı!”
          </text>
        </Speech>

        {p2 > 0.05 && (
          <g transform={`translate(365,505) scale(${lerp(1.3, 1, p2)})`}>
            <rect x={-270} y={-95} width={540} height={190} rx={26} fill={C.teal} stroke={INK} strokeWidth={6} />
            <text y={-20} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={2.5} fill={C.goldBright}>
              KARİYER BASAMAĞI GEREKÇESİ
            </text>
            <text y={34} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.cream}>
              Kıdem & Mesleki Teşvik!
            </text>
          </g>
        )}
      </Room>
    </Art>
  );
};
