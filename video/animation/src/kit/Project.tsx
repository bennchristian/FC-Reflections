import React from 'react';
import {Img} from 'remotion';
import {brand, hasSlot, slot, slotImage, slotValue, type ProjectKey} from '../assets';
import {C, F} from '../theme';

type Crop = {x: number; y: number; w: number};

/** A screenshot slot, cropped by its optional {x, y, w} (fractions of the image). */
const Shot: React.FC<{slotKey: string; opacity?: number}> = ({slotKey, opacity = 1}) => {
  const src = slotImage(slotKey);
  if (!src) return null;
  const crop = (slot(slotKey) as {crop?: Crop}).crop ?? {x: 0, y: 0, w: 1};
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        top: 0,
        width: `${100 / crop.w}%`,
        left: `${(-crop.x / crop.w) * 100}%`,
        transform: `translateY(${-crop.y * 100}%)`,
        opacity,
      }}
    />
  );
};

/**
 * A project clipping in that project's own brand: a browser-window card with
 * the project's colours and font, showing its screenshot (or a labelled slot).
 * `reveal` wipes the screenshot in from the top (0→1); `alt` cross-fades to the
 * project's feature screenshot, where it has one.
 */
export const ProjectClipping: React.FC<{project: ProjectKey; w: number; h: number; reveal?: number; alt?: number}> = ({project, w, h, reveal = 1, alt = 0}) => {
  const b = brand(project);
  const hasShot = slotImage(`${project}.screenshot`) !== null;
  const featureKey = `${project}.feature_screenshot`;
  const logo = hasSlot(`${project}.logo`) ? slotImage(`${project}.logo`) : null;
  const scale = w / 900;
  const bar = Math.round(54 * scale);
  return (
    <div style={{position: 'absolute', inset: 0, background: '#fffdf7', padding: Math.max(6, 12 * scale), boxSizing: 'border-box'}}>
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: b.bg, borderRadius: 6 * scale, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)'}}>
        {/* window bar in brand colours */}
        <div style={{height: bar, background: b.bar ?? b.accent, display: 'flex', alignItems: 'center', gap: 10 * scale, padding: `0 ${18 * scale}px`}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 13 * scale, height: 13 * scale, borderRadius: '50%', background: b.barText ?? '#fff', opacity: 0.45}} />
          ))}
          {logo ? (
            <Img src={logo} style={{height: bar * 0.78, marginLeft: 10 * scale}} />
          ) : (
            <div style={{marginLeft: 10 * scale, fontFamily: b.font, fontWeight: b.weight ?? 800, fontSize: 28 * scale, color: b.barText ?? '#fff', letterSpacing: -0.3 * scale}}>{b.name}</div>
          )}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: bar, bottom: 0, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`}}>
          {hasShot ? <Shot slotKey={`${project}.screenshot`} /> : <Placeholder project={project} scale={scale} />}
          {alt > 0 && hasSlot(featureKey) && <Shot slotKey={featureKey} opacity={alt} />}
        </div>
      </div>
    </div>
  );
};

/** A clearly labelled stand-in for a missing screenshot, in the stand-in brand colours. */
const Placeholder: React.FC<{project: ProjectKey; scale: number}> = ({project, scale}) => {
  const b = brand(project);
  const block = (wPct: number, hPx: number, c: string, o = 1): React.CSSProperties => ({width: `${wPct}%`, height: hPx * scale, background: c, opacity: o, borderRadius: 6 * scale});
  return (
    <div style={{position: 'absolute', inset: 0, padding: 30 * scale, display: 'flex', flexDirection: 'column', gap: 16 * scale, fontFamily: b.font}}>
      <div style={{fontFamily: b.font, fontWeight: b.weight ?? 800, fontSize: 54 * scale, color: b.fg, letterSpacing: -1 * scale}}>{b.name}</div>
      <div style={block(62, 18, b.accent2, 0.7)} />
      <div style={block(48, 18, b.accent2, 0.5)} />
      <div style={{display: 'flex', gap: 16 * scale, marginTop: 10 * scale}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{flex: 1, height: 150 * scale, borderRadius: 10 * scale, background: b.accent, opacity: 0.12 + i * 0.06}} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 20 * scale,
          bottom: 20 * scale,
          border: `${3 * scale}px dashed ${C.red}`,
          borderRadius: 8 * scale,
          padding: `${6 * scale}px ${14 * scale}px`,
          background: 'rgba(255,255,255,0.85)',
          fontFamily: F.type,
          fontWeight: 700,
          fontSize: 22 * scale,
          color: C.red,
        }}
      >
        SLOT · {project}.screenshot
      </div>
    </div>
  );
};

/** The FC logo as a round sticker, or a labelled placeholder sticker. */
export const FCLogo: React.FC<{size: number}> = ({size}) => {
  const src = slotImage('fc.logo');
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#fffdf7',
        boxShadow: 'inset 0 0 0 6px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {src ? (
        <Img src={src} style={{width: '78%', height: '78%', objectFit: 'contain'}} />
      ) : (
        <>
          <div style={{fontFamily: F.marker, fontSize: size * 0.36, color: C.ink, lineHeight: 1}}>FC</div>
          <div style={{fontFamily: F.type, fontWeight: 700, fontSize: size * 0.075, color: C.red, marginTop: size * 0.04}}>SLOT · fc.logo</div>
        </>
      )}
    </div>
  );
};

/** Feature callout text for KNOWN / Living Letter, or a visible slot label. */
export const featureText = (project: 'known' | 'livingletter') => slotValue<string>(`${project}.feature`) ?? `[${brand(project).name} feature]`;

export const ownerName = () => slotValue<string>('owner.name') ?? '[Your name]';
export const fellowshipDates = () => slotValue<string>('fellowship.dates') ?? '[Fellowship dates]';
