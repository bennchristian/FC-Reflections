// Row 4a · How I grew: next steps.
// C30 "confidence" → header returns · (page turn to the envelope) · C31 "divinely" → sunburst · C32 "my next appointment" → envelope opens
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hand, Layer} from '../kit/Bits';
import {Envelope, Sunburst} from '../kit/Doodles';
import {FrozenScene} from '../kit/Frozen';
import {Page, PageTurn} from '../kit/Paper';
import {ConfidenceHeader} from '../kit/Recurring';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';

const ENV = {x: 640, y: 420, w: 640, h: 400};

/** The envelope page (shared with 4b, where the letter slides out of it). */
export const EnvelopePage: React.FC<{sun: number; open: number; letter: number; noteAt: number; noteOut?: number; children?: React.ReactNode}> = ({
  sun,
  open,
  letter,
  noteAt,
  noteOut = 0,
  children,
}) => (
  <Page variant="plain">
    <Thread />
    <Layer>
      <Sunburst p={sun} cx={ENV.x + ENV.w / 2} cy={ENV.y + ENV.h / 2} r={430} />
    </Layer>
    <div style={{position: 'absolute', left: ENV.x, top: ENV.y, transform: 'rotate(-3deg)', filter: 'drop-shadow(0 12px 18px rgba(40,28,18,0.25))'}}>
      <Envelope p={1} open={open} letter={letter} w={ENV.w} h={ENV.h} />
    </div>
    <div style={{position: 'absolute', inset: 0, opacity: 1 - noteOut}}>
      <Hand text="next steps →" at={noteAt} dur={18} x={170} y={560} size={80} color={C.pencil} rotate={-4} />
    </div>
    {children}
  </Page>
);

export const Row4a: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const headerIn = ramp(f, c('C30'), 16);
  // "I saw it in my next steps": page turns on word 4 of 18 between C30 and C31, the note on word 6.
  const turnAt = c.between('C30', 'C31', 4 / 18);
  return (
    <>
      <PageTurn at={turnAt} duration={18} from={<FrozenScene id="3b" />}>
        <EnvelopePage sun={ramp(f, c('C31'), 26)} open={ramp(f, c('C32'), 14)} letter={ramp(f, c('C32') + 10, 26)} noteAt={c.between('C30', 'C31', 6 / 18)} />
      </PageTurn>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - headerIn) * -260}px)`, opacity: headerIn}}>
        <ConfidenceHeader p={1} under={1} shrink={1} />
      </div>
    </>
  );
};
