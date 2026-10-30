// Hand-drawn doodles, all procedural SVG. Each draws on as `p` goes 0→1.
import React from 'react';
import {interpolate} from 'remotion';
import {C, F} from '../theme';
import {Ink} from './Bits';
import {ellipse, line, rect, smooth} from './rough';

const seg = (p: number, a: number, b: number) => interpolate(p, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const Svg: React.FC<{w: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({w, h, children, style}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>
    {children}
  </svg>
);

export const Mortarboard: React.FC<{p: number}> = ({p}) => (
  <Svg w={260} h={200}>
    <path d="M130 30 L245 75 L130 120 L15 75 Z" fill={C.ink} opacity={seg(p, 0.3, 0.6) * 0.92} />
    <Ink d="M130 30 L245 75 L130 120 L15 75 Z" p={seg(p, 0, 0.4)} width={5} />
    <Ink d="M70 98 L70 150 Q130 185 190 150 L190 98" p={seg(p, 0.4, 0.7)} width={5} />
    <Ink d="M130 75 Q200 80 215 130 L215 165" p={seg(p, 0.65, 0.9)} width={4} color={C.red} />
    <Ink d="M205 165 L215 190 L225 165 Z" p={seg(p, 0.85, 1)} width={4} color={C.red} />
  </Svg>
);

export const Books: React.FC<{p: number}> = ({p}) => {
  const books = [
    {x: 30, y: 150, w: 230, h: 42, c: '#7c4a3a', label: 'BAR PREP'},
    {x: 50, y: 106, w: 200, h: 44, c: '#2f5d9e', label: ''},
    {x: 20, y: 64, w: 220, h: 42, c: '#3f6e4f', label: ''},
    {x: 60, y: 24, w: 180, h: 40, c: '#b5893c', label: ''},
  ];
  return (
    <Svg w={280} h={200}>
      {books.map((b, i) => {
        const q = seg(p, i * 0.2, i * 0.2 + 0.35);
        return (
          <g key={i} opacity={q > 0 ? 1 : 0} transform={`translate(0 ${(1 - q) * -30})`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={5} fill={b.c} opacity={0.9} />
            <Ink d={rect(b.x, b.y, b.w, b.h, `book${i}`, 2)} p={q} width={3.5} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 8} textAnchor="middle" fontFamily={F.type} fontWeight={700} fontSize={20} fill="#f6efe1" opacity={q}>
              {b.label}
            </text>
          </g>
        );
      })}
    </Svg>
  );
};

/** Seedling sprouting up from its base point (0,0) in local coords. */
export const Seedling: React.FC<{p: number; x: number; y: number; scale?: number}> = ({p, x, y, scale = 1}) => {
  const stem = seg(p, 0, 0.55);
  const leaf = seg(p, 0.45, 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Ink d="M0 0 C-6 -40 8 -80 0 -130" p={stem} color={C.green} width={7} />
      <g transform={`translate(0 -118) scale(${leaf})`}>
        <path d="M0 0 C-30 -40 -80 -30 -95 -5 C-60 10 -25 10 0 0 Z" fill="#7cbf6a" stroke={C.green} strokeWidth={4} />
        <path d="M0 -6 C25 -50 75 -50 92 -28 C60 -6 25 -2 0 -6 Z" fill="#8fd07a" stroke={C.green} strokeWidth={4} />
      </g>
    </g>
  );
};

export const Terminal: React.FC<{p: number; w?: number; h?: number}> = ({p, w = 300, h = 200}) => (
  <Svg w={w} h={h}>
    <rect x={6} y={6} width={w - 12} height={h - 12} rx={14} fill="#2b2a33" opacity={seg(p, 0.2, 0.5)} />
    <Ink d={rect(6, 6, w - 12, h - 12, 'term', 2)} p={seg(p, 0, 0.4)} width={5} />
    <Ink d={line(6, 46, w - 6, 46, 'termbar', 1)} p={seg(p, 0.3, 0.5)} width={4} color="#f6efe1" />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={30 + i * 24} cy={26} r={7} fill={['#ff6b5e', '#ffc23d', '#3fc45a'][i]} opacity={seg(p, 0.4 + i * 0.05, 0.55 + i * 0.05)} />
    ))}
    <text x={30} y={110} fontFamily={F.type} fontWeight={700} fontSize={44} fill="#8be28b" opacity={seg(p, 0.6, 0.8)}>
      {'>_'}
    </text>
    <rect x={92} y={84} width={22} height={34} fill="#8be28b" opacity={seg(p, 0.8, 1) * (Math.floor(p * 40) % 2 ? 1 : 0.4)} />
  </Svg>
);

