// Row 2b · What I built: People Group Browser.
// C13 "At FC" → clipping pins on · C14 "missionary senders" → screenshot reveals · C15 "messy dataset" → crumpled scrap smooths flat
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Drop, Hand} from '../kit/Bits';
import {Spreadsheet} from '../kit/Doodles';
import {Page} from '../kit/Paper';
import {ProjectClipping} from '../kit/Project';
import {ConfidenceHeader} from '../kit/Recurring';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';
import {useConfidence} from './Row2a';

/** PGB clipping + spreadsheet scrap; `aside` (0→1) shrinks them left to make room in 2c. */
export const PgbItems: React.FC<{aside: number}> = ({aside}) => {
  const f = useCurrentFrame();
  const c = useCues();
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: '60px 240px', transform: `scale(${1 - aside * 0.4})`}}>
      <Drop at={c('C13')} x={120} y={235} w={1000} h={625} rotate={-1.5} attach="pin" seed="pgb">
        <ProjectClipping project="pgb" w={1000} h={625} reveal={ramp(f, c('C14'), 20)} />
      </Drop>
      <Hand text="People Group Browser" at={c('C13') + 12} dur={22} x={150} y={880} size={66} color={C.blue} rotate={-2} />
      <Drop at={c('C15')} x={1240} y={370} w={460} h={330} rotate={4} attach="tape" seed="sheet">
        <Spreadsheet crumple={1 - ramp(f, c('C15') + 8, 26)} />
      </Drop>
      <Hand text="messy dataset" at={c('C15') + 4} dur={14} x={1280} y={260} size={58} color={C.pencil} rotate={3} />
    </div>
  );
};

export const Row2b: React.FC = () => {
  const conf = useConfidence();
  return (
    <Page variant="dots">
      <Thread />
      <ConfidenceHeader {...conf} />
      <PgbItems aside={0} />
    </Page>
  );
};
