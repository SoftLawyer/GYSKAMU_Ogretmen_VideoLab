import React from "react";
import { Composition } from "remotion";
import { GVVideo } from "./Engine";
import { FPS, W, H } from "./tokens";
import { EPISODES } from "./registry.generated"; // araclar/kaydet.py üretir

export const Root: React.FC = () => (
  <>
    {EPISODES.map(({ id, ep, tl, art }) => (
      <Composition
        key={id}
        id={id}
        component={() => <GVVideo episode={ep} timeline={tl} art={art} />}
        durationInFrames={Math.round(tl.total * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
