// Pieces that come back later in the video: the title label (0.5 → 5b),
// the "too good to be true?" note (0 → 5c) and the CONFIDENCE header (2a → 4a).
import React from 'react';
import {interpolate} from 'remotion';
import {C, F} from '../theme';
import {Ink, Layer} from './Bits';
import {ellipse, measure, scratch, smooth, tornClip} from './rough';

export const TITLE = "Why I'd say yes to FC again";

/** Torn-paper title label. `p` is its landing spring (0→1). */
export const TitleLabel: React.FC<{p: number; x?: number; y?: number; rotate?: number}> = ({p, x = 960, y = 440, rotate = -2}) => {
  if (p <= 0) return null;
  const w = 1380;
  const h = 250;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `rotate(${rotate + (1 - p) * -5}deg) scale(${1.25 - 0.25 * p})`,
        opacity: Math.min(1, p * 2.5),
        filter: `drop-shadow(0 ${6 + (1 - p) * 20}px ${10 + (1 - p) * 20}px rgba(0,0,0,0.35))`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fffaf0',
          clipPath: tornClip(w, h, 'title', 12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.marker,
          fontSize: 96,
          color: C.ink,
          letterSpacing: 1,
        }}
      >
        {TITLE}
      </div>
    </div>
  );
};

export const NOTE_WORDS = ['too', 'good', 'to', 'be', 'true'] as const;
const NOTE_FONT_SIZE = 150;
const NOTE_FONT = `700 ${NOTE_FONT_SIZE}px Caveat`;
export const NOTE = {x: 960, y: 520, w: 1160, h: 560, rotate: -2};

export type NoteState = {
  /** write-on progress per word (too, good, to, be, true) */
  words: number[];
  /** the "?" being drawn */
  q: number;
  /** 5c answer marks */
  circleGood?: number;
  circleTrue?: number;
  crossToo?: number;
  crossToBe?: number;
  /** "?" turns into "!" */
  bang?: number;
  /** anything else to draw in card coordinates (0..w, 0..h) */
  extras?: React.ReactNode;
};

/** The index card with "too good to be true?" on it. */
export const QuestionNote: React.FC<NoteState> = ({words, q, circleGood = 0, circleTrue = 0, crossToo = 0, crossToBe = 0, bang = 0, extras}) => {
  const {w, h} = NOTE;
  const space = measure(' ', NOTE_FONT);
  const widths = NOTE_WORDS.map((t) => measure(t, NOTE_FONT));
  const total = widths.reduce((a, b) => a + b, 0) + space * 4 + 90;
  const xs: number[] = [];
  let cx = (w - total) / 2;
  widths.forEach((ww) => {
    xs.push(cx);
    cx += ww + space;
  });
  const base = 330;
  const qx = cx + 6;
  const qPath = smooth([[qx + 4, base - 92], [qx + 22, base - 118], [qx + 58, base - 118], [qx + 72, base - 90], [qx + 60, base - 62], [qx + 38, base - 48], [qx + 36, base - 18]]);
  const bangPath = `M${qx + 40} ${base - 125} L${qx + 36} ${base - 22}`;
  const word = (i: number) => ({x: xs[i], w: widths[i]});
  return (
    <div
      style={{
        position: 'absolute',
        left: NOTE.x - w / 2,
        top: NOTE.y - h / 2,
        width: w,
        height: h,
        transform: `rotate(${NOTE.rotate}deg)`,
        background: `repeating-linear-gradient(to bottom, transparent 0 77px, rgba(80,120,170,0.25) 77px 79px) 0 40px, #fffdf7`,
        boxShadow: '0 14px 30px rgba(40,28,18,0.25)',
      }}
    >
      <div style={{position: 'absolute', left: 0, right: 0, top: 118, height: 3, background: 'rgba(200,65,46,0.45)'}} />
      {NOTE_WORDS.map((t, i) => (
        <div
          key={t + i}
          style={{
            position: 'absolute',
            left: xs[i],
            top: base - NOTE_FONT_SIZE * 0.82,
            fontFamily: F.hand,
            fontWeight: 700,
            fontSize: NOTE_FONT_SIZE,
            lineHeight: 1,
            color: C.ink,
            whiteSpace: 'pre',
            opacity: words[i] > 0 ? 1 : 0,
            clipPath: `inset(-30% calc(${(1 - Math.min(1, words[i])) * 100}% - ${Math.min(1, words[i]) * 40}px) -30% -5%)`,
          }}
        >
          {t}
        </div>
      ))}
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g opacity={1 - interpolate(bang, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'})}>
          <Ink d={qPath} p={q} width={13} />
          {q > 0.9 && <circle cx={qx + 36} cy={base + 12} r={9} fill={C.ink} />}
        </g>
        <Ink d={bangPath} p={interpolate(bang, [0.3, 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} width={15} color={C.red} />
        {bang > 0.85 && <circle cx={qx + 35} cy={base + 12} r={11} fill={C.red} />}
        <Ink d={ellipse(word(1).x + word(1).w / 2, base - 52, word(1).w * 0.68, 78, 'good')} p={circleGood} width={9} color={C.red} />
        <Ink d={ellipse(word(4).x + word(4).w / 2, base - 52, word(4).w * 0.68, 78, 'true')} p={circleTrue} width={9} color={C.red} />
        <Ink d={scratch(word(0).x - 6, base - 80, word(0).w + 12, 50, 'too', 4)} p={crossToo} width={9} color={C.red} />
        <Ink d={scratch(word(2).x - 6, base - 80, word(3).x + word(3).w - word(2).x + 12, 50, 'tobe', 6)} p={crossToBe} width={9} color={C.red} />
        {extras}
      </svg>
    </div>
  );
};

/** CONFIDENCE, lettered big (`p`), underlined twice (`under`), then shrunk to a header (`shrink`). */
export const ConfidenceHeader: React.FC<{p: number; under: number; shrink: number}> = ({p, under, shrink}) => {
  if (p <= 0) return null;
  const letters = 'CONFIDENCE'.split('');
  const size = 250;
  const font = `400 ${size}px "Permanent Marker"`;
  const total = measure('CONFIDENCE', font);
  const s = interpolate(shrink, [0, 1], [1, 0.34]);
  const cy = interpolate(shrink, [0, 1], [500, 112]);
  const x0 = 960 - total / 2;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(0px, ${cy - 500}px) scale(${s})`, transformOrigin: '960px 500px'}}>
      {letters.map((l, i) => {
        const q = interpolate(p, [i / letters.length, (i + 1.6) / letters.length], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const x = x0 + measure('CONFIDENCE'.slice(0, i), font);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: 500 - size * 0.62,
              fontFamily: F.marker,
              fontSize: size,
              lineHeight: 1,
              color: C.ink,
              opacity: q > 0 ? 1 : 0,
              transform: `translateY(${(1 - q) * 30}px) scale(${0.6 + 0.4 * q}) rotate(${(i % 2 ? 2 : -2) * q}deg)`,
              transformOrigin: '50% 80%',
            }}
          >
            {l}
          </div>
        );
      })}
      <Layer>
        <Ink d={smooth([[x0 - 10, 610], [960, 600], [x0 + total + 20, 612]])} p={interpolate(under, [0, 0.55], [0, 1], {extrapolateRight: 'clamp'})} width={14} color={C.red} />
        <Ink d={smooth([[x0 + 30, 645], [960, 638], [x0 + total - 10, 650]])} p={interpolate(under, [0.45, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} width={11} color={C.red} />
      </Layer>
    </div>
  );
};
