import React, { Suspense, useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Vec2 } from 'planck-js';
import { usePlanckBody } from 'rgg-engine';
import { Html } from '@react-three/drei';

import ReactPlayer from 'react-player';
import useSound from 'use-sound';

import { isNil } from 'lodash';

import { degToRad } from '../../../../utils/angles';
import { usePrevious } from '../../../../../hooks';

import BoomboxMdl from '../../../../3d/components/Boombox/Boombox2';

import CassettePlayerSound from '../../../../../assets/sounds/cassette-player-1.mp3';
import CassetteEject from '../../../../../assets/sounds/cassette-ejecting.mp3';
import Clickable from '../../../../utils/components/Clickable';

const Boombox = ({ radioState, setRadioOnState, fetchRadioOnState }) => {
  const playerRef = useRef();

  const isRadioOn = radioState.onState;

  const prevRadioState = usePrevious(isRadioOn);
  const [shouldTurnOn, setShouldTurnOn] = useState(false);
  const [localIsOn, setLocalIsOn] = useState(null);
  // const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [userInput, setUserInput] = useState(false);
  const [duration, setDuration] = useState(null);

  const listenersRef = useRef({});

  // useEffect(() => {
  //   const timer = setTimeout(() => setShouldLoad(true), 1000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  useEffect(() => {
    if (!listenersRef.current) return;
    listenersRef.current.click = () => {
      setUserInput(true);
    };
    document.addEventListener('click', listenersRef.current.click);

    listenersRef.current.hover = () => {
      setUserInput(true);
    };
    document.addEventListener('keydown', listenersRef.current.hover);
  }, []);

  useEffect(() => {
    if (!userInput || listenersRef.current === null) return;
    document.removeEventListener('click', listenersRef.current.click);
    document.removeEventListener('keydown', listenersRef.current.hover);
    listenersRef.current = null;
  }, [userInput]);

  const flagIsReady = useCallback(() => setReady(true), []);
  // const jigglePause = useCallback(() => {
  //   setReady(false);
  //   setTimeout(() => {
  //     setReady(true);
  //   }, 600);
  // }, []);

  // const startRetry = useCallback(() => setRetrying(true), []);

  // useEffect(() => {
  //   if (!retrying) return () => {};
  //   console.log('retrying');
  //   setReady(false);
  //   const timer = setTimeout(() => {
  //     setReady(true);
  //   }, 500);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [retrying]);

  // const stopRetrying = useCallback(() => setRetrying(false), []);

  const cassetteStartPlaying = useRef(false);
  const [playCassettePlayer] = useSound(CassettePlayerSound, {
    onplay: () => {
      cassetteStartPlaying.current = true;
    },
    onend: () => {
      cassetteStartPlaying.current = false;
      setShouldTurnOn(true);
    },
  });

  const cassetteEjectPlaying = useRef(false);
  const [playCassetteEject] = useSound(CassetteEject, {
    onplay: () => {
      cassetteEjectPlaying.current = true;
    },
    onend: () => {
      cassetteEjectPlaying.current = false;
    },
  });

  const toggleBoomboxOn = useCallback(() => {
    if (isNil(isRadioOn)) return;
    setRadioOnState({ onState: !isRadioOn });
  }, [isRadioOn, setRadioOnState]);

  const getCurrentPlayHead = useCallback(() => {
    if (!duration || !radioState.timestamp) return null;
    const lastLoop = Math.floor(radioState.timestamp / duration);
    const timestamp = radioState.timestamp - lastLoop * duration;
    return timestamp;
  }, [duration, radioState.timestamp]);

  const startRadio = useCallback(() => {
    if (!playerRef.current) return;
    // const duration = playerRef.current.getDuration();
    // if (!duration) {
    //   setLocalIsOn(true);
    //   return;
    // }
    // playerRef.current.seekTo(duration, 'seconds');
    const timestamp = radioState.timestamp || 0;
    playerRef.current.seekTo(timestamp, 'seconds');
    fetchRadioOnState();
    setLocalIsOn(true);
  }, [setLocalIsOn, radioState.timestamp, fetchRadioOnState]);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(getCurrentPlayHead(), 'seconds');
  }, [getCurrentPlayHead]);

  useEffect(() => {
    if (prevRadioState === isRadioOn) return;
    if (isNil(localIsOn)) {
      setLocalIsOn(isRadioOn);
      return;
    }
    switch (isRadioOn) {
      case true:
        playCassettePlayer();
        break;
      case false:
        setLocalIsOn(false);
        playCassetteEject();
        break;
      default:
    }
  }, [prevRadioState, localIsOn, isRadioOn, playCassettePlayer, playCassetteEject]);

  useEffect(() => {
    if (!shouldTurnOn) return;
    startRadio();
    setShouldTurnOn(false);
  }, [shouldTurnOn, startRadio]);

  usePlanckBody(
    () => ({
      body: {
        type: 'static',
        position: Vec2(8, 9),
        angle: degToRad(-75),
      },
      fixtures: [
        {
          shape: 'Box',
          args: [0.4, 0.1],
          fixtureOptions: {},
        },
      ],
    }),
    {},
  );

  return (
    <>
      <Html>
        {userInput && (
          <ReactPlayer
            // url="https://www.youtube.com/watch?v=7NOSDKb0HlU"
            // url="https://www.youtube.com/watch?v=5yx6BWlEVcY"
            // url="https://www.youtube.com/watch?v=g-pqmuYPHPs"
            url="https://www.youtube.com/watch?v=GvSrDbr0KvI"
            // url="https://twitch.com/trainwreckstv"
            // config={{ youtube: { playerVars: { showinfo: 1 }, host: 'https://www.youtube.com' } }}
            playing={localIsOn && ready}
            volume={0.1}
            style={{ display: 'none' }}
            ref={playerRef}
            onReady={flagIsReady}
            onDuration={dur => setDuration(dur)}
          />
        )}
      </Html>
      <Suspense fallback={null}>
        <Clickable>
          <BoomboxMdl
            onClick={userInput ? toggleBoomboxOn : undefined}
            position={[8, 0, 9]}
            rotation={[0, degToRad(-75), 0]}
          />
        </Clickable>
      </Suspense>
    </>
  );
};

Boombox.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  radioState: PropTypes.object.isRequired,
  setRadioOnState: PropTypes.func.isRequired,
  fetchRadioOnState: PropTypes.func.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

// Boombox.defaultProps = {
//   radioState: {
//     onState: null,
//     timestamp: null,
//   },
// };

export default Boombox;
