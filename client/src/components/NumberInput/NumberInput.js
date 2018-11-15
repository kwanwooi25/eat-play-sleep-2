import React, { Component } from 'react';
import { ozToMl, mlToOz, inToCm, cmToIn, lbToKg, kgToLb } from '../../helpers/unitChange';

class NumberInput extends Component {
  constructor(props) {
    super(props);

    let { value, unit } = props;
    let decimalModifier = 10;

    if (unit === 'oz') value = mlToOz(value);
    if (unit === 'in') value = cmToIn(value);
    if (unit === 'lb') value = kgToLb(value);
    if (unit === 'oz' || unit === 'in' || unit === 'lb') decimalModifier = 100;

    const hundred = Math.floor(value / 100) || 0;
    const ten = Math.floor((value - (hundred * 100)) / 10) || 0;
    const one = Math.floor(value - (hundred * 100) - (ten * 10)) || 0;
    const decimal = (value - (hundred * 100) - (ten * 10) - one) * decimalModifier || 0;

    this.state = { hundred, ten, one, decimal };
  }

  componentDidMount() {
    const { value } = this.props;
    const { hundred, ten, one, decimal } = this.state;

    if (value) {
      const scrollHeight = this.oneSpinner.children[0].scrollHeight;
      if (this.hundredSpinner) this.hundredSpinner.scrollTo({ top: hundred * scrollHeight });
      if (this.tenSpinner) this.tenSpinner.scrollTo({ top: ten * scrollHeight });
      this.oneSpinner.scrollTo({ top: one * scrollHeight });
      if (this.decimalSpinner) this.decimalSpinner.scrollTo({ top: decimal * scrollHeight });
    }
  }

  handleSpinnerScroll = (e, name) => {
    const currentScrollPosition = e.target.scrollTop;
    const childScrollHeight = e.target.children[0].scrollHeight;
    let selected = Math.round(currentScrollPosition / childScrollHeight);
    const value = Number(e.target.children[selected].textContent);

    this.setState({ [name]: value }, () => {
      this.handleChange();
    });
  }

  handleChange = () => {
    const { hundred, ten, one, decimal } = this.state;
    const { showDecimal, onChange, unit } = this.props;

    let value = (hundred * 100) + (ten * 10) + one;
    if (showDecimal) {
      if (unit === 'oz' || unit === 'in' || unit === 'lb') {
        value += (decimal / 100);
      } else {
        value += (decimal / 10);
      }
    }

    if (unit === 'oz') value = ozToMl(value);
    else if (unit === 'in') value = inToCm(value);
    else if (unit === 'lb') value = lbToKg(value);

    onChange(value);
  }

  renderNumbers = (numbers, name) =>
    numbers.map(number => <li key={`${number}-${name}`}>{number}</li>);

  render() {
    const {
      className = '',
      label,
      labelAlign = 'row', // 'row', 'column'
      unit,
      showDecimal,
      showHundred = true,
      hundredMax = 9,
      showTen = true,
      tenMax = 9,
      small = false,
    } = this.props;

    const numbers = {
      hundred: [],
      ten: [],
      one: [],
      decimal: [],
    };
    let spinners = [];

    if (showHundred) {
      spinners.push('hundred');
      for (let i = 0; i <= hundredMax; i++) numbers.hundred.push(i);
    }
    if (showTen) {
      spinners.push('ten');
      for (let i = 0; i <= tenMax; i++) numbers.ten.push(i);
    }
    spinners.push('one');
    for (let i = 0; i <= 9; i++) numbers.one.push(i);
    if (showDecimal) {
      if (unit === 'oz' || unit === 'in' || unit === 'lb') {
        for (let i = 0; i <= 75; i += 25) numbers.decimal.push(i);
      } else {
        for (let i = 0; i <= 9; i++) numbers.decimal.push(i);
      }
    }

    const containerClassName =
      `number-input-container ${className} label-align--${labelAlign} ${small ? 'small' : ''}`

    return (
      <div className={containerClassName}>
        {label && <label>{label}</label>}
        <div className="number-input">
          <div className="number-input__spinner">
            {spinners.map(name => (
              <div key={name} className={`number-input__spinner__${name}-wrapper`}>
                <ul
                  ref={ref => this[`${name}Spinner`] = ref}
                  className={`number-input__spinner__${name}`}
                  onScroll={e => this.handleSpinnerScroll(e, name)}
                >
                  {this.renderNumbers(numbers[name], name)}
                </ul>
              </div>
            ))}
            {showDecimal && <span className="number-input__point">.</span>}
            {showDecimal && (
              <div className="number-input__spinner__decimal-wrapper">
                <ul
                  ref={ref => this.decimalSpinner = ref}
                  className="number-input__spinner__decimal"
                  onScroll={e => this.handleSpinnerScroll(e, 'decimal')}
                >
                  {this.renderNumbers(numbers['decimal'], 'decimal')}
                </ul>
              </div>
            )}
          </div>
          <div className="number-input__unit">
            {unit}
          </div>
        </div>
      </div>
    )
  }
}

export default NumberInput;