// Row 3b · What I learnt: keep trying.
// C27 "doable" → "not" crossed out, "doable!" written · C28 "just keep trying" → phrase letters on ·
// C29 "my own mind" → thought cloud crossed out
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hand, Layer} from '../kit/Bits';
import {Cloud, Clock, FriendTalk} from '../kit/Doodles';
import {Page} from '../kit/Paper';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C, F} from '../theme';
import {Brief, NotSticky} from './Row3a';

export const Row3b: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  return (
    <Page variant="lines">
      <Thread />
      <div style={{position: 'absolute', left: 120, top: 170}}>
        <FriendTalk p={1} talk={1} />
      </div>
      <NotSticky at={-1e6} cross={ramp(f, c('C27'), 10)} />
      <Brief at={-1e6} />
      <Layer style={{opacity: 1 - ramp(f, 0, 20)}}>
        <Clock p={1} open={1} cx={960} cy={790} />
      </Layer>
      <Hand text="doable!" at={c('C27') + 8} dur={14} x={760} y={600} size={110} color={C.red} font={F.marker} weight={400} rotate={-6} />
      <Hand text="just keep trying" at={c('C28')} dur={24} x={170} y={770} size={120} color={C.blue} rotate={-2} />
      <div style={{position: 'absolute', left: 1360, top: 600}}>
        <Cloud p={ramp(f, c('C29'), 18)} cross={ramp(f, c('C29') + 14, 14)} />
      </div>
    </Page>
  );
};
