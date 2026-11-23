import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, prog, shake, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Table, Clock, Check, Cross, Speech, Sparkle, Anger, Sweat, AW, AH, M, D } from "../../motor/art/kit";

/** Küçük ortak bileşen: Dilekçe kâğıdı */
const Petition: React.FC<{ x?: number; y?: number; r?: number; s?: number; title?: string; stamp?: string; stampColor?: string }> = ({
  x = 0, y = 0, r = 0, s = 1, title = "DİLEKÇE", stamp, stampColor = C.coral,
}) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <rect x={-52} y={-68} width={104} height={136} rx={10} fill={C.cream} stroke={INK} strokeWidth={5} />
    <text y={-40} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={16} fill={C.espresso}>{title}</text>
    <line x1={-34} y1={-22} x2={34} y2={-22} stroke={INK} strokeWidth={3.5} opacity={0.45} />
    <line x1={-34} y1={-6} x2={26} y2={-6} stroke={INK} strokeWidth={3.5} opacity={0.45} />
    <line x1={-34} y1={10} x2={30} y2={10} stroke={INK} strokeWidth={3.5} opacity={0.45} />
    <line x1={-34} y1={26} x2={16} y2={26} stroke={INK} strokeWidth={3.5} opacity={0.45} />
    {stamp ? (
      <g transform="translate(0,30) rotate(-14)">
        <rect x={-40} y={-16} width={80} height={32} rx={6} fill={C.cream} stroke={stampColor} strokeWidth={4} />
        <text y={6} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={16} fill={stampColor}>{stamp}</text>
      </g>
    ) : null}
  </g>
);

