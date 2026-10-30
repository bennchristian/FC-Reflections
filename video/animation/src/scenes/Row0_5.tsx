// Row 0.5 · Title card (no VO, 3 s hold). M1 music hit → title label lands.
import React from 'react';
import {Drop, Hand} from '../kit/Bits';
import {Cover} from '../kit/Paper';
import {FCLogo, fellowshipDates, ownerName} from '../kit/Project';
import {TitleLabel} from '../kit/Recurring';
import {useCues, usePop} from '../timing/context';

export const TitleCover: React.FC<{label: number; logoAt: number; textAt: number}> = ({label, logoAt, textAt}) => (
  <Cover>
    <TitleLabel p={label} />
    <Drop at={logoAt} x={1530} y={590} w={230} h={230} rotate={8} attach="none" style={{borderRadius: '50%'}}>
      <FCLogo size={230} />
    </Drop>
    <Hand text={`${ownerName()}  ·  ${fellowshipDates()}`} at={textAt} dur={24} x={960} y={660} center size={64} color="#fbf3e2" />
  </Cover>
);

export const Row0_5: React.FC = () => {
  const c = useCues();
  const pop = usePop();
  return <TitleCover label={pop(c('M1'), 10)} logoAt={c('M1') + 14} textAt={c('M1') + 22} />;
};

