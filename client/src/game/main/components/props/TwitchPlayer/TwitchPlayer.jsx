import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
// import * as THREE from 'three';
// import { useFrame } from '@react-three/fiber';
import { Html } from "@react-three/drei";
import { TwitchPlayer, TwitchChat } from "react-twitch-embed";
import { Button, IconButton } from "@material-ui/core";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SoundOffIcon from "@material-ui/icons/VolumeOff";
import SoundOnIcon from "@material-ui/icons/VolumeUp";

// const vec = new THREE.Vector3();

const OurTwitchPlayer = React.forwardRef(
  (
    { twitchState, setTwitchState, toggleFocusTwitch, focused, ...props },
    ref
  ) => {
    const [channel, setChannel] = useState(twitchState.streamer || "xQc");
    const localRef = useRef(null);
    const usedRef = ref || localRef;

    const [player, setPlayer] = useState(null);

    const [enabled, setEnabled] = useState(false);
    const [display, setDisplay] = useState(false);

    // const [lastCamera, setLastCamera] = useState(null);

    const [untoggled, setUntoggled] = useState(true);

    const setMuted = useCallback(
      (muted) => setTwitchState({ muted, paused: twitchState.paused }),
      [setTwitchState, twitchState.paused]
    );

    const setPaused = useCallback(
      (paused) => setTwitchState({ paused, muted: twitchState.muted }),
      [setTwitchState, twitchState.muted]
    );

    useEffect(() => {
      setChannel(twitchState.streamer);
    }, [twitchState.streamer]);

    const onReady = useCallback((passedPlayer) => {
      setPlayer(passedPlayer);
    }, []);

    useEffect(() => {
      if (focused && untoggled) setUntoggled(false);
    }, [focused, untoggled]);

    useEffect(() => {
      if (twitchState.on) {
        setEnabled(true);
      }
      setDisplay(twitchState.on);
    }, [twitchState.on, player]);

    useEffect(() => {
      if (!player) return;
      const qualities = player.getQualities();
      let canUse480 = false;
      qualities.forEach((quality) => {
        if (quality.name === "480p") {
          canUse480 = true;
        }
      });

      if (canUse480) player.setQuality("480p30");
      player.setVolume(0.5);
    }, [player]);

    useEffect(() => {
      if (!player) return;
      switch (twitchState.muted) {
        case true:
          if (!player.getMuted()) player.setMuted(true);
          break;
        case false:
          if (player.getMuted()) player.setMuted(false);
          break;
        default:
      }
    }, [player, twitchState.muted]);

    useEffect(() => {
      if (!player) return;
      switch (twitchState.paused) {
        case true:
          if (!player.isPaused()) player.pause();
          break;
        case false:
          if (player.isPaused()) player.play();
          break;
        default:
      }
    }, [player, twitchState.paused]);

    // useFrame(state => {
    //   if (!lastCamera) {
    //     setLastCamera({
    //       pos: new THREE.Vector3().copy(state.camera.position),
    //       fov: state.camera.fov,
    //     });
    //   }
    //   if (!usedRef.current || untoggled) return;
    //   const step = 0.1;
    //   // eslint-disable-next-line no-param-reassign
    //   state.camera.fov = THREE.MathUtils.lerp(
    //     state.camera.fov,
    //     focused ? 20 : lastCamera.fov,
    //     step,
    //   );
    //   state.camera.position.lerp(
    //     vec.set(
    //       focused ? usedRef.current.position.x - 20 : lastCamera.pos.x,
    //       focused ? usedRef.current.position.y : lastCamera.pos.y,
    //       focused ? usedRef.current.position.z + 25 : lastCamera.pos.z,
    //     ),
    //     step,
    //   );
    //   if (focused) {
    //     state.camera.lookAt(usedRef.current.position);
    //     state.camera.updateProjectionMatrix();
    //   }
    // });

    return enabled ? (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <mesh ref={usedRef} {...props} visible={display}>
        <planeGeometry args={[1920 / 150, 1080 / 200, 60, 40]} />
        <meshStandardMaterial color="black" />
        <Html distanceFactor={1} scale={4} transform>
          <div
            style={{
              position: "relative",
              display: display ? "block" : "none",
            }}
          >
            {player && (
              <>
                <div style={{ position: "absolute", left: 10, top: 0 }}>
                  <Button
                    onClick={toggleFocusTwitch}
                    style={{ color: "white" }}
                  >
                    Focus
                  </Button>
                </div>
                <div style={{ position: "absolute", left: 10, bottom: 0 }}>
                  <IconButton onClick={() => setMuted(!twitchState.muted)}>
                    {twitchState.muted ? (
                      <SoundOffIcon style={{ color: "white" }} />
                    ) : (
                      <SoundOnIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                  <IconButton onClick={() => setPaused(!twitchState.paused)}>
                    {twitchState.paused ? (
                      <PlayArrowIcon style={{ color: "white" }} />
                    ) : (
                      <PauseIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                </div>
              </>
            )}
            <div style={{ display: "flex" }}>
              <div>
                <TwitchPlayer
                  channel={channel}
                  hideControls
                  onReady={onReady}
                />
              </div>
              <div>
                <TwitchChat channel={channel} theme="dark" />
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    ) : null;
  }
);

OurTwitchPlayer.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  twitchState: PropTypes.object.isRequired,
  setTwitchState: PropTypes.func.isRequired,
  toggleFocusTwitch: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default OurTwitchPlayer;
