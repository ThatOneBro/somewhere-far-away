/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useGLTF, useAnimations } from '@react-three/drei';

import { useHandleAnimation } from './useHandleAnimation';

export default function Model({ walking, ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/models/PeepoRigged.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useHandleAnimation(actions, mixer, walking);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Stomach} />
      <skinnedMesh
        geometry={nodes.Sphere002.geometry}
        material={nodes.Sphere002.material}
        skeleton={nodes.Sphere002.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Sphere002_1.geometry}
        material={nodes.Sphere002_1.material}
        skeleton={nodes.Sphere002_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.LeftGlass.geometry}
        material={nodes.LeftGlass.material}
        skeleton={nodes.LeftGlass.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Mouth.geometry}
        material={materials.Rot}
        skeleton={nodes.Mouth.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Pants.geometry}
        material={materials.Pants}
        skeleton={nodes.Pants.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Peepo.geometry}
        material={materials.Peepo}
        skeleton={nodes.Peepo.skeleton}
      />
      <skinnedMesh
        geometry={nodes.PeepoTshirt.geometry}
        material={materials.Tshirt}
        skeleton={nodes.PeepoTshirt.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Sphere003.geometry}
        material={nodes.Sphere003.material}
        skeleton={nodes.Sphere003.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Sphere003_1.geometry}
        material={nodes.Sphere003_1.material}
        skeleton={nodes.Sphere003_1.skeleton}
      />
      <skinnedMesh
        geometry={nodes.RightGlass.geometry}
        material={nodes.RightGlass.material}
        skeleton={nodes.RightGlass.skeleton}
      />
    </group>
  );
}

Model.propTypes = {
  walking: PropTypes.bool,
};

Model.defaultProps = {
  walking: false,
};

useGLTF.preload('/models/PeepoRigged.glb');
