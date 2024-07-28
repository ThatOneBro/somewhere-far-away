import React from 'react';
import IceCream from './IceCream';
import { degToRad } from '../../../utils/angles';

const IceCreamHat = () => {
  return (
    <IceCream
      scale={0.1}
      position={[0.01, 0.01, 0.042]}
      rotation={[degToRad(-110), degToRad(15), degToRad(15)]}
    />
  );
};

export default IceCreamHat;
