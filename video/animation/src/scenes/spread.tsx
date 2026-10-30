// The project spread shared by 2d (two big clippings), 2e (all five) and 2f (slides aside).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {ProjectKey} from '../assets';
import {Drop, Hand, Ink, Layer} from '../kit/Bits';
import {featureText, ProjectClipping} from '../kit/Project';
import {arrow} from '../kit/rough';
import {ramp} from '../timing/context';
import {C} from '../theme';

const BIG = {w: 840, h: 525};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type SpreadState = {
  knownAt: number;
  llAt: number;
  /** 0 = 2d layout (two big), 1 = 2e layout (two big up top, three small below) */
  rearrange: number;
  /** drop frames for the three small clippings (2e) */
  smallAt: [number, number, number];
  /** marker callouts for one feature each */
  callouts: number;
  /** the "(minimal coding experience!)" margin scribble */
  scribbleAt: number;
  scribbleOut: number;
};

const SMALL: {project: ProjectKey; x: number; y: number; rot: number; tape: string}[] = [
  {project: 'pgb', x: 180, y: 690, rot: -4, tape: C.tapeMint},
  {project: 'cadgy', x: 760, y: 705, rot: 3, tape: C.tapePink},
  {project: 'portfolio', x: 1330, y: 690, rot: -2, tape: C.tape},
];

export const Spread: React.FC<SpreadState> = (s) => {
  const f = useCurrentFrame();
  const r = s.rearrange;
  const sc = lerp(1, 0.8, r);
  const known = {x: lerp(110, 170, r), y: lerp(150, 60, r), rot: -2};
  const ll = {x: lerp(970, 1060, r), y: lerp(190, 80, r), rot: 2};
  const kA = arrow([330, 560], [470, 400], 40, 'kcall', 24);
  const lA = arrow([1400, 585], [1320, 482], -30, 'lcall', 24);
  const scribble = ramp(f, s.scribbleAt, 18) * (1 - ramp(f, s.scribbleOut, 10));
  const mA = arrow([1060, 830], [930, 700], -30, 'minimal', 24);
  return (
    <>
      <Drop at={s.knownAt} x={known.x} y={known.y} w={BIG.w * sc} h={BIG.h * sc} rotate={known.rot} attach="tape2" seed="known">
        <ProjectClipping project="known" w={BIG.w * sc} h={BIG.h * sc} />
      </Drop>
      <Drop at={s.llAt} x={ll.x} y={ll.y} w={BIG.w * sc} h={BIG.h * sc} rotate={ll.rot} attach="pin" seed="ll">
        <ProjectClipping project="livingletter" w={BIG.w * sc} h={BIG.h * sc} alt={interpolate(s.callouts, [0.05, 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      </Drop>
      {SMALL.map((m, i) => (
        <Drop key={m.project} at={s.smallAt[i]} x={m.x} y={m.y} w={400} h={250} rotate={m.rot} attach="tape" tapeColor={m.tape} seed={m.project}>
          <ProjectClipping project={m.project} w={400} h={250} />
        </Drop>
      ))}
      <Layer>
        <Ink d={kA.shaft} p={interpolate(s.callouts, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'})} color={C.red} width={6} />
        <Ink d={kA.head} p={interpolate(s.callouts, [0.45, 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color={C.red} width={6} />
        <Ink d={lA.shaft} p={interpolate(s.callouts, [0.2, 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color={C.red} width={6} />
        <Ink d={lA.head} p={interpolate(s.callouts, [0.65, 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color={C.red} width={6} />
        <g opacity={1 - ramp(f, s.scribbleOut, 10)}>
          <Ink d={mA.shaft} p={ramp(f, s.scribbleAt + 10, 10)} color={C.pencil} width={5} />
          <Ink d={mA.head} p={ramp(f, s.scribbleAt + 18, 5)} color={C.pencil} width={5} />
        </g>
      </Layer>
      <Hand text={featureText('known')} at={-1} dur={1} x={200} y={565} size={52} color={C.red} rotate={-3} style={{opacity: interpolate(s.callouts, [0.3, 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Hand text={featureText('livingletter')} at={-1} dur={1} x={1330} y={590} size={52} color={C.red} rotate={2} style={{opacity: interpolate(s.callouts, [0.5, 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      {scribble > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(f, s.scribbleOut, 10)}}>
          <Hand text="(minimal coding experience!)" at={s.scribbleAt} dur={20} x={1040} y={830} size={64} color={C.pencil} rotate={-3} />
        </div>
      )}
    </>
  );
};
