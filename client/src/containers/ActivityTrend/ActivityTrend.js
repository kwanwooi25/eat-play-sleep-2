import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import TabSummary from '../../components/TabSummary/TabSummary';
import MenuSelector from '../../components/MenuSelector/MenuSelector';
import FeedChart from '../../components/FeedChart/FeedChart';
import DurationChart from '../../components/DurationChart/DurationChart';
import DiaperChart from '../../components/DiaperChart/DiaperChart';
import GrowthChart from '../../components/GrowthChart/GrowthChart';
import NoData from '../../components/NoData/NoData';

/** Actions */
import * as actions from '../../actions';

const RANGE_SELECT_ITEMS = ['one_week', 'two_weeks', 'one_month'];

class ActivityTrend extends Component {
  state = {
    range: 'one_week', // 'one_week', 'two_weeks', 'one_month'
  }

  componentDidMount() {
    const { activityName } = this.props;
    const { range } = this.state;
    this.getActivityTrendByName(activityName, range);
  }

  getActivityTrendByName = (name, range = 'one_week') => {
    const {
      auth: { currentUser },
      babies: { currentBaby },
      getActivityTrendByName
    } = this.props;
    
    let from = moment().startOf('date');
    if (range === 'one_week') from = from.subtract(6, 'days');
    else if (range === 'two_weeks') from = from.subtract(13, 'days');
    else if (range === 'one_month') from = from.subtract(1, 'months');

    const to = moment().endOf('date');

    if (name === 'feed') {
      getActivityTrendByName(currentUser, currentBaby.id, { name: 'breast', from, to });
      getActivityTrendByName(currentUser, currentBaby.id, { name: 'bottle', from, to });
      getActivityTrendByName(currentUser, currentBaby.id, { name: 'babyfood', from, to });
    } else {
      getActivityTrendByName(currentUser, currentBaby.id, { name, from, to });
    }

  }

  handleRangeSelectChange = value => {
    const { range } = this.state;
    const { activityName } = this.props;

    this.setState({ range: value || range }, () => {
      this.getActivityTrendByName(activityName, this.state.range);
    });
  }

  render() {
    const {
      translate,
      activityName,
      auth: { currentUser : { settings: { displayActivities, displayUnits } } },
      babies: { currentBaby },
      activities: { trend },
    } = this.props;
    const { range } = this.state;

    const { breast, bottle, babyfood, sleep, diaper, growth } = trend;
    let shouldRender = true;

    if (activityName === 'feed') {
      shouldRender =
        shouldRender && 
        (
          (breast && breast.totalCount) ||
          (bottle && bottle.totalCount) ||
          (babyfood && babyfood.totalCount)
        );
    } else {
      shouldRender = 
        shouldRender &&
        trend[activityName] &&
        trend[activityName].totalCount;
    }

    if (shouldRender) {
      return (
        <div className="activity-trend">
          {activityName !== 'growth' && (
            <div className="activity-trend__controls">
              <TabSummary
                activityName={activityName}
                trend={trend}
                displayActivities={displayActivities}
                displayUnits={displayUnits}
              />
              <MenuSelector
                buttonClassName="activity-trend__controls__button"
                menuSelected={range}
                menuItems={RANGE_SELECT_ITEMS}
                onChange={this.handleRangeSelectChange}
              />
            </div>
          )}
  
          <div className="activity-trend__chart">
            {activityName === 'feed' && (
              <FeedChart
                breast={breast}
                bottle={bottle}
                babyfood={babyfood}
                displayActivities={displayActivities}
                displayUnits={displayUnits}
              />
            )}
            {activityName === 'sleep' && <DurationChart source={sleep} />}
            {activityName === 'diaper' && <DiaperChart source={diaper} />}
            {activityName === 'growth' && (
              <GrowthChart
                source={growth}
                baby={currentBaby}
                displayUnits={displayUnits}
              />
            )}
          </div>
        </div>
      )
    } else {
      return <NoData icon="insert_chart" message={translate('noDataForChart')} />
    }

  }
}

const mapStateToProps = ({ auth, babies, activities }) => {
  return { auth, babies, activities };
}

export default withTranslate(connect(mapStateToProps, actions)(ActivityTrend))