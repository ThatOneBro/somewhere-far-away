import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Vec2 } from 'planck-js';
import { usePlanckBody } from 'rgg-engine';

import PalmShortMdl from '../../../../3d/components/PalmShort/PalmShort';

const PalmShort = ({ position, ...props }) => {
  usePlanckBody(
    () => ({
      body: {
        type: 'static',
        position: Vec2(position[0], position[2]),
      },
      fixtures: [
        {
          shape: 'Circle',
          args: [0.25, 0.25],
          fixtureOptions: {},
        },
      ],
    }),
    {},
  );

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group position={position} {...props}>
      <Suspense fallback={null}>
        <PalmShortMdl scale={2.5} />
      </Suspense>
    </group>
  );
};

PalmShort.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  position: PropTypes.array,
  /* eslint-enable react/forbid-prop-types */
};

PalmShort.defaultProps = {
  position: [0, 0, 0],
};

export default PalmShort;
