// Row 1b · Why I joined: the invitation.
// C07 → Arise Asia logo sticker · C08 → arrow back to the frayed thread ·
// C09a/b/c → mentorship / discipleship / community tabs · C10 → seedling, thread straightens
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {slotImage} from '../assets';
import {Drop, Hand, Ink, Layer} from '../kit/Bits';
import {Seedling} from '../kit/Doodles';
import {Page} from '../kit/Paper';
import {arrow} from '../kit/rough';
import {frayPoint, Thread} from '../kit/Thread';
import {ramp, useCues, usePop} from '../timing/context';
import {C, F} from '../theme';
import {PAGE1_THREAD_Y, Page1Items} from './Row1a';

const TABS = [
  {cue: 'C09a', text: 'mentorship', color: C.sticky},
  {cue: 'C09b', text: 'discipleship', color: C.stickyBlue},
  {cue: 'C09c', text: 'community', color: C.stickyPink},
] as const;

export const Row1b: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const pop = usePop();
  const straighten = ramp(f, c('C10') + 6, 36);
  const fray = 1 - straighten;
  const fp = frayPoint(PAGE1_THREAD_Y, {fray: 1});
  const seedAt = frayPoint(PAGE1_THREAD_Y, {fray: 0});
  const a = arrow([1210, 520], [fp[0] + 30, fp[1] - 50], -90, 'like-me', 30);
  const logo = slotImage('arise.logo') ?? staticFile('arise-asia-logo.webp');
  return (
    <Page variant="lines">
      <Thread y={PAGE1_THREAD_Y} fray={fray} />
      <Page1Items headAt={-100} boardAt={-100} booksAt={-100} />

      <Drop at={c('C07')} x={1080} y={110} w={330} h={330} rotate={-4} attach="tape" tapeColor={C.tapeMint} seed="arise" style={{borderRadius: 26}}>
        <div style={{position: 'absolute', inset: 0, background: '#fff', borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img src={logo} style={{width: '82%', height: '82%', objectFit: 'contain'}} />
        </div>
      </Drop>
      {/* "met many lovely people": word 4 of 17 between C07 and C08 */}
      <Hand text="lovely people!" at={c.between('C07', 'C08', 4 / 17)} dur={16} x={1060} y={460} size={58} color={C.blue} rotate={-6} />

      <Layer>
        <Ink d={a.shaft} p={ramp(f, c('C08'), 16)} color={C.red} width={7} />
        <Ink d={a.head} p={ramp(f, c('C08') + 14, 6)} color={C.red} width={7} />
        <Seedling p={ramp(f, c('C10'), 34)} x={seedAt[0]} y={seedAt[1] - 4} scale={1.1} />
      </Layer>
      <Hand text="exactly like me" at={c('C08') + 8} dur={16} x={1300} y={560} size={60} color={C.red} rotate={-4} />
      <Hand text="room to grow" at={c('C10') + 20} dur={18} x={seedAt[0] + 40} y={seedAt[1] + 36} size={64} color={C.green} rotate={-3} />

      {TABS.map((t, i) => {
        const s = pop(c(t.cue), 12);
        return (
          <div
            key={t.cue}
            style={{
              position: 'absolute',
              left: 1590 + (1 - s) * 340,
              top: 150 + i * 120,
              width: 330,
              height: 92,
              background: t.color,
              borderRadius: '10px 0 0 10px',
              boxShadow: '-4px 6px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 26,
              fontFamily: F.hand,
              fontWeight: 700,
              fontSize: 58,
              color: C.ink,
              transform: `rotate(${(i - 1) * 1.5}deg)`,
            }}
          >
            {t.text}
          </div>
        );
      })}
    </Page>
  );
};
