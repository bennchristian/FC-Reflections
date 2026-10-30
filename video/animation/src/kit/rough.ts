// Procedural "hand-drawn" path helpers. Deterministic: same seed, same wobble.
import {random} from 'remotion';

export type Pt = [number, number];

/** Deterministic noise in [-1, 1]. */
export const jit = (seed: string | number) => random(String(seed)) * 2 - 1;

/** Smooth Catmull-Rom curve through the points, as an SVG path. */
export function smooth(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A slightly wobbly straight stroke. */
export function line(x1: number, y1: number, x2: number, y2: number, seed: string | number = 0, amp = 3, segs = 6): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const edge = i === 0 || i === segs ? 0.3 : 1;
    pts.push([x1 + (x2 - x1) * t + jit(`${seed}x${i}`) * amp * 0.4 * edge, y1 + (y2 - y1) * t + jit(`${seed}y${i}`) * amp * edge]);
  }
  return smooth(pts);
}

/** A marker loop around a box, overshooting the start like a real hand circle. */
export function ellipse(cx: number, cy: number, rx: number, ry: number, seed: string | number = 0, turns = 1.15, start = -2.4): string {
  const n = 40;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + t * turns * Math.PI * 2;
    const k = 1 + jit(`${seed}e${Math.floor(i / 5)}`) * 0.05 + t * 0.06;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts);
}

/** Wobbly rectangle outline (one continuous stroke). */
export function rect(x: number, y: number, w: number, h: number, seed: string | number = 0, amp = 2.5): string {
  const corners: Pt[] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 2]];
  const pts: Pt[] = [];
  corners.forEach((p, i) => pts.push([p[0] + jit(`${seed}r${i}a`) * amp, p[1] + jit(`${seed}r${i}b`) * amp]));
  return pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
}

/** A curved arrow from a to b, bowing by `bend` px. Returns shaft and head separately. */
export function arrow(a: Pt, b: Pt, bend = 60, seed: string | number = 0, head = 26) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const c: Pt = [mx + nx * bend + jit(`${seed}c`) * 6, my + ny * bend + jit(`${seed}d`) * 6];
  const shaft = `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`;
  const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
  const h1: Pt = [b[0] - Math.cos(ang - 0.45) * head, b[1] - Math.sin(ang - 0.45) * head];
  const h2: Pt = [b[0] - Math.cos(ang + 0.45) * head, b[1] - Math.sin(ang + 0.45) * head];
  const headD = `M${h1[0]},${h1[1]} L${b[0]},${b[1]} L${h2[0]},${h2[1]}`;
  return {shaft, head: headD};
}

/** A zig-zag scribble across a box, for crossing words out. */
export function scratch(x: number, y: number, w: number, h: number, seed: string | number = 0, passes = 5): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= passes; i++) {
    const t = i / passes;
    pts.push([x + w * t + jit(`${seed}s${i}`) * 6, i % 2 === 0 ? y + h * 0.25 : y + h * 0.75]);
  }
  return pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
}

/** Polygon for torn paper edges around a w×h box, as a CSS clip-path. */
export function tornClip(w: number, h: number, seed: string | number = 0, tooth = 7): string {
  const pts: string[] = [];
  const step = 18;
  for (let x = 0; x <= w; x += step) pts.push(`${x}px ${Math.abs(jit(`${seed}t${x}`)) * tooth}px`);
  for (let y = 0; y <= h; y += step) pts.push(`${w - Math.abs(jit(`${seed}r${y}`)) * tooth}px ${y}px`);
  for (let x = w; x >= 0; x -= step) pts.push(`${x}px ${h - Math.abs(jit(`${seed}b${x}`)) * tooth}px`);
  for (let y = h; y >= 0; y -= step) pts.push(`${Math.abs(jit(`${seed}l${y}`)) * tooth}px ${y}px`);
  return `polygon(${pts.join(',')})`;
}

let ctx: CanvasRenderingContext2D | null = null;
/** Width of a string in px for a CSS font shorthand (fonts are loaded before render). */
export function measure(text: string, font: string): number {
  if (typeof document === 'undefined') return text.length * 20;
  ctx ??= document.createElement('canvas').getContext('2d');
  ctx!.font = font;
  return ctx!.measureText(text).width;
}
