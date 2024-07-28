import { useGLTF } from '@react-three/drei';
import { useGraph } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

// import Hat from './Hat';

// import { useHandleAnimation } from './useHandleAnimation';

// interface AnimationHandlerProps {
//   model:
// }
// const AnimationHandler = ({ model, fwdRef, moving, jumping }) => {
//   const animations = model ? model.animations : null;

//   const { actions, mixer } = useAnimations(animations, fwdRef);
//   useHandleAnimation(actions, mixer, moving, jumping);

//   return null;
// };

const coloredMaterials = {} as Record<RobotColor, THREE.MeshBasicMaterial>;

export const COLORS = {
  // yellow: 0xfddd5c,
  yellow: 0xffcc11,
  orange: 0xff7210,
  red: 0xff2025,
  green: 0x3d9900,
  magenta: 0xdc13ff,
  blue: 0x003166,
  teal: 0x008080,
} as const;

type RobotColor = keyof typeof COLORS;

export const TEXT_COLORS = {
  yellow: '#ffda00',
  orange: '#ff7210',
  red: '#fe4e52',
  green: '#54d400',
  magenta: '#db72af',
  blue: '#2d91ff',
  teal: '#00cfcf',
} as const;

interface RobotProps {
  color: RobotColor;
  moving: boolean;
  jumping: boolean;
}

export default function Robot({ color, ...props }: RobotProps) {
  const { scene } = useGLTF('/models/Robot/Robot_Yellow.glb');
  const copiedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(copiedScene);

  const group = useRef(null);
  // const hatRef = useRef(null);

  useEffect(() => {
    if (!COLORS[color] || !materials || !materials.Main) return;
    if (coloredMaterials[color]) return;
    coloredMaterials[color] = (materials.Main as THREE.MeshBasicMaterial).clone();
    coloredMaterials[color].color = new THREE.Color(COLORS[color]);
  }, [color, materials]);

  useEffect(() => {
    if (!materials || !materials.Main || !coloredMaterials[color]) return;
    materials.Main = coloredMaterials[color];
  }, [color, materials]);

  useEffect(() => {
    if (!nodes || !nodes.Bone || !color || !coloredMaterials[color]) return;
    const mat = nodes.Bone.getObjectByName('Main') as THREE.MeshBasicMaterial | undefined;
    console.log(mat);
    // mat = coloredMaterials[color];
  }, [color, nodes]);

  return (
    <>
      {/* <AnimationHandler model={model} fwdRef={group} moving={moving} jumping={jumping} /> */}
      <group name="Robot" ref={group} {...props} dispose={null}>
        {/* <Hat type={hat} ref={hatRef} /> */}
        <group rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]} dispose={null}>
          {nodes.Bone && <primitive object={nodes.Bone} />}
        </group>
        <group position={[0, 2.37, -0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
          <skinnedMesh
            geometry={nodes.HandR_1.geometry}
            material={coloredMaterials['yellow'] || nodes.HandR_1.material}
            skeleton={nodes.HandR_1.skeleton}
          >
            {/* <meshBasicMaterial color="yellow" /> */}
          </skinnedMesh>
          <skinnedMesh
            geometry={nodes.HandR_2.geometry}
            material={nodes.HandR_2.material}
            skeleton={nodes.HandR_2.skeleton}
          />
        </group>
        <group position={[0, 2.37, -0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={[100, 100, 100]}>
          <skinnedMesh
            geometry={nodes.HandL_1.geometry}
            material={coloredMaterials['yellow'] || nodes.HandL_1.material}
            skeleton={nodes.HandL_1.skeleton}
          >
            {/* <meshBasicMaterial color="yellow" /> */}
          </skinnedMesh>
          <skinnedMesh
            geometry={nodes.HandL_2.geometry}
            material={nodes.HandL_2.material}
            skeleton={nodes.HandL_2.skeleton}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('/models/Robot/Robot_Yellow.glb');
