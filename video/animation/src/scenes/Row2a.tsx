// Row 2a · What I learnt: confidence.
// C11 "In hindsight" → page turn · C12 "confidence" → word letters on (then shrinks to a header, carried into 2b)
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FrozenScene} from '../kit/Frozen';
import {Page, PageTurn} from '../kit/Paper';
import {ConfidenceHeader} from '../kit/Recurring';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';

/** CONFIDENCE as it stands at local frame f of any scene from 2a to 2c. */
export const useConfidence = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const at = c('C12');
  // It holds after lettering, then shrinks to the header just before the PGB clipping lands.
  const shrinkAt = Math.min(at + 34, c('C13') - 4);
  return {p: ramp(f, at, 18, (t) => t), under: ramp(f, at + 18, 14), shrink: ramp(f, shrinkAt, 16)};
};

export const Row2a: React.FC = () => {
  const c = useCues();
  const conf = useConfidence();
  return (
    <PageTurn at={c('C11') - 4} from={<FrozenScene id="1b" />}>
      <Page variant="dots">
        <Thread />
        <ConfidenceHeader {...conf} />
      </Page>
    </PageTurn>
  );
};