/** Clock that "opens" into wide space: the face stretches into a long double arrow. */
export const Clock: React.FC<{p: number; open: number; cx: number; cy: number}> = ({p, open, cx, cy}) => {
  const r = 110;
  const rx = r + open * 560;
  const ry = r - open * 40;
  const handA = p * 6 + open * 10;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(255,255,255,0.6)" opacity={seg(p, 0.2, 0.5) * (1 - open * 0.6)} />
      <Ink d={ellipse(cx, cy, rx, ry, 'clock', 1.05, -1.6)} p={seg(p, 0, 0.5)} width={6} />
      <g opacity={1 - seg(open, 0, 0.4)}>
        {Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <Ink key={i} d={line(cx + Math.cos(a) * 88, cy + Math.sin(a) * 88, cx + Math.cos(a) * 98, cy + Math.sin(a) * 98, `t${i}`, 0.5, 1)} p={seg(p, 0.4, 0.6)} width={4} />;
        })}
        <Ink d={`M${cx} ${cy} L${cx + Math.cos(handA) * 70} ${cy + Math.sin(handA) * 70}`} p={seg(p, 0.5, 0.8)} width={6} color={C.red} />
        <Ink d={`M${cx} ${cy} L${cx + Math.cos(handA / 12 - 1.5) * 48} ${cy + Math.sin(handA / 12 - 1.5) * 48}`} p={seg(p, 0.5, 0.8)} width={7} />
      </g>
      {/* the opened-up space */}
      <g opacity={seg(open, 0.3, 0.8)}>
        <Ink d={line(cx - rx + 60, cy, cx + rx - 60, cy, 'span', 2)} p={seg(open, 0.3, 0.9)} width={6} color={C.blue} />
        <Ink d={`M${cx - rx + 100} ${cy - 34} L${cx - rx + 60} ${cy} L${cx - rx + 100} ${cy + 34}`} p={seg(open, 0.7, 1)} width={6} color={C.blue} />
        <Ink d={`M${cx + rx - 100} ${cy - 34} L${cx + rx - 60} ${cy} L${cx + rx - 100} ${cy + 34}`} p={seg(open, 0.7, 1)} width={6} color={C.blue} />
      </g>
    </g>
  );
};

/** Envelope with a flap that opens (open 0→1) and a letter that rises out. */
export const Envelope: React.FC<{p: number; open: number; w?: number; h?: number; letter?: number}> = ({p, open, w = 640, h = 400, letter = 0}) => {
  const flapScale = 1 - 2 * open; // 1 closed (pointing down), -1 open (pointing up)
  return (
    <Svg w={w} h={h}>
      {/* back */}
      <rect x={0} y={0} width={w} height={h} rx={10} fill="#efe3c8" opacity={seg(p, 0, 0.3)} />
      {/* letter rising out */}
      <g transform={`translate(0 ${-letter * h * 0.55})`} opacity={letter > 0 ? 1 : 0}>
        <rect x={50} y={30} width={w - 100} height={h - 50} fill="#fffdf7" stroke="#d8ccb2" strokeWidth={2} />
        {[0, 1, 2, 3].map((i) => (
          <Ink key={i} d={line(90, 90 + i * 44, w - 90 - (i === 3 ? 160 : 0), 90 + i * 44, `l${i}`, 1.5)} p={seg(letter, 0.4 + i * 0.1, 0.7 + i * 0.1)} width={4} color={C.pencil} opacity={0.5} />
        ))}
      </g>
      {/* front pocket */}
      <path d={`M0 ${h * 0.3} L${w / 2} ${h * 0.62} L${w} ${h * 0.3} L${w} ${h} L0 ${h} Z`} fill="#f4e9d1" opacity={seg(p, 0, 0.3)} />
      <Ink d={`M0 ${h} L${w / 2} ${h * 0.55} L${w} ${h}`} p={seg(p, 0.4, 0.8)} width={4} color={C.pencil} opacity={0.5} />
      <Ink d={rect(0, 0, w, h, 'env', 2)} p={seg(p, 0, 0.5)} width={5} />
      {/* flap, hinged on the top edge */}
      <g transform={`translate(0 0) scale(1 ${flapScale})`}>
        <path d={`M0 0 L${w / 2} ${h * 0.55} L${w} 0 Z`} fill={open > 0.5 ? '#e6d6b4' : '#f0e4c9'} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" opacity={seg(p, 0.3, 0.6)} />
      </g>
      {/* wax seal */}
      <circle cx={w / 2} cy={h * 0.55} r={30} fill={C.red} opacity={seg(p, 0.6, 0.9) * (1 - open)} />
    </Svg>
  );
};

