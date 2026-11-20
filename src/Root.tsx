import React from "react";
import { Composition } from "remotion";
import { OgretmenVideo } from "./OgretmenVideo";
import timelineData from "./timeline.json";

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const durationInFrames = Math.ceil((timelineData.totalDuration || 49.5) * fps);

  return (
    <>
      <Composition
        id="OgretmenDosya"
        component={OgretmenVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
