import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Victory Chart Components */
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
  VictoryLabel,
} from 'victory';

/** Helper functions */
import secondsToHMS from '../../helpers/secondsToHMS';

const DATA_FILL_COLOR = {
  sleep: "#9E9E9E",
};
const DATA_STROKE_COLOR = {
  sleep: "#9E9E9E",
};
const LABEL_COLOR = {
  sleep: "#9E9E9E",
};

class DurationChart extends Component {

  onChartMouseOver = name => (
    [
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
          const { duration } = props.datum;
          return { text: secondsToHMS(duration) };
        }
      }
    ]
  )
  
  onChartMouseOut = () => (
    [
      { target: "data", mutation: () => null },
      { target: "labels", mutation: () => null }
    ]
  )

  render() {
    const {
      translate,
      source
    } = this.props;

    const { keys, name } = source;

    const data = keys.map(key => ({ data: key, duration: source[key].duration }));

    return (
      <div className="duration-chart">
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
        >
          <VictoryAxis
            tickCount={7}
            tickValues={keys}
            tickFormat={x => parseInt(x.split('-')[1])}
          />
          <VictoryAxis
            label={translate('durationLabel')}
            dependentAxis
            tickFormat={x => secondsToHMS(x)}
            style={{ axisLabel: { padding: -15 } }}
          />
          <VictoryLegend
            x={20} y={10}
            orientation="horizontal"
            gutter={25}
            style={{ border: { stroke: "black" } }}
            data={[
              { name: translate(name), symbol: { fill: DATA_FILL_COLOR[name] } },
            ]}
          />
          <VictoryBar
            data={data}
            x="date"
            y="duration"
            color={DATA_FILL_COLOR[name]}
            barRatio={0.9}
            labels={() => null}
            labelComponent={<VictoryLabel dy={8} />}
            style={{
              labels: {
                fill: LABEL_COLOR[name],
                fontSize: 20,
                stroke: LABEL_COLOR[name],
                strokeWidth: 1
              }
            }}
            events={[{
              target: "data",
              eventHandlers: {
                onMouseOver: () => this.onChartMouseOver(name),
                onMouseOut: this.onChartMouseOut,
              }
            }]}
          />
        </VictoryChart>
      </div>
    )
  }
}

export default withTranslate(DurationChart);