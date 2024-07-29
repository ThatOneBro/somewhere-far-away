import { MutableRefObject, useContext, useEffect } from 'react';
import { Object3D } from 'three';
import { AngleName } from '../Camera/hooks/useFollow';
import { CameraContext } from './CameraContext';

export const useSetCameraFollowTarget = (
  target: MutableRefObject<Object3D | null> | null
) => {
  const { setCameraFollowTarget } = useContext(CameraContext);
  useEffect(() => {
    const unsubscribe = setCameraFollowTarget?.(target);

    return () => {
      unsubscribe?.();
    };
  }, [target, setCameraFollowTarget]);
};

export const useSetCameraAngle = (angle: AngleName) => {
  const { setCameraAngle } = useContext(CameraContext);
  useEffect(() => {
    const unsubscribe = setCameraAngle?.(angle);

    return () => {
      unsubscribe?.();
    };
  }, [angle, setCameraAngle]);
};

export const useSetLocalPlayerRef = (
  playerRef: MutableRefObject<Object3D | null> | null
) => {
  const { setLocalPlayerRef } = useContext(CameraContext);
  useEffect(() => {
    const unsubscribe = setLocalPlayerRef?.(playerRef);

    return () => {
      unsubscribe?.();
    };
  }, [playerRef, setLocalPlayerRef]);
};
