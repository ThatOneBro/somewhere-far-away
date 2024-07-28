import React from 'react';
import PropTypes from 'prop-types';

import BurgerHat from '../Burger/BurgerHat';
import DonutHat from '../Donut/DonutHat';
import PineappleHat from '../Pineapple/PineappleHat';
import IceCreamHat from '../IceCream/IceCreamHat';

export const HATS = {
  burger: BurgerHat,
  donut: DonutHat,
  pineapple: PineappleHat,
  iceCream: IceCreamHat,
};

const Hat = React.forwardRef(({ type = null }, ref) => {
  const HatComponent = HATS[type] || null;
  return HatComponent ? (
    <group ref={ref}>
      <HatComponent />
    </group>
  ) : null;
});

Hat.propTypes = {
  type: PropTypes.string,
};

Hat.defaultProps = {
  type: null,
};

export default Hat;
