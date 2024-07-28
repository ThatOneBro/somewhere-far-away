import React, { Suspense, useRef } from 'react';
// import PropTypes from 'prop-types';
import { useSyncBody, SyncedComponent, useBodyProxy } from 'rgg-engine';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// import { vectorToAngle, lerpRadians } from '../../../../utils/angles';

import BeachBallMdl from '../../../../3d/components/BeachBall/BeachBall';

const velocity = new THREE.Vector3();
const perpendicular = new THREE.Vector3();

const BeachBall = React.forwardRef(({ ...props }, ref) => {
  const localRef = useRef(null);
  const usedRef = ref || localRef;
  const innerRef = useRef(null);

  useSyncBody('ball', usedRef, { applyRotation: true });
  const bodyProxy = useBodyProxy('ball');

  const previousMagnitudeRef = useRef(0);

  const onFrame = (state, delta) => {
    if (!innerRef.current || !bodyProxy.velocity) return;
    velocity.set(bodyProxy.velocity[0], 0, bodyProxy.velocity[1]);
    // console.log(velocity);
    const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    // console.log(perpendicular);
    // innerRef.current.rotation.x += magnitude * delta;
    // Make it a unit vector
    perpendicular.set(bodyProxy.velocity[1], 0, -bodyProxy.velocity[0]).normalize();
    innerRef.current.rotateOnAxis(perpendicular, magnitude * delta);
    // const newAngle = vectorToAngle(velocity.x, velocity.z);
    // innerRef.current.rotation.y = lerpRadians(innerRef.current.rotation.y, newAngle, delta * 10);
    // innerRef.current.position.y = THREE.MathUtils.lerp(
    //   innerRef.current.position.y,
    //   innerRef.current.position.y + (magnitude - previousMagnitudeRef.current) * delta * 5,
    //   0.1,
    // );
    previousMagnitudeRef.current = magnitude;
  };

  useFrame(onFrame);

  // useFrame(() => {
  //   if (!innerRef.current) return;
  //   innerRef.current.rotation.y += 0.1;
  //   // usedRef.current.rotation.z += 0.01;
  // });

  return (
    <>
      <SyncedComponent type="ball" ballId="ball" radius={0.45} position={[2, 2]} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <group ref={usedRef} position={[2, 0, 2]} {...props}>
        <Suspense fallback={null}>
          <BeachBallMdl innerRef={innerRef} scale={2} />
        </Suspense>
      </group>
    </>
  );
});

// BeachBall.propTypes = {
//   /* eslint-disable react/forbid-prop-types */
//   /* eslint-enable react/forbid-prop-types */
// };

export default BeachBall;
