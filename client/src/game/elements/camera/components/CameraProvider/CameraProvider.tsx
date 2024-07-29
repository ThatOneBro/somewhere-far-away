import { MutableRefObject, useCallback, useState } from 'react';
import { Object3D } from 'three';
import Camera from '../Camera/Camera';
import { AngleName } from '../Camera/hooks/useFollow';
import { CameraContext } from './CameraContext';

interface CameraProviderProps {
  children: JSX.Element;
}

const CameraProvider = ({ children }: CameraProviderProps) => {
  const [followTarget, setFollowTarget] = useState<MutableRefObject<Object3D | null> | null>(null);
  const [cameraAngle, setAngle] = useState<AngleName>('high');
  const [localPlayerRef, setPlayerRef] = useState<MutableRefObject<Object3D | null> | null>(null);

  const setCameraFollowTarget = useCallback((target: MutableRefObject<Object3D | null> | null) => {
    setFollowTarget(target);

    const unsubscribe = () => {
      setFollowTarget(null);
    };

    return unsubscribe;
  }, []);

  const setCameraAngle = useCallback((angle: AngleName) => {
    setAngle(angle);

    const unsubscribe = () => {
      setAngle('high');
    };

    return unsubscribe;
  }, []);

  const setLocalPlayerRef = useCallback((playerRef: MutableRefObject<Object3D | null> | null) => {
    setPlayerRef(playerRef);

    const unsubscribe = () => {
      setPlayerRef(null);
    };

    return unsubscribe;
  }, []);

  return (
    <CameraContext.Provider
      value={{
        setCameraFollowTarget,
        setCameraAngle,
        setLocalPlayerRef,
        localPlayerRef,
      }}
    >
      <Camera followTarget={followTarget} angle={cameraAngle} />
      {children}
    </CameraContext.Provider>
  );
};

export default CameraProvider;
