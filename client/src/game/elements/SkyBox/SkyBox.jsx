import React, { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCubeTexture } from '@react-three/drei';

// const imgArray = Array(6)
//   .fill()
//   .map((_, i) => `/skyboxes/skybox1/cloud04_out_${i}.jpg`);
// const imgArray = [
//   '/skyboxes/skybox1/cloud04_out_1.jpg',
//   '/skyboxes/skybox1/cloud04_out_0.jpg', // front
//   '/skyboxes/skybox1/cloud04_out_2.jpg', // back
//   '/skyboxes/skybox1/cloud04_out_3.jpg',
//   '/skyboxes/skybox1/cloud04_out_4.jpg',
//   '/skyboxes/skybox1/cloud04_out_5.jpg',
// ];
// const imgArray = [
//   'cloud04_out_1.jpg', // down
//   'cloud04_out_3.jpg', //
//   'cloud04_out_4.jpg',
//   'cloud04_out_5.jpg',
//   'cloud04_out_0.jpg', // front
//   'cloud04_out_2.jpg', // back
// ];
const imgArray = [
  'cloudright.png',
  'cloudleft.png',
  'cloudup.png',
  'clouddown.png',
  'cloudfront.png',
  'cloudback.png',
];

const SkyBox = () => {
  const texture = useCubeTexture(imgArray, { path: '/skyboxes/skybox2/' });
  const { scene } = useThree();
  // useFrame(() => {
  //   if (!scene || !scene.background) return;
  //   console.log(scene.background);
  //   scene.background.rotation += 0.01;
  // });

  useEffect(() => {
    if (!texture) return;
    scene.background = texture;
    // scene.environment = texture;
  }, [scene, texture]);

  // return (
  //   <mesh rotation={[0, -Math.PI / 2, 0]}>
  //     <boxGeometry attach="geometry" args={[1000, 1000, 1000, 1, 1, 1]} />
  //     {textures.map(texture => (
  //       <meshBasicMaterial map={texture} side={THREE.BackSide} />
  //     ))}
  //   </mesh>
  // );
  return null;
};

export default SkyBox;
