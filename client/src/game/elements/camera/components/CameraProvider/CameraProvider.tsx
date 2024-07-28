import { createContext, MutableRefObject, useCallback, useContext, useEffect, useState } from 'react';
import { Object3D } from 'three';
import Camera from '../Camera/Camera';
import { AngleName } from '../Camera/hooks/useFollow';

const Context = createContext({
  setCameraAngle: null,
  setCameraFollowTarget: null,
} as { setCameraAngle: ((angle: AngleName) => () => void) | null; setCameraFollowTarget: ((followTarget: MutableRefObject<Object3D | null> | null) => () => void) | null });

export const useSetCameraFollowTarget = (target: MutableRefObject<Object3D | null> | null) => {
  const { setCameraFollowTarget } = useContext(Context);
  useEffect(() => {
    const unsubscribe = setCameraFollowTarget?.(target);

    return () => {
      unsubscribe?.();
    };
  }, [target, setCameraFollowTarget]);
};

export const useSetCameraAngle = (angle: AngleName) => {
  const { setCameraAngle } = useContext(Context);
  useEffect(() => {
    const unsubscribe = setCameraAngle?.(angle);

    return () => {
      unsubscribe?.();
    };
  }, [angle, setCameraAngle]);
};

interface CameraProviderProps {
  children: JSX.Element;
}

const CameraProvider = ({ children }: CameraProviderProps) => {
  const [followTarget, setFollowTarget] = useState<MutableRefObject<Object3D | null> | null>(null);
  const [cameraAngle, setAngle] = useState<AngleName>('high');

  const setCameraFollowTarget = useCallback(
    (target: MutableRefObject<Object3D | null> | null) => {
      setFollowTarget(target);

      const unsubscribe = () => {
        setFollowTarget(null);
      };

      return unsubscribe;
    },
    [setFollowTarget]
  );

  const setCameraAngle = useCallback(
    (angle: AngleName) => {
      setAngle(angle);

      const unsubscribe = () => {
        setAngle('high');
      };

      return unsubscribe;
    },
    [setAngle]
  );

  return (
    <Context.Provider
      value={{
        setCameraFollowTarget,
        setCameraAngle,
      }}
    >
      <Camera followTarget={followTarget} angle={cameraAngle} />
      {children}
    </Context.Provider>
  );
};

export default CameraProvider;
