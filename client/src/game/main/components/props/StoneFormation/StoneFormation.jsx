import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Vec2 } from 'planck-js';
import { usePlanckBody } from 'rgg-engine';

import StoneFormationMdl from '../../../../3d/components/StoneFormation/StoneFormation';

const EntityPhysics = ({ position, scale }) => {
  usePlanckBody(
    () => ({
      body: {
        type: 'static',
        position: Vec2(position[0], position[2]),
      },
      fixtures: [
        {
          shape: 'Circle',
          args: [scale * 0.75],
          fixtureOptions: {},
        },
      ],
    }),
    {},
  );
  return null;
};

const StoneFormation = ({ solid, position, scale, ...props }) => {
  return (
    <>
      {solid && <EntityPhysics position={position} scale={scale} />}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <group position={position} scale={scale} {...props}>
        <Suspense fallback={null}>
          <StoneFormationMdl scale={4} />
        </Suspense>
      </group>
    </>
  );
};

StoneFormation.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  solid: PropTypes.bool,
  position: PropTypes.array,
  scale: PropTypes.number,
  /* eslint-enable react/forbid-prop-types */
};

StoneFormation.defaultProps = {
  solid: true,
  position: [0, 0, 0],
  scale: 1,
};

export default StoneFormation;
