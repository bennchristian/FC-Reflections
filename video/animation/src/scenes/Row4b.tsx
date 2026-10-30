// Row 4b · How I grew: the cover letter. Only the FC sentence is shown (nothing about RCLT).
// C33 "cover letter" → page slides out · C34 "beyond legal matters" → highlighter swipe · C35 "what I'd built" → mini clippings flick past
import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {ProjectKey} from '../assets';
import {Drop} from '../kit/Bits';
import {ProjectClipping} from '../kit/Project';
import {ConfidenceHeader} from '../kit/Recurring';
import {measure} from '../kit/rough';
import {ramp, useCues, usePop} from '../timing/context';
import {C, F} from '../theme';
import {EnvelopePage} from './Row4a';

const LINES = ['…my fellowship at Frontier Commons has', 'since given me hands-on experience', 'building with these tools.'];
// Highlighted: "hands-on experience building with these tools"
const HIGHLIGHT = [
  {line: 1, from: 'since given me ', text: 'hands-on experience'},
  {line: 2, from: '', text: 'building with these tools'},
];
const SIZE = 48;
const FONT = `400 ${SIZE}px "Courier Prime"`;
const SHEET = {x: 330, y: 120, w: 1240, h: 860};
const PAD = 80;
const TEXT_TOP = 330;
const LH = 82;

const MINIS: ProjectKey[] = ['pgb', 'known', 'livingletter', 'cadgy', 'portfolio'];

export const CoverLetter: React.FC<{slide: number; hl: number[]}> = ({slide, hl}) => (
  <div
    style={{
      position: 'absolute',
      left: SHEET.x,
      top: SHEET.y + (1 - slide) * 1000,
      width: SHEET.w,
      height: SHEET.h,
      background: '#fffefb',
      transform: `rotate(${-1 + (1 - slide) * 4}deg)`,
      boxShadow: '0 20px 40px rgba(40,28,18,0.3)',
    }}
  >
    {/* the rest of the letter, deliberately unreadable */}
    {[0, 1, 2, 3].map((i) => (
      <div key={`a${i}`} style={{position: 'absolute', left: PAD, top: 90 + i * 50, width: i === 0 ? 300 : 1080 - (i % 2) * 140, height: 16, borderRadius: 8, background: '#d9d3c7', filter: 'blur(3px)'}} />
    ))}
    {[0, 1, 2].map((i) => (
      <div key={`b${i}`} style={{position: 'absolute', left: PAD, top: 610 + i * 50, width: 1080 - (i % 2) * 260, height: 16, borderRadius: 8, background: '#d9d3c7', filter: 'blur(3px)'}} />
    ))}
    {HIGHLIGHT.map((h, i) => {
      const x = PAD + measure(h.from, FONT) - 6;
      const w = measure(h.text, FONT) + 12;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: TEXT_TOP + h.line * LH - 4,
            width: w * hl[i],
            height: SIZE + 14,
            background: C.highlighter,
            borderRadius: 6,
            transform: 'skewX(-8deg)',
          }}
        />
      );
    })}
    {LINES.map((l, i) => (
      <div key={i} style={{position: 'absolute', left: PAD, top: TEXT_TOP + i * LH, fontFamily: F.type, fontSize: SIZE, color: C.ink, whiteSpace: 'pre', mixBlendMode: 'multiply'}}>
        {l}
      </div>
    ))}
  </div>
);

export const Row4b: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const pop = usePop();
  const slide = pop(c('C33'), 16);
  return (
    <EnvelopePage sun={1} open={1} letter={1} noteAt={-1e6} noteOut={ramp(f, c('C33'), 10)}>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(f, c('C33'), 12)}}>
        <ConfidenceHeader p={1} under={1} shrink={1} />
      </div>
      <CoverLetter slide={slide} hl={[ramp(f, c('C34'), 10), ramp(f, c('C34') + 10, 12)]} />
      {MINIS.map((p, i) => (
        <Drop key={p} at={c('C35') + i * 5} x={1630} y={90 + i * 185} w={240} h={150} rotate={i % 2 ? 4 : -4} attach="none">
          <ProjectClipping project={p} w={240} h={150} />
        </Drop>
      ))}
    </EnvelopePage>
  );
};
