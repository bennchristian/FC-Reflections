// Row 2c · Struggle → adapting.
// C16 "never" → thread tangles · C17 "Claude Code" → sticky note + terminal doodle ·
// C18 "But" → stamps on adapted / googled / learned, tangle loosens
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Drop, Stamp, Sticky} from '../kit/Bits';
import {Terminal} from '../kit/Doodles';
import {Page} from '../kit/Paper';
import {ConfidenceHeader} from '../kit/Recurring';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';
import {useConfidence} from './Row2a';
import {PgbItems} from './Row2b';

export const Row2c: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const conf = useConfidence();
  // "But I adapted, googled, and learned on the spot." — words 2, 3, 5 of 9 after C18.
  const word = (k: number) => c.between(c('C18'), c.rowEnd, k / 9);
  const stamps = [
    {at: word(2), text: 'adapted', x: 1190, rot: -7},
    {at: word(3), text: 'googled', x: 1450, rot: 4},
    {at: word(5), text: 'learned', x: 1710, rot: -3},
  ];
  const tangle = ramp(f, c('C16'), 22) * (1 - ramp(f, word(5) + 4, 36));
  return (
    <Page variant="dots">
      <Thread tangle={tangle} />
      <ConfidenceHeader {...conf} />
      <PgbItems aside={ramp(f, 0, 20)} />
      <Drop at={c('C17')} x={1120} y={250} w={400} h={340} rotate={3} attach="tape" seed="cc">
        <Sticky style={{fontSize: 70, fontWeight: 700, lineHeight: 1.0, padding: 20}}>first time using Claude Code</Sticky>
      </Drop>
      <Drop at={c('C17') + 8} x={1560} y={330} w={300} h={200} rotate={-4} attach="none" shadow={false}>
        <Terminal p={ramp(f, c('C17') + 8, 22)} />
      </Drop>
      {stamps.map((s) => (
        <Stamp key={s.text} at={s.at} x={s.x} y={760} text={s.text} rotate={s.rot} size={50} color={s.text === 'learned' ? C.green : C.red} />
      ))}
    </Page>
  );
};
