import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Victory Chart Components */
import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryGroup,
  VictoryScatter,
  VictoryLabel,
} from 'victory';

/** Helper functions */
import secondsToHMS from '../../helpers/secondsToHMS';
import { mlToOz } from '../../helpers/unitChange';

const DATA_FILL_COLOR = {
  breast: '#FFC107',
  bottle: '#3F51B5',
  babyfood: '#FF5722',
};
const DATA_STROKE_COLOR = {
  breast: '#FFC107',
  bottle: '#3F51B5',
  babyfood: '#FF5722',
};
const LABEL_COLOR = {
  breast: '#FF6F00',
  bottle: '#1A237E',
  babyfood: '#BF360C',
};

class FeedChart extends Component {

  transformData = (source, unit) => {
    let data = [];

    if (source) {
      data = source.keys.map(key => {
        switch (source.name) {
          case 'breast':
            return { date: key, duration: source[key].duration / 5 };
          case 'bottle':
          case 'babyfood':
            if (unit === 'oz') {
              return { date: key, amount: parseFloat(mlToOz(source[key].amount).toFixed(2)) };
            }
            return { date: key, amount: parseInt(source[key].amount.toFixed(0)) };
          default:
            return {};
        }    
      });
    }

    return data;
  }

  onBreastChartMouseOver = () => {
    return [
      {
        target: "data",
        mutation: props => {
          const { style } = props;
          const newStyle =
            Object.assign(
              {},
              style,
              {
                fillOpacity: 0.7,
                stroke: DATA_STROKE_COLOR['breast'],
                strokeWidth: 2
              }
            );
          return Object.assign({}, props, { style: newStyle });
        }
      }, {
        target: "labels",
        mutation: props => {
          const { duration } = props.datum;
          return { text: secondsToHMS(duration * 5) };
        }
      }
    ];
  }
  
  onBarChartMouseOver = name => {
    const { displayUnits } = this.props;
    const volumeUnit = displayUnits ? displayUnits.volume : 'ml';
    
    return [
      {
        target: "data",
        mutation: props => {
          const { style } = props;
          const newStyle =
            Object.assign(
              {},
              style,
              {
                fillOpacity: 0.7,
                stroke: DATA_STROKE_COLOR[name],
                strokeWidth: 1
              }
            );
          return Object.assign({}, props, { style: newStyle });
        }
      }, {
        target: "labels",
        mutation: props => {
          const { amount } = props.datum;
          return { text: `${amount}${volumeUnit}` };
        }
      }
    ];
  }
  
  onChartMouseOut = () => {
    return [
      { target: "data", mutation: () => null },
      { target: "labels", mutation: () => null }
    ];
  }

  render() {
    const {
      translate,
      breast,
      bottle,
      babyfood,
      displayActivities,
      displayUnits,
    } = this.props;

    const volumeUnit = displayUnits ? displayUnits.volume : 'ml';

    let shouldRenderBreastData = breast && breast.totalCount > 0;
    let shouldRenderBottleData = bottle && bottle.totalCount > 0;
    let shouldRenderBabyfoodData = babyfood && babyfood.totalCount > 0;
    if (displayActivities) {
      shouldRenderBreastData = shouldRenderBreastData && displayActivities.includes('breast');
      shouldRenderBottleData = shouldRenderBottleData && displayActivities.includes('bottle');
      shouldRenderBabyfoodData = shouldRenderBabyfoodData && displayActivities.includes('babyfood');
    }

    const breastData = this.transformData(breast, volumeUnit);
    const bottleData = this.transformData(bottle, volumeUnit);
    const babyfoodData = this.transformData(babyfood, volumeUnit);

    const legendData = [];
    if (shouldRenderBreastData) {
      legendData.push({ name: translate('breast'), symbol: { fill: DATA_FILL_COLOR['breast'] } });
    }
    if (shouldRenderBottleData) {
      legendData.push({ name: translate('bottle'), symbol: { fill: DATA_FILL_COLOR['bottle'] } });
    }
    if (shouldRenderBabyfoodData) {
      legendData.push({ name: translate('babyfood'), symbol: { fill: DATA_FILL_COLOR['babyfood'] } });
    }

    return (
      <div className="feed-chart">
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
        >
          <VictoryAxis
            tickCount={7}
            tickValues={breast && breast.keys}
            tickFormat={x => parseInt(x.split('-')[1])}
          />
          <VictoryAxis
            label={translate('amount')}
            dependentAxis
            tickCount={4}
            tickFormat={x => `${x}${volumeUnit}`}
            style={{ axisLabel: { padding: -15 } }}
          />
          <VictoryAxis
            label={translate('durationLabel')}
            dependentAxis
            orientation="right"
            tickCount={4}
            tickFormat={x => secondsToHMS(x * 5)}
            style={{ axisLabel: { padding: -15 } }}
          />
          <VictoryLegend
            x={20} y={10}
            orientation="horizontal"
            gutter={25}
            style={{ border: { stroke: "black" } }}
            data={legendData}
          />
          <VictoryStack>
            {shouldRenderBottleData && (
              <VictoryBar
                data={bottleData}
                x="date"
                y="amount"
                color={DATA_FILL_COLOR['bottle']}
                barRatio={0.9}
                labels={() => null}
                labelComponent={<VictoryLabel dy={30}/>}
                style={{
                  labels: {
                    fill: LABEL_COLOR['bottle'],
                    fontSize: 20,
                    stroke: LABEL_COLOR['bottle'],
                    strokeWidth: 1
                  }
                }}
                events={[{
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => this.onBarChartMouseOver('bottle'),
                    onMouseOut: this.onChartMouseOut,
                  }
                }]}
              />
            )}
            {shouldRenderBabyfoodData && (
              <VictoryBar
                data={babyfoodData}
                x="date"
                y="amount"
                color={DATA_FILL_COLOR['babyfood']}
                barRatio={0.9}
                labels={() => null}
                labelComponent={<VictoryLabel dy={30}/>}
                style={{
                  labels: {
                    fill: LABEL_COLOR['babyfood'],
                    fontSize: 20,
                    stroke: LABEL_COLOR['babyfood'],
                    strokeWidth: 1
                  }
                }}
                events={[{
                  target: "data",
                  eventHandlers: {
                    onMouseOver: () => this.onBarChartMouseOver('babyfood'),
                    onMouseOut: this.onChartMouseOut,
                  }
                }]}
              />
            )}
          </VictoryStack>

          {shouldRenderBreastData && (
            <VictoryGroup
              data={breastData}
              x="date"
              y="duration"
              color={DATA_FILL_COLOR['breast']}
            >
              <VictoryLine />
              <VictoryScatter
                size={5}
                labels={() => null}
                style={{
                  labels: {
                    fill: LABEL_COLOR['breast'],
                    fontSize: 20,
                    stroke: LABEL_COLOR['breast'],
                    strokeWidth: 1
                  }
                }}
                events={[{
                  target: "data",
                  eventHandlers: {
                    onMouseOver: this.onBreastChartMouseOver,
                    onMouseOut: this.onChartMouseOut,
                  }
                }]}
              />
            </VictoryGroup>
          )}
        </VictoryChart>
      </div>
    )
  }
}

export default withTranslate(FeedChart);