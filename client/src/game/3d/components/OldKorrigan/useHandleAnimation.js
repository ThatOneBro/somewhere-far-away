import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useHandleAnimation = (actions, waiting = false) => {
  const currentAnimationRef = useRef({
    key: null,
    animation: null,
    finished: false,
    delayTimer: null,
  });

  const playAnimation = useCallback(
    (
      animation,
      fadeInDuration,
      fadeDuration,
      key,
      { delay, playOnce } = { delay: 0, playOnce: false },
    ) => {
      const currentAnimation = currentAnimationRef.current;
      if (currentAnimation.animation) {
        if (!animation) {
          return;
        }
        currentAnimation.animation.fadeOut(fadeDuration);
      } else {
        // eslint-disable-next-line no-param-reassign
        fadeInDuration = 0;
      }

      if (!animation) return;

      if (currentAnimation.delayTimer) {
        clearTimeout(currentAnimation.delayTimer);
        currentAnimation.delayTimer = null;
      }

      if (delay) {
        currentAnimation.delayTimer = setTimeout(() => {
          playAnimation(animation, fadeInDuration, fadeDuration, key);
        }, delay);
        return;
      }

      animation
        .reset()
        .setEffectiveWeight(1)
        .fadeIn(fadeInDuration);

      // eslint-disable-next-line no-param-reassign
      animation.repetitions = playOnce ? 1 : Infinity;
      animation.play();

      currentAnimation.animation = animation;
      currentAnimation.key = key;
      currentAnimation.finished = false;
    },
    [currentAnimationRef],
  );

  useEffect(() => {
    if (waiting) {
      playAnimation(actions.pose_vieux, 250 / 1000, 250 / 1000, 'waiting');
    } else {
      playAnimation(null);
    }
  }, [actions, waiting, playAnimation]);
};