/** S01: Öğretmen dilekçeyi uzatıyor -> Müdür "Yerine öğretmen yok" -> RET damgası */
export const S01KancaA: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 12, 12);

  return (
    <Art>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <Room wall="#EDE3D0" floor="#D7C4A3" floorY={635} stripes>
          <Clock x={486} y={120} time={frame * 0.4 + 45} />
          <Table x={625} y={635} w={290} />

          {/* Öğretmen solda dilekçeyi uzatıyor */}
          <Person
            x={255} y={635} s={0.96} face={1}
            top={C.teal} pants="#2F3D4E" style="cardigan"
            hairStyle="short" glasses mood={p2 > 0.2 ? "shock" : p1 > 0.2 ? "worry" : "neutral"}
            armF={[lerp(18, 76, p0), lerp(10, 18, p0)]}
            armB={[10, 10]}
            heldF={<Petition y={10} s={0.78} r={-8} />}
          />
          {p2 > 0.3 && <Sweat x={190} y={295} s={0.9 * p2} />}

          {/* Müdür sağda masanın arkasında */}
          <Person
            x={735} y={635} s={0.98} face={-1}
            top={C.espresso2} pants="#1F1915" style="cardigan"
            hairStyle="gray" mustache mood={p1 > 0.2 ? "angry" : "smug"}
            armF={[lerp(12, 84, p1), lerp(10, 26, p1)]}
            armB={[10, 10]}
          />
          {p1 > 0.2 && <Anger x={815} y={280} s={0.9 * p1} />}

          {/* Beat 1: Konuşma balonu */}
          {p1 > 0.05 && (
            <Speech x={520} y={210} w={370} h={118} tailX={110} s={p1}>
              <text y={-8} textAnchor="middle" fontFamily={D} fontSize={34} fill={C.coral}>“Yerine girecek</text>
              <text y={32} textAnchor="middle" fontFamily={D} fontSize={34} fill={C.espresso}>öğretmen yok!”</text>
            </Speech>
          )}

          {/* Beat 2: Büyük RET damgası */}
          {p2 > 0.05 && (
            <g transform={`translate(486,445) rotate(-9) scale(${lerp(2.2, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
              <rect x={-215} y={-48} width={430} height={96} rx={16} fill={C.cream} stroke={C.coral} strokeWidth={9} />
              <text y={15} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={44} letterSpacing={5} fill={C.coral}>
                REDDEDİLDİ
              </text>
            </g>
          )}
        </Room>
      </g>
    </Art>
  );
};

/** S02: RET damgası kırılıyor -> Yeşil Kanun Kalkanı -> YASAL HAK REDDEDİLEMEZ */
export const S02KancaB: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 10, 10);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Beat 0: Havada beliren kırmızı RET mührü */}
        <g transform={`translate(486,260) scale(${p0})`}>
          <g transform={`translate(${-p1 * 60},0) rotate(${-p1 * 18})`} opacity={1 - p1 * 0.65}>
            <rect x={-160} y={-44} width={155} height={88} rx={12} fill={C.coralSoft} stroke={C.coral} strokeWidth={6} />
            <text x={-82} y={16} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={44} fill={C.coral}>RET</text>
          </g>
          <g transform={`translate(${p1 * 60},0) rotate(${p1 * 18})`} opacity={1 - p1 * 0.65}>
            <rect x={5} y={-44} width={155} height={88} rx={12} fill={C.coralSoft} stroke={C.coral} strokeWidth={6} />
            <text x={82} y={16} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={44} fill={C.coral}>YOK</text>
          </g>
        </g>

        {/* Beat 1: Büyük yeşil kanun kalkanı */}
        {p1 > 0.05 && (
          <g transform={`translate(486,425) scale(${p1})`}>
            <path
              d="M0 -175 L155 -115 V25 C155 125 75 180 0 215 C-75 180 -155 125 -155 25 V-115 Z"
              fill={C.teal} stroke={INK} strokeWidth={7} strokeLinejoin="round"
            />
            <path
              d="M0 -142 L124 -94 V20 C124 102 60 148 0 176 C-60 148 -124 102 -124 20 V-94 Z"
              fill="none" stroke={C.goldBright} strokeWidth={4}
            />
            <text y={-22} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} fill={C.goldBright}>657 DMK</text>
            <text y={34} textAnchor="middle" fontFamily={D} fontSize={58} fill={C.cream}>m. 104</text>
            <Check x={0} y={118} s={1.15} color={C.green} />
          </g>
        )}

        {/* Beat 2: Net alt mühür */}
        {p2 > 0.05 && (
          <g transform={`translate(486,695) scale(${lerp(1.6, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-320} y={-46} width={640} height={92} rx={18} fill={C.espresso} stroke={C.gold} strokeWidth={6} />
            <text y={14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={34} letterSpacing={4} fill={C.goldBright}>
              YASAL İZİN REDDEDİLEMEZ
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S03: Ters Terazi — Ders Programı vs 657 Kanun */
export const S03Celiski: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const tilt = lerp(-14, 15, p2);

  return (
    <Art bg={C.cream}>
      {/* Terazi direği */}
      <g transform={`translate(486,160) scale(${p0})`}>
        <rect x={-12} y={40} width={24} height={440} rx={8} fill={C.goldDeep} stroke={INK} strokeWidth={5} />
        <rect x={-120} y={468} width={240} height={36} rx={12} fill={C.espresso} stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={46} r={22} fill={C.goldBright} stroke={INK} strokeWidth={5} />

        {/* Terazi kolu */}
        <g transform={`translate(0,46) rotate(${tilt})`}>
          <rect x={-310} y={-10} width={620} height={20} rx={10} fill={C.gold} stroke={INK} strokeWidth={5} />

          {/* Sol kefe: Ders Programı (Hafif / Yukarıda) */}
          <g transform={`translate(-270,0) rotate(${-tilt})`}>
            <line x1={0} y1={0} x2={-66} y2={155} stroke={INK} strokeWidth={4} />
            <line x1={0} y1={0} x2={66} y2={155} stroke={INK} strokeWidth={4} />
            <path d="M-98 155 Q0 205 98 155 Z" fill={C.coral} stroke={INK} strokeWidth={5} />
            <rect x={-110} y={64} width={220} height={86} rx={14} fill={C.cream} stroke={C.coral} strokeWidth={5} />
            <text y={102} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coral}>DERS PROGRAMI</text>
            <text y={132} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.muted}>“Boş geçer” bahanesi</text>
          </g>

          {/* Sağ kefe: 657 Kanun (Ağır / Aşağıda) */}
          <g transform={`translate(270,0) rotate(${-tilt})`}>
            <line x1={0} y1={0} x2={-66} y2={155} stroke={INK} strokeWidth={4} />
            <line x1={0} y1={0} x2={66} y2={155} stroke={INK} strokeWidth={4} />
            <path d="M-98 155 Q0 205 98 155 Z" fill={C.teal} stroke={INK} strokeWidth={5} />
            {p1 > 0.05 && (
              <g transform={`scale(${p1})`}>
                <rect x={-115} y={56} width={230} height={94} rx={14} fill={C.espresso} stroke={C.gold} strokeWidth={5} />
                <text y={98} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.goldBright}>657 DMK</text>
                <text y={132} textAnchor="middle" fontFamily={M} fontSize={19} fill={C.cream}>KANUNİ ZORUNLULUK</text>
              </g>
            )}
          </g>
        </g>
      </g>

      {p2 > 0.05 && (
        <g transform={`translate(486,718) scale(${p2})`}>
          <Cross x={-240} y={0} s={0.9} />
          <text x={24} y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} fill={C.espresso}>
            MÜDÜRÜN SÖZÜ KANUNDAN ÜSTÜN DEĞİL
          </text>
        </g>
      )}
    </Art>
  );
};

/** S04: 657 DMK m. 104 Açık Kitap -> "VERİLEBİLİR" üstü çizilir, "VERİLİR" altınla vurgulanır */
export const S04Kanun: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Açık Kanun Kitabı */}
      <g transform={`translate(486,370) scale(${p0})`}>
        <rect x={-370} y={-230} width={740} height={460} rx={24} fill={C.espresso} stroke={INK} strokeWidth={6} />
        <rect x={-346} y={-206} width={334} height={412} rx={12} fill={C.paper} stroke={INK} strokeWidth={4} />
        <rect x={12} y={-206} width={334} height={412} rx={12} fill={C.paper} stroke={INK} strokeWidth={4} />
        <line x1={0} y1={-210} x2={0} y2={210} stroke={C.gold} strokeWidth={6} />

        {/* Sol sayfa */}
        <text x={-179} y={-142} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.rust}>657 SAYILI KANUN</text>
        <text x={-179} y={-86} textAnchor="middle" fontFamily={D} fontSize={62} fill={C.espresso}>MADDE 104</text>
        <line x1={-295} y1={-54} x2={-65} y2={-54} stroke={C.gold} strokeWidth={4} />
        <text x={-179} y={8} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.muted}>“Verilebilir”</text>
        {p1 > 0.05 && (
          <line
            x1={-285} y1={-2} x2={lerp(-285, -75, p1)} y2={-2}
            stroke={C.coral} strokeWidth={9} strokeLinecap="round"
          />
        )}
        <text x={-179} y={76} textAnchor="middle" fontFamily={M} fontSize={21} fill={C.coral}>TAKDİR YOK!</text>

        {/* Sağ sayfa */}
        <text x={179} y={-142} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.teal}>KANUN METNİ</text>
        {p1 > 0.05 && (
          <g transform={`translate(179,-20) scale(${p1})`}>
            <rect x={-136} y={-52} width={272} height={106} rx={16} fill={C.goldBright} stroke={INK} strokeWidth={5} />
            <text y={-8} textAnchor="middle" fontFamily={M} fontSize={20} fill={C.espresso}>İSTEĞİ ÜZERİNE</text>
            <text y={38} textAnchor="middle" fontFamily={D} fontSize={52} fill={C.espresso}>“VERİLİR”</text>
          </g>
        )}
        {p2 > 0.05 && (
          <g transform={`translate(179,115) scale(${p2})`}>
            <rect x={-130} y={-34} width={260} height={68} rx={14} fill={C.teal} stroke={INK} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.cream}>BAĞLI YETKİ</text>
          </g>
        )}
      </g>

      {p2 > 0.05 && (
        <g transform={`translate(486,695) scale(${p2})`}>
          <Sparkle x={-290} y={0} s={0.9} />
          <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} fill={C.espresso}>
            AMİRİN KEYFİNE BIRAKILAMAZ
          </text>
          <Sparkle x={290} y={0} s={0.9} />
        </g>
      )}
    </Art>
  );
};

