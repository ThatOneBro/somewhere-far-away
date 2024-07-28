import React, { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { Html } from '@react-three/drei';
import PropTypes from 'prop-types';
import { Vec2 } from 'planck-js';
import { usePlanckBody } from 'rgg-engine';
import { isNil } from 'lodash';

// Props to Alaric.Baraou of Poimandres
import OldKorriganMdl from '../../../3d/components/OldKorrigan/OldKorrigan';
import Clickable from '../../../utils/components/Clickable';

// const DIALOG_DURATION = 5000;
const COOLDOWN = 5000;
const DIALOG = [
  { message: 'Wider...', duration: 3500, status: 'mumbling to self' },
  { message: 'WIDER...', duration: 2800, status: 'slightly excited' },
  { message: '**looks at you**', duration: 2000 },
  { message: 'Hello there, young one.', duration: 2500 },
  { message: 'Can you please make yourself wider?', duration: 4000, status: 'smiling' },
  { message: `Go to your profile and tick the 'Wide' option, if you would.`, duration: 6000 },
];

const OldKorrigan = ({ position }) => {
  usePlanckBody(
    () => ({
      body: {
        type: 'static',
        position: Vec2(position[0], position[2]),
      },
      fixtures: [
        {
          shape: 'Circle',
          args: [0.2, 0.2],
          fixtureOptions: {},
        },
      ],
    }),
    {},
  );

  const [canShow, setCanShow] = useState(true);
  const [showing, setShowing] = useState(false);
  const [currentDialog, setCurrentDialog] = useState(null);
  const [status, setStatus] = useState(null);

  const getNextDialog = useCallback(() => {
    const nextIndex = !isNil(currentDialog) ? currentDialog + 1 : 0;
    if (DIALOG[nextIndex]) return nextIndex;
    return null;
  }, [currentDialog]);

  const getNextDialogRef = useRef(getNextDialog);

  useEffect(() => {
    getNextDialogRef.current = getNextDialog;
  }, [getNextDialog]);

  useEffect(() => {
    if (!canShow || !showing) return;
    setCanShow(false);
    const playNextDialog = () => {
      const nextDialog = getNextDialogRef.current();
      if (isNil(nextDialog)) {
        setShowing(false);
        setCurrentDialog(null);
        setTimeout(() => {
          setCanShow(true);
        }, COOLDOWN);
        return;
      }
      setCurrentDialog(nextDialog);
      setTimeout(() => {
        playNextDialog();
      }, DIALOG[nextDialog].duration);
    };
    playNextDialog();
  }, [canShow, showing]);

  useEffect(() => {
    if (isNil(currentDialog)) {
      setStatus(null);
      return;
    }
    setStatus(DIALOG[currentDialog].status || null);
  }, [currentDialog]);

  const onClick = useCallback(() => {
    if (!canShow) return;
    setShowing(true);
  }, [canShow]);

  return (
    <group position={position}>
      {showing && !isNil(currentDialog) && (
        <group position={[0.75, 2.5, 0.75]}>
          <Html>
            <div
              style={{
                // backgroundColor: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                minHeight: '60px',
                padding: '10px 15px',
                borderRadius: '8px',
                // color: '#656565',
                color: 'white',
                minWidth: '200px',
                maxWidth: '600px',
                fontSize: 14,
                position: 'relative',
                overflow: 'auto',
              }}
            >
              <h2
                className="player-name"
                style={{
                  color: '#55aaff',
                  // color: TEXT_COLORS[playerData.appearance.color],
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Old Elf{status ? <span style={{ color: 'white' }}> ({status})</span> : null}
              </h2>
              <p style={{ display: 'inline-block' }}>
                {DIALOG[currentDialog] ? DIALOG[currentDialog].message : null}
              </p>
            </div>
          </Html>
        </group>
      )}
      <Suspense fallback={null}>
        <OldKorriganMdl onClick={onClick} thinking />
      </Suspense>
      <Clickable>
        <mesh onClick={onClick} visible={false} position={[0, 1, 0]}>
          <sphereGeometry args={[0.75, 20]} />
        </mesh>
      </Clickable>
    </group>
  );
};

OldKorrigan.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  position: PropTypes.array,
  /* eslint-enable react/forbid-prop-types */
};

OldKorrigan.defaultProps = {
  position: [0, 0, 0],
};

export default OldKorrigan;
