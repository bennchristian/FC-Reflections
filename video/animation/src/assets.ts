// Typed access to assets.manifest.json, the single list of swappable slots.
import {staticFile} from 'remotion';
import manifest from '../assets.manifest.json';

type Slot = {status: 'ready' | 'placeholder' | 'confirm'; file?: string | null; value?: unknown; need?: string};
const slots = manifest.slots as Record<string, Slot>;

export type Brand = {
  name: string;
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  font: string;
  /** Optional: window-bar colour and its text colour (default: accent, white), and the name's font weight. */
  bar?: string;
  barText?: string;
  weight?: number;
};
export type ProjectKey = 'pgb' | 'known' | 'livingletter' | 'cadgy' | 'portfolio';

const usable = (s: Slot) => s.status === 'ready' || s.status === 'confirm';

export const slot = (key: string): Slot => {
  const s = slots[key];
  if (!s) throw new Error(`assets.manifest.json has no slot "${key}"`);
  return s;
};

export const hasSlot = (key: string) => key in slots;

/** URL of a slot's image, or null while it's a placeholder. */
export const slotImage = (key: string): string | null => {
  const s = slot(key);
  return usable(s) && s.file ? staticFile(s.file) : null;
};

/** A slot's value, or null while it's a placeholder. */
export const slotValue = <T,>(key: string): T | null => {
  const s = slot(key);
  return usable(s) && s.value != null ? (s.value as T) : null;
};

/** Brand values are always present (stand-ins until the real ones arrive). */
export const brand = (p: ProjectKey) => ({...(slot(`${p}.brand`).value as Brand), placeholder: !usable(slot(`${p}.brand`))});
