import React, { Component } from 'react';

class TimeInput extends Component {
  state = { hour: 0, minute: 0, second: 0 };

  componentDidMount() {
    const { value } = this.props;
    if (value) this.setTimeSpinnerValue(value);
  }

  componentWillReceiveProps(nextProps) {
    const { readonly, value } = nextProps;
    if (readonly && value) this.setTimeSpinnerValue(value);
  }

  setTimeSpinnerValue = value => {
    const hour = Math.floor(value / 3600);
    const minute = Math.floor((value % 3600) / 60);
    const second = (value % 3600) % 60;
    const scrollHeight = this.minuteSpinner.children[0].scrollHeight;

    this.minuteSpinner.scrollTo({ top: minute * scrollHeight });
    this.secondSpinner.scrollTo({ top: second * scrollHeight });
    
    if (this.hourSpinner) {
      this.hourSpinner.scrollTo({ top: hour * scrollHeight });
    }

    this.setState({ hour, minute, second })
  }

  handleSpinnerScroll = (e, name) => {
    const currentScrollPosition = e.target.scrollTop;
    const childScrollHeight = e.target.children[0].scrollHeight;
    let selected = Math.round(currentScrollPosition / childScrollHeight);

    this.setState({ [name]: selected }, () => {
      this.handleChange();
    });
  }

  handleChange = () => {
    const { hour, minute, second } = this.state;
    const { hourController, onChange } = this.props;

    let value = (minute * 60) + second;
    if (hourController) value += (hour * 3600);
    onChange(value);
  }

  renderNumbers = (name) => {
    let numbers = [];
    const max = name === 'hour' ? 12 : 59;

    for (let i = 0; i < max; i++) numbers.push(i);

    return numbers.map(number => (
      <li key={`${number}-${name}`}>
        {('00'+number).slice(-2)}
      </li>
    ));
  }

  render() {
    const {
      className = '',
      label,
      labelAlign = 'row', // 'row', 'column'
      hourController = false,
      readonly = false,
      small = false,
    } = this.props;

    const containerClassName =
      `time-input-container ${className} label-align--${labelAlign}`;

    return (
      <div className={containerClassName}>
        {label && <label>{label}</label>}
        <div className={`time-input ${readonly ? 'readonly' : ''} ${small ? 'small' : ''}`}>
          <div className="time-input__spinner">
            {hourController && (
              <div className="time-input__spinner__hour-wrapper">
                <ul
                  ref={ref => this.hourSpinner = ref}
                  className="time-input__spinner__hour"
                  onScroll={e => this.handleSpinnerScroll(e, 'hour')}
                >
                  {this.renderNumbers('hour')}
                </ul>
              </div>
            )}
            {hourController && <span className="time-input__colon">:</span>}
            <div className="time-input__spinner__minute-wrapper">
              <ul
                ref={ref => this.minuteSpinner = ref}
                className="time-input__spinner__minute"
                onScroll={e => this.handleSpinnerScroll(e, 'minute')}
              >
                {this.renderNumbers('minute')}
              </ul>
            </div>
            <span className="time-input__colon">:</span>
            <div className="time-input__spinner__second-wrapper">
              <ul
                ref={ref => this.secondSpinner = ref}
                className="time-input__spinner__second"
                onScroll={e => this.handleSpinnerScroll(e, 'second')}
              >
                {this.renderNumbers('second')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// const TimeInput = ({
//   className = '',
//   label,
//   labelAlign = 'row', // 'row', 'column'
//   value,
//   hourController = false,
//   onHourMinus,
//   onHourPlus,
//   onMinuteMinus,
//   onMinutePlus,
//   onSecondMinus,
//   onSecondPlus,
//   readonly = false
// }) => {
//   return (
//     <div className={`time-input-container ${className} label-align--${labelAlign}`}>
//       {label && <label>{label}</label>}
//       <div className="time-input">
//         <div className="time-input__value">
//           {value}
//         </div>

//         {readonly === false && (
//           <div className="time-input__controllers">
//             {hourController && (
//               <div className="time-input__buttons">
//                 <button
//                   className="time-input__buttons__button"
//                   onClick={onHourPlus}
//                 >
//                   <Icon color="inherit">add</Icon>
//                 </button>
//                 <button
//                   className="time-input__buttons__button"
//                   onClick={onHourMinus}
//                 >
//                   <Icon color="inherit">remove</Icon>
//                 </button>
//               </div>
//             )}
//             <div className="time-input__buttons">
//               <button
//                 className="time-input__buttons__button"
//                 onClick={onMinutePlus}
//               >
//                 <Icon color="inherit">add</Icon>
//               </button>
//               <button
//                 className="time-input__buttons__button"
//                 onClick={onMinuteMinus}
//               >
//                 <Icon color="inherit">remove</Icon>
//               </button>
//             </div>
//             <div className="time-input__buttons">
//               <button
//                 className="time-input__buttons__button"
//                 onClick={onSecondPlus}
//               >
//                 <Icon color="inherit">add</Icon>
//               </button>
//               <button
//                 className="time-input__buttons__button"
//                 onClick={onSecondMinus}
//               >
//                 <Icon color="inherit">remove</Icon>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

export default TimeInput;