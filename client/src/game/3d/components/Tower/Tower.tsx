import { useGLTF } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import React, { useRef } from 'react';

export default React.forwardRef(function Model(props: GroupProps, ref: any) {
  const group = useRef(null);
  const { nodes, materials } = useGLTF('/models/Tower/model.gltf');
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group ref={group} {...props} dispose={null}>
      <group position={[0, 0, 0]}>
        <mesh ref={ref} position={[1, 4, 1]} />
        <mesh geometry={nodes.tower_1.geometry} material={materials['stone.006']} castShadow />
        <mesh geometry={nodes.tower_2.geometry} material={materials['woodDark.003']} castShadow />
        <mesh geometry={nodes.tower_3.geometry} material={materials['_defaultMat.007']} castShadow />
        <mesh geometry={nodes.tower_4.geometry} material={materials['iron.011']} castShadow />
        <mesh geometry={nodes.tower_5.geometry} material={materials['wood.024']} castShadow />
        <mesh geometry={nodes.tower_6.geometry} material={materials['sand.006']} castShadow />
        <mesh geometry={nodes.tower_7.geometry} material={materials['textile.008']} castShadow />
      </group>
    </group>
  );
});

useGLTF.preload('/models/Tower/model.gltf');
