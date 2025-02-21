/* eslint-disable import/prefer-default-export */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  angleToVector,
  calculateVectorBetweenVectors,
  calculateVectorsDistance,
} from '../../../utils/vectors';
import { degToRad, vectorToAngle } from '../../../utils/angles';

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledJoyContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 250ms ease;
`;

const StyledJoy = styled.div`
  width: 100px;
  height: 100px;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
  position: relative;
`;

const StyledJoyInnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transition: transform 25ms linear;
`;

const StyledJoyInner = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  transform: translate(-50%, -50%);
`;

const StartingPoint = {
  MOUSE: 'MOUSE',
  TOUCH: 'TOUCH',
};

export const joystickState = {
  active: false,
  xVel: 0,
  yVel: 0,
};

const TouchHandler = ({ children }) => {
  const joyStickRef = useRef(null);
  const joyStickInnerRef = useRef(null);

  const localStateRef = useRef({
    mouseStarted: 0,
    mouseActive: false,
    mouseStartX: 0,
    mouseStartY: 0,
    touchStarts: {},
  });

  const localState = localStateRef.current;

  const [startingPoint, setStartingPoint] = useState(null);

  const handleMove = useCallback(
    (x, y, type, id) => {
      let startingX = x;
      let startingY = y;

      if (type === StartingPoint.MOUSE) {
        startingX = localState.mouseStartX;
        startingY = localState.mouseStartY;
      } else if (id != null && localState.touchStarts[id]) {
        startingX = localState.touchStarts[id].x;
        startingY = localState.touchStarts[id].y;
      }

      const handleUpdate = distance => {
        const max = 50;
        const adjustment = distance > max ? max : distance;
        const threshold = adjustment / max;
        const vector = calculateVectorBetweenVectors(startingX, x, startingY, y);
        const xDiff = vector[0] * adjustment;
        const yDiff = vector[1] * adjustment;

        const originalAngle = vectorToAngle(vector[0], vector[1] * -1);
        const rotatedAngle = originalAngle + degToRad(45);

        const [xVel, yVel] = angleToVector(rotatedAngle);

        joystickState.xVel = xVel * threshold;
        joystickState.yVel = yVel * threshold;
        joystickState.active = true;

        if (joyStickInnerRef.current) {
          joyStickInnerRef.current.style.transform = `translate(${xDiff * -1}px, ${yDiff * -1}px)`;
        }
      };

      if (!startingPoint) {
        const distance = calculateVectorsDistance(startingX, x, startingY, y);
        const threshold = 3;

        if (distance > threshold) {
          setStartingPoint({
            type,
            id,
            x: startingX,
            y: startingY,
          });
          handleUpdate(distance);
        }
      } else if (startingPoint.type === type && startingPoint.id === id) {
        const distance = calculateVectorsDistance(startingX, x, startingY, y);
        handleUpdate(distance);
      }
    },
    [startingPoint, setStartingPoint, localState, joyStickInnerRef],
  );

  // const addStartingPoint = useCallback(
  //   (x, y, type, id) => {

  //     // if (startingPoint) return
  //     //
  //     // setStartingPoint({
  //     //     type,
  //     //     id,
  //     //     x,
  //     //     y,
  //     // })
  // }, [startingPoint, setStartingPoint]);

  const removeStartingPoint = useCallback(
    (type, id) => {
      if (startingPoint && startingPoint.type === type && startingPoint.id === id) {
        setStartingPoint(null);
      }
    },
    [startingPoint, setStartingPoint],
  );

  const onStart = useCallback(
    event => {
      if (event.type === 'mousedown') {
        const x = event.clientX;
        const y = event.clientY;
        localState.mouseStartX = x;
        localState.mouseStartY = y;
        localState.mouseStarted = Date.now();
        localState.mouseActive = true;
        // addStartingPoint(x, y, StartingPoint.MOUSE);
      } else if (event.type === 'touchstart') {
        if (event.changedTouches.length > 0) {
          const touch = event.changedTouches[0];
          const { identifier, clientX, clientY } = touch;
          localState.touchStarts[identifier] = {
            started: Date.now(),
            x: clientX,
            y: clientY,
          };
          // addStartingPoint(clientX, clientY, StartingPoint.TOUCH, identifier);
        }
      }
    },
    [localState],
  );

  const onEnd = useCallback(
    event => {
      if (event.type === 'mouseup') {
        localState.mouseActive = false;
        removeStartingPoint(StartingPoint.MOUSE);
      } else if (event.type === 'touchend') {
        Object.values(event.changedTouches).forEach(touch => {
          const { identifier } = touch;
          delete localState.touchStarts[identifier];
          removeStartingPoint(StartingPoint.TOUCH, identifier);
        });
      }
    },
    [localState, removeStartingPoint],
  );

  const onMove = useCallback(
    event => {
      if (event.type === 'mousemove' && localState.mouseActive) {
        handleMove(event.clientX, event.clientY, StartingPoint.MOUSE);
      } else if (event.type === 'touchmove') {
        Object.values(event.changedTouches).forEach(touch => {
          const { identifier, clientX, clientY } = touch;
          handleMove(clientX, clientY, StartingPoint.TOUCH, identifier);
        });
      }
    },
    [handleMove, localState.mouseActive],
  );

  useEffect(() => {
    const joystick = joyStickRef.current;
    if (!joystick) return;

    if (startingPoint) {
      joystick.style.transform = `translate(${startingPoint.x}px, ${startingPoint.y}px)`;
      joystick.style.opacity = '1';
    } else {
      joystick.style.opacity = '0';
    }
  }, [startingPoint, joyStickRef]);

  useEffect(() => {
    if (!startingPoint) {
      joystickState.active = false;
    }
  }, [startingPoint]);

  return (
    <StyledContainer
      onTouchStartCapture={onStart}
      onMouseDownCapture={onStart}
      onTouchEndCapture={onEnd}
      onMouseUpCapture={onEnd}
      onTouchMoveCapture={onMove}
      onMouseMoveCapture={onMove}
    >
      {children}
      <StyledJoyContainer ref={joyStickRef}>
        <StyledJoy>
          <StyledJoyInnerWrapper ref={joyStickInnerRef}>
            <StyledJoyInner />
          </StyledJoyInnerWrapper>
        </StyledJoy>
      </StyledJoyContainer>
    </StyledContainer>
  );
};

TouchHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TouchHandler;
