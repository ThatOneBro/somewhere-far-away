import { RootState, useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { DirectionalLight, Group, Object3D, PerspectiveCamera } from 'three';
import { degToRad, lerpRadians } from '../../../../../utils/angles';

const PROJECTION_UPDATE_RATE = 3;
const followTargetPos = new THREE.Vector3();
const lastLookAtPos = new THREE.Vector3();
const newCameraPos = new THREE.Vector3();

export type AngleName = 'high' | 'lowWide' | 'ship' | 'default';

const angleConfig = {
  high: 15,
  ship: 90,
  lowWide: -5,
} as const;

const posConfig = {
  lowWide: {
    x: -90,
    z: 90,
  },
  ship: {
    x: -45,
    z: 45,
  },
  default: {
    x: -15,
    z: 15,
  },
} as const;

const fovConfig = {
  high: 35,
  // high: 25,
  default: 25,
} as const;

const rotationConfig = {
  ship: degToRad(45),
  lowWide: degToRad(12),
  default: 0,
} as const;

const getNewCameraFov = (angle: AngleName) => {
  return fovConfig[angle as keyof typeof fovConfig] || fovConfig.default;
};

const getNewCameraPos = (angle: AngleName, yPos: number) => {
  const pos = posConfig[angle as keyof typeof posConfig];
  if (pos) {
    return newCameraPos.set(pos.x, yPos, pos.z);
  }
  return newCameraPos.set(posConfig.default.x, yPos, posConfig.default.z);
};

export const useFollow = (
  followTarget: MutableRefObject<Object3D | null> | null,
  groupRef: MutableRefObject<Group>,
  cameraRef: MutableRefObject<PerspectiveCamera>,
  angle: AngleName,
  lightRef: MutableRefObject<DirectionalLight> | null = null
) => {
  const callCounterRef = useRef(0);

  const onFrame = (_state: RootState, delta: number) => {
    if (!followTarget || !followTarget.current) return;

    const group = groupRef.current;
    followTarget.current.getWorldPosition(followTargetPos);

    const yPos = angleConfig[angle as keyof typeof angleConfig] || followTargetPos.y;

    group.position.lerp(followTargetPos, 1 - 0.000037 ** delta);
    group.rotation.y = lerpRadians(
      group.rotation.y,
      rotationConfig[angle as keyof typeof rotationConfig] || rotationConfig.default,
      // 0.15,
      1 - 0.000037 ** delta
    );

    const camera = cameraRef.current;
    camera.position.lerp(getNewCameraPos(angle, yPos), 1 - 0.000037 ** delta);
    camera.lookAt(lastLookAtPos.x ? lastLookAtPos.lerp(group.position, 1 - 0.000037 ** delta) : group.position);
    camera.fov = THREE.MathUtils.lerp(camera.fov, getNewCameraFov(angle), 1 - 0.000037 ** delta);

    if (callCounterRef.current % PROJECTION_UPDATE_RATE === 0) {
      camera.updateProjectionMatrix();
    }

    if (lightRef && lightRef.current) {
      const light = lightRef.current;
      light.target.position.x = group.position.x;
      light.target.position.y = group.position.y;
      light.target.position.z = group.position.z;
      light.target.updateMatrixWorld();
    }
  };

  useFrame(onFrame);
};
