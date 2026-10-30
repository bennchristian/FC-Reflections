import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp, usePop} from '../timing/context';
import {C, F} from '../theme';
import {jit, tornClip} from './rough';

/** Full-frame SVG layer in 1920×1080 coordinates for marker and pencil work. */
export const Layer: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{pointerEvents: 'none', ...style}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{overflow: 'visible'}}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** A stroke that draws on as `p` goes 0→1. */
export const Ink: React.FC<{d: string; p: number; color?: string; width?: number; opacity?: number; dash?: string}> = ({
  d,
  p,
  color = C.ink,
  width = 6,
  opacity = 1,
}) =>
  p <= 0 ? null : (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.min(1, p)}
      opacity={opacity}
    />
  );

/** Ink drawn on from frame `at` over `dur` frames. */
export const InkAt: React.FC<Omit<React.ComponentProps<typeof Ink>, 'p'> & {at: number; dur?: number}> = ({at, dur = 14, ...rest}) => {
  const frame = useCurrentFrame();
  return <Ink {...rest} p={ramp(frame, at, dur)} />;
};

type Attach = 'tape' | 'pin' | 'clip' | 'tape2' | 'none';

/**
 * Something dropped onto the page: falls in, settles with a little overshoot,
 * then gets taped / pinned / clipped. Lands on frame `at` + ~4.
 */
export const Drop: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  attach?: Attach;
  tapeColor?: string;
  shadow?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  seed?: string;
}> = ({at, x, y, w, h, rotate = 0, attach = 'tape', tapeColor = C.tape, shadow = true, style, children, seed = 'drop'}) => {
  const pop = usePop();
  const s = pop(at, 11);
  if (s <= 0) return null;
  const attachP = pop(at + 5, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: Math.min(1, s * 3),
        transform: `translateY(${(1 - s) * -70}px) scale(${1.14 - 0.14 * s}) rotate(${rotate + (1 - s) * 7}deg)`,
        transformOrigin: '50% 30%',
        filter: shadow ? `drop-shadow(0 ${4 + 10 * (1 - s)}px ${8 + 14 * (1 - s)}px ${C.shadow})` : undefined,
        ...style,
      }}
    >
      {children}
      {attach !== 'none' && attachP > 0 && <Attachment kind={attach} w={w} p={attachP} color={tapeColor} seed={seed} />}
    </div>
  );
};

const Attachment: React.FC<{kind: Attach; w: number; p: number; color: string; seed: string}> = ({kind, w, p, color, seed}) => {
  if (kind === 'pin') return <Pin x={w / 2} y={14} p={p} />;
  if (kind === 'clip') return <Paperclip x={w * 0.18} y={-30} p={p} />;
  if (kind === 'tape2')
    return (
      <>
        <Tape x={-30} y={-8} w={150} rotate={-38} p={p} color={color} seed={`${seed}a`} />
        <Tape x={w - 120} y={-8} w={150} rotate={38} p={p} color={color} seed={`${seed}b`} />
      </>
    );
  return <Tape x={w / 2 - 85} y={-22} w={170} rotate={-3 + jit(seed) * 4} p={p} color={color} seed={seed} />;
};

export const Tape: React.FC<{x: number; y: number; w?: number; h?: number; rotate?: number; p?: number; color?: string; seed?: string}> = ({
  x,
  y,
  w = 170,
  h = 46,
  rotate = -3,
  p = 1,
  color = C.tape,
  seed = 'tape',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      background: `linear-gradient(180deg, rgba(255,255,255,0.25), transparent 40%), ${color}`,
      clipPath: tornClip(w, h, seed, 5),
      transform: `rotate(${rotate}deg) scale(${0.85 + 0.15 * p})`,
      opacity: p,
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
    }}
  />
);

export const Pin: React.FC<{x: number; y: number; p?: number; color?: string}> = ({x, y, p = 1, color = C.red}) => (
  <div style={{position: 'absolute', left: x - 17, top: y - 17 - (1 - p) * 30, width: 34, height: 34, opacity: p}}>
    <div style={{position: 'absolute', left: 6, top: 14, width: 30, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.22)', filter: 'blur(3px)'}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75), transparent 30%), ${color}`,
        boxShadow: 'inset -3px -4px 6px rgba(0,0,0,0.3)',
      }}
    />
  </div>
);