/** S05: 3 Kesin Hak Takvim Kartı — Evlilik (7), Babalık/Doğum (10), Ölüm (7) */
export const S05Haklar: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  const cards = [
    { p: p0, x: 185, title: "EVLİLİK", days: "7", sub: "Kendisi / Çocuğu", col: C.teal },
    { p: p1, x: 486, title: "DOĞUM", days: "10", sub: "Babalık İzni", col: C.goldDeep },
    { p: p2, x: 787, title: "ÖLÜM", days: "7", sub: "Eş · Çocuk · Anne · Baba", col: C.espresso },
  ];

  return (
    <Art bg={C.cream}>
      <text x={486} y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={4} fill={C.rust}>
        657 DMK m.104/B · KESİN HAKLAR
      </text>
      {cards.map((c, idx) => (
        <g key={idx} transform={`translate(${c.x},425) scale(${c.p})`} opacity={Math.min(1, c.p * 2)}>
          {/* Takvim gövdesi */}
          <rect x={-130} y={-235} width={260} height={460} rx={24} fill={C.paper} stroke={INK} strokeWidth={6} />
          <rect x={-130} y={-235} width={260} height={82} rx={20} fill={c.col} stroke={INK} strokeWidth={6} />
          <text y={-183} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={3} fill={C.cream}>
            {c.title}
          </text>
          <text y={10} textAnchor="middle" fontFamily={D} fontSize={132} fill={c.col}>{c.days}</text>
          <text y={68} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={5} fill={C.espresso}>
            GÜN
          </text>
          <line x1={-90} y1={104} x2={90} y2={104} stroke={INK} strokeWidth={3} opacity={0.25} />
          <text y={144} textAnchor="middle" fontFamily={M} fontSize={17} fill={C.muted}>{c.sub}</text>
          <Check x={0} y={205} s={0.95} color={C.green} />
        </g>
      ))}
    </Art>
  );
};