/** Soft hand-drawn sunburst glow behind something at (cx, cy). */
export const Sunburst: React.FC<{p: number; cx: number; cy: number; r?: number}> = ({p, cx, cy, r = 420}) => (
  <g>
    <defs>
      <radialGradient id="sunGlow">
        <stop offset="0%" stopColor="#ffe27a" stopOpacity={0.9} />
        <stop offset="60%" stopColor="#ffd25a" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#ffd25a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r * (0.6 + 0.4 * p)} fill="url(#sunGlow)" opacity={p} />
    {Array.from({length: 18}, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r0 = r * 0.62;
      const r1 = r * (i % 2 ? 0.86 : 1);
      return (
        <Ink
          key={i}
          d={line(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, `ray${i}`, 2, 2)}
          p={seg(p, (i % 6) * 0.05, 0.5 + (i % 6) * 0.08)}
          width={6}
          color="#e2a72e"
        />
      );
    })}
  </g>
);

export const Cloud: React.FC<{p: number; cross: number; w?: number; h?: number}> = ({p, cross, w = 380, h = 250}) => {
  const d = smooth([
    [70, 190], [30, 150], [50, 100], [100, 85], [120, 40], [190, 30], [240, 55], [290, 40], [340, 80], [345, 135], [320, 185], [250, 200], [180, 205], [110, 200], [70, 190],
  ]);
  return (
    <Svg w={w} h={h}>
      <path d={d} fill="#ffffff" opacity={seg(p, 0.3, 0.7) * 0.85} />
      <Ink d={d} p={p} width={5} color={C.pencil} />
      <Ink d={ellipse(60, 225, 14, 10, 'c1', 1.05)} p={seg(p, 0.7, 0.85)} width={4} color={C.pencil} />
      <Ink d={ellipse(35, 250, 8, 6, 'c2', 1.05)} p={seg(p, 0.8, 1)} width={4} color={C.pencil} />
      {[0, 1, 2].map((i) => (
        <text key={i} x={140 + i * 50} y={135} fontFamily={F.hand} fontWeight={700} fontSize={64} fill={C.pencil} opacity={seg(p, 0.6 + i * 0.1, 0.8 + i * 0.1)}>
          ?
        </text>
      ))}
      <Ink d="M60 40 L330 210" p={seg(cross, 0, 0.5)} width={12} color={C.red} />
      <Ink d="M330 40 L60 210" p={seg(cross, 0.4, 1)} width={12} color={C.red} />
    </Svg>
  );
};

