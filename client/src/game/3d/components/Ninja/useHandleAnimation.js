import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useHandleAnimation = (actions, moving) => {
  const currentAnimationRef = useRef({
    key: null,
    animation: null,
    finished: false,
  });

  const playAnimation = useCallback(
    (animation, fadeInDuration, fadeDuration, key) => {
      const currentAnimation = currentAnimationRef.current;
      if (currentAnimation.animation) {
        currentAnimation.animation.fadeOut(fadeDuration);
      } else {
        // eslint-disable-next-line no-param-reassign
        fadeInDuration = 0;
      }
      animation
        .reset()
        .setEffectiveWeight(1)
        .fadeIn(fadeInDuration)
        .play();
      currentAnimation.animation = animation;
      currentAnimation.key = key;
      currentAnimation.finished = false;
    },
    [currentAnimationRef],
  );

  useEffect(() => {
    if (moving) {
      playAnimation(actions.Walk, 250 / 1000, 250 / 1000, 'walk');
    } else {
      playAnimation(actions.Idle, 250 / 1000, 250 / 1000, 'idle');
    }
  }, [actions, moving, playAnimation]);
};
