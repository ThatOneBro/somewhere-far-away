import React, { useState, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { Html } from '@react-three/drei';
import _ from 'lodash';
import { Vec2 } from 'planck-js';
import { usePlanckBody } from 'rgg-engine';

import { degToRad } from '../../../../utils/angles';

import Clickable from '../../../../utils/components/Clickable';

import './slots.css';

const emotes = [
  'https://cdn.frankerfacez.com/emoticon/128054/4',
  'https://cdn.frankerfacez.com/emoticon/210748/1',
  'https://cdn.frankerfacez.com/emoticon/231552/4',
  'https://cdn.frankerfacez.com/emoticon/139407/4',

  'https://cdn.frankerfacez.com/emoticon/243789/4',
  'https://cdn.frankerfacez.com/emoticon/270930/4',
  'https://cdn.frankerfacez.com/emoticon/214681/4',
  'https://cdn.frankerfacez.com/emoticon/239504/4',

  'https://cdn.frankerfacez.com/emoticon/214129/1',
  'https://cdn.frankerfacez.com/emoticon/162146/4',
  'https://cdn.frankerfacez.com/emoticon/229486/4',
  'https://cdn.frankerfacez.com/emoticon/229760/4',
];

const TIMER = 2;
const SLOTS_PER_REEL = 12;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) );
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 150;
const SLOT_ANGLE = 360 / SLOTS_PER_REEL;

const getSeed = () => {
  // generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
  return Math.floor(Math.random() * SLOTS_PER_REEL);
};

const Slot = ({ position, seed }) => {
  return (
    <div
      className="slot"
      style={{ transform: `rotateX(${SLOT_ANGLE * position}deg) translateZ(${REEL_RADIUS}px)` }}
    >
      <div>
        <img src={emotes[(seed + position) % SLOTS_PER_REEL]} alt="Emote" />{' '}
      </div>
    </div>
  );
};

Slot.propTypes = {
  position: PropTypes.number.isRequired,
  seed: PropTypes.number,
};

Slot.defaultProps = {
  seed: 0,
};

const Ring = React.forwardRef(({ position }, ref) => {
  const [seed, setSeed] = useState(getSeed());
  const [animation, setAnimation] = useState(null);
  // const [spinning, setSpinning] = useState();

  useImperativeHandle(ref, () => ({
    spin() {
      let newSeed = getSeed();
      while (newSeed === seed) {
        newSeed = getSeed();
      }
      setSeed(newSeed);
      setAnimation(`back-spin 1s, spin-${newSeed} ${TIMER + position * 0.5}s`);
    },
  }));

  return (
    <div
      ref={ref}
      id={`ring-${position}`}
      className={`ring${!animation ? '' : ` spin-${seed}`}`}
      style={{ animation: animation || undefined }}
    >
      {_.times(SLOTS_PER_REEL, i => (
        <Slot key={i} position={i} seed={seed} />
      ))}
    </div>
  );
});

Ring.propTypes = {
  position: PropTypes.number.isRequired,
};

// Inspired by: https://codepen.io/AdrianSandu/pen/MyBQYz
const SlotMachine = React.forwardRef(({ focused, toggleFocusSlots, ...props }, ref) => {
  const localRef = useRef(null);
  const usedRef = ref || localRef;

  const [refs] = useState(
    Array(3)
      .fill()
      .map(() => React.createRef()),
  );

  const onClick = () => {
    refs.forEach(childRef => {
      if (!childRef.current) return;
      childRef.current.spin();
    });

    toggleFocusSlots();
  };

  usePlanckBody(
    () => ({
      body: {
        type: 'static',
        position: Vec2(props.position[0], props.position[2]),
        angle: degToRad(-45),
      },
      fixtures: [
        {
          shape: 'Box',
          args: [0.8, 0.8],
          fixtureOptions: {},
        },
      ],
    }),
    {},
  );

  return (
    <Clickable>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <mesh ref={usedRef} {...props} onClick={onClick} castShadow>
        <boxGeometry args={[2, 3]} />
        <meshBasicMaterial color="#fddd5c" />
        <Html scale={2} distanceFactor={1} transform position={[0, 0.75, 0.5]}>
          <div
            style={{ userSelect: 'none' }}
            onMouseEnter={() => {
              document.body.style.cursor = 'pointer';
            }}
            onMouseLeave={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* eslint-disable jsx-a11y/click-events-have-key-events */}
            {/* eslint-disable jsx-a11y/no-static-element-interactions */}
            <div id="stage" className="perspective-on" onClick={onClick}>
              <div id="rotate">
                {refs.map((childRef, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Ring key={i + 1} position={i + 1} ref={childRef} />
                ))}
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    </Clickable>
  );
});

SlotMachine.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  toggleFocusSlots: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  position: PropTypes.array,
  /* eslint-enable react/forbid-prop-types */
};

SlotMachine.defaultProps = {
  // position: new THREE.Vector3(0, 0, 0),
  position: [0, 0, 0],
};

export default SlotMachine;
