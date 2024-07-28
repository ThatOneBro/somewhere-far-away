import { Circle, useTexture } from '@react-three/drei';
import { useLayoutEffect } from 'react';
import * as THREE from 'three';

import { degToRad } from '../../../utils/angles';

const size = 50;

const Floor = () => {
  const [texture1, texture2] = useTexture(['/textures/ground/tiling_grass01.png', '/textures/ground/TilingSand.png']);
  useLayoutEffect(() => {
    if (!texture1 || !texture2) return;
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(4, 4);
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(8, 8);
  }, [texture1, texture2]);
  return (
    <>
      <Circle args={[size / 2.5, size]} position={[0, 0, 0]} rotation={[degToRad(-90), 0, 0]} receiveShadow>
        {/* <meshStandardMaterial color="#7bb36e" /> */}
        <meshStandardMaterial map={texture1} />
      </Circle>
      <Circle args={[size / 2, size]} position={[-0.5, -0.1, 0.5]} rotation={[degToRad(-90), 0, 0]} receiveShadow>
        <meshStandardMaterial map={texture2} />
        {/* <meshStandardMaterial color="#F9E98E" /> */}
      </Circle>
      <Circle args={[size / 1.7, size]} position={[-0.4, -1.1, 0.4]} rotation={[degToRad(-90), 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Circle>
    </>
  );
};

export default Floor;
