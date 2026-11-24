import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useScene, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Speech, Sparkle, Gavel, M, D } from "../../motor/art/kit";

/** S01: Anında Öğretmen Kancası — Ortada Öğretmen + Cerrah & Hâkim Rozetleri */
export const S01Kanca: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const glow = 0.85 + 0.15 * Math.sin(frame * 0.12);

  return (
    <Art>
      <Room wall="#F0E7D6" floor="#DCCAA8" floorY={655} stripes>
        {/* Arka planda altın hale ve yeşil kara tahta */}
        <circle cx={486} cy={350} r={240 * glow} fill={C.goldBright} opacity={0.18} />
        <g transform={`translate(486,205) scale(${p0})`}>
          <rect x={-260} y={-110} width={520} height={195} rx={18} fill="#1A3A32" stroke={C.gold} strokeWidth={7} />
          <text y={-32} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.goldBright}>
            BÜTÜN MESLEKLERİN KÖKÜ
          </text>
          <text y={32} textAnchor="middle" fontFamily={D} fontSize={58} fill={C.cream}>
            BİR ÖĞRETMEN
          </text>
        </g>

        {/* Altın bağlantı çizgileri */}
        {p1 > 0.05 && (
          <line x1={380} y1={420} x2={lerp(380, 185, p1)} y2={lerp(420, 390, p1)} stroke={C.gold} strokeWidth={6} strokeDasharray="10 8" />
        )}
        {p2 > 0.05 && (
          <line x1={592} y1={420} x2={lerp(592, 787, p2)} y2={lerp(420, 390, p2)} stroke={C.gold} strokeWidth={6} strokeDasharray="10 8" />
        )}

        {/* Ortada Gururlu Öğretmen */}
        <Person
          x={486} y={655} s={0.96 * p0} face={1}
          top={C.teal} pants="#243242" style="cardigan"
          hairStyle="short" glasses mood="smile"
          armF={[lerp(15, 58, p0), 18]}
          armB={[lerp(15, 42, p0), 12]}
        />

        {/* Beat 1: Sol Rozet — CERRAH */}
        {p1 > 0.05 && (
          <g transform={`translate(168,425) scale(${p1})`}>
            <circle r={112} fill={C.cream} stroke={INK} strokeWidth={6} />
            <circle r={96} fill="none" stroke={C.teal} strokeWidth={3} strokeDasharray="6 6" />
            {/* Tıp Artı Sembolü */}
            <rect x={-16} y={-56} width={32} height={82} rx={7} fill={C.coral} stroke={INK} strokeWidth={4} />
            <rect x={-41} y={-31} width={82} height={32} rx={7} fill={C.coral} stroke={INK} strokeWidth={4} />
            <text y={68} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2} fill={C.espresso}>
              CERRAH
            </text>
          </g>
        )}

        {/* Beat 2: Sağ Rozet — HÂKİM */}
        {p2 > 0.05 && (
          <g transform={`translate(804,425) scale(${p2})`}>
            <circle r={112} fill={C.cream} stroke={INK} strokeWidth={6} />
            <circle r={96} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" />
            <Gavel x={0} y={-22} s={0.62} r={-28} />
            <text y={68} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2} fill={C.espresso}>
              HÂKİM
            </text>
          </g>
        )}

        <Sparkle x={150} y={135} s={0.9 * p0} />
        <Sparkle x={822} y={135} s={0.9 * p0} />
      </Room>
    </Art>
  );
};

