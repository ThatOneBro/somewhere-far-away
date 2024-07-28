import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Entity = ({ entityProps }) => {
  const [model, setModel] = useState(null);
  const group = useRef(null);

  useEffect(() => new GLTFLoader().load(entityProps.model.url, setModel), [entityProps.model.url]);

  return model ? (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <group ref={group} position={entityProps.position || [0, 0, 0]} dispose={null}>
        <primitive object={model.scene} />
      </group>
    </>
  ) : null;
};

Entity.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  entityProps: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default Entity;
