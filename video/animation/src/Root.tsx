import React from 'react';
import {Composition, Folder, Sequence} from 'remotion';
import './fonts';
import {Main, type MainProps} from './Main';
import {TIMELINE} from './timing/context';

/** One composition per row (handy for previewing a single scene), all reading the same timeline. */
const RowPreview: React.FC<MainProps & {from: number}> = ({from, debug}) => (
  <Sequence from={-from}>
    <Main debug={debug} />
  </Sequence>
);

export const Root: React.FC = () => (
  <>
    <Composition
      id="FCReflection"
      component={Main}
      durationInFrames={TIMELINE.totalFrames}
      fps={TIMELINE.fps}
      width={1920}
      height={1080}
      defaultProps={{debug: false}}
    />
    <Folder name="Rows">
      {TIMELINE.scenes.map((s) => (
        <Composition
          key={s.id}
          id={`Row-${s.id.replace('.', '-')}`}
          component={RowPreview}
          durationInFrames={s.durationInFrames}
          fps={TIMELINE.fps}
          width={1920}
          height={1080}
          defaultProps={{debug: false, from: s.from}}
        />
      ))}
    </Folder>
  </>
);
