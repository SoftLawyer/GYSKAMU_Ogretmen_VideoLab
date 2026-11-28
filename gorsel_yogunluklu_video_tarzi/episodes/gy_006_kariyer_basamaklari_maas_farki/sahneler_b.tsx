import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { INK } from "../../motor/art/Person";
import { Art, Cross, Speech, Sparkle, M, D } from "../../motor/art/kit";

/** S06: Asıl Şok — Emekli Olduğun Gün Tazminat SIFIRLANIYOR! */
export const S06EmeklilikSok: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 14, 12);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <text x={486} y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.coral}>
          İKİ TARAFIN DA ŞAŞIRDIĞI ASIL GERÇEK
        </text>

        {/* Sol: Görevde +%120 */}
        <g transform={`translate(245,320) scale(${p0})`}>
          <rect x={-180} y={-140} width={360} height={280} rx={26} fill={C.teal} stroke={INK} strokeWidth={7} />
          <text y={-50} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>AKTİF GÖREVDE</text>
          <text y={35} textAnchor="middle" fontFamily={D} fontSize={92} fill={C.cream}>+%120</text>
          <text y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.tealSoft}>TAZMİNAT ÖDENİR</text>
        </g>

        {/* Ok */}
        {p1 > 0.05 && (
          <g opacity={p1}>
            <line x1={432} y1={320} x2={lerp(432, 535, p1)} y2={320} stroke={C.coral} strokeWidth={12} strokeLinecap="round" />
            <polygon points="544,320 516,300 516,340" fill={C.coral} />
          </g>
        )}

        {/* Sağ: Emekli Olduğun Gün 0 TL */}
        {p1 > 0.05 && (
          <g transform={`translate(728,320) scale(${lerp(1.4, 1, p2)})`} opacity={Math.min(1, p1 * 2)}>
            <rect x={-180} y={-140} width={360} height={280} rx={26} fill={C.coral} stroke={INK} strokeWidth={7} />
            <text y={-50} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>EMEKLİ OLDUĞUN GÜN</text>
            <text y={38} textAnchor="middle" fontFamily={D} fontSize={106} fill={C.cream}>0 TL</text>
            <text y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.coralSoft}>KESENEK KESİLMİYOR!</text>
          </g>
        )}

        {/* Beat 2: Alt Damga */}
        {p2 > 0.05 && (
          <g transform={`translate(486,620) scale(${lerp(1.35, 1, p2)})`}>
            <rect x={-390} y={-72} width={780} height={144} rx={26} fill={C.espresso} stroke={C.coral} strokeWidth={8} />
            <text y={-14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={3} fill={C.goldBright}>
              EMEKLİ AYLIĞI & İKRAMİYEYE YANSIMIYOR
            </text>
            <text y={40} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.coral}>
              O FARK BİR ANDA SIFIRLANIYOR!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S07: Ek Ders & Tazminat Emekliliğe Yansımıyor -> Gelir Kaybı */
export const S07EkDers: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Kart 1: Ek Ders */}
      <g transform={`translate(486,195) scale(${p0})`}>
        <rect x={-375} y={-76} width={750} height={152} rx={24} fill={C.paper} stroke={INK} strokeWidth={6} />
        <Cross x={-295} y={0} s={1.15} />
        <text x={32} y={-8} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>Ek Ders Ücretleri</text>
        <text x={32} y={38} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coral}>EMEKLİLİK MATRAHINA GİRMİYOR</text>
      </g>

      {/* Kart 2: Uzman / Başöğretmen Tazminatı */}
      {p1 > 0.05 && (
        <g transform={`translate(486,405) scale(${p1})`}>
          <rect x={-375} y={-76} width={750} height={152} rx={24} fill={C.coralSoft} stroke={C.coral} strokeWidth={6} />
          <Cross x={-295} y={0} s={1.15} />
          <text x={32} y={-8} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>Başöğretmen Tazminatı</text>
          <text x={32} y={38} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coral}>EMEKLİLİKTE DÜZ ÖĞRETMEN HESABI</text>
        </g>
      )}

      {/* Kart 3: Sonuç */}
      {p2 > 0.05 && (
        <g transform={`translate(486,625) scale(${lerp(1.3, 1, p2)})`}>
          <rect x={-375} y={-78} width={750} height={156} rx={26} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <text y={-12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={3} fill={C.goldBright}>
            İŞTE ASIL SEBEP
          </text>
          <text y={40} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.cream}>
            Emeklilikte Ciddi Gelir Kaybı!
          </text>
        </g>
      )}
    </Art>
  );
};

