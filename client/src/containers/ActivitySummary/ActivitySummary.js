import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import SVGIcon from '../../components/SVGIcon/SVGIcon';

/** Helper functions */
import parseSeconds from '../../helpers/parseSeconds';
import { comma } from '../../helpers/comma';
import { mlToOz } from '../../helpers/unitChange';

/** Actions */
import * as actions from '../../actions';

class ActivitySummary extends Component {
  state = { date: moment() }

  componentDidMount() {
    this.getSummary(this.state.date);
  }

  getSummary = (date = moment()) => {
    const {
      auth: { currentUser },
      babies: { currentBaby },
      getActivitySummaryByDate
    } = this.props;

    getActivitySummaryByDate(currentUser, currentBaby.id, date);
  }

  handleButtonClick = change => {
    let { date } = this.state;

    if (change === 'prev') date = moment(date).subtract(1, 'days');
    else if (change === 'next') date = moment(date).add(1, 'days');

    this.setState({ date }, () => this.getSummary(this.state.date));
  }

  renderSummary = (summary, settings) => {
    const { translate } = this.props;
    const { displayActivities, displayUnits } = settings;
    let keys = Object.keys(summary);
    if (displayActivities) {
      keys = keys.filter(name => displayActivities.includes(name));
    }
    const volumeUnit = displayUnits ? displayUnits.volume : 'ml';

    return keys.map(name => {
      const { count, amount, duration, pee, poo } = summary[name];

      // generate duration string
      let durationString = '';
      if (duration) {
        const { h, m, s } = parseSeconds(duration);
        if (h) durationString += translate('hour', { h });
        if (m) durationString += ' ' + translate('minute', { m });
        if (s) durationString += ' ' + translate('second', { s });
        durationString.trim();
      }

      // generate amount string
      let amountString = '';
      if (amount) {
        if (volumeUnit === 'oz') {
          amountString = `${mlToOz(amount).toFixed(2)} oz`;
        } else {
          amountString = `${comma(amount.toFixed(0))} ml`
        }
      }

      // generate pee-poo string
      const peeString = `${translate('pee')}: ${translate('count', { count: pee })}`;
      const pooString = `${translate('poo')}: ${translate('count', { count: poo })}`;

      return (
        <div key={name} className={`activity-summary__info__item ${name}`}>
          <div className="activity-summary__info__item__icon">
            <SVGIcon name={name} />
          </div>
          <div className="activity-summary__info__item__details">
            <div className="activity-summary__info__item__details__name">
              {translate(name)}
            </div>
            <div className="activity-summary__info__item__details__count">
              {translate('count', { count })}
            </div>
            {Boolean(duration) && (
              <div className="activity-summary__info__item__details__duration">
                {durationString}
              </div>
            )}
            {Boolean(amount) && (
              <div className="activity-summary__info__item__details__amount">
                {amountString}
              </div>
            )}
            {(Boolean(pee) || Boolean(poo)) && (
              <div className="activity-summary__info__item__details__peepoo">
                <p>{peeString}</p>
                <p>{pooString}</p>
              </div>
            )}
          </div>
        </div>
      )
    });
  }

  render() {
    const {
      translate,
      auth: { currentUser : { settings } },
      activities: { summaryByDate }
    } = this.props;
    const { date } = this.state;

    const isToday = moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD');
    
    const dateString = isToday ?
      translate('today') :
      moment(date).format(translate('dateFormatLong'));

    return (
      <div className="activity-summary">
        <div className="activity-summary__date-display">
          <button
            className="activity-summary__date-display__button"
            onClick={() => this.handleButtonClick('prev')}
          >
            <SVGIcon name="arrow_left" />
          </button>
          <span className="activity-summary__date-display__date">
            {dateString}
          </span>
          <button
            className="activity-summary__date-display__button"
            onClick={() => this.handleButtonClick('next')}
            disabled={isToday}
          >
            <SVGIcon name="arrow_right" />
          </button>
        </div>
        <div className="activity-summary__info">
          {this.renderSummary(summaryByDate, settings)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, babies, activities }) => {
  return { auth, babies, activities };
}

export default withTranslate(connect(mapStateToProps, actions)(ActivitySummary));