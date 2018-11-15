import React, { Component } from 'react';
import { connect } from 'react-redux';

/** Material UI Components */
import Icon from '@material-ui/core/Icon';

/** Helpers */
import secondsToHMS from '../../helpers/secondsToHMS';

/** Actions */
import * as actions from '../../actions';

class ActivityTimer extends Component {
  constructor(props) {
    super(props);

    const { paused, timer } = props.activity;

    this.state = {
      paused: paused,
      elapsed: timer.elapsed
    }
  }

  componentDidMount() {
    this.displayInterval = setInterval(this.updateState, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.displayInterval);
  }

  updateState = () => {
    const { timer: { elapsed } } = this.props.activity;
    this.setState({ elapsed });
  }

  handlePause = () => {
    const { activity, updateActivityInProgress } = this.props;
    activity.timer.stop();
    
    this.setState({ paused: true });
    updateActivityInProgress(activity);
  }

  handleResume = () => {
    const { activity, updateActivityInProgress } = this.props;
    activity.timer.start();

    this.setState({ paused: false });
    updateActivityInProgress(activity);
  }

  render() {
    const { paused, elapsed } = this.state;

    return (
      <div className="activity-timer">
        <div className={`activity-timer__timer ${paused && 'paused'}`}>
          <span>{secondsToHMS(elapsed)}</span>
        </div>
        <div className="activity-timer__controls">
          {paused ? (
            <button
              className="activity-timer__controls__button"
              onClick={this.handleResume}
            >
              <Icon color="inherit" fontSize="large">play_arrow</Icon>
            </button>
          ) : (
            <button
              className="activity-timer__controls__button"
              onClick={this.handlePause}
            >
              <Icon color="inherit" fontSize="large">pause</Icon>
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(ActivityTimer);