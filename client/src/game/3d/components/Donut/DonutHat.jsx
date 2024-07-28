import React from 'react';
import DonutSprinkles from './DonutSprinkles';
import { degToRad } from '../../../utils/angles';

const DonutHat = () => {
  return <DonutSprinkles scale={0.15} rotation={[degToRad(80), 0, 0]} />;
};

export default DonutHat;
