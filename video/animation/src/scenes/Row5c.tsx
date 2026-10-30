// Row 5c · Bookend: the answer.
// C44 "At the start" → the opening note returns · C45 "good" → "good" circled · C46 "true" → "true" circled, "?" → "!"
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hand} from '../kit/Bits';
import {FrozenScene} from '../kit/Frozen';
import {PageTurn} from '../kit/Paper';
import {NOTE} from '../kit/Recurring';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';
import {NotePage} from './Row0';

export const Row5c: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const t = c('C46');
  // "true" is the last word, so the answer has to finish inside the scene's short tail:
  // squeeze the marks into whatever room there is (at most 24 frames, at least 10).
  const k = Math.max(10, Math.min(24, c.duration - 2 - t)) / 24;
  return (
    <PageTurn at={c('C44') - 6} duration={18} from={<FrozenScene id="5b" />}>
      <NotePage
        words={[1, 1, 1, 1, 1]}
        q={1}
        circleGood={ramp(f, c('C45'), 14)}
        circleTrue={ramp(f, t, 12 * k)}
        crossToo={ramp(f, t + 4 * k, 7 * k)}
        crossToBe={ramp(f, t + 8 * k, 8 * k)}
        bang={ramp(f, t + 10 * k, 14 * k)}
      >
        <Hand text="Frontier Commons Fellowship" at={-1e6} dur={1} x={NOTE.x - NOTE.w / 2 + 30} y={130} size={64} color={C.pencil} rotate={-2} />
        <Hand text="first thoughts:" at={-1e6} dur={1} x={NOTE.x - NOTE.w / 2 + 70} y={NOTE.y - NOTE.h / 2 + 40} size={66} color={C.blue} rotate={-2} />
        {/* "Two months later": word 11 of the 18 between C44 and C45 */}
        <Hand text="2 months later:" at={c.between('C44', 'C45', 11 / 18)} dur={18} x={1150} y={880} size={78} color={C.red} rotate={-3} />
      </NotePage>
    </PageTurn>
  );
};
