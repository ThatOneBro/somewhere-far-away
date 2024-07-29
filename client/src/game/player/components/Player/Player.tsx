import { Html } from '@react-three/drei';
import { MutableRefObject, Suspense, useRef } from 'react';
// import EmoteDisplayer from '../../../utils/components/EmoteDisplayer';
import { Group } from 'three';
import Robot from '../../../3d/components/Robot/RobotExpressive';
import { useSetLocalPlayerRef } from '../../../elements/camera/components/CameraProvider/hooks';
// import ProfileEditor from '../../../../components/ProfileModal/ProfileEditor';

// const PlayerEditor = ({ id, playerData, updatePreview }) => {
//   const { playerEditing, setPlayerEditing, accessToken } = useStore(
//     useCallback(
//       (state) => ({
//         playerEditing: state.playerEditing,
//         setPlayerEditing: state.setPlayerEditing,
//         accessToken: state.accessToken,
//       }),
//       []
//     )
//   );
//   const handleClose = useCallback(() => setPlayerEditing(false), [setPlayerEditing]);
//   const updatePreviewColor = useCallback((color) => updatePreview({ color }), [updatePreview]);
//   const updatePreviewHat = useCallback((hat) => updatePreview({ hat }), [updatePreview]);
//   const updatePreviewWide = useCallback((wide) => updatePreview({ wide }), [updatePreview]);
//   const updatePlayer = useCallback(
//     ({ color, hat, wide }) =>
//       api.updatePlayer(
//         {
//           userId: id,
//           frames: [],
//           appearance: { ...playerData.appearance, color, hat, wide },
//         },
//         { Authorization: `Bearer ${accessToken}` }
//       ),
//     [id, playerData.appearance, accessToken]
//   );

//   return playerEditing ? (
//     <group position={[-2, -0.5, -2]}>
//       <Html center>
//         <ProfileEditor
//           userId={id}
//           localPlayer={playerData}
//           handleClose={handleClose}
//           updatePreviewColor={updatePreviewColor}
//           updatePreviewHat={updatePreviewHat}
//           updatePreviewWide={updatePreviewWide}
//           updatePlayer={updatePlayer}
//         />
//       </Html>
//     </group>
//   ) : null;
// };

const Player = () => {
  const playerRef = useRef<Group>(null);
  // const playerColor = useMemo(() => {
  //   return playerEditing && preview ? preview.color : playerData.appearance.color;
  // }, [playerEditing, preview, playerData]);

  // const playerHat = useMemo(() => {
  //   return playerEditing && preview ? preview.hat : playerData.appearance.hat;
  // }, [playerEditing, preview, playerData]);

  // const playerWide = useMemo(() => {
  //   return playerEditing && preview ? preview.wide : playerData.appearance.wide;
  // }, [playerEditing, preview, playerData]);

  useSetLocalPlayerRef(playerRef);

  const playerData = {
    user: {
      username: 'john',
    },
    username: 'john',
    color: 'yellow',
  } as const;

  return (
    <group ref={playerRef as MutableRefObject<Group>}>
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
      {/* {message && (
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
      )} */}
      <group>
        <Suspense fallback={null}>
          <Robot
            color={playerData.color}
            moving={false}
            jumping={false}
            scale={[0.3, 0.3, 0.3]}
            // hat={playerHat}
          />
        </Suspense>
      </group>
    </group>
  );
};

export default Player;
