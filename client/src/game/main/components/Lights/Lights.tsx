import { useWindowSize } from '@react-hook/window-size';

const portraitConfig = {
  top: 3,
  left: -3,
  right: 1,
  bottom: -1,
  horizontalRatio: 7,
  verticalRatio: 4,
};

const landscapeConfig = {
  top: 1,
  left: -2,
  right: 2,
  bottom: -2,
  horizontalRatio: 12.5,
  verticalRatio: 12,
};

const Lights = () => {
  const [width, height] = useWindowSize();

  const ratio = width / height;

  const config = width > height ? landscapeConfig : portraitConfig;
  const { top, left, right, bottom, horizontalRatio, verticalRatio } = config;
  return (
    <>
      {/* <ambientLight color={0xfed8b1} intensity={0.3} /> */}
      {/* <ambientLight intensity={2} /> */}
      <hemisphereLight color={0xffb94f} groundColor={0x080820} position={[0, 50, 0]} intensity={1} />
      <directionalLight
        position={[0.75 * 25, 0.5 * 25, 0.445 * 25]}
        intensity={1.5}
        color={0xffb94f}
        castShadow
        shadow-camera-top={top * verticalRatio * ratio}
        shadow-camera-left={left * horizontalRatio * ratio}
        shadow-camera-bottom={bottom * verticalRatio}
        shadow-camera-right={right * horizontalRatio}
        shadow-camera-far={3500}
        shadow-mapSize-width={1024 * 3}
        shadow-mapSize-height={1024 * 3}
      />
      <directionalLight
        position={[-0.75 * 25, -0.5 * 25, -0.445 * 25]}
        intensity={0.5}
        color={0xfff3da}
        // castShadow
      />
    </>
  );
};

export default Lights;
