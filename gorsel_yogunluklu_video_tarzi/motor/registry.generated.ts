// OTOMATİK ÜRETİLDİ — araclar/kaydet.py. Elle düzenleme.
import type { Episode, Timeline } from "./types";
import type React from "react";
import ep0 from "../episodes/gy_001_mazeret_izni/episode.json";
import tl0 from "../episodes/gy_001_mazeret_izni/timeline.json";
import { art as art0 } from "../episodes/gy_001_mazeret_izni/art";
export const EPISODES: { id: string; ep: Episode; tl: Timeline; art: Record<string, React.FC> }[] = [
  { id: "gy-001", ep: ep0 as Episode, tl: tl0 as unknown as Timeline, art: art0 as Record<string, React.FC> },
];
