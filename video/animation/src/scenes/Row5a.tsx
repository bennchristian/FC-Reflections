// Row 5a · What I'll take forward.
// C39 "shifted" → thread bends upward · C40 "recognise yet" → runs off the page
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Mortarboard, Seedling} from '../kit/Doodles';
import {FrozenScene} from '../kit/Frozen';
import {Camera, Page, PageTurn} from '../kit/Paper';
import {threadPoints, Thread, type ThreadState} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C, F} from '../theme';

const Y = 700;

/** Little reminders of each chapter, riding on the thread at fraction u. */
const MILESTONES: {u: number; render: (p: number) => React.ReactNode}[] = [
  {u: 0.07, render: (p) => <div style={{transform: 'scale(0.5)', transformOrigin: '0 0', position: 'absolute', left: -60, top: -110}}><Mortarboard p={p} /></div>},
  {u: 0.24, render: (p) => <svg width={10} height={10} style={{overflow: 'visible', position: 'absolute'}}><Seedling p={p} x={0} y={0} scale={0.6} /></svg>},
  {u: 0.41, render: (p) => <div style={{position: 'absolute', left: -110, top: -78, fontFamily: F.marker, fontSize: 44, color: C.ink, opacity: p, transform: 'rotate(-4deg)'}}>CONFIDENCE</div>},
  {
    u: 0.58,
    render: (p) => (
      <div style={{position: 'absolute', left: -90, top: -120, opacity: p}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: i * 46, top: i * 8, width: 90, height: 60, background: ['#20253a', '#1a5fb4', '#891f1b'][i], border: '5px solid #fffdf7', transform: `rotate(${(i - 1) * 8}deg)`, boxShadow: '0 3px 6px rgba(0,0,0,0.2)'}} />
        ))}
      </div>
    ),
  },
  {u: 0.75, render: (p) => <div style={{position: 'absolute', left: -60, top: -100, width: 120, height: 76, background: '#efe3c8', border: `4px solid ${C.ink}`, opacity: p, transform: 'rotate(-5deg)'}} />},
];

export const Row5a: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const state: ThreadState = {lift: ramp(f, c('C39'), 34), runOff: ramp(f, c('C40'), 30)};
  const pts = threadPoints(Y, state);
  const at = (u: number) => pts[Math.round(u * (pts.length - 1))];
  const pull = ramp(f, 4, 40);
  return (
    <PageTurn at={0} from={<FrozenScene id="4c" />}>
      <Page variant="plain">
        <Camera scale={1.3 - 0.3 * pull} x={(1 - pull) * 300}>
          <Thread y={Y} {...state} width={8} />
          {MILESTONES.map((m, i) => {
            const [x, y] = at(m.u);
            return (
              <div key={i} style={{position: 'absolute', left: x, top: y}}>
                {m.render(ramp(f, 6 + i * 6, 16))}
              </div>
            );
          })}
        </Camera>
      </Page>
    </PageTurn>
  );
};
