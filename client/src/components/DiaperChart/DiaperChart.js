import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Victory Chart Components */
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryLabel,
} from 'victory';

const DATA_FILL_COLOR = { pee: '#FFEB3B', poo: '#795548' };
const DATA_STROKE_COLOR = { pee: '#FFEB3B', poo: '#795548' };
const LABEL_COLOR = { pee: '#F57F17', poo: '#3E2723' };

class DiaperChart extends Component {
  
  onChartMouseOver = type => {
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
                stroke: DATA_STROKE_COLOR[type],
                strokeWidth: 1
              }
            );
          return Object.assign({}, props, { style: newStyle });
        }
      }, {
        target: "labels",
        mutation: props => {
          const text = props.datum[type];
          return { text };
        }
      }
    ];
  }
  
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
    
    const { keys } = source;

    const data = keys.map(key => 
      ({ data: key, pee: source[key].pee, poo: source[key].poo })
    );

    return (
      <div className="diaper-chart">
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis
            tickCount={7}
            tickValues={keys}
            tickFormat={x => parseInt(x.split('-')[1])}
          />
          <VictoryAxis
            label={translate('times')}
            dependentAxis
            tickCount={4}
            style={{ axisLabel: { padding: -15 } }}
          />
          <VictoryLegend
            x={20} y={10}
            orientation="horizontal"
            gutter={25}
            style={{ border: { stroke: "black" } }}
            data={[
              { name: translate('pee'), symbol: { fill: DATA_FILL_COLOR['pee'] } },
              { name: translate('poo'), symbol: { fill: DATA_FILL_COLOR['poo'] } },]}
          />
          <VictoryStack>
            {['pee', 'poo'].map(name => {
              return (
                <VictoryBar
                  key={name}
                  data={data}
                  x="date"
                  y={name}
                  color={DATA_FILL_COLOR[name]}
                  barRatio={0.9}
                  labels={() => null}
                  labelComponent={<VictoryLabel dy={30}/>}
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
              )
            })}
          </VictoryStack>
        </VictoryChart>
      </div>
    )
  }
}

export default withTranslate(DiaperChart);