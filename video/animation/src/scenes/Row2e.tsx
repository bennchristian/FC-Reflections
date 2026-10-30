// Row 2e · Showcase hold ★ (no VO, 5 s). M2 music swell → callouts draw, small clippings tape on on the beat, pull back.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Camera, Page} from '../kit/Paper';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {Spread} from './spread';

/** Beat spacing for the small clippings (~100 BPM at 30 fps). */
const BEAT = 18;

export const useShowcase = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const m2 = c('M2');
  return {
    spread: {
      knownAt: -1e6,
      llAt: -1e6,
      rearrange: ramp(f, m2, 26),
      smallAt: [m2 + BEAT, m2 + BEAT * 2, m2 + BEAT * 3] as [number, number, number],
      callouts: ramp(f, m2 + 30, 40, (t) => t),
      scribbleAt: -1e6,
      scribbleOut: m2,
    },
    pull: ramp(f, m2 + 6, Math.max(30, c.duration - 20)),
  };
};

export const Row2e: React.FC = () => {
  const {spread, pull} = useShowcase();
  return (
    <Page variant="grid">
      <Thread />
      <Camera scale={1 - pull * 0.08}>
        <Spread {...spread} />
      </Camera>
    </Page>
  );
};
