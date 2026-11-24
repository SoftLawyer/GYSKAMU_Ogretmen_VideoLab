// OTOMATİK ÜRETİLDİ — araclar/kaydet.py. Elle düzenleme.
import type { Episode, Timeline } from "./types";
import type React from "react";
import ep0 from "../episodes/gy_001_mazeret_izni/episode.json";
import tl0 from "../episodes/gy_001_mazeret_izni/timeline.json";
import { art as art0 } from "../episodes/gy_001_mazeret_izni/art";
import ep1 from "../episodes/gy_002_ogretmenler_gunu/episode.json";
import tl1 from "../episodes/gy_002_ogretmenler_gunu/timeline.json";
import { art as art1 } from "../episodes/gy_002_ogretmenler_gunu/art";
export const EPISODES: { id: string; ep: Episode; tl: Timeline; art: Record<string, React.FC> }[] = [
  { id: "gy-001", ep: ep0 as Episode, tl: tl0 as unknown as Timeline, art: art0 as Record<string, React.FC> },
  { id: "gy-002", ep: ep1 as Episode, tl: tl1 as unknown as Timeline, art: art1 as Record<string, React.FC> },
];
