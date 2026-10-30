// Row 5b · Close: yes again.
// C41 "say yes again" → title label flashes · C42 "comes to a close" → recap page-flip · C43 "the FC community" → community page lands
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FrozenScene} from '../kit/Frozen';
import {PageTurn} from '../kit/Paper';
import {TitleLabel} from '../kit/Recurring';
import {ramp, useCues, usePop} from '../timing/context';
import type {RowId} from '../timing/timeline';

/** Recap order: transition → confidence → the five projects → the letter; then community lands last. */
const RECAP: RowId[] = ['1a', '2a', '2e', '4b'];

export const Row5b: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const pop = usePop();
  const gap = Math.max(6, Math.min(14, Math.floor((c('C43') - c('C42')) / (RECAP.length + 0.5))));
  const pages: {id: RowId; at: number}[] = [
    {id: '5a', at: -1e6},
    ...RECAP.map((id, i) => ({id, at: c('C42') + i * gap})),
    {id: '2f', at: c('C43')},
  ];
  let k = 0;
  pages.forEach((p, i) => {
    if (f >= p.at) k = i;
  });
  const cur = pages[k];
  const prev = pages[k - 1];
  const flash = pop(c('C41'), 10) * (1 - ramp(f, c('C41') + 34, 10));
  return (
    <AbsoluteFill>
      {prev ? (
        <PageTurn at={cur.at} duration={k === pages.length - 1 ? 16 : Math.min(10, gap)} from={<FrozenScene id={prev.id} />}>
          <FrozenScene id={cur.id} />
        </PageTurn>
      ) : (
        <FrozenScene id={cur.id} />
      )}
      <AbsoluteFill style={{background: `rgba(40,28,18,${0.35 * flash})`}} />
      <TitleLabel p={flash} />
    </AbsoluteFill>
  );
};
