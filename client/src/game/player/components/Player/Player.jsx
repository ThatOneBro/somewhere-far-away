import React, { Suspense, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
// import { isEmpty } from 'lodash';
import { useSnapshot } from 'valtio';
import { useBodyApi, useSyncBody, SyncedComponent } from 'rgg-engine';
import { Html } from '@react-three/drei';
// import { bindActionCreators } from 'redux';
import { useFrame } from '@react-three/fiber';
// import { useSpring, config } from '@react-spring/core';
// import { a } from '@react-spring/three';
import * as THREE from 'three';

// import { degToRad } from '../../../utils/angles';
import { lerpRadians } from '../../../utils/angles';

import EmoteDisplayer from '../../../utils/components/EmoteDisplayer';

import { useController } from './hooks/useController';
import { getPlayerUuid } from '../../../meshes/uuids';
import Robot, { TEXT_COLORS } from '../../../3d/components/Robot/RobotExpressive2';

import ProfileEditor from '../../../../components/ProfileModal/ProfileEditor';
import useLocalState from './hooks/useLocalState';

import api from '../../../../api';

import useStore from '../../../../components/GraphView/PlayerLayer/store';

const PlayerEditor = ({ id, playerData, updatePreview }) => {
  const { playerEditing, setPlayerEditing, accessToken } = useStore(
    useCallback(
      (state) => ({
        playerEditing: state.playerEditing,
        setPlayerEditing: state.setPlayerEditing,
        accessToken: state.accessToken,
      }),
      []
    )
  );
  const handleClose = useCallback(() => setPlayerEditing(false), [setPlayerEditing]);
  const updatePreviewColor = useCallback((color) => updatePreview({ color }), [updatePreview]);
  const updatePreviewHat = useCallback((hat) => updatePreview({ hat }), [updatePreview]);
  const updatePreviewWide = useCallback((wide) => updatePreview({ wide }), [updatePreview]);
  const updatePlayer = useCallback(
    ({ color, hat, wide }) =>
      api.updatePlayer(
        {
          userId: id,
          frames: [],
          appearance: { ...playerData.appearance, color, hat, wide },
        },
        { Authorization: `Bearer ${accessToken}` }
      ),
    [id, playerData.appearance, accessToken]
  );

  return playerEditing ? (
    <group position={[-2, -0.5, -2]}>
      <Html center>
        <ProfileEditor
          userId={id}
          localPlayer={playerData}
          handleClose={handleClose}
          updatePreviewColor={updatePreviewColor}
          updatePreviewHat={updatePreviewHat}
          updatePreviewWide={updatePreviewWide}
          updatePlayer={updatePlayer}
        />
      </Html>
    </group>
  ) : null;
};

const LocalController = ({ id, fwdRef, innerRef, localState }) => {
  const timer = useRef();

  const localStateProxy = useSnapshot(localState);

  useSyncBody(id, fwdRef, { applyRotation: false });

  const bodyApi = useBodyApi(id);
  useController(id, fwdRef, innerRef, bodyApi, localState);

  const { geckosChannel } = useStore(useCallback((state) => ({ geckosChannel: state.geckosChannel }), []));
  // const { accessToken } = useStore(useCallback(state => ({ accessToken: state.accessToken }), []));

  const updatePlayerPositionRef = useRef();
  updatePlayerPositionRef.current = async () => {
    // if (!accessToken) return;
    // if (isNil(playerData.walking)) return;
    // await api.updatePlayer(
    //   {
    //     userId: id,
    //     walking: localStateProxy.moving,
    //     jumping: localStateProxy.jumping,
    //     position: { x: fwdRef.current.position.x, z: fwdRef.current.position.z },
    //     rotation: innerRef.current.rotation.y,
    //   },
    //   { Authorization: `Bearer ${accessToken}` },
    // );
    if (!geckosChannel) return;
    const { x, z } = fwdRef.current.position;
    // eslint-disable-next-line no-underscore-dangle
    geckosChannel._raw.emit('clientUpdate', {
      id,
      walk: localStateProxy.moving,
      jump: localStateProxy.jumping,
      x,
      z,
      rot: innerRef.current.rotation.y,
    });
  };
  // [id, localStateProxy.moving, localStateProxy.jumping, updatePlayer, playerData.walking],

  useEffect(() => {
    const tickRate = 100;
    const cb = () => {
      if (!fwdRef.current || !innerRef.current) {
        timer.current = setTimeout(cb, tickRate);
        return;
      }
      updatePlayerPositionRef.current();
      timer.current = setTimeout(cb, tickRate);
    };

    cb();

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [fwdRef, innerRef]);

  return <SyncedComponent id={id} type="player" playerId={id} />;
};

const RemotePlayerController = ({ id, fwdRef, innerRef, walking, jumping, localState, snapshotRef }) => {
  const onFrame = useCallback(() => {
    // eslint-disable-next-line no-param-reassign
    localState.moving = walking;
    // eslint-disable-next-line no-param-reassign
    localState.jumping = jumping;

    if (!snapshotRef || !snapshotRef.current || !snapshotRef.current[id]) return;
    // eslint-disable-next-line no-param-reassign
    localState.moving = snapshotRef.current[id].walking;
    // eslint-disable-next-line no-param-reassign
    localState.jumping = snapshotRef.current[id].jumping;

    if (!fwdRef || !fwdRef.current) return;
    // eslint-disable-next-line no-param-reassign
    fwdRef.current.position.x = THREE.MathUtils.lerp(
      fwdRef.current.position.x,
      snapshotRef.current[id].position.x,
      0.15
    );
    // eslint-disable-next-line no-param-reassign
    fwdRef.current.position.z = THREE.MathUtils.lerp(
      fwdRef.current.position.z,
      snapshotRef.current[id].position.z,
      0.15
    );

    if (!innerRef || !innerRef.current) return;
    // eslint-disable-next-line no-param-reassign
    innerRef.current.rotation.y = lerpRadians(innerRef.current.rotation.y, snapshotRef.current[id].rotation, 0.15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useFrame(onFrame);

  return null;
};

const Player = React.forwardRef(
  ({ id = getPlayerUuid(), local = false, playerData = null, snapshotRef = null, position, fwdInnerRef }, ref) => {
    const localRef = useRef();
    const usedRef = ref || localRef;
    const innerRef = useRef();
    const usedInnerRef = fwdInnerRef || innerRef;
    // useSubscribeMesh(uuid, ref.current, false);
    const localState = useLocalState();
    const localStateProxy = useSnapshot(localState);

    const [message, setMessage] = useState(null);
    const messageTimer = useRef(null);

    const { playerEditing } = useStore(useCallback((state) => ({ playerEditing: state.playerEditing }), []));

    const [preview, setPreview] = useState(null);

    const updatePreview = useCallback((update) => setPreview((s) => ({ ...s, ...update })), []);

    const playerColor = useMemo(() => {
      return playerEditing && preview ? preview.color : playerData.appearance.color;
    }, [playerEditing, preview, playerData]);

    const playerHat = useMemo(() => {
      return playerEditing && preview ? preview.hat : playerData.appearance.hat;
    }, [playerEditing, preview, playerData]);

    const playerWide = useMemo(() => {
      return playerEditing && preview ? preview.wide : playerData.appearance.wide;
    }, [playerEditing, preview, playerData]);

    useEffect(() => {
      if (!playerData.lastMsg) return;
      if (playerData.lastMsg.showTil >= Date.now()) {
        if (message && playerData.lastMsg.id === message.id) return;
        setMessage(playerData.lastMsg);
      }
    }, [message, playerData]);

    useEffect(() => {
      if (!message) return;
      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }
      messageTimer.current = setTimeout(() => {
        setMessage(null);
      }, playerData.lastMsg.showTil - Date.now());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    const [emote, setEmote] = useState(null);
    const emoteTimer = useRef(null);

    useEffect(() => {
      if (!playerData.lastEmote) return;
      if (playerData.lastEmote.showTil >= Date.now()) {
        if (emote && playerData.lastEmote.name === emote.name) return;
        setEmote(playerData.lastEmote.name);
      }
    }, [emote, playerData]);

    useEffect(() => {
      if (!emote) return;
      if (emoteTimer.current) {
        clearTimeout(emoteTimer.current);
      }
      emoteTimer.current = setTimeout(() => {
        setEmote(null);
      }, playerData.lastEmote.showTil - Date.now());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emote]);

    useEffect(() => {
      localState.position.set(position[0], position[1], position[2]);
    }, [position, localState]);

    // // useStoreMesh(uuid, ref.current);

    return (
      <>
        {local ? (
          <LocalController
            id={id}
            fwdRef={usedRef}
            innerRef={usedInnerRef}
            localState={localState}
            playerData={playerData}
          />
        ) : (
          <RemotePlayerController
            id={id}
            fwdRef={usedRef}
            innerRef={usedInnerRef}
            walking={playerData.walking || false}
            jumping={playerData.jumping || false}
            localState={localState}
            snapshotRef={snapshotRef}
          />
        )}
        <group ref={usedRef} position={localStateProxy.position}>
          {local && <PlayerEditor id={id} playerData={playerData} updatePreview={updatePreview} />}
          {playerData && (
            <group position={[0, 3.25, 0]}>
              <Html center>
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    paddingLeft: '5px',
                    paddingRight: '5px',
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderRadius: 3,
                    // color: TEXT_COLORS[playerData.appearance.color],
                    color: '#eee',
                    fontSize: 13,
                    fontWeight: 400,
                    fontFamily: 'Inter',
                    userSelect: 'none',
                    position: 'relative',
                  }}
                >
                  {playerData.user ? playerData.user.username : playerData.username}
                </div>
              </Html>
            </group>
          )}
          {/* <EmoteDisplayer
            emote={emote || playerData.lastEmote ? playerData.lastEmote.name : null}
            displaying={Boolean(emote)}
            position={[-0.25, 4.75, -0.25]}
            size={50}
          /> */}
          {message && (
            <group position={[0.75, 3.25, 0.75]}>
              <Html>
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    minHeight: '60px',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: 14,
                    position: 'relative',
                    overflow: 'auto',
                  }}
                >
                  {playerData && (
                    <h2
                      className="player-name"
                      style={{
                        color: TEXT_COLORS[playerData.appearance.color],
                        fontWeight: 500,
                        padding: 0,
                        display: 'inline-block',
                      }}
                    >
                      {playerData.user.username}
                    </h2>
                  )}
                  <div style={{ display: 'flex', maxWidth: '300px' }}>
                    <p
                      style={{
                        display: 'inline-block',
                        wordWrap: 'break-word',
                        flex: 1,
                      }}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              </Html>
            </group>
          )}
          <group ref={usedInnerRef}>
            <Suspense fallback={null}>
              <Robot
                color={playerColor}
                moving={localStateProxy.moving}
                jumping={localStateProxy.jumping}
                scale={[playerWide ? 0.6 : 0.3, 0.3, 0.3]}
                hat={playerHat}
              />
            </Suspense>
          </group>
        </group>
      </>
    );
  }
);

export default Player;
