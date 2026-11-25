import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Check, Cross, Gavel, Sparkle, Sweat, Anger, Bars, M, D } from "../../motor/art/kit";

/** S01: Parçalanmış Ders Programı Panosu (Pencere / Boş Saatler) + Şaşkın Öğretmen */
export const S01Kanca: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 10, 10);

  const days = ["PZT", "SAL", "ÇAR", "PER", "CUM"];
  // 0 = dolu ders, 1 = kırmızı boş saat (pencere)
  const grid = [
    [0, 1, 1, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 0, 1],
  ];

  return (
    <Art>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <Room wall="#EFE6D6" floor="#D8C6A6" floorY={665} stripes>
          {/* Haftalık Ders Programı Panosu */}
          <g transform={`translate(355,300) scale(${p0})`}>
            <rect x={-285} y={-230} width={570} height={435} rx={22} fill={C.cream} stroke={INK} strokeWidth={6} />
            <rect x={-285} y={-230} width={570} height={68} rx={18} fill={C.espresso} stroke={INK} strokeWidth={6} />
            <text y={-186} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={4} fill={C.goldBright}>
              HAFTALIK DERS PROGRAMI
            </text>

            {/* Gün başlıkları */}
            {days.map((d, ci) => (
              <text key={d} x={-208 + ci * 104} y={-124} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.espresso}>
                {d}
              </text>
            ))}

            {/* Ders / Pencere hücreleri */}
            {grid.map((col, ci) =>
              col.map((cell, ri) => {
                const isGap = cell === 1;
                const showGap = isGap && p0 > 0.2;
                const pulseLast = ri === 4 && p1 > 0.2;
                return (
                  <g key={`${ci}-${ri}`} transform={`translate(${-208 + ci * 104},${-86 + ri * 58})`}>
                    <rect
                      x={-44} y={-22} width={88} height={44} rx={8}
                      fill={showGap ? C.coralSoft : pulseLast ? C.goldBright : C.tealSoft}
                      stroke={showGap ? C.coral : INK}
                      strokeWidth={showGap ? 4 : 3}
                    />
                    <text y={6} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={16} fill={showGap ? C.coral : C.espresso}>
                      {showGap ? "BOŞ" : "DERS"}
                    </text>
                  </g>
                );
              })
            )}
          </g>

          {/* Sağda şaşkın öğretmen */}
          <Person
            x={785} y={665} s={0.95} face={-1}
            top={C.teal} pants="#2C3C4E" style="cardigan"
            hairStyle="short" glasses mood={p2 > 0.2 ? "shock" : "worry"}
            armF={[lerp(18, 95, p1), 22]}
            armB={[lerp(18, 80, p2), 18]}
          />
          {p2 > 0.2 && <Sweat x={865} y={325} s={0.95 * p2} />}

          {/* Beat 2: Altta uyarı bandı */}
          {p2 > 0.05 && (
            <g transform={`translate(355,585) scale(${p2})`}>
              <rect x={-270} y={-38} width={540} height={76} rx={16} fill={C.coral} stroke={INK} strokeWidth={5} />
              <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={2} fill={C.cream}>
                KASITLI PENCERE / BOŞ SAATLER
              </text>
            </g>
          )}
        </Room>
      </g>
    </Art>
  );
};

/** S02: Müdürün "TAKDİR YETKİM" Damgası -> 657 Kalkanıyla Durdurulur */
export const S02Yanilgi: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Müdür solda "Takdir Yetkim" diye bağırıyor */}
      <Person
        x={235} y={660} s={0.96 * p0} face={1}
        top={C.espresso2} pants="#1F1915" style="cardigan"
        hairStyle="gray" mustache mood="angry"
        armF={[lerp(15, 88, p0), 18]}
        armB={[12, 12]}
      />
      {p0 > 0.2 && <Anger x={150} y={310} s={0.9 * p0} />}

      {/* Beat 0-1: Havada "TAKDİR YETKİSİ" kartı */}
      <g transform={`translate(620,275) scale(${p0})`}>
        <rect x={-215} y={-88} width={430} height={176} rx={24} fill={C.coralSoft} stroke={C.coral} strokeWidth={6} />
        <text y={-14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={3} fill={C.coral}>
          YAYGIN SANILAN
        </text>
        <text y={44} textAnchor="middle" fontFamily={D} fontSize={50} fill={C.espresso}>
          “Takdir Yetkim”
        </text>
        {p2 > 0.05 && <Cross x={190} y={-68} s={1.25 * p2} />}
      </g>

      {/* Beat 2: 657 Sınır Kalkanı */}
      {p2 > 0.05 && (
        <g transform={`translate(620,545) scale(${p2})`}>
          <rect x={-230} y={-95} width={460} height={190} rx={26} fill={C.teal} stroke={INK} strokeWidth={6} />
          <text y={-24} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={3} fill={C.goldBright}>
            KANUNİ SINIR
          </text>
          <text y={32} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.cream}>
            Sınırsız Değildir!
          </text>
          <Check x={0} y={96} s={1.0} color={C.green} />
        </g>
      )}
    </Art>
  );
};

