// "Editorial" caption system, measured from the caption references in refs/ (see ../../../style-sheet.md):
// a heavy grotesque (Inter) paired with a red italic serif (Instrument Serif) for the words that carry the meaning,
// every word arriving on its spoken time with a short blur-in. Four tiers:
//   hook     a stacked block in the middle of the frame, one line per beat, sans and serif lines mixed
//   running  small captions, 1-3 words, the emphasized word on its own serif line underneath
//   callout  a medium block for the lines that matter (a feature, the offer, the spoken CTA)
//   pill     the comment-keyword pill that pairs with a spoken "comment X" call to action
// plus full-screen light cards for a number or a name. Everything is addressed by WORD INDEX into captions.words
// (tools/editorial.py words edit/<id> prints them), so text lands on the word without hand-typed timecodes.
// This file is ours, outside src/kit/, so kit.py update never touches it. The footage, camera, inserts and end card
// still come from the kit: EditorialReel renders ReelKit with its own subtitles and hook switched off.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { KIT_FPS, ReelKit, ReelKitProps } from "../ReelKit";
import type { Word } from "../kit/Subtitles";

const SANS = "EdInter";
const SERIF = "EdInstrumentSerif";
const FACES: [string, string, string, string][] = [
  [SANS, "fonts/Inter-SemiBold.ttf", "600", "normal"],
  [SANS, "fonts/Inter-Bold.ttf", "700", "normal"],
  [SANS, "fonts/Inter-Black.ttf", "900", "normal"],
  [SERIF, "fonts/InstrumentSerif-Italic.ttf", "400", "italic"],
];

export type Token = { t: string; serif?: boolean; accent?: boolean; atWord?: number };
export type EditorialSpec = {
  accent?: string; // the one accent color; default: the brand's accent
  emphasis?: number[]; // word indexes set in the serif italic, accent color
  hook?: { lines: number[][]; serifLines?: number[]; accentLines?: number[]; hold?: number; y?: number };
  callouts?: { words: [number, number]; lines?: number[][]; size?: number; y?: number; hold?: number;
    serifScale?: number; serifStroke?: number; gap?: number }[]; // serifScale: emphasized words larger still (1 = the usual 1.2x); serifStroke: px, a heavier serif; gap: extra px between lines
  cta?: { atWord: number; keyword: string; then?: string; thenAtWord?: number; y?: number; untilWord?: number };
  cards?: { fromWord: number; toWord: number; label?: string; big: Token[]; sub?: Token[] }[];
  captionY?: number; // center of the running captions, px from the top (measured reference: 1174)
  captionSize?: number; // px (measured reference: 48)
  maxWords?: number; // words per running caption (measured reference: 1-3)
  maxChars?: number;
  shadow?: number; // 0..1 soft shadow under text over footage; 0 on dark, graded footage
  topShade?: number; // 0..1 darkening from the top edge, gone by 44% of the height: for text set against a bright sky
};
export type EditorialProps = ReelKitProps & { editorial?: EditorialSpec | null };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.out(Easing.cubic);
const f = (seconds: number) => seconds * KIT_FPS;

/** A word arriving: opacity, a blur that clears and a small rise, over `dur` frames from frame `at`. */
const arrive = (frame: number, at: number, dur = 6, blur = 12): React.CSSProperties => {
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease });
  return { opacity: p, filter: p < 1 ? `blur(${((1 - p) * blur).toFixed(2)}px)` : undefined, transform: `translateY(${((1 - p) * 10).toFixed(2)}px)`, display: "inline-block" };
};
/** A block leaving: a quick fade with a slight blur. */
const leave = (frame: number, end: number, dur = 5): React.CSSProperties => {
  const p = interpolate(frame, [end, end + dur], [1, 0], clamp);
  return { opacity: p, filter: p < 1 ? `blur(${((1 - p) * 6).toFixed(2)}px)` : undefined };
};

