/* eslint-disable no-param-reassign */
import { MathUtils } from 'three';
const { lerp } = MathUtils;

export const { degToRad } = MathUtils;

export const vectorToAngle = (x: number, y: number) => {
  return Math.atan2(x, y);
};

export const calculateAngleBetweenVectors = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.atan2(x1 - x2, y1 - y2);
};

export const PI = 3.14159265359;
export const PI_TIMES_TWO = 6.28318530718;
export const PI_TIMES_FOUR = PI * 4;

export const lerpRadians = (angleA: number, angleB: number, lerpFactor: number) => {
  // Lerps from angle a to b (both between 0.f and PI_TIMES_TWO), taking the shortest path

  if (angleA > PI) {
    angleA -= PI_TIMES_TWO;
  }

  if (angleB > PI) {
    angleB -= PI_TIMES_TWO;
  }

  let result;
  const diff = angleB - angleA;
  if (diff < -PI) {
    // lerp upwards past PI_TIMES_TWO
    angleB += PI_TIMES_TWO;
    result = lerp(angleA, angleB, lerpFactor);
    if (result >= PI_TIMES_TWO) {
      result -= PI_TIMES_TWO;
    }
  } else if (diff > PI) {
    // lerp downwards past 0
    angleB -= PI_TIMES_TWO;
    result = lerp(angleA, angleB, lerpFactor);
    if (result < 0) {
      result += PI_TIMES_TWO;
    }
  } else {
    // straight lerp
    result = lerp(angleA, angleB, lerpFactor);
  }

  if (result > PI_TIMES_FOUR || result < -PI_TIMES_FOUR) {
    return angleB;
  }
  return result;
};
