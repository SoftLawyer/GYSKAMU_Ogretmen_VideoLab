export type Beat = {
  /** TTS'e gönderilen metin (sayılar okunuşuyla: "elli bin lira") */
  say: string;
  /** Ekranda altyazı hapında görünen yazım. *kelime* = altın italik vurgu */
  pill: string;
};

export type Scene = {
  id: string;
  /** illüstrasyon bileşeni adı (episode art haritasında) */
  art: string;
  kicker: string;
  /** Satırlar dizisi. *kelime* = altın italik vurgu */
  headline: string[];
  footer: string;
  dark?: boolean;
  beats: Beat[];
};

export type Episode = {
  id: string;
  title: string;
  handle: string;
  scenes: Scene[];
};

export type TimelineBeat = { start: number; end: number; voiceStart: number; voiceEnd: number };
export type TimelineScene = { id: string; start: number; end: number; beats: TimelineBeat[] };
export type Timeline = { fps: number; total: number; audio: string; scenes: TimelineScene[] };
