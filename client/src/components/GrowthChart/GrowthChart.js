import moment from 'moment';
import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Growth Standards */
import boysStandards from '../../assets/boys_standards.json';
import girlsStandards from '../../assets/girls_standards.json';

/** Victory Chart Components */
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTheme,
  VictoryScatter,
  VictoryLegend,
} from 'victory';

/** Helper functions */
import { comma } from '../../helpers/comma';
import { cmToIn, kgToLb } from '../../helpers/unitChange';

const DATA_FILL_COLOR = {
  standard: '#B2DFDB',
  height: "#FF5722",
  weight: "#FF5722",
  head: "#FF5722",
};
const DATA_STROKE_COLOR = {
  standard: '#B2DFDB',
  height: "#FF5722",
  weight: "#FF5722",
  head: "#FF5722",
};
const LABEL_COLOR = {
  standard: '#B2DFDB',
  height: "#FF5722",
  weight: "#FF5722",
  head: "#FF5722",
};

class GrowthChart extends Component {

  getStandardsData = (gender, age) => {
    const { displayUnits } = this.props;
    const lengthUnit = displayUnits ? displayUnits.length : 'cm';
    const weightUnit = displayUnits ? displayUnits.weight : 'kg';
    const standards = gender === 'boy' ? boysStandards : girlsStandards;

    const standardsData = {};
    const minMax = {};

    Object.keys(standards).forEach(key => {
      standardsData[key] = standards[key]
        .filter(({ month }) => 
          (age - 2 <= month && month <= age + 2));

      if ((key === 'height'|| key === 'head') && lengthUnit === 'in') {
        standardsData[key] = standardsData[key].map(data => {
          return {
            month: data.month,
            third: cmToIn(data.third),
            fifteenth: cmToIn(data.fifteenth),
            median: cmToIn(data.median),
            eightyfifth: cmToIn(data.eightyfifth),
            ninetyseventh: cmToIn(data.ninetyseventh),
          }
        });
      } else if (key === 'weight' && weightUnit === 'lb') {
        standardsData[key] = standardsData[key].map(data => {
          return {
            month: data.month,
            third: kgToLb(data.third),
            fifteenth: kgToLb(data.fifteenth),
            median: kgToLb(data.median),
            eightyfifth: kgToLb(data.eightyfifth),
            ninetyseventh: kgToLb(data.ninetyseventh),
          }
        });
      }

      const min = standardsData[key][0].third;
      const max = standardsData[key][standardsData[key].length - 1].ninetyseventh;
      const median = standardsData[key][0].median;

      minMax[key] = {
        min: min - (median * 0.1),
        max: max + (median * 0.1),
      }
    });

    return { standardsData, minMax };
  }

  getLastMeasure = source => {
    const babyData = source.keys
      .map(key => {
        if (source[key].count !== 0) return source[key];
        return undefined;
      })
      .filter(value => value);

    return babyData && babyData[babyData.length - 1];
  }
  
  onChartMouseOver = name => {
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
      }
    ];
  }
  
  onChartMouseOut = () => [{ target: "data", mutation: () => null }];

  render() {
    const { translate, source, baby, displayUnits } = this.props;
    const lengthUnit = displayUnits ? displayUnits.length : 'cm';
    const weightUnit = displayUnits ? displayUnits.weight : 'kg';
    const ageInMonth = moment().diff(moment(baby.birthday), 'months');
    const { standardsData, minMax } = this.getStandardsData(baby.gender, ageInMonth);
    const lastMeasure = this.getLastMeasure(source);

    if (lengthUnit === 'in') {
      lastMeasure.height = cmToIn(lastMeasure.height);
      lastMeasure.head = cmToIn(lastMeasure.head);
    }
    if (weightUnit === 'lb') lastMeasure.weight = kgToLb(lastMeasure.weight);

    return (
      <div className="growth-chart">
        {Object.keys(standardsData).map(name => {
          const unit =
            (name === 'height' || name === 'head') ?
              lengthUnit :
              name === 'weight' && weightUnit;

          return (
            <div key={name} className="growth-chart__item" >
              <div>{translate(name)}</div>
              <VictoryChart theme={VictoryTheme.material}>
                <VictoryAxis tickFormat={x => `${x}m`} />
                <VictoryAxis
                  dependentAxis
                  tickFormat={x => `${comma(x)}${unit}`}
                />
                <VictoryLegend
                  x={20} y={10}
                  orientation="horizontal"
                  gutter={25}
                  data={[{
                    name: translate('WHOstandard'),
                    symbol: { fill: DATA_FILL_COLOR['standard'] }
                  }]}
                />
                <VictoryArea
                  data={standardsData[name]}
                  x="month"
                  y0="third"
                  y="ninetyseventh"
                  interpolation="natural"
                  domain={{ y: [minMax[name].min, minMax[name].max] }}
                  style={{
                    data: {
                      fill: DATA_FILL_COLOR['standard'],
                      fillOpacity: 0.7,
                    },
                  }}
                />
                {lastMeasure && (
                  <VictoryScatter
                    data={[{
                      month: ageInMonth,
                      [name]: parseFloat(lastMeasure[name].toFixed(2)),
                    }]}
                    x="month"
                    y={name}
                    size={5}
                    labels={v => v[name]}
                    style={{
                      data: { fill: DATA_FILL_COLOR[name] },
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
                )}
              </VictoryChart>
            </div>
          )
        })}
      </div>
    )
  }
}

export default withTranslate(GrowthChart);