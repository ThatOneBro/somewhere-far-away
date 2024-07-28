import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useTexture } from '@react-three/drei';

import Clickable from '../../../../utils/components/Clickable';

const Display = React.forwardRef(({ imageName = 'buffalo1', toggleFocus, idx, ...props }, ref) => {
  const map = useTexture(`/textures/images/${imageName}.png`);
  const usedMap = map || null;
  const toggle = useCallback(() => toggleFocus(idx), [toggleFocus, idx]);
  return (
    <Clickable>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <mesh ref={ref} onClick={toggle} {...props}>
        <planeBufferGeometry attach="geometry" args={[2, 2]} />
        <meshBasicMaterial attach="material" map={usedMap} />
      </mesh>
    </Clickable>
  );
});

Display.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  imageName: PropTypes.string.isRequired,
  toggleFocus: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

// Boombox.defaultProps = {
//   radioState: {
//     onState: null,
//     timestamp: null,
//   },
// };

export default Display;
