import React, {createContext, useContext} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import cuesData from '../data/cues.json';
import {ANTICIPATION, buildTimeline, type CueFile, type RowId, type Scene} from './timeline';

export const TIMELINE = buildTimeline(cuesData as CueFile);

export const sceneById = (id: RowId) => {
  const s = TIMELINE.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`No scene ${id}`);
  return s;
};

const SceneCtx = createContext<Scene | null>(null);

export const SceneProvider: React.FC<{scene: Scene; children: React.ReactNode}> = ({scene, children}) => (
  <SceneCtx.Provider value={scene}>{children}</SceneCtx.Provider>
);

export const useScene = () => {
  const s = useContext(SceneCtx);
  if (!s) throw new Error('useScene outside a scene');
  return s;
};

/**
 * Cue lookups in the current scene's local frames.
 *   c('C04')            frame the change starts (cue frame minus anticipation)
 *   c.between(a, b, t)  a point a fraction t of the way from cue a to cue b
 *   c.rowStart/rowEnd   first word / last word end of this scene's VO row
 */
export const useCues = () => {
  const scene = useScene();
  const local = (abs: number) => abs - scene.from - ANTICIPATION;
  const c = (id: string) => {
    const f = TIMELINE.cueFrames[id];
    if (f === undefined) throw new Error(`Cue ${id} is missing from cues.json`);
    return local(f);
  };
  const row = TIMELINE.rowFrames[scene.id];
  return Object.assign(c, {
    between: (a: string | number, b: string | number, t: number) => {
      const fa = typeof a === 'number' ? a : c(a);
      const fb = typeof b === 'number' ? b : c(b);
      return Math.round(fa + (fb - fa) * t);
    },
    rowStart: row ? local(row.start) : 0,
    rowEnd: row ? local(row.end) : scene.durationInFrames,
    duration: scene.durationInFrames,
  });
};

const ease = Easing.bezier(0.45, 0, 0.2, 1);

/** 0→1 between frame `start` and `start + dur`, eased. */
export const ramp = (frame: number, start: number, dur: number, easing: (t: number) => number = ease) =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** A settling spring that starts at `start`. 0 before it. */
export const usePop = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (start: number, damping = 12, durationInFrames?: number) =>
    frame < start ? 0 : spring({frame: frame - start, fps, config: {damping, mass: 0.7, stiffness: 140}, durationInFrames});
};

/** Low-rate jitter seed for hand-drawn "boil" (changes every 4 frames). */
export const useBoil = (rate = 4) => Math.floor(useCurrentFrame() / rate);
