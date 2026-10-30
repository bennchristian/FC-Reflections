import type React from 'react';
import type {RowId} from '../timing/timeline';
import {Row0} from './Row0';
import {Row0_5} from './Row0_5';
import {Row1a} from './Row1a';
import {Row1b} from './Row1b';
import {Row2a} from './Row2a';
import {Row2b} from './Row2b';
import {Row2c} from './Row2c';
import {Row2d} from './Row2d';
import {Row2e} from './Row2e';
import {Row2f} from './Row2f';
import {Row3a} from './Row3a';
import {Row3b} from './Row3b';
import {Row4a} from './Row4a';
import {Row4b} from './Row4b';
import {Row4c} from './Row4c';
import {Row5a} from './Row5a';
import {Row5b} from './Row5b';
import {Row5c} from './Row5c';
import {Row6} from './Row6';

/** One scene component per script row. File name = Row<id with "." → "_">.tsx */
export const SCENES: Record<RowId, React.FC> = {
  '0': Row0,
  '0.5': Row0_5,
  '1a': Row1a,
  '1b': Row1b,
  '2a': Row2a,
  '2b': Row2b,
  '2c': Row2c,
  '2d': Row2d,
  '2e': Row2e,
  '2f': Row2f,
  '3a': Row3a,
  '3b': Row3b,
  '4a': Row4a,
  '4b': Row4b,
  '4c': Row4c,
  '5a': Row5a,
  '5b': Row5b,
  '5c': Row5c,
  '6': Row6,
};