/** S03: 657 DMK Madde 10 — Açık Kanun Kitabı */
export const S03Kanun: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(486,365) scale(${p0})`}>
        <rect x={-375} y={-230} width={750} height={460} rx={24} fill={C.espresso} stroke={INK} strokeWidth={6} />
        <rect x={-350} y={-205} width={338} height={410} rx={12} fill={C.paper} stroke={INK} strokeWidth={4} />
        <rect x={12} y={-205} width={338} height={410} rx={12} fill={C.paper} stroke={INK} strokeWidth={4} />
        <line x1={0} y1={-210} x2={0} y2={210} stroke={C.gold} strokeWidth={6} />

        {/* Sol sayfa */}
        <text x={-181} y={-140} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.rust}>657 SAYILI DMK</text>
        <text x={-181} y={-82} textAnchor="middle" fontFamily={D} fontSize={62} fill={C.espresso}>MADDE 10</text>
        <line x1={-295} y1={-50} x2={-65} y2={-50} stroke={C.gold} strokeWidth={4} />
        <text x={-181} y={14} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.muted}>Keyfi Ceza</text>
        {p2 > 0.05 && (
          <line x1={-285} y1={4} x2={lerp(-285, -75, p2)} y2={4} stroke={C.coral} strokeWidth={9} strokeLinecap="round" />
        )}
        <text x={-181} y={84} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coral}>HUKUKA AYKIRI!</text>

        {/* Sağ sayfa */}
        <text x={181} y={-140} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.teal}>AMİRİN GÖREVİ</text>
        {p1 > 0.05 && (
          <g transform={`translate(181,-12) scale(${p1})`}>
            <rect x={-144} y={-62} width={288} height={124} rx={16} fill={C.goldBright} stroke={INK} strokeWidth={5} />
            <text y={-8} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>Hakkaniyet</text>
            <text y={40} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>& Eşitlik</text>
          </g>
        )}
        {p2 > 0.05 && (
          <g transform={`translate(181,122) scale(${p2})`}>
            <rect x={-136} y={-34} width={272} height={68} rx={14} fill={C.teal} stroke={INK} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} fill={C.cream}>KANUNİ ZORUNLULUK</text>
          </g>
        )}
      </g>

      {p2 > 0.05 && (
        <g transform={`translate(486,700) scale(${p2})`}>
          <Sparkle x={-320} y={0} s={0.9} />
          <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.espresso}>
            DERS PROGRAMI CEZALANDIRMA ARACI OLAMAZ
          </text>
          <Sparkle x={320} y={0} s={0.9} />
        </g>
      )}
    </Art>
  );
};

/** S04 (DARK): Danıştay 2. Daire — Boş Saat Kafesi + AÇIK MOBBİNG Damgası */
export const S04Danistay: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 13, 12);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.4);

  return (
    <Art bg={C.espresso2}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <circle cx={486} cy={350} r={280} fill={C.coral} opacity={0.12 + pulse * 0.1} />

        {/* Öğretmen ortada, etrafına inen "BOŞ SAAT / PENCERE" parmaklıkları */}
        <Person
          x={486} y={625} s={0.95 * p0} face={1}
          top={C.teal} pants="#2C3C4E" style="cardigan"
          hairStyle="short" glasses mood="sad"
          armF={[18, 18]} armB={[18, 18]}
        />
        <Bars x={250} y={145} w={472} h={480} p={p1} n={6} />

        {/* Üstte Danıştay etiketi */}
        <g transform={`translate(486,92) scale(${p0})`}>
          <rect x={-300} y={-34} width={600} height={68} rx={16} fill={C.espresso} stroke={C.goldBright} strokeWidth={4} />
          <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2.5} fill={C.goldBright}>
            DANIŞTAY 2. DAİRE EMSAL KARAR
          </text>
        </g>

        {/* Beat 2: AÇIK MOBBİNG Damgası */}
        {p2 > 0.05 && (
          <g transform={`translate(486,405) rotate(-7) scale(${lerp(2.1, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-295} y={-58} width={590} height={116} rx={18} fill={C.espresso} stroke={C.coral} strokeWidth={9} />
            <text y={18} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={48} letterSpacing={6} fill={C.coral}>
              AÇIK MOBBİNG!
            </text>
          </g>
        )}

        <text x={486} y={735} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={3} fill={C.goldBright}>
          KASITLI BOŞ SAATLERLE OKULDA TUTMA = PSİKOLOJİK TACİZ
        </text>
      </g>
    </Art>
  );
};

/** S05: Tam Yargı Davası — İdare Mahkemesi Tokmağı + Manevi Tazminat */
export const S05Tazminat: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 10, 10);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Adım 1: Yazılı İtiraz */}
        <g transform={`translate(486,185) scale(${p0})`}>
          <rect x={-330} y={-68} width={660} height={136} rx={22} fill={C.paper} stroke={INK} strokeWidth={6} />
          <Check x={-255} y={0} s={1.1} color={C.teal} />
          <text x={28} y={-8} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>1. Yazılı İtiraz Dilekçesi</text>
          <text x={28} y={36} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.muted}>EŞİTSİZLİĞİ RESMİ KAYDA GEÇİR</text>
        </g>

        {/* Adım 2: İdare Mahkemesi Tokmağı */}
        {p1 > 0.05 && (
          <g transform={`translate(486,365) scale(${p1})`}>
            <Gavel x={0} y={0} s={0.95} r={lerp(-42, 0, p2)} />
          </g>
        )}

        {/* Beat 2: MANEVİ TAZMİNAT KARARI */}
        {p2 > 0.05 && (
          <g transform={`translate(486,600) scale(${lerp(1.4, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-370} y={-105} width={740} height={210} rx={28} fill={C.espresso} stroke={C.goldBright} strokeWidth={7} />
            <Sparkle x={-305} y={0} s={1.0} />
            <Sparkle x={305} y={0} s={1.0} />
            <text y={-28} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={4} fill={C.goldBright}>
              İDARE MAHKEMESİ · TAM YARGI DAVASI
            </text>
            <text y={44} textAnchor="middle" fontFamily={D} fontSize={60} fill={C.cream}>
              MANEVİ TAZMİNAT
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};
