import { useCallback, useEffect, useRef, useState } from 'react';

import { usePrevious } from '../../../../hooks';

const CLEARED_ANIM = {
  key: null,
  animation: null,
  finished: false,
};

const cloneObj = obj => JSON.parse(JSON.stringify(obj));

// eslint-disable-next-line import/prefer-default-export
export const useHandleAnimation = (actions, mixer, moving, jumping) => {
  const [wasMoving, setWasMoving] = useState(false);
  const [wasJumping, setWasJumping] = useState(false);
  const movingTimer = useRef(null);
  const [currAnim, setCurrAnim] = useState(null);
  const prevAnim = usePrevious(currAnim);

  useEffect(() => {
    if (prevAnim === 'walk' && !jumping) {
      setWasJumping(false);
    }
  }, [jumping, currAnim, prevAnim]);

  useEffect(() => {
    if (!moving) {
      movingTimer.current = setTimeout(() => {
        setWasMoving(false);
      }, 150);
      return;
    }
    if (movingTimer.current) {
      clearTimeout(movingTimer.current);
      movingTimer.current = null;
    }
    setWasMoving(moving);
  }, [moving]);

  useEffect(() => {
    if (wasJumping || !jumping) return;
    setWasJumping(true);
  }, [wasJumping, jumping, moving]);

  const onJumpEnd = useCallback(() => {
    if (!jumping) setWasJumping(false);
  }, [jumping]);

  const onJumpEndRef = useRef(onJumpEnd);

  useEffect(() => {
    onJumpEndRef.current = onJumpEnd;
  }, [onJumpEnd]);

  const currentAnimationRef = useRef(cloneObj(CLEARED_ANIM));
  const delayTimerRef = useRef(null);

  const playAnimation = useCallback(
    (
      animation = null,
      fadeInDuration,
      fadeDuration,
      key = null,
      { delay = 0, playOnce = false, onEnd = null, speed = 1 } = {},
    ) => {
      const currentAnimation = currentAnimationRef.current;
      if (currentAnimation.animation) {
        // if (currentAnimation.key === key && currentAnimation.animation.isRunning()) return;
        if (currentAnimation.key !== key) {
          setCurrAnim(key);
        }
        if (!animation) {
          if (currentAnimation.key === 'jump') currentAnimation.animation.repetitions = 1;
          return;
        }
        currentAnimation.animation.fadeOut(fadeDuration);
      } else {
        // eslint-disable-next-line no-param-reassign
        fadeInDuration = 0;
      }

      if (!animation) return;

      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }

      if (onEnd) {
        const listener = mixer.addEventListener('loop', e => {
          if (e.action === animation) {
            if (e.action === currentAnimationRef.current.animation) {
              onEnd();
            }
            mixer.removeEventListener('loop', listener);
          }
        });
      }

      if (delay) {
        delayTimerRef.current = setTimeout(() => {
          playAnimation(animation, fadeInDuration, fadeDuration, key);
        }, delay);
        return;
      }

      animation
        .reset()
        .setEffectiveWeight(1)
        .fadeIn(fadeInDuration)
        .setEffectiveTimeScale(speed);

      // eslint-disable-next-line no-param-reassign
      animation.repetitions = playOnce ? 1 : Infinity;
      animation.play();

      currentAnimation.animation = animation;
      currentAnimation.key = key;
      currentAnimation.finished = false;
    },
    [currentAnimationRef, mixer],
  );

  useEffect(() => {
    if (jumping) {
      if (!moving && !wasMoving) {
        playAnimation(actions.Jump, 250 / 1000, 250 / 1000, 'jump', {
          onEnd: () => onJumpEndRef.current(),
          speed: 1.3,
        });
      } else {
        playAnimation(actions.Running_Jump, 250 / 1000, 250 / 1000, 'running_jump', {
          onEnd: () => onJumpEndRef.current(),
          speed: 1,
        });
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (moving) {
        playAnimation(actions.Running, 250 / 1000, 250 / 1000, 'walk');
      } else if (!wasJumping && !wasMoving) {
        playAnimation(null);
        const onEnd = () => {
          playAnimation(null);
          playAnimation(actions.Idle, 250 / 1000, 250 / 1000, 'idle', {
            delay: 5000,
            onEnd,
            playOnce: true,
          });
        };
        // playAnimation(actions.Standing, 250 / 1000, 250 / 1000, 'standing', { playOnce: true });
        playAnimation(actions.Idle, 250 / 1000, 250 / 1000, 'idle', {
          delay: 5000,
          onEnd,
          playOnce: true,
        });
      }
    }
  }, [actions, mixer, moving, jumping, wasJumping, wasMoving, playAnimation]);
};
