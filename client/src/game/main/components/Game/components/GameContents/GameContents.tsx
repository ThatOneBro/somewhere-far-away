import { MutableRefObject, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { Object3D } from 'three';

// import Fog from '../../../../../elements/Fog/Fog';
import Floor from '../../../Floor/Floor';
import Lights from '../../../Lights/Lights';
import Water from '../../../Water/Water';

// import OldKorrigan from '../../../npcs/OldKorrigan';
// import BeachBall from '../../../props/BeachBall/BeachBall';
// import Display from '../../../props/Display/Display';
// import PalmLong from '../../../props/PalmLong/PalmLong';
// import PalmShort from '../../../props/PalmShort/PalmShort';
// import ShipWreck from '../../../props/ShipWreck/ShipWreck';
// import Shungite from '../../../props/Shungite/Shungite';
import Tower from '../../../props/Tower/Tower';
// import Entities from '../Entities/Entities';

import {
  useSetCameraAngle,
  useSetCameraFollowTarget,
} from '../../../../../elements/camera/components/CameraProvider/CameraProvider';

// import StoneFormation from '../../../props/StoneFormation/StoneFormation';

const CAMERA_ANGLE_CONFIG = {
  player: 'high',
  ship: 'ship',
  tower: 'lowWide',
} as const;

interface GameContentsProps {
  localPlayerRef: MutableRefObject<Object3D | null>;
}

const GameContents = ({ localPlayerRef }: GameContentsProps) => {
  const [currentTarget, setCurrentTarget] = useState('player');

  const twitchRef = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const slotsRef = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const slots2Ref = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const slots3Ref = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const shipRef = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const towerRef = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const portrait1Ref = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const portrait2Ref = useRef<Object3D>(null) as MutableRefObject<Object3D>;
  const portrait3Ref = useRef<Object3D>(null) as MutableRefObject<Object3D>;

  const cameraTargets = useMemo(
    () => ({
      player: localPlayerRef,
      twitch: twitchRef,
      slots: slotsRef,
      slots2: slots2Ref,
      slots3: slots3Ref,
      ship: shipRef,
      tower: towerRef,
      portrait1: portrait1Ref,
      portrait2: portrait2Ref,
      portrait3: portrait3Ref,
    }),
    [localPlayerRef]
  );

  useSetCameraAngle(CAMERA_ANGLE_CONFIG[currentTarget as keyof typeof CAMERA_ANGLE_CONFIG] || 'head-on');
  useSetCameraFollowTarget(currentTarget ? cameraTargets[currentTarget as keyof typeof cameraTargets] || null : null);

  // const toggleFocusShip = useCallback(() => {
  //   setCurrentTarget(currentTarget === 'ship' ? 'player' : 'ship');
  // }, [currentTarget]);

  const toggleFocusTower = useCallback(() => {
    setCurrentTarget(currentTarget === 'tower' ? 'player' : 'tower');
  }, [currentTarget]);

  // const togglePortrait = useCallback(
  //   (index) => {
  //     setCurrentTarget(currentTarget === `portrait${index}` ? 'player' : `portrait${index}`);
  //   },
  //   [currentTarget]
  // );

  return (
    <>
      <Lights />
      {/* <Fog /> */}
      <Water />
      <Suspense fallback={null}>
        <Floor />
      </Suspense>
      {/* <ShipWreck
        ref={shipRef}
        position={[25, -7, -25]}
        rotation={[0, degToRad(33), 0]}
        toggleFocusShip={toggleFocusShip}
      /> */}
      <Tower ref={towerRef} position={[-2, -1, -14]} toggleFocusTower={toggleFocusTower} />
      {/* <Suspense fallback={null}>
        <group position={[-30, 3, 0]}>
          <Display
            ref={portrait1Ref}
            idx={1}
            position={[-2, 0, -2]}
            rotation={[0, degToRad(-45), 0]}
            imageName="frankenbaj"
            toggleFocus={togglePortrait}
          />
          <Display
            ref={portrait2Ref}
            idx={2}
            position={[0, 0, 0]}
            rotation={[0, degToRad(-45), 0]}
            toggleFocus={togglePortrait}
          />
          <Display
            ref={portrait3Ref}
            idx={3}
            position={[2, 0, 2]}
            rotation={[0, degToRad(-45), 0]}
            imageName="pepeposting"
            toggleFocus={togglePortrait}
          />
        </group>
      </Suspense> */}
      {/* <OldKorrigan position={[-5, 0, -5]} />
      <StoneFormation position={[19, -4, -30]} rotation={[0, degToRad(-66), 0]} scale={2} solid={false} />
      <PalmShort position={[5, 0, -5]} rotation={[0, degToRad(-60), 0]} />
      <PalmShort position={[12, 0, -4]} />
      <PalmLong position={[-5, 0, 15]} />
      <PalmLong position={[-10, 0, 7]} rotation={[0, degToRad(-60), 0]} />
      <PalmShort position={[12, 0, -12]} rotation={[0, degToRad(33), 0]} />
      <PalmShort position={[-12, 0, 12]} rotation={[0, degToRad(33), 0]} />
      <PalmShort position={[-15, 0, -15]} rotation={[0, degToRad(66), 0]} />
      <PalmLong position={[-10, 0, -7]} rotation={[0, degToRad(45), 0]} />
      <PalmLong position={[-20, 0, 10]} rotation={[0, degToRad(33), 0]} />
      <PalmLong position={[-20, 0, -10]} rotation={[0, degToRad(-33), 0]} />
      <StoneFormation position={[-15, -4, -10]} rotation={[0, degToRad(-66), 0]} />
      <StoneFormation position={[-22, -2, 15]} rotation={[0, degToRad(-66), 0]} />

      <PalmLong position={[10, 0, 9]} rotation={[0, degToRad(-60), 0]} />
      <StoneFormation position={[9, -1, 8]} rotation={[0, degToRad(-45), 0]} scale={0.5} />
      <Shungite position={[-8, 0, 11]} />
      <BeachBall />
      <Entities /> */}
    </>
  );
};

export default GameContents;
