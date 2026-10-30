// Row 0 · Cold open: the question.
// C00 "When" → page opens · C01 "too good" → note starts writing · C02 "true" → "?" drawn
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hand, Tape} from '../kit/Bits';
import {Cover, Page, PageTurn} from '../kit/Paper';
import {NOTE, QuestionNote, type NoteState} from '../kit/Recurring';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';

/** The note page, shared with 5c (which answers the question on it). */
export const NotePage: React.FC<NoteState & {children?: React.ReactNode}> = ({children, ...note}) => (
  <Page variant="plain">
    <QuestionNote {...note} />
    <Tape x={NOTE.x - NOTE.w / 2 - 50} y={NOTE.y - NOTE.h / 2 - 10} rotate={-40} w={180} />
    <Tape x={NOTE.x + NOTE.w / 2 - 120} y={NOTE.y + NOTE.h / 2 - 40} rotate={-40} w={180} color={C.tapeMint} seed="t2" />
    {children}
  </Page>
);

export const Row0: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  // "too good to be true": too on C01, true on C02, the words between spaced evenly.
  const wordAt = [0, 1, 2, 3, 4].map((i) => c.between('C01', 'C02', i / 4));
  const words = wordAt.map((a, i) => ramp(f, a, Math.max(5, Math.min(12, (wordAt[i + 1] ?? a + 12) - a)), (t) => t));
  const q = ramp(f, c('C02') + 8, 14);
  // Extra beats between C00 and C01 (word positions in the VO line): "Frontier"=2, "my initial thoughts"=10 of 17.
  return (
    <PageTurn at={Math.max(4, c('C00'))} duration={22} from={<Cover />}>
      <NotePage words={words} q={q}>
        <Hand text="Frontier Commons Fellowship" at={c.between('C00', 'C01', 2 / 17)} dur={26} x={NOTE.x - NOTE.w / 2 + 30} y={130} size={64} color={C.pencil} rotate={-2} />
        <Hand text="first thoughts:" at={c.between('C00', 'C01', 10 / 17)} dur={18} x={NOTE.x - NOTE.w / 2 + 70} y={NOTE.y - NOTE.h / 2 + 40} size={66} color={C.blue} rotate={-2} />
      </NotePage>
    </PageTurn>
  );
};