/** One little person: head, body, arms out. */
export const Figure: React.FC<{x: number; y: number; p: number; color: string; scale?: number; rotate?: number; seed?: string}> = ({
  x,
  y,
  p,
  color,
  scale = 1,
  rotate = 0,
  seed = 'f',
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <circle cx={0} cy={-62} r={20} fill={color} opacity={seg(p, 0.1, 0.4)} />
    <Ink d={ellipse(0, -62, 20, 20, seed, 1.05)} p={seg(p, 0, 0.35)} width={4} />
    <path d="M-22 40 L-14 -32 Q0 -44 14 -32 L22 40 Z" fill={color} opacity={seg(p, 0.3, 0.6) * 0.85} />
    <Ink d="M-22 40 L-14 -32 Q0 -44 14 -32 L22 40" p={seg(p, 0.3, 0.7)} width={4} />
    <Ink d="M-14 -22 L-42 6 M14 -22 L42 6" p={seg(p, 0.6, 1)} width={4} />
  </g>
);

const RING_COLORS = ['#e07a5f', '#3d8a9e', '#f2cc8f', '#81b29a', '#b56576', '#6d83c4', '#e5989b', '#9c89b8'];

/** A hand-drawn ring of people (the stand-in for a community photo). */
export const CommunityRing: React.FC<{p: number; cx: number; cy: number; r?: number}> = ({p, cx, cy, r = 220}) => (
  <g>
    <Ink d={ellipse(cx, cy, r * 0.62, r * 0.62, 'ring', 1.05)} p={seg(p, 0, 0.4)} width={5} color={C.red} opacity={0.8} />
    {RING_COLORS.map((c, i) => {
      const a = (i / RING_COLORS.length) * Math.PI * 2 - Math.PI / 2;
      return (
        <Figure
          key={i}
          x={cx + Math.cos(a) * r}
          y={cy + Math.sin(a) * r}
          rotate={(a * 180) / Math.PI + 90}
          p={seg(p, 0.15 + i * 0.07, 0.5 + i * 0.07)}
          color={c}
          scale={1.05}
          seed={`ring${i}`}
        />
      );
    })}
  </g>
);

/** A spreadsheet scrap that starts crumpled (crumple=1) and smooths flat (0). */
export const Spreadsheet: React.FC<{crumple: number; w?: number; h?: number; id?: string}> = ({crumple, w = 460, h = 330, id = 'sheet'}) => {
  const rows = 8;
  const cols = 5;
  return (
    <Svg w={w} h={h}>
      <defs>
        <filter id={`${id}-crumple`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={crumple * 70} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id}-crumple)`}>
        <rect x={0} y={0} width={w} height={h} fill="#fbfbf6" />
        <rect x={0} y={0} width={w} height={h / rows} fill="#d9ead3" />
        {Array.from({length: rows + 1}, (_, i) => (
          <line key={`r${i}`} x1={0} x2={w} y1={(i * h) / rows} y2={(i * h) / rows} stroke="#b8c2b0" strokeWidth={2} />
        ))}
        {Array.from({length: cols + 1}, (_, i) => (
          <line key={`c${i}`} y1={0} y2={h} x1={(i * w) / cols} x2={(i * w) / cols} stroke="#b8c2b0" strokeWidth={2} />
        ))}
        {Array.from({length: (rows - 1) * cols}, (_, k) => {
          const r = Math.floor(k / cols) + 1;
          const c = k % cols;
          const len = 20 + ((k * 37) % 50);
          const messy = (k * 13) % 7 === 0;
          return (
            <rect key={k} x={(c * w) / cols + 10} y={(r * h) / rows + h / rows / 2 - 4} width={len} height={8} rx={4} fill={messy ? '#e8a598' : '#9aa3ad'} opacity={0.75} />
          );
        })}
        {/* crease shading fades as it flattens */}
        <path d={`M0 ${h * 0.3} L${w} ${h * 0.55} M${w * 0.35} 0 L${w * 0.6} ${h} M${w * 0.8} 0 L${w * 0.2} ${h}`} stroke="rgba(0,0,0,0.25)" strokeWidth={6} opacity={crumple} />
      </g>
    </Svg>
  );
};

/** Two little people talking; the speech bubble appears at `talk`. */
export const FriendTalk: React.FC<{p: number; talk: number}> = ({p, talk}) => (
  <Svg w={420} h={300}>
    <Figure x={110} y={220} p={p} color="#81b29a" seed="me" />
    <Figure x={300} y={220} p={seg(p, 0.2, 1)} color="#6d83c4" seed="friend" />
    <Ink d={smooth([[80, 110], [60, 70], [90, 30], [170, 20], [240, 35], [250, 75], [210, 105], [140, 108], [120, 130], [110, 108], [80, 110]])} p={talk} width={4} color={C.pencil} />
    <Ink d={line(110, 62, 210, 62, 'talk1', 1.5)} p={seg(talk, 0.6, 0.85)} width={4} color={C.pencil} />
    <Ink d={line(110, 82, 180, 82, 'talk2', 1.5)} p={seg(talk, 0.75, 1)} width={4} color={C.pencil} />
  </Svg>
);