const useFonts = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("editorial fonts"));
  useEffect(() => {
    Promise.all(FACES.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(file)})`, { weight, style });
      return face.load().then((ff) => (document.fonts as unknown as Set<FontFace>).add(ff));
    }))
      .catch((e) => console.warn("editorial: a font failed to load", e))
      .finally(() => { setReady(true); continueRender(handle); });
  }, [handle]);
  return ready;
};

const shadowOf = (a: number) => (a > 0 ? `0 2px 18px rgba(0,0,0,${a}), 0 1px 3px rgba(0,0,0,${a * 0.8})` : undefined);
const sansStyle = (size: number, weight = 900): React.CSSProperties => ({
  fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: weight >= 800 ? "-0.045em" : "-0.015em", lineHeight: 1,
});
// the serif is set ~1.2x the sans beside it: its x-height is smaller, and the reference sets it larger
const serifStyle = (size: number): React.CSSProperties => ({
  fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: Math.round(size * 1.2), letterSpacing: "-0.01em", lineHeight: 1,
});

type W = Word & { i: number };
const SENTENCE_END = /[.!?…]["»”)]*$/;

/** Running captions: the words no other tier shows, in chunks of 1-3, split at pauses, sentence ends and cuts. */
const chunkWords = (free: W[], maxWords: number, maxChars: number): W[][] => {
  const out: W[][] = [];
  let cur: W[] = [];
  const len = (ws: W[]) => ws.reduce((n, w) => n + w.text.length + 1, 0);
  for (const w of free) {
    const prev = cur[cur.length - 1];
    const brk = prev && (w.i !== prev.i + 1 || w.seg !== prev.seg || w.start - prev.end >= 0.25 || SENTENCE_END.test(prev.text)
      || cur.length >= maxWords || len(cur) + w.text.length > maxChars);
    if (brk) { out.push(cur); cur = []; }
    cur.push(w);
  }
  if (cur.length) out.push(cur);
  return out;
};

const Hook: React.FC<{ spec: NonNullable<EditorialSpec["hook"]>; words: Word[]; accent: string; shadow: number }> = ({ spec, words, accent, shadow }) => {
  const frame = useCurrentFrame();
  const all = spec.lines.flat();
  const end = f(words[all[all.length - 1]].end + (spec.hold ?? 0.45));
  if (frame > end + 6) return null;
  const longest = Math.max(...spec.lines.map((l) => l.map((i) => words[i].text).join(" ").length));
  const size = Math.min(132, Math.round(1380 / Math.max(longest, 6))); // measured: 130 px, the block ~680 px wide
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: spec.y ?? 960, transform: "translateY(-50%)", textAlign: "center", color: "#fff",
      textShadow: shadowOf(shadow), ...leave(frame, end) }}>
      {spec.lines.map((line, li) => {
        const serif = spec.serifLines?.includes(li);
        return (
          <div key={li} style={{ ...(serif ? serifStyle(size) : sansStyle(size)), height: Math.round(size * 0.88), whiteSpace: "nowrap",
            color: spec.accentLines?.includes(li) ? accent : "#fff" }}>
            {line.map((i, k) => (
              <span key={i} style={{ ...arrive(frame, f(words[i].start) - 1, 6, 16), marginLeft: k ? "0.22em" : 0 }}>{words[i].text.replace(/[.,]$/, "")}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Running: React.FC<{ chunks: W[][]; emphasis: Set<number>; accent: string; y: number; size: number; shadow: number }> = ({ chunks, emphasis, accent, y, size, shadow }) => {
  const frame = useCurrentFrame();
  const k = chunks.findIndex((c, n) => {
    const next = chunks[n + 1];
    const end = Math.min(f(c[c.length - 1].end + 0.3), next ? f(next[0].start) - 1 : Infinity);
    return frame >= f(c[0].start) - 2 && frame < end + 4;
  });
  if (k < 0) return null;
  const c = chunks[k];
  const next = chunks[k + 1];
  const end = Math.min(f(c[c.length - 1].end + 0.3), next ? f(next[0].start) - 1 : Infinity);
  const plain = c.filter((w) => !emphasis.has(w.i));
  const strong = c.filter((w) => emphasis.has(w.i));
  const row = (ws: W[], serif: boolean) => ws.length > 0 && (
    <div style={{ ...(serif ? { ...serifStyle(size * 1.12), color: accent, marginTop: plain.length ? -Math.round(size * 0.12) : 0 } : sansStyle(size, 600)), whiteSpace: "nowrap", lineHeight: 1.12 }}>
      {ws.map((w, n) => <span key={w.i} style={{ ...arrive(frame, f(w.start) - 1, 5, 10), marginLeft: n ? "0.26em" : 0 }}>{w.text}</span>)}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, transform: "translateY(-50%)", textAlign: "center", color: "#fff",
      textShadow: shadowOf(shadow), ...leave(frame, end, 4) }}>
      {row(plain, false)}
      {row(strong, true)}
    </div>
  );
};

const autoLines = (idx: number[], words: Word[], maxChars: number): number[][] => {
  const lines: number[][] = [[]];
  for (const i of idx) {
    const cur = lines[lines.length - 1];
    const n = cur.reduce((s, j) => s + words[j].text.length + 1, 0);
    if (cur.length && n + words[i].text.length > maxChars) lines.push([i]);
    else cur.push(i);
  }
  return lines;
};

const Callout: React.FC<{ spec: NonNullable<EditorialSpec["callouts"]>[number]; words: Word[]; emphasis: Set<number>; accent: string; shadow: number }> = ({ spec, words, emphasis, accent, shadow }) => {
  const frame = useCurrentFrame();
  const [a, b] = spec.words;
  const start = f(words[a].start) - 2;
  const end = f(words[b].end + (spec.hold ?? 0.35));
  if (frame < start || frame > end + 6) return null;
  const idx = Array.from({ length: b - a + 1 }, (_, n) => a + n);
  const lines = spec.lines ?? autoLines(idx, words, 15);
  const longest = Math.max(...lines.map((l) => l.map((i) => words[i].text).join(" ").length));
  const size = Math.min(spec.size ?? 82, Math.round(1500 / Math.max(longest, 8))); // measured: 76-82 px, never wider than ~860 px
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: spec.y ?? 1180, transform: "translateY(-50%)", textAlign: "center", color: "#fff",
      textShadow: shadowOf(shadow), ...leave(frame, end) }}>
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap", height: Math.round(size * 1.08), marginTop: li ? spec.gap ?? 0 : 0 }}>
          {line.map((i, n) => (
            <span key={i} style={{ ...(emphasis.has(i) ? { ...serifStyle(size * (spec.serifScale ?? 1)), color: accent,
              WebkitTextStroke: spec.serifStroke ? `${spec.serifStroke}px ${accent}` : undefined } : sansStyle(size)), ...arrive(frame, f(words[i].start) - 1, 6, 14), marginLeft: n ? "0.24em" : 0 }}>
              {words[i].text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const Icon: React.FC<{ kind: "comment" | "send"; size: number }> = ({ kind, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {kind === "comment"
      ? <path d="M12 4.2c-4.6 0-8.2 3.2-8.2 7.3 0 1.6.6 3.1 1.6 4.3L4.6 19.6l4.1-1.3c1 .4 2.1.6 3.3.6 4.6 0 8.2-3.2 8.2-7.4S16.6 4.2 12 4.2Z" />
      : <><path d="M20.5 3.5 3.8 10.3l6.4 2.6 2.6 6.9 7.7-16.3Z" /><path d="m10.2 12.9 4.6-4.5" /></>}
  </svg>
);

/** The comment-keyword pill: a red disc lands, the black pill opens to the keyword, then switches to the promise. */
const Pill: React.FC<{ spec: NonNullable<EditorialSpec["cta"]>; words: Word[]; accent: string; ready: boolean; total: number }> = ({ spec, words, accent, total }) => {
  const frame = useCurrentFrame();
  const start = f(words[spec.atWord].start) - 2;
  const end = spec.untilWord !== undefined ? f(words[spec.untilWord].end + 0.4) : total;
  if (frame < start || frame > end + 6) return null;
  const swap = spec.then && spec.thenAtWord !== undefined ? f(words[spec.thenAtWord].start) - 2 : Infinity;
  const second = frame >= swap;
  const text = second ? spec.then! : spec.keyword.toUpperCase();
  const disc = 132;
  const open = interpolate(frame, [start + 5, start + 14], [0, 1], { ...clamp, easing: ease });
  const textW = Math.round(text.length * (second ? 30 : 46) + 64); // an estimate that errs wide: the pill never clips its text
  const width = disc + 18 + open * textW;
  const pop = interpolate(frame, [start, start + 7], [0.55, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const fade = interpolate(frame, [second ? swap : start + 8, (second ? swap : start + 8) + 6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top: (spec.y ?? 603) - (disc + 18) / 2, width, height: disc + 18, borderRadius: (disc + 18) / 2,
      background: "#0E0E0F", display: "flex", alignItems: "center", overflow: "hidden", transform: `scale(${pop})`,
      opacity: interpolate(frame, [start, start + 4], [0, 1], clamp), ...leave(frame, end) }}>
      <div style={{ width: disc, height: disc, margin: 9, borderRadius: disc / 2, background: accent, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon kind={second ? "send" : "comment"} size={62} />
      </div>
      <div style={{ ...sansStyle(second ? 54 : 70, second ? 700 : 900), letterSpacing: second ? "-0.02em" : "-0.01em", color: "#fff", whiteSpace: "nowrap", paddingLeft: 14, opacity: fade * open }}>
        {text}
      </div>
    </div>
  );
};

const Card: React.FC<{ spec: NonNullable<EditorialSpec["cards"]>[number]; words: Word[]; accent: string }> = ({ spec, words, accent }) => {
  const frame = useCurrentFrame();
  const start = f(words[spec.fromWord].start) - 4;
  const end = f(words[spec.toWord].end);
  if (frame < start || frame > end + 8) return null;
  const field = interpolate(frame, [start, start + 5, end, end + 7], [0, 1, 1, 0], clamp);
  const tok = (t: Token, n: number, size: number, base: number) => {
    const at = t.atWord !== undefined ? f(words[t.atWord].start) - 1 : base + n * 5;
    return (
      <span key={n} style={{ ...(t.serif ? serifStyle(size * 0.92) : sansStyle(size)), color: t.accent ? accent : "#272428", ...arrive(frame, at, 7, 18), marginLeft: n ? "0.2em" : 0 }}>{t.t}</span>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#F2F0F3", opacity: field, alignItems: "center", justifyContent: "center" }}>
      {spec.label && (
        <div style={{ ...sansStyle(38, 700), letterSpacing: "0.16em", color: "#5B585D", marginBottom: 40, ...arrive(frame, start + 4, 7, 10) }}>{spec.label.toUpperCase()}</div>
      )}
      <div style={{ whiteSpace: "nowrap" }}>{spec.big.map((t, n) => tok(t, n, Math.min(148, Math.round(1500 / Math.max(spec.big.map((x) => x.t).join(" ").length, 6))), start + 9))}</div>
      {spec.sub && <div style={{ whiteSpace: "nowrap", marginTop: 44 }}>{spec.sub.map((t, n) => tok(t, n, 70, start + 20))}</div>}
    </AbsoluteFill>
  );
};

export const EditorialLayer: React.FC<{ p: EditorialProps }> = ({ p }) => {
  const ready = useFonts();
  const frame = useCurrentFrame();
  const spec = p.editorial ?? {};
  const words = p.captions.words;
  if (!ready || !words.length) return null;
  const accent = spec.accent ?? p.brand.colors.accent;
  const shadow = spec.shadow ?? 0.3;
  const emphasis = new Set(spec.emphasis ?? []);
  const taken = new Set<number>();
  spec.hook?.lines.flat().forEach((i) => taken.add(i));
  spec.callouts?.forEach((c) => { for (let i = c.words[0]; i <= c.words[1]; i++) taken.add(i); });
  spec.cards?.forEach((c) => { for (let i = c.fromWord; i <= c.toWord; i++) taken.add(i); });
  const free = words.map((w, i) => ({ ...w, i })).filter((w) => !taken.has(w.i));
  const chunks = chunkWords(free, spec.maxWords ?? 3, spec.maxChars ?? 18);
  const hidden = (p.hideSubtitles ?? []).some(([a, b]) => frame >= f(a) && frame <= f(b));
  const total = Math.round(p.captions.duration * KIT_FPS);
  return (
    <AbsoluteFill>
      {spec.topShade ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 845,
          background: `linear-gradient(to bottom, rgba(0,0,0,${spec.topShade}) 0%, rgba(0,0,0,${(spec.topShade * 0.6).toFixed(3)}) 48%, rgba(0,0,0,0) 100%)` }} />
      ) : null}
      {spec.cards?.map((c, n) => <Card key={n} spec={c} words={words} accent={accent} />)}
      {!hidden && <Running chunks={chunks} emphasis={emphasis} accent={accent} y={spec.captionY ?? 1174} size={spec.captionSize ?? 48} shadow={shadow} />}
      {spec.callouts?.map((c, n) => <Callout key={n} spec={c} words={words} emphasis={emphasis} accent={accent} shadow={shadow} />)}
      {spec.hook && <Hook spec={spec.hook} words={words} accent={accent} shadow={shadow} />}
      {spec.cta && <Pill spec={spec.cta} words={words} accent={accent} ready={ready} total={total} />}
    </AbsoluteFill>
  );
};

/** The kit's footage, camera, inserts and end card, with the editorial caption system on top. */
export const EditorialReel: React.FC<EditorialProps> = (p) => (
  <AbsoluteFill>
    <ReelKit {...p} subtitles="none" hook={null} />
    <EditorialLayer p={p} />
  </AbsoluteFill>
);
