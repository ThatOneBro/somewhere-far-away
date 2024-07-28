import { PerspectiveCamera as PerspectiveCameraHelper } from '@react-three/drei';
import { MutableRefObject, useRef } from 'react';
import { DirectionalLight, Group, Object3D, PerspectiveCamera } from 'three';
import { AngleName, useFollow } from './hooks/useFollow';

interface Camera {
  followTarget: MutableRefObject<Object3D | null> | null;
  angle: AngleName;
}

const Camera = ({ followTarget, angle }: Camera) => {
  const groupRef = useRef<Group>(null) as MutableRefObject<Group>;
  const lightRef = useRef<DirectionalLight>(null) as MutableRefObject<DirectionalLight>;
  const cameraRef = useRef<PerspectiveCamera>(null) as MutableRefObject<PerspectiveCamera>;

  // useLayoutEffect(() => {
  //   cameraRef.current.up.set(0, 1, 0);
  //   cameraRef.current.lookAt(0, 50 + 1, 0);
  //   cameraRef.current.updateProjectionMatrix();
  // }, []);

  useFollow(followTarget, groupRef, cameraRef, angle, lightRef);

  return (
    <group ref={groupRef}>
      <PerspectiveCameraHelper ref={cameraRef} position={[-15, 15, 15]} fov={25} far={500} makeDefault />
    </group>
  );
};

export default Camera;
