// Row 2d · What I built: KNOWN + Living Letter ★
// C19 "international student ministry" → KNOWN clipping · C20 "Christian content creators" → Living Letter clipping ·
// C21 "minimal experience" → margin scribble
import React from 'react';
import {FrozenScene} from '../kit/Frozen';
import {Page, PageTurn} from '../kit/Paper';
import {Thread} from '../kit/Thread';
import {useCues} from '../timing/context';
import {Spread} from './spread';

export const Row2d: React.FC = () => {
  const c = useCues();
  return (
    <PageTurn at={Math.max(0, Math.min(4, c('C19') - 20))} from={<FrozenScene id="2c" />}>
      <Page variant="grid">
        <Thread />
        <Spread knownAt={c('C19')} llAt={c('C20')} rearrange={0} smallAt={[1e6, 1e6, 1e6]} callouts={0} scribbleAt={c('C21')} scribbleOut={1e6} />
      </Page>
    </PageTurn>
  );
};
