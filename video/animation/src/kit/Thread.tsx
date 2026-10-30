import React from 'react';
import {noise2D} from '@remotion/noise';
import {useBoil} from '../timing/context';
import {C} from '../theme';
import {Layer} from './Bits';
import {smooth, type Pt} from './rough';

/**
 * The timeline thread that runs through every page. All states are 0→1 and
 * blend smoothly, so a scene only animates the numbers:
 *   draw    how much of the thread is drawn, left to right
 *   fray    the right part unravels into a loose scribble that trails off
 *   tangle  a knot balls up in the middle
 *   lift    the right half bends upward
 *   runOff  the end runs up and off the top-right of the frame
 */
export type ThreadState = {draw?: number; fray?: number; tangle?: number; lift?: number; runOff?: number};

export const THREAD_X0 = 70;
export const THREAD_X1 = 1850;
/** Where the frayed part begins (fraction along the thread). */
export const FRAY_AT = 0.58;

export function threadPoints(y: number, s: ThreadState, boil = 0, n = 280): Pt[] {
  const {fray = 0, tangle = 0, lift = 0, runOff = 0} = s;
  const pts: Pt[] = [];
  const x1 = THREAD_X1 + runOff * 260;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    let x = THREAD_X0 + (x1 - THREAD_X0) * u;
    let yy = y + noise2D('thread', u * 3.2, 0) * 14 + noise2D('boil', u * 9, boil) * 1.4;

    // Fray: growing loops after FRAY_AT, like a scribble losing its way.
    if (fray > 0 && u > FRAY_AT) {
      const v = (u - FRAY_AT) / (1 - FRAY_AT);
      const env = Math.pow(v, 1.1) * fray;
      const a = v * 34;
      x += Math.cos(a) * 46 * env + noise2D('fx', v * 6, 0) * 20 * env;
      yy += Math.sin(a) * 40 * env + noise2D('fy', v * 5, 0) * 60 * env + v * 40 * fray;
    }

    // Tangle: a knot centred on the middle of the page.
    const tw = Math.max(0, 1 - Math.abs(u - 0.5) / 0.13);
    if (tangle > 0 && tw > 0) {
      const env = Math.sin(tw * Math.PI * 0.5) * tangle;
      const a = u * 260;
      x += (Math.cos(a) * 62 + noise2D('tx', u * 20, 0) * 30) * env;
      yy += (Math.sin(a * 1.37) * 58 + noise2D('ty', u * 20, 0) * 30) * env;
    }

    // Lift: bend upward from the middle, and then off the top of the frame.
    const lu = Math.max(0, (u - 0.45) / 0.55);
    yy -= lift * lu * lu * (y - 160) + runOff * lu * lu * lu * (y + 200);

    pts.push([x, yy]);
  }
  return pts;
}

export const Thread: React.FC<ThreadState & {y?: number; width?: number}> = ({y = 985, width = 6, ...s}) => {
  const boil = useBoil(5);
  const draw = s.draw ?? 1;
  if (draw <= 0) return null;
  const pts = threadPoints(y, s, boil);
  const d = smooth(pts);
  const fray = s.fray ?? 0;
  const fp = pts[Math.round(FRAY_AT * (pts.length - 1))];
  return (
    <Layer>
      <defs>
        <linearGradient id="threadFade" gradientUnits="userSpaceOnUse" x1={THREAD_X0} x2={THREAD_X1} y1={0} y2={0}>
          <stop offset={0} stopColor={C.thread} />
          <stop offset={FRAY_AT} stopColor={C.thread} />
          <stop offset={1} stopColor={C.thread} stopOpacity={1 - fray * 0.75} />
        </linearGradient>
      </defs>
      {/* soft shadow so it sits on the paper */}
      <path d={d} pathLength={1} fill="none" stroke="rgba(60,20,10,0.18)" strokeWidth={width + 3} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - draw} transform="translate(2 4)" />
      <path d={d} pathLength={1} fill="none" stroke="url(#threadFade)" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      {/* loose strands splitting off where it frays */}
      {fray > 0.02 && draw > FRAY_AT &&
        [0, 1, 2].map((k) => {
          const strand: Pt[] = [];
          for (let i = 0; i <= 12; i++) {
            const v = i / 12;
            strand.push([fp[0] + v * (160 + k * 70) * fray, fp[1] + noise2D(`st${k}`, v * 3, boil * 0.05) * 40 * v * fray + (k - 1) * 50 * v * fray]);
          }
          return <path key={k} d={smooth(strand)} fill="none" stroke={C.thread} strokeWidth={2} strokeLinecap="round" opacity={0.7 * fray} />;
        })}
    </Layer>
  );
};

/** The point on the thread where it frays (for arrows and the seedling). */
export const frayPoint = (y: number, s: ThreadState): Pt => {
  const pts = threadPoints(y, s, 0);
  return pts[Math.round(FRAY_AT * (pts.length - 1))];
};