/** S06: Ayrım — 104/B (Bağlı Yetki) vs 104/C (10 Gün Genel Mazeret -> Kaymakam/Vali) */
export const S06Ayrim: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Sol Kutu: 104/B */}
      <g transform={`translate(256,370) scale(${p0})`}>
        <rect x={-205} y={-250} width={410} height={470} rx={28} fill={C.tealSoft} stroke={INK} strokeWidth={6} />
        <rect x={-170} y={-215} width={340} height={58} rx={12} fill={C.teal} stroke={INK} strokeWidth={4} />
        <text y={-178} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.cream}>657 m. 104/B</text>
        <text y={-78} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>Evlilik · Doğum</text>
        <text y={-28} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>Ölüm İzinleri</text>
        <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.teal}>MÜDÜR TAKDİRİ:</text>
        <text y={128} textAnchor="middle" fontFamily={D} fontSize={78} fill={C.green}>SIFIR</text>
        <Check x={0} y={195} s={1.0} color={C.green} />
      </g>

      {/* Sağ Kutu: 104/C */}
      {p1 > 0.05 && (
        <g transform={`translate(716,370) scale(${p1})`}>
          <rect x={-205} y={-250} width={410} height={470} rx={28} fill={C.paper} stroke={INK} strokeWidth={6} />
          <rect x={-170} y={-215} width={340} height={58} rx={12} fill={C.espresso} stroke={C.gold} strokeWidth={4} />
          <text y={-178} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.goldBright}>657 m. 104/C</text>
          <text y={-78} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>Genel Mazeret</text>
          <text y={-28} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>(Yılda 10 Gün)</text>
          <text y={52} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.rust}>ONAY YETKİSİ:</text>
          {p2 > 0.05 && (
            <g transform={`translate(0,124) scale(${p2})`}>
              <rect x={-172} y={-44} width={344} height={88} rx={16} fill={C.goldBright} stroke={INK} strokeWidth={5} />
              <text y={-4} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.espresso}>KAYMAKAM / VALİ</text>
              <text y={28} textAnchor="middle" fontFamily={M} fontSize={19} fill={C.rust}>(Okul müdürü değil!)</text>
            </g>
          )}
        </g>
      )}

      {/* Ortada ≠ rozeti */}
      <g transform={`translate(486,370) scale(${p1})`}>
        <circle r={42} fill={C.coral} stroke={INK} strokeWidth={5} />
        <text y={18} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.cream}>≠</text>
      </g>

      <text x={486} y={725} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.espresso}>
        HER İKİ DURUMDA DA MÜDÜR TEK BAŞINA REDDEDEMEZ
      </text>
    </Art>
  );
};
