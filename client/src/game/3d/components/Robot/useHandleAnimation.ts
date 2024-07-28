import { useCallback, useEffect, useRef } from 'react';
import { AnimationAction, AnimationMixer } from 'three';

interface PlayAnimationProps {
  delay?: number;
  playOnce?: boolean;
  onEnd?: (() => void) | null;
}

export const useHandleAnimation = (
  actions: AnimationAction[],
  mixer: AnimationMixer,
  moving: boolean,
  jumping: boolean
) => {
  const currentAnimationRef = useRef({
    key: null as string | null,
    animation: null as AnimationAction | null,
    finished: false,
    delayTimer: null as number | null,
  });

  const playAnimation = useCallback(
    (
      animation: AnimationAction,
      fadeInDuration: number,
      fadeDuration: number,
      key?: string,
      { delay = 0, playOnce = false, onEnd = null }: PlayAnimationProps = {}
    ) => {
      const currentAnimation = currentAnimationRef.current;
      if (currentAnimation.animation) {
        if (!animation) {
          if (currentAnimation.key === 'jump') currentAnimation.animation.repetitions = 1;
          return;
        }
        currentAnimation.animation.fadeOut(fadeDuration);
      } else {
        // eslint-disable-next-line no-param-reassign
        fadeInDuration = 0;
      }

      if (!animation || !key) return;

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

      animation.reset().setEffectiveWeight(1).fadeIn(fadeInDuration);

      // eslint-disable-next-line no-param-reassign
      animation.repetitions = playOnce ? 1 : Infinity;
      animation.play();

      currentAnimation.animation = animation;
      currentAnimation.key = key;
      currentAnimation.finished = false;

      if (onEnd) {
        const listener = mixer.addEventListener('finished', (e) => {
          if (e.action === animation) {
            onEnd();
            mixer.removeEventListener('finished', listener);
          }
        });
      }
    },
    [currentAnimationRef, mixer]
  );

  useEffect(() => {
    if (jumping) {
      playAnimation(actions.Jump, 250 / 1000, 250 / 1000, 'jump');
    } else {
      // eslint-disable-next-line no-lonely-if
      if (moving) {
        playAnimation(actions.Running, 250 / 1000, 250 / 1000, 'walk');
      } else {
        playAnimation(null, 0, 0);
        // playAnimation(actions.Standing, 250 / 1000, 250 / 1000, 'standing', { playOnce: true });
        playAnimation(actions.Idle, 250 / 1000, 250 / 1000, 'idle', { delay: 5000 });
      }
    }
  }, [actions, mixer, moving, jumping, playAnimation]);
};