/** S02: Görünmez İmza — Köprü + Başarı Kupası + Altın İmza Mührü */
export const S02Imza: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Beat 0: Sol Kart — Mühendisin Köprüsü */}
      <g transform={`translate(262,285) scale(${p0})`}>
        <rect x={-195} y={-155} width={390} height={300} rx={26} fill={C.paper} stroke={INK} strokeWidth={6} />
        {/* Zarif Asma Köprü Çizimi */}
        <path d="M-150 45 H150" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <rect x={-96} y={-78} width={18} height={124} rx={4} fill={C.teal} stroke={INK} strokeWidth={4} />
        <rect x={78} y={-78} width={18} height={124} rx={4} fill={C.teal} stroke={INK} strokeWidth={4} />
        <path d="M-150 38 Q-87 -68 -87 -68 Q0 28 87 -68 Q87 -68 150 38" fill="none" stroke={C.goldDeep} strokeWidth={5} />
        <text y={108} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2} fill={C.espresso}>
          MÜHENDİSİN KÖPRÜSÜ
        </text>
      </g>

      {/* Beat 1: Sağ Kart — Büyük Başarı Kupası */}
      {p1 > 0.05 && (
        <g transform={`translate(710,285) scale(${p1})`}>
          <rect x={-195} y={-155} width={390} height={300} rx={26} fill={C.paper} stroke={INK} strokeWidth={6} />
          {/* Altın Kupa */}
          <path d="M-55 -92 H55 L42 -12 C34 26 -34 26 -42 -12 Z" fill={C.goldBright} stroke={INK} strokeWidth={5} />
          <path d="M-55 -78 C-92 -78 -92 -24 -46 -22" fill="none" stroke={C.goldDeep} strokeWidth={8} strokeLinecap="round" />
          <path d="M55 -78 C92 -78 92 -24 46 -22" fill="none" stroke={C.goldDeep} strokeWidth={8} strokeLinecap="round" />
          <rect x={-12} y={16} width={24} height={34} fill={C.goldDeep} stroke={INK} strokeWidth={4} />
          <rect x={-48} y={46} width={96} height={18} rx={6} fill={C.espresso} stroke={INK} strokeWidth={4} />
          <text y={108} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2} fill={C.espresso}>
            ALKIŞLANAN BAŞARI
          </text>
        </g>
      )}

      {/* Beat 2: Altta Parlayan Görünmez İmza Plaketi */}
      {p2 > 0.05 && (
        <g transform={`translate(486,600) scale(${lerp(1.35, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
          <rect x={-390} y={-110} width={780} height={220} rx={28} fill={C.espresso} stroke={C.goldBright} strokeWidth={7} />
          <Sparkle x={-320} y={0} s={1.1} />
          <Sparkle x={320} y={0} s={1.1} />
          <text y={-28} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={5} fill={C.goldBright}>
            HEPSİNİN ARKASINDAKİ İMZA
          </text>
          <text y={44} textAnchor="middle" fontFamily={D} fontSize={62} fill={C.cream}>
            Bir Öğretmenin Emeği
          </text>
        </g>
      )}
    </Art>
  );
};

/** S03: 5 Bin Yıllık Kadimlik — Kil Tablet -> Parşömen -> Kara Tahta */
export const S03Kadimlik: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <text x={486} y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={5} fill={C.rust}>
        5 BİN YILLIK KESİNTİSİZ MİRAS
      </text>

      {/* Zaman çizgisi oku */}
      <line x1={140} y1={415} x2={lerp(140, 830, Math.max(p0 * 0.35, p1 * 0.7, p2))} y2={415} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />

      {/* 1. Kil Tablet */}
      <g transform={`translate(195,415) scale(${p0})`}>
        <rect x={-115} y={-165} width={230} height={310} rx={28} fill="#C6A074" stroke={INK} strokeWidth={6} />
        <line x1={-66} y1={-85} x2={66} y2={-85} stroke={INK} strokeWidth={5} opacity={0.55} />
        <line x1={-66} y1={-45} x2={46} y2={-45} stroke={INK} strokeWidth={5} opacity={0.55} />
        <line x1={-66} y1={-5} x2={60} y2={-5} stroke={INK} strokeWidth={5} opacity={0.55} />
        <text y={90} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.espresso}>KİL TABLET</text>
        <text y={122} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.espresso}>M.Ö. 3000</text>
      </g>

      {/* 2. Parşömen */}
      {p1 > 0.05 && (
        <g transform={`translate(486,415) scale(${p1})`}>
          <rect x={-115} y={-165} width={230} height={310} rx={18} fill={C.paper} stroke={INK} strokeWidth={6} />
          <rect x={-125} y={-172} width={250} height={30} rx={12} fill={C.gold} stroke={INK} strokeWidth={5} />
          <rect x={-125} y={122} width={250} height={30} rx={12} fill={C.gold} stroke={INK} strokeWidth={5} />
          <text y={-40} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>İlim</text>
          <text y={12} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.goldDeep}>İrfan</text>
          <text y={92} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.espresso}>PARŞÖMEN</text>
        </g>
      )}

      {/* 3. Bugünün Tahtası */}
      {p2 > 0.05 && (
        <g transform={`translate(777,415) scale(${p2})`}>
          <rect x={-125} y={-165} width={250} height={310} rx={22} fill="#1A3A32" stroke={C.goldBright} strokeWidth={7} />
          <Sparkle x={0} y={-88} s={1.0} />
          <text y={-8} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.cream}>BUGÜN</text>
          <text y={44} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>ÖĞRETMENLİK</text>
          <text y={102} textAnchor="middle" fontFamily={M} fontSize={19} fill={C.tealSoft}>HİÇ EKSİLMEDİ</text>
        </g>
      )}

      <text x={486} y={715} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.espresso}>
        ÇAĞLAR DEĞİŞTİ · İNSANI YETİŞTİREN O SES KALDI
      </text>
    </Art>
  );
};

/** S04 (DARK): 24 Kasım 1928 — Başöğretmen Kara Tahtanın Başında */
export const S04Basogretmen: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.14);

  return (
    <Art bg={C.espresso2}>
      {/* Altın spot ışığı */}
      <circle cx={486} cy={355} r={340 * pulse} fill={C.gold} opacity={0.14} />

      {/* Altın çerçeveli Kara Tahta (Millet Mektepleri) */}
      <g transform={`translate(486,335) scale(${p0})`}>
        <rect x={-390} y={-230} width={780} height={440} rx={24} fill="#132924" stroke={C.goldBright} strokeWidth={8} />
        <rect x={-366} y={-206} width={732} height={392} rx={14} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={0.5} />

        {/* Tarih */}
        <text y={-130} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={30} letterSpacing={6} fill={C.goldBright}>
          24 KASIM 1928
        </text>

        {/* Beat 1: Yeni Harfler ve Millet Mektepleri */}
        {p1 > 0.05 && (
          <g opacity={Math.min(1, p1 * 2)}>
            <text y={-22} textAnchor="middle" fontFamily={D} fontSize={74} letterSpacing={10} fill={C.cream}>
              A B C Ç D E F G
            </text>
            <line x1={-290} y1={24} x2={290} y2={24} stroke={C.gold} strokeWidth={4} opacity={0.7} />
            <text y={82} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={5} fill={C.tealSoft}>
              MİLLET MEKTEPLERİ
            </text>
          </g>
        )}

        {/* Tebeşir rafı */}
        <rect x={-410} y={204} width={820} height={24} rx={8} fill={C.goldDeep} stroke={C.goldBright} strokeWidth={3} />
      </g>

      {/* Beat 2: BAŞÖĞRETMEN Onur Madalyonu */}
      {p2 > 0.05 && (
        <g transform={`translate(486,675) scale(${lerp(1.4, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
          <rect x={-360} y={-58} width={720} height={116} rx={22} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <Sparkle x={-300} y={0} s={1.0} />
          <text y={14} textAnchor="middle" fontFamily={D} fontSize={52} fill={C.goldBright}>
            BAŞÖĞRETMEN ÜNVANI
          </text>
          <Sparkle x={300} y={0} s={1.0} />
        </g>
      )}
    </Art>
  );
};

/** S05: Kalbe Dokunan An — "Sana inanıyorum." -> Çocuğun Kaderi Değişir */
export const S05Kader: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art>
      <Room wall="#F4ECDC" floor="#DECBA9" floorY={655} stripes>
        {/* Öğretmen solda sıcak gülümsemeyle konuşuyor */}
        <Person
          x={275} y={655} s={0.96 * p0} face={1}
          top={C.teal} pants="#243242" style="cardigan"
          hairStyle="short" glasses mood="smile"
          armF={[lerp(15, 72, p1), 16]}
          armB={[12, 12]}
        />

        {/* Öğrenci sağda: önce üzgün/çekingen, Beat 1'de gülümsüyor, Beat 2'de parlıyor! */}
        <Person
          x={705} y={655} s={0.82 * p0} face={-1}
          top={p2 > 0.3 ? C.gold : C.coral} pants="#354659" style="hoodie"
          hairStyle="messy" mood={p2 > 0.25 ? "grin" : p1 > 0.35 ? "smile" : "sad"}
          armF={[lerp(8, 125, p2), lerp(8, 25, p2)]}
          armB={[lerp(8, 125, p2), lerp(8, 25, p2)]}
        />

        {/* Beat 1: "Sana inanıyorum." Konuşma Balonu */}
        {p1 > 0.05 && (
          <Speech x={486} y={205} w={500} h={146} tailX={-120} s={p1}>
            <text y={-10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.teal}>
              TEK BİR CÜMLE
            </text>
            <text y={44} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.espresso}>
              “Sana inanıyorum.”
            </text>
          </Speech>
        )}

        {/* Beat 2: Çocuğun etrafında açan altın yıldızlar & Kader değişti bandı */}
        {p2 > 0.05 && (
          <g opacity={Math.min(1, p2 * 2)}>
            <Sparkle x={600} y={320} s={1.15 * p2} />
            <Sparkle x={815} y={330} s={1.15 * p2} />
            <Sparkle x={705} y={255} s={1.3 * p2} />
            <g transform={`translate(486,730) scale(${p2})`}>
              <rect x={-320} y={-36} width={640} height={72} rx={16} fill={C.espresso} stroke={C.gold} strokeWidth={5} />
              <text y={11} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={27} letterSpacing={3} fill={C.goldBright}>
                BİR ÇOCUĞUN BÜTÜN KADERİ DEĞİŞİR
              </text>
            </g>
          </g>
        )}
      </Room>
    </Art>
  );
};
