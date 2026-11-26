// OTOMATİK ÜRETİLDİ — araclar/kaydet.py. Elle düzenleme.
import type { Episode, Timeline } from "./types";
import type React from "react";
import ep0 from "../episodes/gy_001_mazeret_izni/episode.json";
import tl0 from "../episodes/gy_001_mazeret_izni/timeline.json";
import { art as art0 } from "../episodes/gy_001_mazeret_izni/art";
import ep1 from "../episodes/gy_002_ogretmenler_gunu/episode.json";
import tl1 from "../episodes/gy_002_ogretmenler_gunu/timeline.json";
import { art as art1 } from "../episodes/gy_002_ogretmenler_gunu/art";
import ep2 from "../episodes/gy_003_ders_programi_mobbing/episode.json";
import tl2 from "../episodes/gy_003_ders_programi_mobbing/timeline.json";
import { art as art2 } from "../episodes/gy_003_ders_programi_mobbing/art";
import ep3 from "../episodes/gy_004_uc_ay_tatil_efsanesi/episode.json";
import tl3 from "../episodes/gy_004_uc_ay_tatil_efsanesi/timeline.json";
import { art as art3 } from "../episodes/gy_004_uc_ay_tatil_efsanesi/art";
export const EPISODES: { id: string; ep: Episode; tl: Timeline; art: Record<string, React.FC> }[] = [
  { id: "gy-001", ep: ep0 as Episode, tl: tl0 as unknown as Timeline, art: art0 as Record<string, React.FC> },
  { id: "gy-002", ep: ep1 as Episode, tl: tl1 as unknown as Timeline, art: art1 as Record<string, React.FC> },
  { id: "gy-003", ep: ep2 as Episode, tl: tl2 as unknown as Timeline, art: art2 as Record<string, React.FC> },
  { id: "gy-004", ep: ep3 as Episode, tl: tl3 as unknown as Timeline, art: art3 as Record<string, React.FC> },
];
