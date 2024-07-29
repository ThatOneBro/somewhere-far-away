import { createContext, MutableRefObject } from 'react';
import { Object3D } from 'three';
import { AngleName } from '../Camera/hooks/useFollow';

export const CameraContext = createContext({
  setCameraAngle: null,
  setCameraFollowTarget: null,
  setLocalPlayerRef: null,
  localPlayerRef: null,
} as {
  setCameraAngle: ((angle: AngleName) => () => void) | null;
  setCameraFollowTarget:
    | ((followTarget: MutableRefObject<Object3D | null> | null) => () => void)
    | null;
  setLocalPlayerRef:
    | ((playerRef: MutableRefObject<Object3D | null> | null) => () => void)
    | null;
  localPlayerRef: MutableRefObject<Object3D | null> | null;
});
