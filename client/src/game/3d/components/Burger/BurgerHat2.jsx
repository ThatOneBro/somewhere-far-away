import React from 'react';
import Burger from './Burger';

import { degToRad } from '../../../utils/angles';

const BurgerHat = () => {
  return <Burger scale={45} position={[0, 28, -5]} rotation={[0, 0, 0]} />;
};

export default BurgerHat;
