import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Speech, Check, Cross, Sparkle, Anger, M, D } from "../../motor/art/kit";

/** S01: "3 AY YATIYORLAR!" Efsanesi vs Kanunla Çürüten Öğretmen */
export const S01Kanca: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 12, 10);

  return (
    <Art>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <Room wall="#EFE6D6" floor="#D8C6A6" floorY={665} stripes>
          {/* Solda bilmiş kişi: "3 AY TATİL!" */}
          <Person
            x={215} y={665} s={0.95 * p0} face={1}
            top={C.coral} pants="#2C3C4E" style="hoodie"
            hairStyle="messy" mood="smug"
            armF={[lerp(18, 92, p0), 24]}
            armB={[16, 12]}
          />
          <Speech x={295} y={205} w={420} h={132} tailX={-75} s={p0}>
            <text y={-8} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.coral}>
              “3 AY TATİL!”
            </text>
            <text y={34} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.muted}>
              ÖĞLEN EVE GİDİYORLAR!
            </text>
          </Speech>

          {/* Sağda emin öğretmen: Dur işareti + Kanun kitabı */}
          <Person
            x={765} y={665} s={0.96 * p1} face={-1}
            top={C.teal} pants="#1F2937" style="cardigan"
            hairStyle="short" glasses mood={p2 > 0.2 ? "grin" : "neutral"}
            armF={[lerp(18, 105, p1), 16]}
            armB={[22, 16]}
          />

          {/* Beat 2: EFSANE ÇÜRÜTÜLDÜ damgası */}
          {p2 > 0.05 && (
            <g transform={`translate(486,435) rotate(-8) scale(${lerp(2.2, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
              <rect x={-265} y={-62} width={530} height={124} rx={20} fill={C.espresso} stroke={C.goldBright} strokeWidth={8} />
              <Sparkle x={-215} y={0} s={0.85} />
              <Sparkle x={215} y={0} s={0.85} />
              <text y={-8} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={4} fill={C.goldBright}>
                KANUNLA GERÇEK HESAP
              </text>
              <text y={38} textAnchor="middle" fontFamily={D} fontSize={46} fill={C.cream}>
                EFSANE BİTTİ!
              </text>
            </g>
          )}
        </Room>
      </g>
    </Art>
  );
};

/** S02: 3 Ay Değil, 2 Ay! — Haziran Sonu & Eylül Başı Seminer Bantları */
export const S02IkiAy: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s1 = useSince(1);
  const sh = shake(s1, 9, 8);

  const months = [
    { name: "HAZİRAN", tag: "SEMİNER", blocked: true },
    { name: "TEMMUZ", tag: "İZİN", blocked: false },
    { name: "AĞUSTOS", tag: "İZİN", blocked: false },
    { name: "EYLÜL", tag: "SEMİNER", blocked: true },
  ];

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Üstte "3 AY TATİL" üstü çizilir */}
        <g transform={`translate(486,148) scale(${p0})`}>
          <rect x={-220} y={-54} width={440} height={108} rx={20} fill={C.coralSoft} stroke={C.coral} strokeWidth={5} />
          <text y={16} textAnchor="middle" fontFamily={D} fontSize={54} fill={C.espresso}>
            “3 AY TATİL”
          </text>
          {p0 > 0.25 && (
            <line
              x1={-195} y1={-12} x2={lerp(-195, 195, p0)} y2={20}
              stroke={C.coral} strokeWidth={12} strokeLinecap="round"
            />
          )}
        </g>

        {/* 4 Aylık Takvim Kartları */}
        {months.map((m, i) => {
          const cx = 162 + i * 216;
          const isBlocked = m.blocked && p1 > 0.15;
          const isAllowed = !m.blocked && p2 > 0.15;
          return (
            <g key={m.name} transform={`translate(${cx},395) scale(${p0})`}>
              <rect
                x={-94} y={-125} width={188} height={250} rx={20}
                fill={isBlocked ? C.coralSoft : isAllowed ? C.teal : C.paper}
                stroke={isBlocked ? C.coral : INK} strokeWidth={6}
              />
              <rect x={-94} y={-125} width={188} height={58} rx={16} fill={C.espresso} stroke={INK} strokeWidth={5} />
              <text y={-87} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>
                {m.name}
              </text>
              {isBlocked ? (
                <g transform={`scale(${p1})`}>
                  <Cross x={0} y={10} s={1.15} />
                  <rect x={-78} y={66} width={156} height={42} rx={10} fill={C.coral} />
                  <text y={94} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={18} fill={C.cream}>
                    SEMİNER
                  </text>
                </g>
              ) : (
                <g>
                  <Check x={0} y={12} s={1.2 * Math.max(0.4, p2)} color={isAllowed ? C.goldBright : C.teal} />
                  <text y={92} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={isAllowed ? C.cream : C.espresso}>
                    {m.tag}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Beat 2: Alt Sonuç Bandı */}
        {p2 > 0.05 && (
          <g transform={`translate(486,650) scale(${lerp(1.3, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-370} y={-62} width={740} height={124} rx={24} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
            <text y={-10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.goldBright}>
              1739 SAYILI KANUN · MADDE 50/A
            </text>
            <text y={40} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.cream}>
              KANUNEN SADECE 2 AY!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S03: 657 DMK Madde 103 — Diğer Memur 20-30 Gün vs Öğretmen 0 Gün Yıllık İzin */
export const S03SifirIzin: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 13, 11);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Açık Kanun Kitabı */}
        <g transform={`translate(486,365) scale(${p0})`}>
          <rect x={-390} y={-235} width={780} height={470} rx={24} fill={C.espresso} stroke={INK} strokeWidth={6} />
          <rect x={-364} y={-210} width={352} height={420} rx={12} fill={C.paper} stroke={INK} strokeWidth={4} />
          <rect x={12} y={-210} width={352} height={420} rx={12} fill={C.paper} stroke={INK} strokeWidth={4} />
          <line x1={0} y1={-215} x2={0} y2={215} stroke={C.gold} strokeWidth={6} />

          {/* Sol sayfa: Diğer Memurlar */}
          <text x={-188} y={-142} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.muted}>
            DİĞER MEMURLAR
          </text>
          <text x={-188} y={-22} textAnchor="middle" fontFamily={D} fontSize={100} fill={C.teal}>
            20–30
          </text>
          <text x={-188} y={36} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.espresso}>
            GÜN YILLIK İZİN
          </text>
          <rect x={-318} y={76} width={260} height={58} rx={14} fill={C.tealSoft} stroke={C.teal} strokeWidth={3} />
          <text x={-188} y={113} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.espresso}>
            YIL İÇİNDE SERBEST
          </text>

          {/* Sağ sayfa: Öğretmen */}
          <text x={188} y={-142} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coral}>
            657 DMK · MADDE 103
          </text>
          {p1 > 0.05 && (
            <g transform={`translate(188,0) scale(${p1})`}>
              <text y={-16} textAnchor="middle" fontFamily={D} fontSize={128} fill={C.coral}>
                0
              </text>
              <text y={40} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.espresso}>
                GÜN YILLIK İZİN!
              </text>
            </g>
          )}
          {p2 > 0.05 && (
            <g transform={`translate(188,108) scale(${lerp(1.5, 1, p2)})`}>
              <rect x={-144} y={-34} width={288} height={68} rx={14} fill={C.coral} stroke={INK} strokeWidth={4} />
              <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.cream}>
                YIL İÇİNDE İZİN YOK!
              </text>
            </g>
          )}
        </g>

        {p2 > 0.05 && (
          <g transform={`translate(486,690) scale(${p2})`}>
            <text y={8} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.espresso}>
              EKİM’DE İŞİN Mİ ÇIKTI? YILLIK İZİN HAKKI YOK!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S04 (DARK): "Yarım Gün" Efsanesi — 6 Saat Ayakta, 30 Öğrenci, Nöbet */
export const S04YarimGun: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 12, 10);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.45);
  const clockAngle = (frame * 9) % 360;

  return (
    <Art bg={C.espresso2}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <circle cx={486} cy={385} r={275} fill={C.gold} opacity={0.08 + pulse * 0.09} />

        {/* Üstte dönen büyük saat + 6 SAAT AYAKTA */}
        <g transform={`translate(215,215) scale(${p0})`}>
          <circle r={88} fill={C.espresso} stroke={C.goldBright} strokeWidth={7} />
          <line x1={0} y1={0} x2={0} y2={-52} stroke={C.cream} strokeWidth={7} strokeLinecap="round" transform={`rotate(${clockAngle * 0.25})`} />
          <line x1={0} y1={0} x2={44} y2={0} stroke={C.coral} strokeWidth={6} strokeLinecap="round" transform={`rotate(${clockAngle})`} />
          <circle r={9} fill={C.goldBright} />
          <text y={128} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.goldBright}>
            6 SAAT AYAKTA
          </text>
        </g>

        {/* Sağ üstte 30 ÖĞRENCİ sayacı */}
        <g transform={`translate(755,215) scale(${p1})`}>
          <rect x={-115} y={-82} width={230} height={164} rx={24} fill={C.espresso} stroke={C.coral} strokeWidth={7} />
          <text y={14} textAnchor="middle" fontFamily={D} fontSize={88} fill={C.coral}>
            30
          </text>
          <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.cream}>
            ÖĞRENCİ
          </text>
          <text y={128} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coralSoft}>
            + KORİDOR NÖBETİ
          </text>
        </g>

        {/* Ortada ayakta duran yorgun ama dimdik öğretmen */}
        <Person
          x={486} y={635} s={0.96 * p0} face={1}
          top={C.teal} pants="#1F2937" style="cardigan"
          hairStyle="short" glasses mood={p2 > 0.2 ? "worry" : "neutral"}
          armF={[lerp(16, 70, p1), 24]}
          armB={[lerp(16, 70, p2), 24]}
        />

        {/* Beat 2: Altta çarpıcı şerit */}
        {p2 > 0.05 && (
          <g transform={`translate(486,725) scale(${lerp(1.25, 1, p2)})`}>
            <rect x={-390} y={-40} width={780} height={80} rx={18} fill={C.coral} stroke={C.goldBright} strokeWidth={5} />
            <text y={11} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={25} letterSpacing={2} fill={C.cream}>
              HEM GÜVENLİK HEM GELECEK OMUZLARINDA!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S05: Akşam 22.00 Evde Mesai — Yazılı Kağıtları + Titreyen Veli WhatsApp Bildirimi */
export const S05EvdeMesai: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const vib = p2 > 0.2 ? Math.sin(frame * 1.9) * 5 : 0;

  return (
    <Art bg="#1E2538">
      {/* Gece penceresi & ay */}
      <g transform={`translate(175,185) scale(${p0})`}>
        <rect x={-95} y={-95} width={190} height={190} rx={18} fill="#111827" stroke={C.gold} strokeWidth={5} />
        <circle cx={28} cy={-26} r={32} fill={C.goldBright} />
        <circle cx={42} cy={-34} r={28} fill="#111827" />
        <text y={68} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} fill={C.goldBright}>
          22:00
        </text>
      </g>

      {/* Masa & Yazılı Yığınları */}
      <g transform={`translate(486,575) scale(${p1})`}>
        <rect x={-390} y={40} width={780} height={36} rx={10} fill="#7A4F2B" stroke={INK} strokeWidth={5} />
        {/* Yazılı yığını */}
        {[0, 1, 2, 3, 4].map((k) => (
          <rect
            key={k}
            x={-310 + k * 4} y={-8 - k * 14} width={185} height={46} rx={6}
            fill={C.paper} stroke={INK} strokeWidth={4}
          />
        ))}
        <text x={-212} y={-32} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.coral}>
          90 YAZILI
        </text>
        {/* Laptop / e-Okul */}
        <rect x={125} y={-76} width={200} height={116} rx={14} fill={C.espresso} stroke={C.goldBright} strokeWidth={5} />
        <text x={225} y={-24} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.goldBright}>
          e-OKUL
        </text>
        <text x={225} y={12} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.cream}>
          DERS PLANI
        </text>
      </g>

      {/* Masa arkasında çalışan öğretmen */}
      <Person
        x={486} y={655} s={0.84 * p0} face={1}
        top={C.teal} pants="#1F2937" style="cardigan"
        hairStyle="short" glasses mood={p2 > 0.2 ? "shock" : "worry"}
        armF={[35, 30]} armB={[35, 30]}
      />

      {/* Beat 2: Gece 22:00 Titreyen Veli WhatsApp Bildirimi */}
      {p2 > 0.05 && (
        <g transform={`translate(${640 + vib},175) scale(${lerp(1.5, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
          <rect x={-260} y={-78} width={520} height={156} rx={26} fill="#14532D" stroke="#4ADE80" strokeWidth={6} />
          <circle cx={-195} cy={-24} r={22} fill="#22C55E" />
          <text x={-195} y={-16} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill="#fff">!</text>
          <text x={25} y={-24} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill="#86EFAC">
            VELİ GRUBU · 22:14
          </text>
          <text x={0} y={32} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.cream}>
            “Hocam yarın ne giyeceğiz?”
          </text>
        </g>
      )}
    </Art>
  );
};
