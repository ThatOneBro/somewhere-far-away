import { useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { CameraHelper, DirectionalLight } from 'three';

interface ShadowHelperProps {
  light: DirectionalLight;
}

const ShadowHelper = ({ light }: ShadowHelperProps) => {
  const ref = useRef(light.shadow.camera);

  useHelper(ref, CameraHelper);

  return null;
};

export default ShadowHelper;
