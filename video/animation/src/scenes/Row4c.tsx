// Row 4c · How I grew: before and after.
// C36 "Before FC" → before/after notes · C36b "I can learn" → written · C36c "it can be done" → written ·
// C37 "a place to try first" → scrapbook circled · C38 "assurance" → checkmark stamp
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Drop, Hand, Ink, InkAt, Layer, Stamp, Sticky} from '../kit/Bits';
import {FrozenScene} from '../kit/Frozen';
import {Camera, Page, PageTurn} from '../kit/Paper';
import {arrow, ellipse} from '../kit/rough';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';

export const Row4c: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const pull = ramp(f, c('C37') - 6, 16);
  // Between C36 and C36b (26 words): the arrow on "But with the experience" (word 7),
  // "not all the knowledge" on word 17.
  const a = arrow([790, 470], [1050, 450], -50, 'ba', 28);
  const arrowAt = c.between('C36', 'C36b', 7 / 26);
  return (
    <PageTurn at={0} from={<FrozenScene id="4b" />}>
      <Camera scale={1 - pull * 0.2}>
        <Page variant="lines">
          <Thread />
          <Hand text="Before FC" at={c('C36')} dur={14} x={290} y={150} size={80} color={C.pencil} rotate={-3} />
          <Drop at={c('C36') + 4} x={240} y={260} w={520} h={380} rotate={-3} attach="tape" seed="before">
            <Sticky color={C.stickyPink} style={{fontSize: 88, fontWeight: 700, lineHeight: 1.0, padding: 30}}>legal work only</Sticky>
          </Drop>
          <Hand text="After" at={c('C36') + 12} dur={10} x={1120} y={140} size={80} color={C.pencil} rotate={2} />
          <Drop at={c('C36') + 14} x={1070} y={250} w={580} h={380} rotate={2} attach="tape" tapeColor={C.tapeMint} seed="after">
            <Sticky style={{fontSize: 88, fontWeight: 700, lineHeight: 1.0, padding: 30}}>+ operations &amp; AI</Sticky>
          </Drop>
          <Layer>
            <Ink d={a.shaft} p={ramp(f, arrowAt, 14)} color={C.blue} width={8} />
            <Ink d={a.head} p={ramp(f, arrowAt + 12, 6)} color={C.blue} width={8} />
          </Layer>
          <Hand text="not all the knowledge…" at={c.between('C36', 'C36b', 17 / 26)} dur={20} x={1100} y={655} size={56} color={C.pencil} rotate={1} />
          <Hand text="I can learn" at={c('C36b')} dur={16} x={1100} y={725} size={92} color={C.blue} rotate={-1} />
          <Hand text="it can be done" at={c('C36c')} dur={18} x={1100} y={820} size={92} color={C.blue} rotate={-1} />
        </Page>
      </Camera>
      {/* circle the whole scrapbook page, outside the camera so it rings the page edge */}
      <Layer>
        <InkAt d={ellipse(960, 540, 870, 465, 'book', 1.1, -2.2)} at={c('C37') + 4} dur={22} color={C.red} width={12} />
      </Layer>
      <Stamp at={c('C38')} x={1590} y={760} color={C.green} rotate={-10} size={120}>
        <svg width={150} height={130} viewBox="0 0 150 130" style={{display: 'block'}}>
          <path d="M18 70 L58 110 L132 18" fill="none" stroke={C.green} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Stamp>
    </PageTurn>
  );
};
