import React, { Component } from 'react';
import { connect } from 'react-redux';

/** Material UI Components */
import Icon from '@material-ui/core/Icon';

/** Components */
import SVGIcon from '../SVGIcon/SVGIcon';

/** Helpers */
import secondsToHMS from '../../helpers/secondsToHMS';

/** Actions */
import * as actions from '../../actions';

class ActivityTimerMulti extends Component {
  constructor(props) {
    super(props);

    const { name, currentSide, paused, leftTimer, rightTimer } = props.activity;

    this.state = {
      name: name,
      currentSide: currentSide,
      paused: paused,
      left: leftTimer.elapsed,
      right: rightTimer.elapsed
    }
  }

  componentDidMount() {
    this.displayInterval = setInterval(this.updateState, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.displayInterval);
  }

  updateState = () => {
    const { leftTimer, rightTimer } = this.props.activity;
    const left = leftTimer.elapsed;
    const right = rightTimer.elapsed;

    this.setState({ left, right });
  }

  changeSide = () => {
    const { activity, updateActivityInProgress } = this.props;
    const { currentSide } = this.state;
    let opposite = '';

    if (currentSide === 'left') {
      opposite = 'right';
      activity.leftTimer.stop();
      activity.rightTimer.start();
    } else if (currentSide === 'right') {
      opposite = 'left';
      activity.rightTimer.stop();
      activity.leftTimer.start();
    }

    activity.currentSide = opposite;
    
    this.setState({ currentSide: opposite, paused: false });
    updateActivityInProgress(activity);
  }

  handlePause = () => {
    const { activity, updateActivityInProgress } = this.props;
    activity.leftTimer.stop();
    activity.rightTimer.stop();
    
    this.setState({ paused: true });
    updateActivityInProgress(activity);
  }

  handleResume = () => {
    const { activity, updateActivityInProgress } = this.props;
    const { currentSide } = this.state;
    if (currentSide === 'left') activity.leftTimer.start();
    else if (currentSide === 'right') activity.rightTimer.start();

    this.setState({ paused: false });
    updateActivityInProgress(activity);
  }

  render() {
    const { name, currentSide, paused, left, right } = this.state;
    const isLeftActive = currentSide === 'left' && !paused;
    const isRightActive = currentSide === 'right' && !paused;

    return (
      <div className="activity-timer-multi">
        <div className={`activity-timer-multi__timer--main ${paused && 'paused'}`}>
          <span>{secondsToHMS(left + right)}</span>
        </div>
        <div className="activity-timer-multi__controls">
          <div className={`activity-timer-multi__controls__side ${name} ${isLeftActive ? 'active' : ''}`}>
            <SVGIcon
              name={`${name}_left`}
              isActive={isLeftActive}
              className="activity-timer-multi__controls__side__icon"
            />
            <div className="activity-timer-multi__controls__side__timer">
              {secondsToHMS(left)}
            </div>
          </div>
          <div className="activity-timer-multi__controls__center">
            <button
              className="activity-timer-multi__controls__center__button"
              onClick={this.changeSide}
            >
              <Icon
                color="inherit"
                fontSize="large"
                className={`change-side ${currentSide}`}
              >
                keyboard_arrow_up
              </Icon>
            </button>
            {paused ? (
              <button
                className="activity-timer-multi__controls__center__button"
                onClick={this.handleResume}
              >
                <Icon color="inherit" fontSize="large">play_arrow</Icon>
              </button>
            ) : (
              <button
                className="activity-timer-multi__controls__center__button"
                onClick={this.handlePause}
              >
                <Icon color="inherit" fontSize="large">pause</Icon>
              </button>
            )}
          </div>
          <div className={`activity-timer-multi__controls__side ${name} ${isRightActive ? 'active' : ''}`}>
            <SVGIcon
              name={`${name}_right`}
              isActive={isRightActive}
              className="activity-timer-multi__controls__side__icon"
            />
            <div className="activity-timer-multi__controls__side__timer">
              {secondsToHMS(right)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(ActivityTimerMulti);