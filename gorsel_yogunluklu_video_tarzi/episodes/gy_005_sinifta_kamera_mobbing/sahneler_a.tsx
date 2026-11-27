import React from "react";
import { C } from "../../motor/tokens";
import { useBeatPop, useSince, useScene, shake, lerp } from "../../motor/anim";
import { Person, INK } from "../../motor/art/Person";
import { Art, Room, Speech, Check, Cross, Sparkle, Anger, Sweat, M, D } from "../../motor/art/kit";

/** S01: Her Zamanki Aydınlık Stil + Kırmızı REC ● CCTV Vizörü + Müdür & Şaşkın Öğretmen */
export const S01Kanca: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s1 = useSince(1);
  const sh = shake(s1, 12, 10);
  const blinkRec = Math.floor(frame / 10) % 2 === 0;

  return (
    <Art>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <Room wall="#EFE6D6" floor="#D8C6A6" floorY={665} stripes>
          {/* CCTV Vizör Köşeleri */}
          <g stroke={C.coral} strokeWidth={6} fill="none" opacity={0.9}>
            <path d="M55 110 V55 H110" />
            <path d="M917 110 V55 H862" />
            <path d="M55 680 V735 H110" />
            <path d="M917 680 V735 H862" />
          </g>

          {/* REC ● Canlı Kamera Göstergesi */}
          <g transform="translate(150,92)">
            <circle cx={-38} cy={0} r={12} fill={C.coral} opacity={blinkRec ? 1 : 0.25} />
            <text x={-14} y={9} fontFamily={M} fontWeight={700} fontSize={26} letterSpacing={3} fill={C.coral}>
              REC · SINIF CAM-04
            </text>
          </g>

          {/* Tavanda CCTV Kamerası */}
          <g transform={`translate(780,105) scale(${p0})`}>
            <rect x={-52} y={-22} width={88} height={44} rx={10} fill={C.paper} stroke={INK} strokeWidth={5} />
            <polygon points="-52,-14 -82,-26 -82,26 -52,14" fill={C.espresso} stroke={INK} strokeWidth={4} />
            <circle cx={-12} cy={0} r={10} fill={C.coral} opacity={blinkRec ? 1 : 0.35} />
          </g>

          {/* Solda öfkeli müdür */}
          <Person
            x={225} y={665} s={0.94 * p0} face={1}
            top={C.espresso2} pants="#14110F" style="cardigan"
            hairStyle="gray" mustache mood="angry"
            armF={[lerp(18, 96, p1), 16]}
            armB={[18, 14]}
          />
          {p1 > 0.2 && <Anger x={135} y={325} s={0.9 * p1} />}

          {/* Müdürün konuşma balonu */}
          {p1 > 0.05 && (
            <Speech x={465} y={248} w={500} h={132} tailX={-140} s={p1}>
              <text y={-8} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.coral}>
                “Bütün ders oturmuşsun!”
              </text>
              <text y={34} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.muted}>
                KAMERADAN İZLEDİM!
              </text>
            </Speech>
          )}

          {/* Sağda şaşkın öğretmen */}
          <Person
            x={765} y={665} s={0.94 * p0} face={-1}
            top={C.teal} pants="#1F2937" style="cardigan"
            hairStyle="short" glasses mood={p1 > 0.2 ? "shock" : "worry"}
            armF={[lerp(16, 82, p2), 24]}
            armB={[lerp(16, 55, p2), 18]}
          />
          {p1 > 0.2 && <Sweat x={845} y={335} s={0.9 * p1} />}

          {/* Beat 2: AĞIR İHLAL / SUÇ MU?! */}
          {p2 > 0.05 && (
            <g transform={`translate(486,495) rotate(-6) scale(${lerp(2.1, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
              <rect x={-285} y={-58} width={570} height={116} rx={20} fill={C.coral} stroke={INK} strokeWidth={7} />
              <text y={16} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={42} letterSpacing={3.5} fill={C.cream}>
                YASAL MI, SUÇ MU?
              </text>
            </g>
          )}
        </Room>
      </g>
    </Art>
  );
};

/** S02: Normal Sınıflarda Kamera KESİNLİKLE YASAK! */
export const S02Yasak: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 13, 10);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Sınıf Tahtası */}
        <g transform={`translate(486,320) scale(${p0})`}>
          <rect x={-355} y={-205} width={710} height={390} rx={24} fill="#1E4638" stroke="#7A4F2B" strokeWidth={14} />
          <text y={-125} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={4} fill={C.goldBright}>
            NORMAL DERSLİK / SINIF İÇİ
          </text>

          {/* Büyük CCTV Kamera İkonu */}
          <g transform={`translate(0,10) scale(${p1})`}>
            <rect x={-110} y={-48} width={180} height={96} rx={18} fill={C.paper} stroke={INK} strokeWidth={7} />
            <polygon points="70,-32 135,-58 135,58 70,32" fill={C.espresso} stroke={INK} strokeWidth={6} />
            <circle cx={-30} cy={0} r={22} fill={C.coral} stroke={INK} strokeWidth={5} />
          </g>

          {/* Beat 2: Dev Kırmızı Yasak Çarpısı */}
          {p2 > 0.05 && <Cross x={0} y={10} s={2.3 * p2} />}
        </g>

        {/* Alt Damga */}
        {p2 > 0.05 && (
          <g transform={`translate(486,625) scale(${lerp(1.5, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-370} y={-64} width={740} height={128} rx={24} fill={C.coral} stroke={INK} strokeWidth={7} />
            <text y={-10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.goldBright}>
              MEB YÖNETMELİKLERİ · KESİN HÜKÜM
            </text>
            <text y={42} textAnchor="middle" fontFamily={D} fontSize={50} fill={C.cream}>
              SINIFTA KAMERA YASAK!
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};

/** S03: İzin Verilen Alanlar vs Yasak Alanlar + Özel Eğitim İstisnası */
export const S03Sinir: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);

  return (
    <Art bg={C.cream}>
      {/* Sol Kart: İZİN VERİLEN */}
      <g transform={`translate(256,310) scale(${p0})`}>
        <rect x={-205} y={-200} width={410} height={400} rx={28} fill={C.teal} stroke={INK} strokeWidth={7} />
        <Check x={0} y={-110} s={1.45} color={C.goldBright} />
        <text y={-22} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2} fill={C.goldBright}>
          KAMERA OLABİLİR
        </text>
        <text y={38} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.cream}>Giriş & Bahçe</text>
        <text y={92} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.cream}>Ortak Koridor</text>
        <text y={146} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.tealSoft}>FİZİKİ GÜVENLİK ALANI</text>
      </g>

      {/* Sağ Kart: YASAK ALANLAR */}
      {p2 > 0.05 && (
        <g transform={`translate(716,310) scale(${p2})`}>
          <rect x={-205} y={-200} width={410} height={400} rx={28} fill={C.coral} stroke={INK} strokeWidth={7} />
          <Cross x={0} y={-110} s={1.45} />
          <text y={-22} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={2} fill={C.goldBright}>
            KESİNLİKLE YASAK
          </text>
          <text y={38} textAnchor="middle" fontFamily={D} fontSize={40} fill={C.cream}>Normal Sınıflar</text>
          <text y={92} textAnchor="middle" fontFamily={D} fontSize={36} fill={C.cream}>Öğretmenler Odası</text>
          <text y={146} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={20} fill={C.coralSoft}>REHBERLİK SERVİSİ</text>
        </g>
      )}

      {/* Altta Tek İstisna Bandı */}
      {p1 > 0.05 && (
        <g transform={`translate(486,635) scale(${p1})`}>
          <rect x={-390} y={-62} width={780} height={124} rx={24} fill={C.espresso} stroke={C.goldBright} strokeWidth={6} />
          <text y={-10} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} letterSpacing={3} fill={C.goldBright}>
            DANIŞTAY 8. DAİRE · TEK İSTİSNA
          </text>
          <text y={40} textAnchor="middle" fontFamily={D} fontSize={44} fill={C.cream}>
            Yalnızca Özel Eğitim Sınıfları
          </text>
        </g>
      )}
    </Art>
  );
};

