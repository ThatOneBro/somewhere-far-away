import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import ShipWreckMdl from '../../../../3d/components/ShipWreck/ShipWreck';
import Clickable from '../../../../utils/components/Clickable';

const ShipWreck = React.forwardRef(({ toggleFocusShip, position, ...props }, ref) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <group ref={ref} position={position} {...props}>
      <Clickable>
        <Suspense fallback={null}>
          <ShipWreckMdl scale={4} onClick={toggleFocusShip} />
        </Suspense>
      </Clickable>
    </group>
  );
});

ShipWreck.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  position: PropTypes.array,
  toggleFocusShip: PropTypes.func.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

ShipWreck.defaultProps = {
  position: [0, 0, 0],
};

export default ShipWreck;
