import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../timing/context';
import {C} from '../theme';

// Paper grain: an SVG-as-image turbulence tile, rasterised once by the browser.
const grain = (freq: number, alpha: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.18  0 0 0 ${alpha} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  )}")`;

export const GRAIN_FINE = grain(0.85, 0.22);
export const GRAIN_COARSE = grain(0.035, 0.18);

export const PAGE_INSET = 26;

/** The desk under the book. Rendered once behind every scene. */
export const Desk: React.FC = () => (
  <AbsoluteFill style={{background: `${GRAIN_COARSE}, ${GRAIN_FINE}, radial-gradient(ellipse at 50% 40%, #5c4a3d, ${C.desk})`}} />
);

type Variant = 'plain' | 'dots' | 'lines' | 'grid';

const ruling: Record<Variant, string> = {
  plain: 'none',
  dots: `radial-gradient(circle, rgba(80,90,110,0.22) 1.6px, transparent 2px) 0 0 / 38px 38px`,
  lines: `repeating-linear-gradient(to bottom, transparent 0 53px, ${C.paperLine} 53px 55px)`,
  grid: `linear-gradient(${C.paperLine} 1.5px, transparent 1.5px) 0 0 / 46px 46px, linear-gradient(90deg, ${C.paperLine} 1.5px, transparent 1.5px) 0 0 / 46px 46px`,
};

/** A scrapbook page: cream paper with grain, ruling and a spine shadow on the left. */
export const Page: React.FC<{variant?: Variant; tint?: string; children?: React.ReactNode}> = ({variant = 'plain', tint = C.paper, children}) => (
  <AbsoluteFill style={{padding: PAGE_INSET}}>
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
        background: `${GRAIN_FINE}, ${GRAIN_COARSE}, ${ruling[variant] === 'none' ? tint : `${ruling[variant]}, ${tint}`}`,
        boxShadow: `0 18px 40px rgba(0,0,0,0.35), inset 0 0 120px rgba(150,120,80,0.18)`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(60,40,20,0.22), transparent 5%)'}} />
      {/* children use full-frame (1920×1080) coordinates */}
      <div style={{position: 'absolute', left: -PAGE_INSET, top: -PAGE_INSET, width: 1920, height: 1080}}>{children}</div>
    </div>
  </AbsoluteFill>
);

/** The kraft-board cover of the scrapbook. */
export const Cover: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{padding: PAGE_INSET - 8}}>
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 14,
        overflow: 'hidden',
        background: `${GRAIN_FINE}, ${GRAIN_COARSE}, linear-gradient(135deg, ${C.cover}, ${C.coverDark})`,
        boxShadow: '0 24px 50px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(255,255,255,0.08), inset 26px 0 40px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{position: 'absolute', left: -PAGE_INSET + 8, top: -PAGE_INSET + 8, width: 1920, height: 1080}}>{children}</div>
    </div>
  </AbsoluteFill>
);

/**
 * Page turn: `from` (the old page) lifts off its left hinge and swings away,
 * revealing `children` (the new page) underneath. Starts at frame `at`.
 */
export const PageTurn: React.FC<{at: number; duration?: number; from: React.ReactNode; children: React.ReactNode}> = ({
  at,
  duration = 16,
  from,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, duration);
  const turning = p < 1;
  return (
    <AbsoluteFill>
      {children}
      {turning && (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.35), transparent 45%)', opacity: Math.sin(p * Math.PI) * 0.9}} />
          <AbsoluteFill style={{perspective: 2600, perspectiveOrigin: '0% 50%'}}>
            <AbsoluteFill
              style={{
                transformOrigin: `${PAGE_INSET}px 50%`,
                transform: `rotateY(${-p * 92}deg)`,
                backfaceVisibility: 'hidden',
              }}
            >
              {from}
              <AbsoluteFill style={{background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5))', opacity: p * 0.8}} />
            </AbsoluteFill>
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};

/** Camera move: scale/translate the whole frame around its centre. */
export const Camera: React.FC<{scale?: number; x?: number; y?: number; rotate?: number; children: React.ReactNode}> = ({
  scale = 1,
  x = 0,
  y = 0,
  rotate = 0,
  children,
}) => <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`}}>{children}</AbsoluteFill>;