/** S08: Özlük Hakkı Bilançosu */
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
          ÖZLÜK HAKKI BİLANÇOSU
        </text>

        <g transform={`translate(262,375) scale(${p0})`}>
          <rect x={-200} y={-205} width={400} height={395} rx={30} fill={C.teal} stroke={INK} strokeWidth={7} />
          <text y={-18} textAnchor="middle" fontFamily={D} fontSize={88} fill={C.goldBright}>%60–120</text>
          <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={2} fill={C.cream}>GÖREVDE FARK</text>
          <text y={108} textAnchor="middle" fontFamily={M} fontSize={21} fill={C.tealSoft}>7528 ÖMK · 657 m.152</text>
        </g>

        {p1 > 0.05 && (
          <g transform={`translate(710,375) scale(${p1})`}>
            <rect x={-200} y={-205} width={400} height={395} rx={30} fill={C.coral} stroke={INK} strokeWidth={7} />
            <text y={-18} textAnchor="middle" fontFamily={D} fontSize={118} fill={C.cream}>0 TL</text>
            <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={2} fill={C.cream}>EMEKLİLİĞE YANSIMA</text>
            <text y={108} textAnchor="middle" fontFamily={M} fontSize={21} fill={C.coralSoft}>KESENEK KESİLMİYOR</text>
          </g>
        )}

        {p2 > 0.05 && (
          <g transform={`translate(486,690) scale(${lerp(1.25, 1, p2)})`}>
            <rect x={-385} y={-46} width={770} height={92} rx={20} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
            <text y={11} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.goldBright}>
              GÖREVDE ÜNVAN VAR, EMEKLİLİKTE SIFIRLANIYOR!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S09: Kapanış — 1 mi 2 mi? + Açıklamayı Mutlaka Oku + @gyskamu */
export const S09Kapanis: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const bounce = Math.sin(frame * 0.45) * 6;

  return (
    <Art bg={C.cream}>
      <Speech x={486} y={185} w={780} h={164} tailX={0} s={p0}>
        <text y={-12} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>
          Kıdem Ödülü mü · Eşit Ücret mi?
        </text>
        <text y={40} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.coral}>
          SEN HANGİ TARAFTASIN?
        </text>
      </Speech>

      {/* Beat 1: Açıklamaya Yönlendiren Altın Kart */}
      {p1 > 0.05 && (
        <g transform={`translate(486,${405 + bounce * 0.4}) scale(${p1})`}>
          <rect x={-375} y={-64} width={750} height={128} rx={26} fill={C.goldBright} stroke={INK} strokeWidth={6} />
          <text y={-12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2.5} fill={C.rust}>
            👇 AÇIKLAMAYI MUTLAKA OKU 👇
          </text>
          <text y={36} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.espresso}>
            Tüm Kanun Maddeleri Aşağıda!
          </text>
        </g>
      )}

      {/* Beat 2: Paylaş & Takip Et */}
      {p2 > 0.05 && (
        <g transform={`translate(486,605) scale(${lerp(1.25, 1, p2)})`}>
          <rect x={-365} y={-72} width={730} height={144} rx={26} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <Sparkle x={-310} y={0} s={0.95} />
          <text y={-12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.cream}>
            ✈️ ÖĞRETMEN ARKADAŞINA GÖNDER
          </text>
          <text y={38} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={2.5} fill={C.goldBright}>
            + TAKİP ET · @gyskamu
          </text>
          <Sparkle x={310} y={0} s={0.95} />
        </g>
      )}

      <text x={486} y={755} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.muted}>
        Genel bilgilendirme amaçlıdır · 7528 ÖMK m.20 & 657 DMK m.152
      </text>
    </Art>
  );
};
