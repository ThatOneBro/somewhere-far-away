import React, { Suspense, useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import { Vec2 } from 'planck-js';
// import { usePlanckBody } from 'rgg-engine';
import useSound from 'use-sound';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import TwoBYearOldRock from '../../../../../assets/sounds/2-billion-year-old-rock.mp3';

import StoneFormation from '../StoneFormation/StoneFormation';
import StoneMeshOnly from '../../../../3d/components/StoneFormation/StoneFormationMeshOnly';
import Clickable from '../../../../utils/components/Clickable';
import EmoteDisplayer from '../../../../utils/components/EmoteDisplayer';

// import BuzzSound from '../../../../../assets/sounds/265210__xixishi__scfi-electric-hum-01.wav';

const vertexShader = `
  uniform vec3 viewVector;
  uniform float c;
  uniform float p;
  varying float intensity;
  void main() 
  {
      vec3 vNormal = normalize( normalMatrix * normal );
    vec3 vNormel = normalize( normalMatrix * viewVector );
    intensity = pow( c - dot(vNormal, vNormel), p );
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragShader = `
  uniform vec3 glowColor;
  varying float intensity;
  void main() 
  {
    vec3 glow = glowColor * intensity;
      gl_FragColor = vec4( glow, 1.0 );
  }
`;

const uniforms = {
  c: { type: 'f', value: 0.0 },
  p: { type: 'f', value: 2.3 },
  // glowColor: { type: 'c', value: new THREE.Color(0xffff00) },
  glowColor: { type: 'c', value: new THREE.Color(0x6900ff) },
  viewVector: { type: 'v3', value: new THREE.Vector3(-10, 25, 10) },
};

const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader: fragShader,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});

const Shungite = ({ position }) => {
  const [displaying, setDisplaying] = useState(false);
  const clipPlaying = useRef(false);
  const [play2BYearOldRock] = useSound(TwoBYearOldRock, {
    onplay: () => {
      clipPlaying.current = true;
      setDisplaying(true);
    },
    onend: () => {
      clipPlaying.current = false;
      setDisplaying(false);
    },
  });

  const onClick = () => {
    if (clipPlaying.current) return;
    play2BYearOldRock();
  };

  // usePlanckBody(
  //   () => ({
  //     body: {
  //       type: 'static',
  //       position: Vec2(0, -3),
  //     },
  //     fixtures: [
  //       {
  //         shape: 'Box',
  //         args: [0.2, 0.2],
  //         fixtureOptions: {},
  //       },
  //     ],
  //   }),
  //   {},
  // );

  const stoneMeshRef = useRef(null);
  const fieldMeshRef = useRef(null);
  const upRef = useRef(false);

  const onFrame = useCallback(() => {
    if (!stoneMeshRef.current) return;
    if (upRef.current) {
      stoneMeshRef.current.uniforms.p.value += 0.04;
      if (stoneMeshRef.current.uniforms.p.value >= 2.29) upRef.current = false;
      return;
    }
    stoneMeshRef.current.uniforms.p.value -= 0.025;
    if (stoneMeshRef.current.uniforms.p.value <= 0.01) upRef.current = true;
  }, []);

  useFrame(onFrame);

  return (
    <>
      <group position={position}>
        <EmoteDisplayer
          emote="forsenCD"
          displaying={displaying}
          position={[-2.5, 0, -2.5]}
          size={65}
        />
        <EmoteDisplayer emote="SHUNGITE" displaying={displaying} position={[2, 0, 2]} size={65} />
      </group>
      <Suspense fallback={null}>
        <Clickable>
          <StoneFormation position={position} onClick={onClick} scale={0.25} />
        </Clickable>
        <mesh
          position={position}
          material={mat}
          uniforms={uniforms}
          ref={fieldMeshRef}
          visible={displaying}
        >
          <sphereGeometry args={[4, 10, 10]} />
        </mesh>
        <StoneMeshOnly
          position={position}
          material={mat}
          uniforms={uniforms}
          scale={1.2}
          ref={stoneMeshRef}
        />
      </Suspense>
    </>
  );
};

Shungite.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  position: PropTypes.array,
  /* eslint-enable react/forbid-prop-types */
};

Shungite.defaultProps = {
  position: [0, 0, 0],
};

export default Shungite;
