import React, { Suspense } from 'react';

import TowerMdl from '../../../../3d/components/Tower/Tower';
import Clickable from '../../../../utils/components/Clickable';

interface TowerProps {
  toggleFocusTower: () => void;
  position: [number, number, number];
}

const Tower = React.forwardRef(({ toggleFocusTower, position, ...props }: TowerProps, ref) => {
  return (
    <group position={position} {...props}>
      <Clickable>
        <Suspense fallback={null}>
          <TowerMdl scale={4} onClick={toggleFocusTower} ref={ref} />
        </Suspense>
      </Clickable>
    </group>
  );
});

export default Tower;
