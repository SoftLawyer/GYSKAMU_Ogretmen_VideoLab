import React, { createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export type SceneCtxType = {
  /** sahne başından beri geçen kare */
  frame: number;
  fps: number;
  /** her ifadenin (beat) sahne başına göre başlangıç karesi */
  beatStarts: number[];
  beatEnds: number[];
  sceneFrames: number;
};
export const SceneCtx = createContext<SceneCtxType>({
  frame: 0, fps: 30, beatStarts: [0], beatEnds: [1], sceneFrames: 1,
});
export const useScene = () => useContext(SceneCtx);

const POP = { damping: 11, stiffness: 190, mass: 0.7 };

/** i. ifade başladıktan (+delay kare) sonra 0→1 yaylanan değer (aşım yapar). */
export const useBeatPop = (beat: number, delay = 0, cfg = POP) => {
  const { frame, fps, beatStarts } = useScene();
  const s = beatStarts[beat];
  if (s === undefined) return 0;
  return spring({ frame: frame - s - delay, fps, config: cfg });
};

/** Sahne başından itibaren (+delay) 0→1 yaylanan değer. */
export const useScenePop = (delay = 0, cfg = POP) => {
  const { frame, fps } = useScene();
  return spring({ frame: frame - delay, fps, config: cfg });
};

/** i. ifadeden beri geçen kare (başlamadıysa negatif). */
export const useSince = (beat: number) => {
  const { frame, beatStarts } = useScene();
  const s = beatStarts[beat];
  return s === undefined ? -9999 : frame - s;
};

/** Kare aralığında 0→1 doğrusal/ease ilerleme. */
export const prog = (f: number, a: number, b: number, ease = true) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease ? Easing.bezier(0.3, 0.0, 0.2, 1) : undefined,
  });

/** Sürekli hafif salınım (yaşam hissi). */
export const useWobble = (period = 40, amp = 1, phase = 0) => {
  const f = useCurrentFrame();
  return Math.sin((f / period) * Math.PI * 2 + phase) * amp;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Çarpma/sarsıntı: frameSince 0'da başlar, hızla söner. */
export const shake = (since: number, amp = 10, dur = 12) => {
  if (since < 0 || since > dur) return { x: 0, y: 0 };
  const k = 1 - since / dur;
  return { x: Math.sin(since * 2.7) * amp * k, y: Math.cos(since * 3.3) * amp * k };
};
