// Row 6 · End card (no VO, 4 s). M3 final chord tail → book closes, hold, fade.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Drop, Hand} from '../kit/Bits';
import {FrozenScene} from '../kit/Frozen';
import {Cover, PAGE_INSET} from '../kit/Paper';
import {FCLogo, fellowshipDates, ownerName} from '../kit/Project';
import {ramp, useCues} from '../timing/context';
import {F} from '../theme';

export const Row6: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const m3 = c('M3');
  const close = ramp(f, m3, 22);
  const fade = ramp(f, c.duration - 24, 24);
  return (
    <AbsoluteFill>
      {close < 1 && <FrozenScene id="5c" />}
      <AbsoluteFill style={{perspective: 2600, perspectiveOrigin: '0% 50%'}}>
        <AbsoluteFill style={{transformOrigin: `${PAGE_INSET}px 50%`, transform: `rotateY(${-(1 - close) * 95}deg)`, backfaceVisibility: 'hidden', opacity: close > 0 ? 1 : 0}}>
          <Cover>
            <Drop at={m3 + 18} x={835} y={150} w={250} h={250} rotate={-6} attach="none" style={{borderRadius: '50%'}}>
              <FCLogo size={250} />
            </Drop>
            <Hand text="Frontier Commons Fellowship" at={m3 + 22} dur={22} x={960} y={520} center size={86} font={F.marker} weight={400} color="#fbf3e2" />
            <Hand text={ownerName()} at={m3 + 34} dur={16} x={960} y={640} center size={84} color="#fbf3e2" />
            <Hand text={fellowshipDates()} at={m3 + 42} dur={14} x={960} y={730} center size={62} color="#f0dfc0" />
          </Cover>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};
