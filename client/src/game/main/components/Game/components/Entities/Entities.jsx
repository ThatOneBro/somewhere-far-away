import React from 'react';
import PropTypes from 'prop-types';

import Entity from './Entity';

const Entities = ({ spaceEntities }) => {
  return (
    <>
      {spaceEntities.map(entity => (
        <Entity key={entity.id} entityProps={entity.props} />
      ))}
    </>
  );
};

Entities.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  spaceEntities: PropTypes.array,
  /* eslint-enable react/forbid-prop-types */
};

Entities.defaultProps = {
  spaceEntities: [],
};

export default Entities;
