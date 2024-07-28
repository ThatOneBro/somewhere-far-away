import React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';

import { store } from '../../../../../store';

import { twitchStateSelector } from '../../../../../selectors';

import modelActions from '../../../../../actions/kickoff/model-actions';

import TwitchPlayer from './TwitchPlayer';

const { setTwitch: setTwitchState } = modelActions;

const mapStateToProps = state => ({
  twitchState: twitchStateSelector(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setTwitchState,
    },
    dispatch,
  );

const ConnectedTwitchPlayer = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(TwitchPlayer);

const WrappedTwitchPlayer = React.forwardRef((props, ref) => {
  return (
    <Provider store={store}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ConnectedTwitchPlayer {...props} ref={ref} />
    </Provider>
  );
});

export default WrappedTwitchPlayer;
