import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Desk} from './kit/Paper';
import {SCENES} from './scenes';
import {Music, Voiceover} from './Soundtrack';
import {SceneProvider, TIMELINE} from './timing/context';

export type MainProps = {debug: boolean};

export const Main: React.FC<MainProps> = ({debug}) => (
  <AbsoluteFill>
    <Desk />
    {TIMELINE.scenes.map((s) => {
      const Comp = SCENES[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames} name={`Row ${s.id}${s.music ? ` (${s.music})` : ''}`}>
          <SceneProvider scene={s}>
            <Comp />
          </SceneProvider>
        </Sequence>
      );
    })}
    <Voiceover />
    <Music />
    {debug && <DebugOverlay />}
  </AbsoluteFill>
);

/** Row, time and the cues that just fired. Off by default; pass {"debug": true}. */
const DebugOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = TIMELINE.scenes.find((s) => frame >= s.from && frame < s.from + s.durationInFrames);
  const recent = Object.entries(TIMELINE.cueFrames).filter(([, f]) => frame >= f && frame < f + 30);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', fontFamily: 'monospace', fontSize: 26, color: '#fff'}}>
      <div style={{position: 'absolute', left: 40, top: 36, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 8}}>
        row {scene?.id} · f{frame} · {(frame / TIMELINE.fps).toFixed(2)}s {TIMELINE.placeholder ? '· PLACEHOLDER TIMING' : ''}
      </div>
      <div style={{position: 'absolute', right: 40, top: 36, display: 'flex', gap: 8}}>
        {recent.map(([id]) => (
          <div key={id} style={{background: '#c8412e', padding: '6px 12px', borderRadius: 8}}>{id}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
