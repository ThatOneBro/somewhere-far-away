import { useFrame } from '@react-three/fiber';
import hotkeys from 'hotkeys-js';
import { useCallback, useEffect } from 'react';
import { Vector2 } from 'three';
import { degToRad, vectorToAngle } from '../../../utils/angles';
import { angleToVector } from '../../../utils/vectors';
import { inputs, isKeyActive } from '../../inputs/config';
import { inputsRawState } from '../../inputs/state';

const vector = new Vector2(0, 0);

const calculateRawInput = () => {
  const up = isKeyActive(inputs.up);
  const down = isKeyActive(inputs.down);
  const right = isKeyActive(inputs.right);
  const left = isKeyActive(inputs.left);
  const space = isKeyActive(inputs.space);

  const vertical = up ? 1 : down ? -1 : 0;
  const horizontal = right ? 1 : left ? -1 : 0;

  if (vertical !== 0 || horizontal !== 0) {
    vector.set(horizontal, vertical);

    const originalAngle = vectorToAngle(horizontal, vertical);

    const rotatedAngle = originalAngle + degToRad(45);

    const [xVel, yVel] = angleToVector(rotatedAngle);

    inputsRawState.active = true;
    inputsRawState.horizontal = xVel * -1;
    inputsRawState.vertical = yVel * -1;
  } else {
    inputsRawState.active = false;
    inputsRawState.horizontal = 0;
    inputsRawState.vertical = 0;
  }

  inputsRawState.jumping = space;
};

interface InputsHandlerProps {
  children: JSX.Element[];
}

const InputsHandler = ({ children }: InputsHandlerProps) => {
  const onFrame = useCallback(() => {
    calculateRawInput();
  }, []);

  useEffect(() => {
    hotkeys('*', '', () => {});
  }, []);

  useFrame(onFrame);

  return <>{children}</>;
};

export default InputsHandler;
