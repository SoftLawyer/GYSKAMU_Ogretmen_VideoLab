import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Episode, Timeline } from "./types";
import { SceneCtx } from "./anim";
import { Background, CardFrame, Footer, HandleTag, Headline, Kicker, Pill, ProgressDots } from "./chrome/Chrome";

export type ArtMap = Record<string, React.FC>;

const SceneView: React.FC<{ ep: Episode; tl: Timeline; si: number; art: ArtMap; startF: number; endF: number }> = ({ ep, tl, si, art, startF, endF }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = ep.scenes[si];
  const tsc = tl.scenes[si];
  const beatStarts = tsc.beats.map((b) => Math.round(b.start * fps) - startF);
  const beatEnds = tsc.beats.map((b) => Math.round(b.end * fps) - startF);
  let bi = 0;
  beatStarts.forEach((s, i) => { if (frame >= s) bi = i; });
  const beat = sc.beats[bi];
  const tb = tsc.beats[bi];
  const since = frame - beatStarts[bi];
  const Art = art[sc.art];
  const sceneProgress = Math.min(1, frame / Math.max(1, endF - startF));
  return (
    <SceneCtx.Provider value={{ frame, fps, beatStarts, beatEnds, sceneFrames: endF - startF }}>
      <Background dark={sc.dark} />
      <ProgressDots index={si} total={ep.scenes.length} dark={sc.dark} sceneProgress={sceneProgress} />
      <Kicker dark={sc.dark}>{sc.kicker}</Kicker>
      <Headline lines={sc.headline} dark={sc.dark} />
      <CardFrame dark={sc.dark}><Art /></CardFrame>
      <HandleTag handle={ep.handle} />
      <Footer dark={sc.dark}>{sc.footer}</Footer>
      <Pill pill={beat.pill} since={since} voiceLen={tb.voiceEnd - tb.voiceStart} voiceLead={tb.voiceStart - tb.start} dark={sc.dark} />
    </SceneCtx.Provider>
  );
};

export const GVVideo: React.FC<{ episode: Episode; timeline: Timeline; art: ArtMap; withAudio?: boolean }> = ({ episode, timeline, art, withAudio = true }) => {
  const { fps } = useVideoConfig();
  const starts = timeline.scenes.map((s) => Math.round(s.start * fps));
  const total = Math.round(timeline.total * fps);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {timeline.scenes.map((s, i) => {
        const a = i === 0 ? 0 : starts[i];
        const b = i === timeline.scenes.length - 1 ? total : starts[i + 1];
        return (
          <Sequence key={s.id} from={a} durationInFrames={b - a}>
            <SceneView ep={episode} tl={timeline} si={i} art={art} startF={a} endF={b} />
          </Sequence>
        );
      })}
      {withAudio && timeline.audio ? <Audio src={staticFile(timeline.audio)} /> : null}
    </AbsoluteFill>
  );
};
