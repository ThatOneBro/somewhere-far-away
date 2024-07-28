import React from 'react';
import Burger from './Burger';

import { degToRad } from '../../../utils/angles';

const BurgerHat = () => {
  return <Burger scale={0.018} position={[0, 0, 0.005]} rotation={[degToRad(80), 0, 0]} />;
};

export default BurgerHat;
