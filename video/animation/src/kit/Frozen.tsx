import React from 'react';
import {Freeze} from 'remotion';
import {SCENES} from '../scenes';
import {SceneProvider, sceneById} from '../timing/context';
import type {RowId} from '../timing/timeline';

/** Another row's scene, frozen on one of its frames (default: its last). */
export const FrozenScene: React.FC<{id: RowId; at?: number}> = ({id, at}) => {
  const scene = sceneById(id);
  const Comp = SCENES[id];
  return (
    <SceneProvider scene={scene}>
      <Freeze frame={at ?? scene.durationInFrames - 1}>
        <Comp />
      </Freeze>
    </SceneProvider>
  );
};
