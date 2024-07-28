import { useCubeTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

const imgArray = ['cloudright.png', 'cloudleft.png', 'cloudup.png', 'clouddown.png', 'cloudfront.png', 'cloudback.png'];

const SkyBox = () => {
  const texture = useCubeTexture(imgArray, { path: '/skyboxes/skybox2/' });
  const { scene } = useThree();

  useEffect(() => {
    if (!texture) return;
    scene.background = texture;
    // scene.environment = texture;
  }, [scene, texture]);

  return null;
};

export default SkyBox;
