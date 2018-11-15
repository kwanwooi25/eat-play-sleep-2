import moment from 'moment';
import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI Components */
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';

/** Components */
import SVGIcon from '../SVGIcon/SVGIcon';
import DialogButtonGroup from '../DialogButtonGroup/DialogButtonGroup';

const Transition = props => <Slide direction="down" {...props} />;

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

class CustomDateTimePicker extends Component {
  constructor(props) {
    super(props);

    const date = moment(props.value) || moment();

    this.state = { isPickerOpen: false, date };
  }

  componentWillReceiveProps(props) {
    if (props.value) this.setTimeSpinner(props.value);
  }

  openPicker = () => this.setState({ isPickerOpen: true });

  setTimeSpinner = value => {
    const { timePicker = true } = this.props;

    if (timePicker) {
      const hour = moment(value).hour();
      const minute = moment(value).minute();
      const scrollHeight = this.hourSpinner.children[0].scrollHeight;
      
      this.hourSpinner.scrollTo({ top: hour * scrollHeight });
      this.minuteSpinner.scrollTo({ top: minute * scrollHeight });
    }
  }

  handlePickerClose = result => {
    const { onChange, value } = this.props;
    const { date } = this.state;

    if (result) {
      onChange(date);
      this.setState({ isPickerOpen: false });
    } else {
      onChange(value);
      this.setState({ isPickerOpen: false, date: moment(value) });
    }
  }

  handleNowButtonClick = () => {
    this.props.onChange(moment());
    this.setState({ date: moment() });
  }

  handleMonthClick = change => {
    let { date } = this.state;

    if (change === 'prev') date = moment(date).subtract(1, 'months');
    else if (change === 'next') date = moment(date).add(1, 'months');

    this.setState({ date });
  }

  handleDateClick = clicked => {
    let { date } = this.state;
    const parsed = clicked.split('-');
    const year = parsed[0];
    const month = parsed[1] - 1;
    const day = parsed[2];

    this.setState({ date: date.year(year).month(month).date(day) });
  }

  handleSpinnerScroll = (e, name) => {
    let { date } = this.state;
    const currentScrollPosition = e.target.scrollTop;
    const childScrollHeight = e.target.children[0].scrollHeight;
    let selected = Math.round(currentScrollPosition / childScrollHeight);

    if (name === 'hour') {
      this.setState({ date: date.hour(selected) });
    } else if (name === 'minute') {
      this.setState({ date: date.minute(selected) });
    }
  }

  renderCalendarDays = (date, min, max) => {
    const startOfMonth = moment(date).startOf('month');
    const endOfMonth = moment(date).endOf('month');
    const dayOfStartOfMonth = startOfMonth.weekday();
    const dayOfEndOfMonth = endOfMonth.weekday();
    const startOfCalendar = startOfMonth.subtract(dayOfStartOfMonth, 'days');
    const endOfCalendar = endOfMonth.add(6 - dayOfEndOfMonth, 'days');
    let calendarDates = [];

    for (let i = startOfCalendar; i <= endOfCalendar; i.add(1, 'days')) {
      calendarDates.push(i.format('YYYY-MM-DD'));
    }

    return calendarDates.map(dateToRender => {
      const selected = moment(date);
      const current = moment(dateToRender);
      let className = 'custom-date-time-picker__date-picker__calendar__day';
      let isValid = true;
      if (selected.month() > current.month()) className += ' prevMonth';
      if (selected.month() < current.month()) className += ' nextMonth';
      if (selected.format('YYYY-MM-DD') === dateToRender) className += ' selected';
      if (min) isValid = isValid && current.startOf('date') >= moment(min).startOf('date');
      if (max) isValid = isValid && current.startOf('date') <= moment(max).startOf('date');

      return (
        <button
          key={dateToRender}
          className={className}
          onClick={() => { this.handleDateClick(dateToRender) }}
          disabled={isValid === false}
        >
          {current.date()}
        </button>
      )
    })
  }

  renderHours = () => {
    let hours = [];
    for (let i = 0; i <= 23; i++) hours.push(i);
    
    return hours.map(hour => (
      <li key={`${hour}h`} id={`${hour}h`}>
        {('00' + hour).slice(-2)}
      </li>
    ));
  }

  renderMinutes = () => {
    let minutes = [];
    for (let i = 0; i <= 59; i++) minutes.push(i);
    
    return minutes.map(minute => (
      <li key={`${minute}m`} id={`${minute}m`}>
        {('00' + minute).slice(-2)}
      </li>
    ));
  }

