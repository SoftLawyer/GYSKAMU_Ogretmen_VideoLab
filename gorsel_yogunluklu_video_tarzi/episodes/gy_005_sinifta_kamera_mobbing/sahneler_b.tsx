import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { INK } from "../../motor/art/Person";
import { Art, Check, Gavel, Speech, Sparkle, M, D } from "../../motor/art/kit";

/** S06 (DARK): Ses Kaydı Varsa TCK 134 — Hapis Cezalı Suç! */
export const S06Tck134: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 13, 11);

  return (
    <Art bg={C.espresso2}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Canlı Kırmızı Ses Dalgaları */}
        <g transform={`translate(486,210) scale(${p0})`}>
          {[-240, -192, -144, -96, -48, 0, 48, 96, 144, 192, 240].map((bx, i) => {
            const h = 34 + Math.abs(Math.sin(frame * 0.35 + i * 0.9)) * 90;
            return (
              <rect
                key={bx}
                x={bx - 12} y={-h / 2} width={24} height={h} rx={12}
                fill={i % 2 === 0 ? C.coral : C.goldBright}
              />
            );
          })}
          <text y={96} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.coral}>
            GİZLİ / AÇIK SES KAYDI = AĞIR SUÇ!
          </text>
        </g>

        {/* Mahkeme Tokmağı */}
        {p1 > 0.05 && (
          <g transform={`translate(486,405) scale(${p1})`}>
            <Gavel x={0} y={0} s={0.95} r={lerp(-44, 0, p2)} />
          </g>
        )}

        {/* Beat 2: TCK MADDE 134 Kartı */}
        {p2 > 0.05 && (
          <g transform={`translate(486,620) scale(${lerp(1.45, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-380} y={-95} width={760} height={190} rx={28} fill={C.coral} stroke={C.goldBright} strokeWidth={7} />
            <text y={-24} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={25} letterSpacing={4} fill={C.goldBright}>
              5237 SAYILI TCK · MADDE 134
            </text>
            <text y={36} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.cream}>
              HAPİS CEZALI SUÇ!
            </text>
            <text y={76} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={21} fill={C.coralSoft}>
              ÖZEL HAYATIN GİZLİLİĞİNİ İHLAL + KVKK PARA CEZASI
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S07: Başına Gelirse 3 Net Adım */
export const S07Adimlar: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  const items = [
    { p: p0, y: 185, num: "01", title: "Yazılı Dilekçe Ver", sub: "KAMERANIN YASAL DAYANAĞINI SOR (DYS)", bg: C.paper, fg: C.espresso },
    { p: p1, y: 405, num: "02", title: "MEM & KVKK’ya Bildir", sub: "İL/İLÇE MEM + KVKK RESMİ ŞİKÂYET", bg: C.tealSoft, fg: C.espresso },
    { p: p2, y: 625, num: "03", title: "Savcılık & Tazminat", sub: "SES KAYDI / MOBBİNG VARSA ADLİ YOL", bg: C.espresso, fg: C.goldBright },
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

/** S08: Hukuki Sınır Bilançosu */
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
          HUKUKİ SINIR BİLANÇOSU
        </text>

        <g transform={`translate(262,375) scale(${p0})`}>
          <rect x={-200} y={-205} width={400} height={395} rx={30} fill={C.teal} stroke={INK} strokeWidth={7} />
          <text y={-10} textAnchor="middle" fontFamily={D} fontSize={78} fill={C.goldBright}>YASAK</text>
          <text y={60} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={2} fill={C.cream}>SINIFTA KAMERA</text>
          <text y={110} textAnchor="middle" fontFamily={M} fontSize={21} fill={C.tealSoft}>MEB YÖNETMELİĞİ</text>
        </g>

        {p1 > 0.05 && (
          <g transform={`translate(710,375) scale(${p1})`}>
            <rect x={-200} y={-205} width={400} height={395} rx={30} fill={C.coral} stroke={INK} strokeWidth={7} />
            <text y={-10} textAnchor="middle" fontFamily={D} fontSize={78} fill={C.cream}>SUÇ</text>
            <text y={60} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={2} fill={C.cream}>GÖZETLEME & SES</text>
            <text y={110} textAnchor="middle" fontFamily={M} fontSize={21} fill={C.coralSoft}>KVKK & TCK m.134</text>
          </g>
        )}

        {p2 > 0.05 && (
          <g transform={`translate(486,690) scale(${lerp(1.25, 1, p2)})`}>
            <rect x={-385} y={-46} width={770} height={92} rx={20} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
            <text y={11} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.goldBright}>
              KAMERAYLA PERFORMANS TAKİBİ = AÇIK MOBBİNG!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S09: Kapanış — Yorum + "Açıklamayı Mutlaka Oku!" Vurgusu + @gyskamu */
export const S09Kapanis: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const bounce = Math.sin(frame * 0.45) * 6;

  return (
    <Art bg={C.cream}>
      <Speech x={486} y={185} w={770} h={160} tailX={0} s={p0}>
        <text y={-10} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>
          Senin okulunda sınıflarda
        </text>
        <text y={42} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.coral}>
          kamera var mı? Yorumlara yaz!
        </text>
      </Speech>

      {/* Beat 1: Açıklamaya Yönlendiren Büyük Dikkat Kartı */}
      {p1 > 0.05 && (
        <g transform={`translate(486,${405 + bounce * 0.4}) scale(${p1})`}>
          <rect x={-375} y={-64} width={750} height={128} rx={26} fill={C.goldBright} stroke={INK} strokeWidth={6} />
          <text y={-12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2.5} fill={C.rust}>
            👇 AÇIKLAMAYI MUTLAKA OKU 👇
          </text>
          <text y={36} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.espresso}>
            Bilmen Gereken Tüm Maddeler Aşağıda!
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
        Genel bilgilendirme amaçlıdır · MEB · 6698 KVKK · TCK m.134
      </text>
    </Art>
  );
};
