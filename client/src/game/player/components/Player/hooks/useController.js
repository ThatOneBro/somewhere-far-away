/* eslint-disable import/prefer-default-export */
import { useFrame } from '@react-three/fiber';
import { useCallback, useRef } from 'react';

import { joystickState } from '../../../../main/components/TouchHandler/TouchHandler';
import { inputsRawState } from '../../../../main/inputs/state';
import { degToRad, lerpRadians, vectorToAngle } from '../../../../utils/angles';

export const useController = (uuid, ref, innerRef, api, localState) => {
  const localRef = useRef({
    angle: degToRad(-45),
    lastVel: { x: 0, y: 0 },
    currentVel: { x: 0, y: 0 },
  });

  const getMoveVelocity = useCallback(() => {
    if (joystickState.active) {
      localRef.current.currentVel.x = -joystickState.xVel;
      localRef.current.currentVel.y = joystickState.yVel;
    } else {
      localRef.current.currentVel.x = -inputsRawState.horizontal;
      localRef.current.currentVel.y = inputsRawState.vertical;
    }

    return localRef.current.currentVel;
  }, []);

  const onFrame = useCallback(
    (state, delta) => {
      const { x: xVel, y: yVel } = getMoveVelocity();
      const moving = xVel !== 0 || yVel !== 0;
      let newAngle = localRef.current.angle;

      if (moving) {
        const angle = vectorToAngle(xVel, yVel);
        localRef.current.angle = angle;
        newAngle = angle;
      }

      if (innerRef.current) {
        // eslint-disable-next-line no-param-reassign
        innerRef.current.rotation.y = lerpRadians(innerRef.current.rotation.y, newAngle, delta * 10);
      }
      // eslint-disable-next-line no-param-reassign
      localState.moving = moving;
      // eslint-disable-next-line no-param-reassign
      localState.jumping = inputsRawState.jumping;
    },
    [innerRef, localRef, getMoveVelocity, localState]
  );

  const onFixedUpdate = useCallback(
    (delta) => {
      const { x: xVel, y: yVel } = getMoveVelocity();
      if (!xVel && !yVel) {
        localRef.current.lastVel.x = 0;
        localRef.current.lastVel.y = 0;
        return;
      }

      velocity.set(xVel * 1500 * delta, yVel * 1500 * delta);
      localRef.current.lastVel.x = xVel;
      localRef.current.lastVel.y = yVel;
    },
    [api, getMoveVelocity]
  );

  useFrame(onFrame);
  useOnFixedUpdate(onFixedUpdate);
};
