import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useHandleAnimation } from './useHandleAnimation';

export default function Ninja({ moving, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/Ninja_Male.glb');
  const { actions } = useAnimations(animations, group);

  useHandleAnimation(actions, moving);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Bone} />
      <skinnedMesh
        castShadow
        receiveShadow
        material={materials.Skin}
        geometry={nodes.Cube004.geometry}
        skeleton={nodes.Cube004.skeleton}
      />
      <skinnedMesh
        castShadow
        receiveShadow
        material={materials.Main}
        geometry={nodes.Cube004_1.geometry}
        skeleton={nodes.Cube004_1.skeleton}
      />
      <skinnedMesh
        castShadow
        receiveShadow
        material={materials.Details}
        geometry={nodes.Cube004_2.geometry}
        skeleton={nodes.Cube004_2.skeleton}
      />
      <skinnedMesh
        castShadow
        receiveShadow
        material={materials.Grey}
        geometry={nodes.Cube004_3.geometry}
        skeleton={nodes.Cube004_3.skeleton}
      />
      <skinnedMesh
        castShadow
        receiveShadow
        material={materials.Face}
        geometry={nodes.Cube004_4.geometry}
        skeleton={nodes.Cube004_4.skeleton}
      />
    </group>
  );
}

Ninja.propTypes = {
  moving: PropTypes.bool.isRequired,
};

useGLTF.preload('/models/Ninja_Male.glb');
