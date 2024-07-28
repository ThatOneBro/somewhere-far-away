import React from 'react';
import PropTypes from 'prop-types';

import BurgerHat from '../Burger/BurgerHat2';
import DonutHat from '../Donut/DonutHat2';
import PineappleHat from '../Pineapple/PineappleHat2';
import IceCreamHat from '../IceCream/IceCreamHat2';

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
