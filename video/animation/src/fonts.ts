// Open-licence fonts, bundled locally via Fontsource (no network at render time).
// Caveat, Courier Prime, Inter: SIL OFL 1.1. Permanent Marker: Apache 2.0.
// Project brand fonts (all SIL OFL 1.1): Instrument Serif (Living Letter), Literata (KNOWN),
// Geist (Cadgy Clone), Newsreader (Portfolio).
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/700.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/permanent-marker/400.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/literata/400.css';
import '@fontsource/literata/600.css';
import '@fontsource/geist/400.css';
import '@fontsource/geist/700.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/600.css';
import {continueRender, delayRender} from 'remotion';

const faces = [
  '400 40px Caveat',
  '700 40px Caveat',
  '400 40px "Courier Prime"',
  '700 40px "Courier Prime"',
  '400 40px "Permanent Marker"',
  '400 40px Inter',
  '600 40px Inter',
  '800 40px Inter',
  '400 40px "Instrument Serif"',
  '400 40px Literata',
  '600 40px Literata',
  '400 40px Geist',
  '700 40px Geist',
  '400 40px Newsreader',
  '600 40px Newsreader',
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(faces.map((f) => document.fonts.load(f)))
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
