import React from 'react';
import { Box } from '@react-three/drei';
import { Vec2 } from 'planck-js';
import { usePlanckBody } from 'rgg-engine';

const Wall = () => {
  usePlanckBody(
    () => ({
      body: {
        type: 'static',
        position: Vec2(0, -3),
      },
      fixtures: [
        {
          shape: 'Box',
          args: [1, 1],
          fixtureOptions: {},
        },
      ],
    }),
    {},
  );

  return (
    <Box args={[2, 2, 2]} position={[0, 0, -3]} castShadow receiveShadow>
      <meshStandardMaterial color="#3c3762" />
    </Box>
  );
};

export default Wall;
