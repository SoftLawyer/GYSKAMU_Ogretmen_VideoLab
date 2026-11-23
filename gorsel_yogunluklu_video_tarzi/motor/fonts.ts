import { loadFont as loadDisplay } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadText } from "@remotion/google-fonts/DMSerifText";
import { loadFont as loadMono } from "@remotion/google-fonts/DMMono";

const sub = { subsets: ["latin", "latin-ext"] as ("latin" | "latin-ext")[] };
export const display = loadDisplay("normal", sub).fontFamily;
export const displayItalic = loadDisplay("italic", sub).fontFamily;
export const text = loadText("normal", sub).fontFamily;
export const textItalic = loadText("italic", sub).fontFamily;
export const mono = loadMono("normal", { ...sub, weights: ["400", "500"] }).fontFamily;
// ₺ (U+20BA) glifi bazı fontlarda yok; yedek olarak sistem sans-serif
export const FALLBACK = ", 'Helvetica Neue', Arial, sans-serif";
