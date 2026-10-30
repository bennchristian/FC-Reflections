// Row 2f · Community.
// C22 "Through it all" → photo/ring pins on · C23 "us as people" → "people > product" writes on
import React from 'react';
import {Img, useCurrentFrame} from 'remotion';
import {slotImage} from '../assets';
import {Cutout, Drop, Hand, Layer} from '../kit/Bits';
import {CommunityRing} from '../kit/Doodles';
import {Camera, Page} from '../kit/Paper';
import {Thread} from '../kit/Thread';
import {ramp, useCues} from '../timing/context';
import {C} from '../theme';
import {Spread} from './spread';

/** The community card: the cohort photo if supplied, else a hand-drawn ring of people. */
export const CommunityCard: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const photo = slotImage('community.photo');
  return (
    <Drop at={at} x={720} y={110} w={780} h={700} rotate={2} attach="tape2" seed="community">
      <Cutout w={780} h={700} seed="community" />
      {photo ? (
        <Img src={photo} style={{position: 'absolute', inset: 24, width: 732, height: 652, objectFit: 'cover'}} />
      ) : (
        <Layer style={{left: 0, top: 0, width: 780, height: 700}}>
          <CommunityRing p={ramp(f, at + 4, 44)} cx={390} cy={350} r={230} />
        </Layer>
      )}
    </Drop>
  );
};

export const Row2f: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const aside = ramp(f, c('C22') - 12, 22);
  return (
    <Page variant="grid">
      <Thread />
      <Camera scale={0.92 - aside * 0.22} x={-aside * 1180} y={aside * 60} rotate={-aside * 4}>
        <Spread knownAt={-1e6} llAt={-1e6} rearrange={1} smallAt={[-1e6, -1e6, -1e6]} callouts={1} scribbleAt={-1e6} scribbleOut={-1e6} />
      </Camera>
      <CommunityCard at={c('C22')} />
      <Hand text="people > product" at={c('C23')} dur={22} x={820} y={840} size={100} color={C.red} rotate={-2} />
    </Page>
  );
};
