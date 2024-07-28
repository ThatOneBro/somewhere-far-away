import React from 'react';
import Pineapple from './Pineapple';
import { degToRad } from '../../../utils/angles';

const PineappleHat = () => {
  return <Pineapple scale={0.1} rotation={[degToRad(80), 0, 0]} />;
};

export default PineappleHat;
