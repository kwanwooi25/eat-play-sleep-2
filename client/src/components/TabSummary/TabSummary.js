import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Helper functions */
import parseSeconds from '../../helpers/parseSeconds';
import { mlToOz } from '../../helpers/unitChange';

class TabSummary extends Component {
  transformDurationToString = seconds => {
    const { translate } = this.props;
    const { h, m, s } = parseSeconds(seconds);

    let durationString = '';
    if (h) durationString += translate('hour', { h });
    if (m) durationString += ' ' + translate('minute', { m });
    if (s) durationString += ' ' + translate('second', { s: s.toFixed(0) });
    
    return durationString.trim();
  }

  generateSummaryContents = (activityName, displayActivities, displayUnits) => {
    const { translate, trend } = this.props;
    const { breast, bottle, babyfood, sleep, diaper } = trend;
    
    const volumeUnit = displayUnits ? displayUnits.volume : 'ml';
    
    let summaryContents = [];

    if (activityName === 'feed' && breast && bottle && babyfood) {
      let shouldRenderBreast = true;
      let shouldRenderBottle = true;
      let shouldRenderBabyfood = true;

      if (displayActivities) {
        shouldRenderBreast = displayActivities.includes('breast') && breast.totalCount;
        shouldRenderBottle = displayActivities.includes('bottle') && bottle.totalCount;
        shouldRenderBabyfood = displayActivities.includes('babyfood') && babyfood.totalCount;
      }

      const daysCount = breast.keys.length;

      let totalCount = 0;
      if (shouldRenderBreast) totalCount += breast.totalCount;
      if (shouldRenderBottle) totalCount += bottle.totalCount;
      if (shouldRenderBabyfood) totalCount += babyfood.totalCount;

      const averageFeedingsPerDay = totalCount / daysCount;
      const averageDurationPerBreastFeeding = 
        this.transformDurationToString(breast.totalDuration / breast.totalCount);
      const averageAmountPerBottleFeeding = bottle.totalAmount / bottle.totalCount || 0;
      const averageAmountPerBabyfoodFeeding = babyfood.totalAmount / babyfood.totalCount || 0;

      let averageAmountPerBottleFeedingString = '';
      let averageAmountPerBabyfoodFeedingString = '';
      if (volumeUnit === 'oz') {
        averageAmountPerBottleFeedingString =
          `${mlToOz(averageAmountPerBottleFeeding).toFixed(2)} oz`;
        averageAmountPerBabyfoodFeedingString =
          `${mlToOz(averageAmountPerBabyfoodFeeding).toFixed(2)} oz`;
      } else {
        averageAmountPerBottleFeedingString =
          `${averageAmountPerBottleFeeding.toFixed(1)} ml`;
        averageAmountPerBabyfoodFeedingString =
          `${averageAmountPerBabyfoodFeeding.toFixed(1)} ml`;
      }

      summaryContents.push({
        title: translate('averageFeedingsPerDay'),
        content: translate('count', { count: averageFeedingsPerDay.toFixed(1) }),
      });

      if (shouldRenderBreast) {
        summaryContents.push({
          title: translate('averageDurationPerBreastFeeding'),
          content: averageDurationPerBreastFeeding,
        });
      }

      if (shouldRenderBottle) {
        summaryContents.push({
          title: translate('averageAmountPerBottleFeeding'),
          content: averageAmountPerBottleFeedingString,
        });
      }

      if (shouldRenderBabyfood) {
        summaryContents.push({
          title: translate('averageAmountPerBabyfoodFeeding'),
          content: averageAmountPerBabyfoodFeedingString,
        })
      }

    } else if (activityName === 'sleep' && sleep) {
      const daysCount = sleep.keys.length;
      const averageTimesPerDay = sleep.totalCount / daysCount;
      const averageDurationPerDay = 
        this.transformDurationToString(sleep.totalDuration / daysCount);

      summaryContents = [
        {
          title: translate('averageTimesPerDay'),
          content: translate('count', { count: averageTimesPerDay.toFixed(1) }),
        },
        {
          title: translate('averageDurationPerDay'),
          content: averageDurationPerDay,
        },
      ];
    } else if (activityName === 'diaper' && diaper) {
      const daysCount = diaper.keys.length;
      const averageDiapersPerDay = diaper.totalCount / daysCount;
      const averagePeePerDay = diaper.totalPee / daysCount;
      const averagePooPerDay = diaper.totalPoo / daysCount;

      summaryContents = [
        {
          title: translate('averageDiapersPerDay'),
          content: translate('count', { count: averageDiapersPerDay.toFixed(1) }),
        },
        {
          title: translate('averagePeePerDay'),
          content: translate('count', { count: averagePeePerDay.toFixed(1) }),
        },
        {
          title: translate('averagePooPerDay'),
          content: translate('count', { count: averagePooPerDay.toFixed(1) }),
        },
      ]
    }

    return summaryContents;
  }

  renderContents = summary => {
    return summary.map(({ title, content }) => (
      <div key={title} className="tab-summary__item">
        <span className="tab-summary__item__title">
          {title}
        </span>
        <span className="tab-summary__item__content">
          {content}
        </span>
      </div>
    ));
  }

  render() {
    const { activityName, displayActivities, displayUnits } = this.props;
    const summaryContents =
      this.generateSummaryContents(activityName, displayActivities, displayUnits);

    return (
      <div className="tab-summary">
        {this.renderContents(summaryContents)}
      </div>
    )
  }
}

export default withTranslate(TabSummary);