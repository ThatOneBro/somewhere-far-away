import React, { Suspense, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stage, OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
// import { useInView } from 'react-intersection-observer';
import Robot from '../../../3d/components/Robot/RobotExpressive';

const FrameRefresher = ({ refresh }) => {
  const [refreshed, setRefreshed] = useState(1);
  const [done, setDone] = useState(false);
  const scene = useThree(state => state.scene);

  useEffect(() => {
    if (refreshed < 6 || done) return;
    let succeeded;
    scene.traverse(obj => {
      if (obj.name !== 'Robot') return;
      succeeded = true;
    });
    if (succeeded) setDone(true);
  }, [refreshed, done, scene]);

  useFrame(({ clock }) => {
    if (done || clock.elapsedTime < refreshed * 0.15 || !scene) return;
    refresh();
    setRefreshed(s => s + 1);
  });

  return null;
};

// const DisableRender = () => useFrame(() => null, 1000);

const CharacterPreview = ({ color, hat, wide = false, refresh, style = undefined }) => {
  const controlsRef = useRef();
  // const [walking, setWalking] = useState(false);

  // const { wrapperRef, inView } = useInView();

  return (
    <div>
      <Canvas
        gl={{ alpha: false }}
        shadows
        dpr={[0.75, 1.5]}
        camera={{ position: [0, 0, 150], fov: 50 }}
        // style={{ zIndex: 9999999 }}
        // mode="concurrent"s
        style={style}
      >
        {/* {!inView && <DisableRender />} */}
        <AdaptiveDpr />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          <FrameRefresher refresh={refresh} />
          <color attach="background" color={0xfff} />
          <ambientLight intensity={0.35} />
          <Stage
            controls={controlsRef}
            preset="rembrandt"
            intensity={0.45}
            contactShadow
            shadows
            // adjustCamera
            environment="sunset"
            shadowBias={-0.001}
          >
            <Robot scale={[wide ? 0.6 : 0.3, 0.3, 0.3]} color={color} hat={hat} />
          </Stage>
        </Suspense>
        <OrbitControls ref={controlsRef} />
      </Canvas>
    </div>
  );
};

CharacterPreview.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  color: PropTypes.string,
  hat: PropTypes.string,
  wide: PropTypes.bool,
  refresh: PropTypes.func,
  style: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
};

CharacterPreview.defaultProps = {
  color: 'yellow',
  hat: null,
  wide: false,
  refresh: () => {},
  style: undefined,
};

export default CharacterPreview;
