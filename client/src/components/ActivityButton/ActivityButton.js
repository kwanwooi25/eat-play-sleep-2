import moment from 'moment';
import React from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import SVGIcon from '../SVGIcon/SVGIcon';

/** Helper functions */
import parseMinutes from '../../helpers/parseMinutes';

class ActivityButton extends React.Component {
  state = { lastActivityTime: '' }

  componentDidMount() {
    this.setLastActivityTime();
    this.timer = setInterval(this.setLastActivityTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  setLastActivityTime = () => {
    const { translate, lastActivity, activityInProgress } = this.props;
    let lastActivityTime = translate('noRecord');

    if (activityInProgress) {
      lastActivityTime = translate('inProgress');
    } else if (lastActivity) {
      const timeDifference = moment().diff(lastActivity.time_start, 'minutes');
      const { d, h, m } = parseMinutes(timeDifference);
      const day = translate('day', { d });
      const hour = translate('hour', { h });
      const minute = translate('minute', { m });
      const ago = translate('ago');
      const justBefore = translate('justBefore');

      if (d > 0) lastActivityTime = `${day} ${ago}`;
      else if (h > 0) lastActivityTime = `${hour} ${minute} ${ago}`;
      else if (m > 0) lastActivityTime = `${minute} ${ago}`;
      else lastActivityTime = justBefore;
    }

    this.setState({ lastActivityTime });
  }

  renderButtons = (
    name,
    isActive,
    hasSides,
    currentSide,
    onClick
  ) => {
    if (hasSides) {
      return ['left', 'right'].map(side => {
        const isActive = side === currentSide;

        return (
          <button
            key={`${name}_${side}`}
            className={`activity-button__buttons__button ${name}_${side} ${isActive ? 'active' : ''}`}
            onClick={() => onClick(`${name}_${side}`)}
          >
            <SVGIcon name={`${name}_${side}`} isActive={isActive} />
          </button>
        )
      })
    } else {
      return (
        <button
          className={`activity-button__buttons__button ${name} ${isActive ? 'active' : ''}`}
          onClick={() => onClick(name)}
        >
          <SVGIcon name={name} isActive={isActive} />
        </button>
      )
    }
  }

  render() {
    const { name, activityInProgress, onClick } = this.props;
    const { lastActivityTime } = this.state;
    const isActive = Boolean(activityInProgress);
    const hasSides = name === 'breast' || name === 'pump';
    const currentSide = activityInProgress && activityInProgress.currentSide;

    return (
      <div className={`activity-button ${name} ${hasSides ? 'two-sided' : ''}`}>
        <div className="activity-button__buttons">
          {this.renderButtons(name, isActive, hasSides, currentSide, onClick)}
        </div>
        <div className="activity-button__last">
          {lastActivityTime}
        </div>
      </div>
    )
  }
}

export default withTranslate(ActivityButton);