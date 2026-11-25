import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, shake, lerp } from "../../motor/anim";
import { INK } from "../../motor/art/Person";
import { Art, Check, Speech, Sparkle, M, D } from "../../motor/art/kit";

/** S06: Anayasa m.129/5 Rücu Akışı — İdare Öder -> Kusurlu Yöneticinin Cebinden Tahsil Eder! */
export const S06Rucu: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 12, 10);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <text x={486} y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.rust}>
          ANAYASA MADDE 129/5 · RÜCU ZİNCİRİ
        </text>

        {/* 1. Üst Kutu: İDARE (DEVLET) */}
        <g transform={`translate(245,280) scale(${p0})`}>
          <rect x={-175} y={-95} width={350} height={190} rx={24} fill={C.espresso} stroke={C.gold} strokeWidth={6} />
          <text y={-18} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.goldBright}>1. ADIM</text>
          <text y={36} textAnchor="middle" fontFamily={D} fontSize={50} fill={C.cream}>İDARE</text>
          <text y={72} textAnchor="middle" fontFamily={M} fontSize={20} fill={C.paperDark}>Tazminatı Öder</text>
        </g>

        {/* Ok 1: İdare -> Öğretmen */}
        {p1 > 0.05 && (
          <g opacity={p1}>
            <line x1={426} y1={280} x2={lerp(426, 540, p1)} y2={280} stroke={C.teal} strokeWidth={10} strokeLinecap="round" />
            <polygon points="546,280 520,262 520,298" fill={C.teal} />
            <text x={486} y={248} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.teal}>₺ ÖDER</text>
          </g>
        )}

        {/* 2. Sağ Kutu: ÖĞRETMEN */}
        {p1 > 0.05 && (
          <g transform={`translate(725,280) scale(${p1})`}>
            <rect x={-175} y={-95} width={350} height={190} rx={24} fill={C.teal} stroke={INK} strokeWidth={6} />
            <text y={-18} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.goldBright}>HAK SAHİBİ</text>
            <text y={36} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.cream}>ÖĞRETMEN</text>
            <text y={72} textAnchor="middle" fontFamily={M} fontSize={20} fill={C.tealSoft}>Tazminatını Alır</text>
          </g>
        )}

        {/* Ok 2 (Kırmızı Rücu Oku): İdare -> Kusurlu Yönetici */}
        {p2 > 0.05 && (
          <g opacity={p2}>
            <line x1={245} y1={382} x2={245} y2={lerp(382, 495, p2)} stroke={C.coral} strokeWidth={10} strokeLinecap="round" />
            <polygon points="245,505 227,478 263,478" fill={C.coral} />
          </g>
        )}

        {/* 3. Alt Büyük Kutu: KUSURLU YÖNETİCİYE RÜCU! */}
        {p2 > 0.05 && (
          <g transform={`translate(486,615) scale(${lerp(1.35, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-390} y={-105} width={780} height={210} rx={28} fill={C.coral} stroke={INK} strokeWidth={7} />
            <text y={-30} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.goldBright}>
              2. ADIM · ZORUNLU RÜCU
            </text>
            <text y={34} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.cream}>
              Kusurlu Yöneticinin Cebinden!
            </text>
            <text y={78} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coralSoft}>
              İDARE ÖDEDİĞİ TUTARI BİZZAT TAHSİL EDER
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S07: 3 Adımlı Korunma Kontrol Listesi */
export const S07Adimlar: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  const items = [
    { p: p0, y: 185, num: "01", title: "Programı Tarihli Sakla", sub: "PDF / FOTOĞRAF / E-OKUL ÇIKTISI", bg: C.paper, fg: C.espresso },
    { p: p1, y: 405, num: "02", title: "Yazılı Dilekçe & DYS", sub: "EVRAK KAYIT NUMARASI MUTLAKA AL", bg: C.tealSoft, fg: C.espresso },
    { p: p2, y: 625, num: "03", title: "Eşitsizliği Belgele", sub: "ZÜMRE KARŞILAŞTIRMASI & HUKUKİ YOL", bg: C.espresso, fg: C.goldBright },
  ];

  return (
    <Art bg={C.cream}>
      {items.map((it) => (
        <g key={it.num} transform={`translate(486,${it.y}) scale(${it.p})`} opacity={Math.min(1, it.p * 2)}>
          <rect x={-375} y={-78} width={750} height={156} rx={24} fill={it.bg} stroke={INK} strokeWidth={6} />
          <circle cx={-295} cy={0} r={44} fill={C.gold} stroke={INK} strokeWidth={4} />
          <text x={-295} y={15} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>{it.num}</text>
          <text x={25} y={-10} textAnchor="middle" fontFamily={D} fontSize={44} fill={it.fg}>{it.title}</text>
          <text x={25} y={36} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={21} fill={it.bg === C.espresso ? C.cream : C.muted}>
            {it.sub}
          </text>
          <Check x={312} y={0} s={1.0} color={C.green} />
        </g>
      ))}
    </Art>
  );
};

/** S08: Dosya Bilançosu */
export const S08Bilanco: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <text x={486} y={104} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={5} fill={C.rust}>
        MEVZUAT BİLANÇOSU
      </text>

      <g transform={`translate(262,380) scale(${p0})`}>
        <rect x={-200} y={-215} width={400} height={410} rx={30} fill={C.teal} stroke={INK} strokeWidth={7} />
        <text y={-20} textAnchor="middle" fontFamily={D} fontSize={148} fill={C.goldBright}>1</text>
        <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={2} fill={C.cream}>HAKKANİYET KURALI</text>
        <text y={108} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.tealSoft}>657 DMK m. 10</text>
      </g>

      {p1 > 0.05 && (
        <g transform={`translate(710,380) scale(${p1})`}>
          <rect x={-200} y={-215} width={400} height={410} rx={30} fill={C.coral} stroke={INK} strokeWidth={7} />
          <text y={-20} textAnchor="middle" fontFamily={D} fontSize={148} fill={C.cream}>0</text>
          <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={2} fill={C.cream}>MOBBİNG HAKKI</text>
          <text y={108} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.coralSoft}>ANAYASA m. 129/5</text>
        </g>
      )}

      {p2 > 0.05 && (
        <g transform={`translate(486,695) scale(${p2})`}>
          <rect x={-370} y={-44} width={740} height={88} rx={18} fill={C.espresso} stroke={C.gold} strokeWidth={5} />
          <text y={11} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.goldBright}>
            KEYFİ UYGULAMANIN BEDELİ RÜCUYLA ÖDENİR
          </text>
        </g>
      )}
    </Art>
  );
};

/** S09: Kapanış & CTA */
export const S09Kapanis: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <Speech x={486} y={205} w={770} h={176} tailX={0} s={p0}>
        <text y={-14} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>
          Senin okulunda da ders programında
        </text>
        <text y={40} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.coral}>
          adaletsizlik yapıldı mı?
        </text>
      </Speech>

      {p1 > 0.05 && (
        <g transform={`translate(486,430) scale(${p1})`}>
          <rect x={-310} y={-48} width={620} height={96} rx={22} fill={C.paper} stroke={C.gold} strokeWidth={6} />
          <text y={14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} fill={C.espresso}>
            💬 DENEYİMİNİ YORUMLARA YAZ
          </text>
        </g>
      )}

      {p2 > 0.05 && (
        <g transform={`translate(486,600) scale(${p2})`}>
          <rect x={-360} y={-72} width={720} height={144} rx={26} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <Sparkle x={-305} y={0} s={0.95} />
          <text y={-10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={34} letterSpacing={2.5} fill={C.goldBright}>
            + TAKİP ET · @gyskamu
          </text>
          <text y={38} textAnchor="middle" fontFamily={M} fontSize={23} fill={C.cream}>
            EKYS & ÖĞRETMEN HAKLARI ARŞİVİ
          </text>
          <Sparkle x={305} y={0} s={0.95} />
        </g>
      )}

      <text x={486} y={755} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.muted}>
        Genel bilgilendirme amaçlıdır · Olay ve kişiler canlandırmadır
      </text>
    </Art>
  );
};
