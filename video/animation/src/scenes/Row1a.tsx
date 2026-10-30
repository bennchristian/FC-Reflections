// Row 1a · Why I joined: where I was.
// C03 → page turns, thread starts · C04 → mortarboard pins on · C05 → books clipping · C06 → thread frays
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cutout, Drop, Hand} from '../kit/Bits';
import {Books, Mortarboard} from '../kit/Doodles';
import {FrozenScene} from '../kit/Frozen';
import {Page, PageTurn} from '../kit/Paper';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';

export const PAGE1_THREAD_Y = 800;

/** Page 1's fixed furniture: the heading and the two pinned doodles (shared with 1b). */
export const Page1Items: React.FC<{headAt: number; boardAt: number; booksAt: number}> = ({headAt, boardAt, booksAt}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Hand text="a season of transition" at={headAt} dur={24} x={150} y={110} size={76} color={C.pencil} rotate={-2} />
      <Drop at={boardAt} x={250} y={330} w={320} h={260} rotate={-5} attach="pin" seed="board">
        <Cutout w={320} h={260} seed="board" />
        <div style={{position: 'absolute', left: 30, top: 30}}>
          <Mortarboard p={ramp(f, boardAt + 2, 18)} />
        </div>
      </Drop>
      <Drop at={booksAt} x={680} y={360} w={340} h={260} rotate={4} attach="tape" tapeColor={C.tapePink} seed="books">
        <Cutout w={340} h={260} seed="books" />
        <div style={{position: 'absolute', left: 30, top: 34}}>
          <Books p={ramp(f, booksAt + 2, 20)} />
        </div>
      </Drop>
    </>
  );
};

export const Row1a: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  return (
    <PageTurn at={c('C03') - 4} from={<FrozenScene id="0.5" />}>
      <Page variant="lines">
        <Thread y={PAGE1_THREAD_Y} draw={ramp(f, c('C03') + 4, 70)} fray={ramp(f, c('C06'), 34)} />
        {/* "deep season of transition": word 8 of the 13 before C04 */}
        <Page1Items headAt={c.between('C03', 'C04', 8 / 13)} boardAt={c('C04')} booksAt={c('C05')} />
        <Hand text="?" at={c('C06') + 24} dur={8} x={1780} y={640} size={110} color={C.thread} rotate={12} />
      </Page>
    </PageTurn>
  );
};
