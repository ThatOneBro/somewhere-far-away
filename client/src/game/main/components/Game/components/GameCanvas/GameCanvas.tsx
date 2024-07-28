import {
  AdaptiveDpr,
  AdaptiveEvents,
  // Sky,
  PositionalAudio,
  Preload,
  Stats,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

import styled from 'styled-components';

import CameraProvider from '../../../../../elements/camera/components/CameraProvider/CameraProvider';
import InputsHandler from '../../../InputsHandler/InputsHandler';
import GameContents from '../GameContents/GameContents';
// import TouchHandler from '../../../TouchHandler/TouchHandler';

// import SkyBox from '../../../../../elements/SkyBox/SkyBox';
// import Player from '../../../../../player/components/Player/Player';
// import Boombox from '../../../props/Boombox/Boombox';

import OceanSound2 from '../../../../../../assets/sounds/ocean-wave-2.mp3';
import OceanSound from '../../../../../../assets/sounds/ocean-waves-1.mp3';

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

// interface FrameUpdaterProps {
//   onFrameUpdate: (state: RootState, delta: number) => void;
// }

// const FrameUpdater = ({ onFrameUpdate }: FrameUpdaterProps) => {
//   useFrame(onFrameUpdate);
//   return null;
// };

const GameCanvas = () => {
  const statsParentRef = useRef(null);
  // const playerRefs = useRef({});
  // const innerRefs = useRef({});
  // const snapshotRef = useRef(useStore.getState().snapshot);

  // const { updateSnapshot } = useStore(useCallback((state) => ({ updateSnapshot: state.updateSnapshot }), []));
  const localPlayerRef = useRef(null);

  // useEffect(
  //   () =>
  //     useStore.subscribe(
  //       (snapshot) => {
  //         snapshotRef.current = snapshot;
  //       },
  //       (state) => state.snapshot
  //     ),
  //   []
  // );

  // const updateCurrentFrame = () => {
  //   updateSnapshot();
  // };

  return (
    <>
      <div style={{ zIndex: 999999, position: 'fixed', right: '2px', bottom: '50px', width: '80px' }}>
        <div style={{ position: 'relative', width: '100%' }} ref={statsParentRef} />
      </div>
      <StyledContainer>
        {/* <TouchHandler> */}
        <Canvas
          dpr={[1, 1.75]}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            // alpha: false,
            // gammaFactor: 2.2,
            // outputEncoding: THREE.sRGBEncoding,
          }}
          shadows
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Stats className="stats-panel" parent={statsParentRef} />
          {/* <Suspense fallback={null}>
            <SkyBox />
          </Suspense> */}
          {/* <Suspense fallback={null}>
            <Environment background={false} preset={null} path="/textures/hdr/" files="pool.jpg" />
          </Suspense> */}
          <Suspense fallback={null}>
            <group position={[0, 0, 0]}>
              <mesh position={[-52, 0, 52]}>
                <PositionalAudio url={OceanSound} distance={8} />
              </mesh>
              <mesh position={[52, 0, -52]}>
                <PositionalAudio url={OceanSound2} distance={8} />
              </mesh>
            </group>
          </Suspense>
          <CameraProvider>
            <InputsHandler>
              <GameContents localPlayerRef={localPlayerRef} />
              {/* {localPlayer && <Player id={localPlayer.id} local playerData={localPlayer} ref={localPlayerRef} />} */}
              {/* {localPlayer &&
                currentPlayers
                  .filter((player) => player.id !== localPlayer.id)
                  .map((player) => {
                    if (!playerRefs.current[player.id]) {
                      playerRefs.current[player.id] = React.createRef();
                      innerRefs.current[player.id] = React.createRef();
                    }
                    return (
                      <Player
                        id={player.id}
                        key={player.id}
                        ref={playerRefs.current[player.id]}
                        playerData={player}
                        snapshotRef={snapshotRef}
                        fwdInnerRef={innerRefs.current[player.id]}
                      />
                    );
                  })} */}
              {/* <Boombox
                setRadioOnState={setRadioOnState}
                radioState={radioState}
                fetchRadioOnState={fetchRadioOnState}
              /> */}
            </InputsHandler>
          </CameraProvider>
          <Preload all />
        </Canvas>
        {/* </TouchHandler> */}
      </StyledContainer>
    </>
  );
};

export default GameCanvas;
