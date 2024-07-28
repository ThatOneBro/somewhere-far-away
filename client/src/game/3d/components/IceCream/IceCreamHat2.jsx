import React from 'react';
import IceCream from './IceCream';

const IceCreamHat = () => {
  return (
    <IceCream
      scale={225}
      position={[12, 120, -15]}
      // position={[0.01, 0, 0.042]}
      rotation={[-Math.PI, -Math.PI / 4, Math.PI / 16]}
    />
  );
};

export default IceCreamHat;
