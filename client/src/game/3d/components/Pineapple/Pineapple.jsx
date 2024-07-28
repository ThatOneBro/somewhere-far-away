/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(
    'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/pineapple/model.gltf',
  );
  useEffect(() => {
    if (!materials) return;
    Object.values(materials).forEach(material => {
      // eslint-disable-next-line no-param-reassign
      material.metalness = 0.25;
    });
  }, [materials]);
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.Mesh_pineapple.geometry} material={materials.yellow} />
      <mesh geometry={nodes.Mesh_pineapple_1.geometry} material={materials.green} />
    </group>
  );
}

useGLTF.preload(
  'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/pineapple/model.gltf',
);
