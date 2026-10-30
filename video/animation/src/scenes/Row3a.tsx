// Row 3a · Assumption challenged.
// C24 "technically possible" → sticky note · C25 "the challenge" → brief staples on · C26 "the bandwidth" → clock opens
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Drop, Ink, Layer, Sticky} from '../kit/Bits';
import {Clock, FriendTalk} from '../kit/Doodles';
import {FrozenScene} from '../kit/Frozen';
import {Page, PageTurn} from '../kit/Paper';
import {line, scratch} from '../kit/rough';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C, F} from '../theme';

const STICKY = {x: 600, y: 170, w: 520, h: 420};
const LINE_H = 96;

/** "not technically possible", with "not" crossed out as `cross` goes 0→1 (used by 3b). */
export const NotSticky: React.FC<{at: number; cross: number}> = ({at, cross}) => (
  <Drop at={at} x={STICKY.x} y={STICKY.y} w={STICKY.w} h={STICKY.h} rotate={-2} attach="tape" seed="not">
    <Sticky style={{fontSize: 92, fontWeight: 700, lineHeight: `${LINE_H}px`}}>
      <div>not</div>
      <div>technically</div>
      <div>possible</div>
    </Sticky>
    <svg width={STICKY.w} height={STICKY.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <Ink d={scratch(STICKY.w / 2 - 80, STICKY.h / 2 - LINE_H * 1.5 + 44, 160, 56, 'notx', 6)} p={cross} width={10} color={C.red} />
    </svg>
  </Drop>
);

/** The Build Lane challenge brief, stapled. */
export const Brief: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  return (
    <Drop at={at} x={1260} y={130} w={500} h={370} rotate={3} attach="none" seed="brief">
      <div style={{position: 'absolute', inset: 0, background: '#fffdf7', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)'}} />
      <div style={{position: 'absolute', left: 40, top: 46, fontFamily: F.type, fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1.1}}>
        Build Lane
        <br />
        challenge
      </div>
      <svg width={500} height={370} style={{position: 'absolute', left: 0, top: 0}}>
        {[0, 1, 2, 3].map((i) => (
          <Ink key={i} d={line(42, 190 + i * 40, 440 - (i === 3 ? 140 : 0), 190 + i * 40, `brief${i}`, 1)} p={ramp(f, at + 8 + i * 3, 10)} width={6} color="#c9c1b0" />
        ))}
        {/* staple */}
        <path d="M18 34 L70 20" stroke="#8d939c" strokeWidth={6} strokeLinecap="round" opacity={ramp(f, at + 6, 3)} />
      </svg>
    </Drop>
  );
};

export const Row3a: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  return (
    <PageTurn at={0} from={<FrozenScene id="2f" />}>
      <Page variant="lines">
        <Thread />
        {/* "telling a friend": word 3 of the 11 before C24 */}
        <div style={{position: 'absolute', left: 120, top: 170}}>
          <FriendTalk p={ramp(f, 8, 26)} talk={ramp(f, c.between(c.rowStart, 'C24', 3 / 11), 16)} />
        </div>
        <NotSticky at={c('C24')} cross={0} />
        <Brief at={c('C25')} />
        <Layer>
          <Clock p={ramp(f, c('C26') - 8, 16)} open={ramp(f, c('C26') + 10, 26)} cx={960} cy={790} />
        </Layer>
      </Page>
    </PageTurn>
  );
};