export const Paperclip: React.FC<{x: number; y: number; p?: number; rotate?: number}> = ({x, y, p = 1, rotate = 8}) => (
  <svg width={46} height={120} viewBox="0 0 46 120" style={{position: 'absolute', left: x, top: y - (1 - p) * 20, opacity: p, transform: `rotate(${rotate}deg)`, overflow: 'visible'}}>
    <path
      d="M14 30 V96 a9 9 0 0 0 18 0 V18 a14 14 0 0 0 -28 0 V92 a19 19 0 0 0 38 0 V36"
      fill="none"
      stroke="#8d939c"
      strokeWidth={4.5}
      strokeLinecap="round"
      style={{filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.3))'}}
    />
  </svg>
);

/** A sticky note body (use inside <Drop attach="none">). */
export const Sticky: React.FC<{color?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({color = C.sticky, children, style}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, rgba(0,0,0,0.06), transparent 18%), linear-gradient(160deg, ${color}, ${color} 70%, rgba(0,0,0,0.04))`,
      boxShadow: 'inset 0 -14px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontFamily: F.hand,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A white paper cut-out with slightly torn edges. */
export const Cutout: React.FC<{w: number; h: number; seed?: string; color?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  w,
  h,
  seed = 'cut',
  color = '#fffdf7',
  children,
  style,
}) => (
  <div style={{position: 'absolute', inset: 0, background: color, clipPath: tornClip(w, h, seed, 5), ...style}}>{children}</div>
);

/** Rubber stamp that slams down at `at`. */
export const Stamp: React.FC<{at: number; x: number; y: number; text?: string; color?: string; rotate?: number; size?: number; children?: React.ReactNode}> = ({
  at,
  x,
  y,
  text,
  color = C.red,
  rotate = -6,
  size = 64,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const s = ramp(frame, at, 5, (v) => v * v);
  const settle = t > 5 ? Math.max(0, 1 - (t - 5) / 6) * Math.sin((t - 5) * 1.6) * 0.03 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${2 - s + settle})`,
        opacity: Math.min(1, s * 1.6) * 0.88,
        border: `${size * 0.09}px solid ${color}`,
        borderRadius: size * 0.16,
        padding: `${size * 0.08}px ${size * 0.3}px`,
        fontFamily: F.type,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.06,
        textTransform: 'uppercase',
        color,
        whiteSpace: 'nowrap',
        mixBlendMode: 'multiply',
        maskImage: GRUNGE,
        WebkitMaskImage: GRUNGE,
      }}
    >
      {children ?? text}
    </div>
  );
};

const GRUNGE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='120'><filter id='g'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.9'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`,
)}")`;

/**
 * Handwritten text that writes on left-to-right as `p` goes 0→1.
 * Absolutely positioned at (x, y) = top-left unless `center`.
 */
export const Write: React.FC<{
  text: string;
  p: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  rotate?: number;
  center?: boolean;
  style?: React.CSSProperties;
}> = ({text, p, x, y, size = 64, color = C.ink, font = F.hand, weight = 700, rotate = 0, center = false, style}) =>
  p <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `${center ? 'translate(-50%, -50%) ' : ''}rotate(${rotate}deg)`,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.05,
        color,
        whiteSpace: 'pre',
        clipPath: `inset(-30% calc(${(1 - Math.min(1, p)) * 100}% - ${Math.min(1, p) * 40}px) -30% -5%)`,
        ...style,
      }}
    >
      {text}
    </div>
  );

/** <Write> that starts at frame `at`; duration scales with text length unless given. */
export const Hand: React.FC<Omit<React.ComponentProps<typeof Write>, 'p'> & {at: number; dur?: number}> = ({at, dur, ...rest}) => {
  const frame = useCurrentFrame();
  const d = dur ?? Math.max(8, Math.round(rest.text.length * 1.1));
  return <Write {...rest} p={ramp(frame, at, d, (t) => t)} />;
};

/** Fade helper for things that leave. */
export const Fade: React.FC<{from?: number; to?: number; out?: number; outDur?: number; inDur?: number; children: React.ReactNode}> = ({
  from,
  out,
  outDur = 12,
  inDur = 10,
  children,
}) => {
  const frame = useCurrentFrame();
  const a = from === undefined ? 1 : ramp(frame, from, inDur);
  const b = out === undefined ? 0 : ramp(frame, out, outDur);
  const o = a * (1 - b);
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