/** S04: "Kaç Dakika Oturdun?" Takibi = KVKK İhlali & Açık Mobbing */
export const S04Mobbing: React.FC = () => {
  const { frame } = useScene();
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s2 = useSince(2);
  const sh = shake(s2, 14, 12);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.45);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        <circle cx={486} cy={365} r={260} fill={C.coral} opacity={0.07 + pulse * 0.06} />

        {/* Hedef Vizörü içinde Öğretmen */}
        <Person
          x={486} y={625} s={0.94 * p0} face={1}
          top={C.teal} pants="#1F2937" style="cardigan"
          hairStyle="short" glasses mood="sad"
          armF={[18, 18]} armB={[18, 18]}
        />

        {/* Kırmızı Gözetleme Hedefi (Crosshair) */}
        <g transform={`translate(486,360) scale(${p1})`} opacity={0.9}>
          <circle r={195} fill="none" stroke={C.coral} strokeWidth={6} strokeDasharray="18 14" />
          <line x1={-230} y1={0} x2={-155} y2={0} stroke={C.coral} strokeWidth={6} />
          <line x1={155} y1={0} x2={230} y2={0} stroke={C.coral} strokeWidth={6} />
          <line x1={0} y1={-230} x2={0} y2={-155} stroke={C.coral} strokeWidth={6} />
          <line x1={0} y1={155} x2={0} y2={230} stroke={C.coral} strokeWidth={6} />
        </g>

        {/* Üstte Saat / Süre Etiketi */}
        <g transform={`translate(486,98) scale(${p1})`}>
          <rect x={-370} y={-36} width={740} height={72} rx={16} fill={C.espresso} stroke={INK} strokeWidth={4} />
          <text y={9} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={21} letterSpacing={2} fill={C.goldBright}>
            “KAÇ DAKİKA OTURDUN?” PERFORMANS TAKİBİ
          </text>
        </g>

        {/* Beat 2: KVKK İHLALİ & AÇIK MOBBİNG Damgası */}
        {p2 > 0.05 && (
          <g transform={`translate(486,425) rotate(-7) scale(${lerp(2.2, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-345} y={-64} width={690} height={128} rx={20} fill={C.espresso} stroke={C.coral} strokeWidth={9} />
            <text y={-8} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={32} letterSpacing={4} fill={C.goldBright}>
              6698 SAYILI KVKK İHLALİ
            </text>
            <text y={44} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={44} letterSpacing={5} fill={C.coral}>
              AÇIK MOBBİNG!
            </text>
          </g>
        )}

        <text x={486} y={735} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={23} letterSpacing={2.5} fill={C.espresso}>
          KAMERA PERFORMANS & BASKI ARACI YAPILAMAZ
        </text>
      </g>
    </Art>
  );
};

/** S05: "Veli/Öğretmen İmza Verdi!" -> Kanunun Yasakladığı Yerde Rıza Geçersizdir */
export const S05Riza: React.FC = () => {
  const p0 = useBeatPop(0);
  const p1 = useBeatPop(1);
  const p2 = useBeatPop(2);
  const s1 = useSince(1);
  const sh = shake(s1, 10, 8);

  return (
    <Art bg={C.cream}>
      <g transform={`translate(${sh.x},${sh.y})`}>
        {/* Üstte İmza / Rıza Belgesi */}
        <g transform={`translate(486,245) scale(${p0})`}>
          <rect x={-350} y={-125} width={700} height={250} rx={26} fill={C.paper} stroke={INK} strokeWidth={6} />
          <text y={-52} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={3} fill={C.muted}>
            YAYGIN BAHANE
          </text>
          <text y={10} textAnchor="middle" fontFamily={D} fontSize={48} fill={C.espresso}>
            “Veli / Öğretmen İmza Verdi!”
          </text>
          <text y={68} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={22} fill={C.coral}>
            HUKUKEN GEÇERSİZ RIZA
          </text>

          {/* Beat 1: Kırmızı Çizgi + Çarpı */}
          {p1 > 0.05 && (
            <g>
              <line x1={-310} y1={-4} x2={lerp(-310, 310, p1)} y2={22} stroke={C.coral} strokeWidth={12} strokeLinecap="round" />
              <Cross x={295} y={-88} s={1.25 * p1} />
            </g>
          )}
        </g>

        {/* Beat 2: Amaç Sadece Fiziki Güvenlik Kalkanı */}
        {p2 > 0.05 && (
          <g transform={`translate(486,570) scale(${lerp(1.35, 1, p2)})`} opacity={Math.min(1, p2 * 2)}>
            <rect x={-375} y={-105} width={750} height={210} rx={28} fill={C.teal} stroke={INK} strokeWidth={7} />
            <Sparkle x={-315} y={0} s={0.95} />
            <Sparkle x={315} y={0} s={0.95} />
            <text y={-28} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={24} letterSpacing={3} fill={C.goldBright}>
              KVKK MADDE 4 · ÖLÇÜLÜLÜK İLKESİ
            </text>
            <text y={32} textAnchor="middle" fontFamily={D} fontSize={50} fill={C.cream}>
              Amaç Sadece Fiziki Güvenlik!
            </text>
            <text y={76} textAnchor="middle" fontFamily={M} fontWeight={700} fontSize={21} fill={C.tealSoft}>
              KANUNUN YASAKLADIĞI YERDE RIZA GEÇERSİZDİR
            </text>
          </g>
        )}
      </g>
    </Art>
  );
};