  render() {
    const {
      isPickerOpen,
      date,
    } = this.state;
    const {
      label,
      labelAlign = 'column',
      value = moment(),
      translate,
      className = '',
      datePicker = true,
      timePicker = true,
      showNowButton = true,
      min,
      max,
    } = this.props;

    const pickerClassName = `custom-date-time-picker label-align--${labelAlign} ${className}`;

    return (
      <div className="custom-date-time-picker-container">
        <div className={pickerClassName}>
        {label && <label>{label}</label>}
          <div className="custom-date-time-picker__picker-button-container">
            <button
              className="custom-date-time-picker__picker-button"
              onClick={this.openPicker}
            >
              {datePicker && (
                <span className="custom-date-time-picker__picker-button__date">
                  {moment(value).format(translate('dateFormat'))}
                </span>
              )}
              {timePicker && (
                <span className="custom-date-time-picker__picker-button__time">
                  {moment(value).format(translate('timeFormat'))}
                </span>
              )}
            </button>
            {showNowButton && (
              <button
                className="custom-date-time-picker__now-button"
                onClick={this.handleNowButtonClick}
              >
                {translate('nowLabel')}
              </button>
            )}
          </div>
        </div>
        
        <Dialog
          open={isPickerOpen}
          onClose={this.handlePickerClose}
          TransitionComponent={Transition}
          keepMounted
        >
          <div className="custom-date-time-picker__display">
            {datePicker && (
              <span className="custom-date-time-picker__display__date">
                {date.format(translate('dateFormat'))}
              </span>
            )}
            {timePicker && (
              <span className="custtime-time-picker__display__time">
                {date.format(translate('timeFormat'))}
              </span>
            )}
          </div>

          {datePicker && (
            <div className="custom-date-time-picker__date-picker">
              <div className="custom-date-time-picker__date-picker__header">
                <div className="custom-date-time-picker__date-picker__header__month-select">
                  <button
                    className="custom-date-time-picker__date-picker__header__month-select__button"
                    onClick={() => this.handleMonthClick('prev')}
                  >
                    <SVGIcon name="arrow_left" />
                  </button>
                  <span className="custom-date-time-picker__date-picker__header__month-select__month">
                    {date.format(translate('yearMonthFormat'))}
                  </span>
                  <button
                    className="custom-date-time-picker__date-picker__header__month-select__button"
                    onClick={() => this.handleMonthClick('next')}
                  >
                    <SVGIcon name="arrow_right" />
                  </button>
                </div>
              </div>
              <div className="custom-date-time-picker__date-picker__calendar">
                {WEEKDAYS.map(weekday => (
                  <span
                    key={weekday}
                    className="custom-date-time-picker__date-picker__calendar__weekday"
                  >
                    {translate(weekday)}
                  </span>
                ))}
                {this.renderCalendarDays(date, min, max)}
              </div>
            </div>
          )}

          {timePicker && (
            <div className="custom-date-time-picker__time-picker">
              <div className="custom-date-time-picker__time-picker__spinner">
                <div className="custom-date-time-picker__time-picker__spinner__hour-wrapper">
                  <ul
                    ref={ref => this.hourSpinner = ref}
                    className="custom-date-time-picker__time-picker__spinner__hour"
                    onScroll={e => this.handleSpinnerScroll(e, 'hour')}
                  >
                    {this.renderHours()}
                  </ul>
                </div>
                <span className="custom-date-time-picker__time-picker__time-label">
                  {translate('hourLabel')}
                </span>
                <div className="custom-date-time-picker__time-picker__spinner__minute-wrapper">
                  <ul
                    ref={ref => this.minuteSpinner = ref}
                    className="custom-date-time-picker__time-picker__spinner__minute"
                    onScroll={e => this.handleSpinnerScroll(e, 'minute')}
                  >
                    {this.renderMinutes()}
                  </ul>
                </div>
                <span className="custom-date-time-picker__time-picker__time-label">
                  {translate('minuteLabel')}
                </span>
              </div>
            </div>
          )}

          <DialogButtonGroup
            variant="confirm"
            cancelLabel={translate('cancel')}
            confirmLabel={translate('confirm')}
            onCancel={() => this.handlePickerClose(false)}
            onConfirm={() => this.handlePickerClose(true)}
          />
        </Dialog>
      </div>
    )
  }
}

export default withTranslate(CustomDateTimePicker);