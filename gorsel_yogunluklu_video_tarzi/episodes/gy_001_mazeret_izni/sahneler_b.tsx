import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Table, Toggle, Check, Cross, Speech, Sparkle, M, D } from "../../motor/art/kit";

/** S07 (DARK): Dilekçeyi Sümen Altı Etmek Yasaktır! */
export const S07SumenAlti: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 14, 12);
  const sirenPulse = 0.5 + 0.5 * Math.sin(frame * 0.45);

  return (
    <Art bg={C.espresso2}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Kırmızı alarm parlaması */}
        <circle cx={486} cy={190} r={240} fill={C.coral} opacity={0.14 + sirenPulse * 0.14} />

        {/* Masa & Çekmece (Sümen Altı Mecazı) */}
        <g transform={`translate(486,470) scale(${p0})`}>
          <rect x={-310} y={-90} width={620} height={34} rx={10} fill="#7B5032" stroke={C.gold} strokeWidth={5} />
          <rect x={-270} y={-56} width={540} height={220} rx={12} fill="#4A3222" stroke={C.gold} strokeWidth={5} />
          {/* Çekmece */}
          <g transform={`translate(0,${lerp(0, 48, p1)})`}>
            <rect x={-210} y={-22} width={420} height={112} rx={10} fill="#62402A" stroke={C.goldBright} strokeWidth={4} />
            <rect x={-48} y={24} width={96} height={18} rx={9} fill={C.goldBright} />
            {/* Çekmeceye saklanan dilekçe */}
            <g transform={`translate(0,${lerp(-140, -18, p1)}) rotate(${lerp(-6, 4, p1)})`}>
              <rect x={-95} y={-75} width={190} height={125} rx={10} fill={C.cream} stroke={INK} strokeWidth={5} />
              <text y={-28} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.espresso}>İZİN DİLEKÇESİ</text>
              <line x1={-60} y1={-4} x2={60} y2={-4} stroke={INK} strokeWidth={4} opacity={0.4} />
              <line x1={-60} y1={18} x2={45} y2={18} stroke={INK} strokeWidth={4} opacity={0.4} />
            </g>
          </g>
        </g>

        {/* Üstte uyarı ikonu */}
        <g transform={`translate(486,165) scale(${p0})`}>
          <polygon points="0,-78 86,62 -86,62" fill={C.coral} stroke={C.goldBright} strokeWidth={6} strokeLinejoin="round" />
          <text y={38} textAnchor="middle" fontFamily={D} fontSize={82} fill={C.cream}>!</text>
        </g>

        {/* Beat 2: SÜMEN ALTI YASAK / KAYIT ZORUNLU */}
        {p2 > 0.05 && (
          <g transform={`translate(486,435) rotate(-7) scale(${lerp(2.1, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-325} y={-56} width={650} height={112} rx={18} fill={C.espresso} stroke={C.coral} strokeWidth={9} />
            <text y={18} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={44} letterSpacing={5} fill={C.coral}>
              SÜMEN ALTI YASAK!
            </text>
          </g>
        )}

        <text x={486} y={735} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={3} fill={C.goldBright}>
          EVRAKI KAYIT ALTINA ALMAK ZORUNLU
        </text>
      </g>
    </Art>
  );
};

/** S08: Doğru Usul — Sözlü Redde Çarpı -> Yazılı Dilekçe + Evrak Kayıt + İlçe MEM */
export const S08Usul: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Beat 0: Sözlü Ret X */}
      <g transform={`translate(486,175) scale(${p0})`}>
        <rect x={-340} y={-62} width={680} height={124} rx={22} fill={C.coralSoft} stroke={C.coral} strokeWidth={5} />
        <Cross x={-265} y={0} s={1.15} />
        <text x={24} y={-6} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.espresso}>Sözlü Reddi Kabul Etme</text>
        <text x={24} y={34} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.coral}>İSPATSIZ SÖZLÜ BEYAN GEÇERSİZ</text>
      </g>

      {/* Beat 1: Yazılı Dilekçe + SAYI ALINDI */}
      {p1 > 0.05 && (
        <g transform={`translate(486,405) scale(${p1})`}>
          <rect x={-340} y={-78} width={680} height={156} rx={22} fill={C.paper} stroke={INK} strokeWidth={6} />
          <Check x={-265} y={0} s={1.15} color={C.teal} />
          <text x={24} y={-14} textAnchor="middle" fontFamily={D} fontSize={42} fill={C.espresso}>Yazılı Dilekçe & DYS</text>
          <g transform="translate(24,36)">
            <rect x={-175} y={-26} width={350} height={48} rx={10} fill={C.teal} />
            <text y={7} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={23} fill={C.cream}>EVRAK KAYIT NO AL</text>
          </g>
        </g>
      )}

      {/* Beat 2: Silsile Yolu -> İlçe MEM */}
      {p2 > 0.05 && (
        <g transform={`translate(486,640) scale(${p2})`}>
          <rect x={-340} y={-68} width={680} height={136} rx={22} fill={C.espresso} stroke={C.gold} strokeWidth={6} />
          <Sparkle x={-265} y={0} s={1.0} />
          <text x={24} y={-6} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.goldBright}>Silsile Yoluyla Üst Makam</text>
          <text x={24} y={36} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.cream}>İLÇE MİLLÎ EĞİTİM / KAYMAKAMLIK</text>
        </g>
      )}
    </Art>
  );
};

/** S09: Boş Dersi Çözmek İdarenin İşi — Toggle + Görev Aktarımı */
export const S09Idare: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art>
      <Room wall="#EFE6D5" floor="#D8C6A6" floorY={645}>
        {/* Üstte Toggle: Ders Tedbiri Kimin İşi? */}
        <Toggle
          x={486} y={165} s={0.96 * p0}
          on={p1}
          label="BOŞ DERS TEDBİRİ"
          offText="ÖĞRETMEN?"
          onText="İDARENİN GÖREVİ"
          onColor={C.teal}
          offColor={C.coral}
        />

        {/* Öğretmen rahatlamış gülümsüyor */}
        <Person
          x={260} y={645} s={0.94} face={1}
          top={C.teal} pants="#2F3D4E" style="cardigan"
          hairStyle="short" glasses mood={p1 > 0.3 ? "smile" : "worry"}
          armF={[lerp(20, 65, p1), 20]}
          armB={[10, 10]}
        />

        {/* Müdür masasında ders programıyla ilgileniyor */}
        <Table x={665} y={645} w={250} />
        <Person
          x={725} y={645} s={0.94} face={-1}
          top={C.espresso2} pants="#1F1915" style="cardigan"
          hairStyle="gray" mustache mood="neutral"
          armF={[45, 25]}
          armB={[15, 15]}
        />

        {/* Ders programı kartı öğretmenden idare masasına kayıyor */}
        <g transform={`translate(${lerp(365, 635, p1)},465) rotate(${lerp(-8, 4, p1)}) scale(${p0})`}>
          <rect x={-96} y={-58} width={192} height={116} rx={14} fill={C.cream} stroke={INK} strokeWidth={5} />
          <text y={-16} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.rust}>DERS PROGRAMI</text>
          <text y={22} textAnchor="middle" fontFamily={D} fontSize={30} fill={C.espresso}>Nöbet / Tedbir</text>
        </g>

        {p2 > 0.05 && (
          <g transform={`translate(486,725) scale(${p2})`}>
            <rect x={-320} y={-34} width={640} height={68} rx={14} fill={C.teal} stroke={INK} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={26} fill={C.cream}>
              YASAL HAK BU BAHANEYLE ENGELLENEMEZ
            </text>
          </g>
        )}
      </Room>
    </Art>
  );
};

/** S10: Kamu Personeli Genel Tebliği — Süre Olay Tarihinde Başlar */
export const S10Teblig: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Büyük Masa Takvimi */}
      <g transform={`translate(486,380) scale(${p0})`}>
        <rect x={-290} y={-250} width={580} height={470} rx={30} fill={C.paper} stroke={INK} strokeWidth={7} />
        <rect x={-290} y={-250} width={580} height={106} rx={24} fill={C.rust} stroke={INK} strokeWidth={7} />
        {/* Takvim halkaları */}
        {[-170, 0, 170].map((hx) => (
          <rect key={hx} x={hx - 14} y={-278} width={28} height={56} rx={12} fill={C.goldBright} stroke={INK} strokeWidth={5} />
        ))}
        <text y={-180} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={5} fill={C.cream}>
          İZİN BAŞLANGIÇ GÜNÜ
        </text>

        {/* Gün kareleri */}
        {[
          { x: -165, y: -55, n: "12" },
          { x: 0, y: -55, n: "13", event: true },
          { x: 165, y: -55, n: "14" },
          { x: -165, y: 85, n: "15" },
          { x: 0, y: 85, n: "16" },
          { x: 165, y: 85, n: "17" },
        ].map((d, i) => (
          <g key={i} transform={`translate(${d.x},${d.y})`}>
            <rect
              x={-58} y={-48} width={116} height={96} rx={14}
              fill={d.event && p1 > 0.2 ? C.goldBright : C.cream}
              stroke={d.event && p1 > 0.2 ? C.coral : INK}
              strokeWidth={d.event && p1 > 0.2 ? 6 : 4}
            />
            <text y={16} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.espresso}>{d.n}</text>
            {d.event && p1 > 0.2 && (
              <text y={-56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={18} fill={C.coral}>
                OLAY GÜNÜ
              </text>
            )}
          </g>
        ))}
      </g>

      {p2 > 0.05 && (
        <g transform={`translate(486,695) scale(${p2})`}>
          <rect x={-350} y={-44} width={700} height={88} rx={18} fill={C.espresso} stroke={C.gold} strokeWidth={5} />
          <text y={12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} fill={C.goldBright}>
            OLAY TARİHİNDE BAŞLAR · ERTELENEMEZ
          </text>
        </g>
      )}
    </Art>
  );
};

/** S11: Dosya Bilançosu — İki Büyük Sayaç Kartı */
export const S11Bilanco: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      <text x={486} y={108} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} letterSpacing={5} fill={C.rust}>
        MEVZUAT BİLANÇOSU
      </text>

      {/* Sol Kart: 7-10 Gün Yasal Hak */}
      <g transform={`translate(262,385) scale(${p0})`}>
        <rect x={-200} y={-215} width={400} height={410} rx={30} fill={C.teal} stroke={INK} strokeWidth={7} />
        <text y={-20} textAnchor="middle" fontFamily={D} fontSize={132} fill={C.goldBright}>7–10</text>
        <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={34} letterSpacing={4} fill={C.cream}>GÜN HAK</text>
        <text y={110} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.tealSoft}>657 DMK m.104/B</text>
      </g>

      {/* Sağ Kart: 0 Ret Yetkisi */}
      {p1 > 0.05 && (
        <g transform={`translate(710,385) scale(${p1})`}>
          <rect x={-200} y={-215} width={400} height={410} rx={30} fill={C.coral} stroke={INK} strokeWidth={7} />
          <text y={-20} textAnchor="middle" fontFamily={D} fontSize={152} fill={C.cream}>0</text>
          <text y={56} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={3} fill={C.cream}>RET YETKİSİ</text>
          <text y={110} textAnchor="middle" fontFamily={M} fontSize={22} fill={C.coralSoft}>KEYFİ ENGEL YOK</text>
        </g>
      )}

      {p2 > 0.05 && (
        <g transform={`translate(486,695) scale(${p2})`}>
          <rect x={-350} y={-44} width={700} height={88} rx={18} fill={C.espresso} stroke={C.gold} strokeWidth={5} />
          <text y={12} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={28} fill={C.goldBright}>
            HAKKINI YAZILI DİLEKÇE İLE KORU
          </text>
        </g>
      )}
    </Art>
  );
};

/** S12: Kapanış & CTA — Yorum Çağrısı + @gyskamu + Yasal Uyarı */
export const S12Kapanis: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Beat 0: Büyük Soru Balonu */}
      <Speech x={486} y={205} w={760} h={176} tailX={0} s={p0}>
        <text y={-14} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.espresso}>
          “Yerine kimse yok” diye
        </text>
        <text y={40} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.coral}>
          mazeret iznin engellendi mi?
        </text>
      </Speech>

      {/* Beat 1: Yorum Çağrısı */}
      {p1 > 0.05 && (
        <g transform={`translate(486,430) scale(${p1})`}>
          <rect x={-310} y={-48} width={620} height={96} rx={22} fill={C.paper} stroke={C.gold} strokeWidth={6} />
          <text y={14} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} fill={C.espresso}>
            💬 DENEYİMİNİ YORUMLARA YAZ
          </text>
        </g>
      )}

      {/* Beat 2: @gyskamu Takip Kartı */}
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

      {/* Kart içi yasal uyarı satırı */}
      <text x={486} y={755} textAnchor="middle" fontFamily={M} fontSize={18} fill={C.muted}>
        Genel bilgilendirme amaçlıdır · Olay ve kişiler canlandırmadır
      </text>
    </Art>
  );
};
