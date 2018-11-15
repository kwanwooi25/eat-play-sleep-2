import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI Components */
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';

/** Components */
import ActivityTimer from '../../components/ActivityTimer/ActivityTimer';
import ActivityTimerMulti from '../../components/ActivityTimerMulti/ActivityTimerMulti';
import CustomSelector from '../../components/CustomSelector/CustomSelector';
import NumberInput from '../../components/NumberInput/NumberInput';
import CustomDateTimePicker from '../../components/CustomDateTimePicker/CustomDateTimePicker';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';

/** Actions */
import * as actions from '../../actions';

const Transition = props => <Slide direction="left" {...props} />;

const CUSTOM_SELECTOR_OPTIONS = {
  bottle: [ 'breast_milk', 'formula_milk' ],
  diaper: [ 'pee', 'poo', 'peepoo' ],
};

class Activity extends Component {
  constructor(props) {
    super(props);

    const {
      time_start = null,
      type = '',
      amount = 0,
      height = 0,
      weight = 0,
      head = 0,
      memo
    } = props.activity;

    this.state = {
      time_start,
      type,
      amount,
      height,
      weight,
      head,
      memo
    }
  }

  handleInputChange = e => {
    let { name, value } = e.target;
    const { activity, updateActivityInProgress } = this.props;

    this.setState({ [name]: value });
    activity[name] = value;
    updateActivityInProgress(activity);
  }

  handleNumberInputChange = (name, value) => {
    const { activity, updateActivityInProgress } = this.props;
    this.setState({ [name]: value });
    activity[name] = value;
    updateActivityInProgress(activity);
  }

  handleDateTimeChange = date => {
    const { activity, updateActivityInProgress } = this.props;

    this.setState({ time_start: date });
    activity.time_start = date;
    updateActivityInProgress(activity);
  }

  setDateTimeToNow = () => {
    const { activity, updateActivityInProgress } = this.props;

    this.setState({ time_start: moment() });
    activity.time_start = moment();
    updateActivityInProgress(activity);
  }

  renderContent = () => {
    const {
      translate,
      activity,
      auth: { currentUser : { settings: { displayUnits } } },
    } = this.props;
    const { name } = activity;
    const {
      time_start,
      amount,
      height,
      weight,
      head,
      type,
      memo
    } = this.state;

    const volumeUnit = displayUnits ? displayUnits.volume : 'ml';
    const lengthUnit = displayUnits ? displayUnits.length : 'cm';
    const weightUnit = displayUnits ? displayUnits.weight : 'kg';

    const shouldRenderActivityTimerMulti = ['breast', 'pump'].includes(name);
    const shouldRenderActivityTimer = ['bottle', 'sleep'].includes(name);
    const shouldRenderDateTimePicker = ['babyfood', 'diaper', 'growth'].includes(name);
    const shouldRenderAmountInput = ['pump', 'bottle', 'babyfood'].includes(name);
    const shouldRenderCustomSelector = ['bottle', 'diaper'].includes(name);
    const shouldRenderMenuInput = ['babyfood'].includes(name);
    const shouldRenderHeightInput = ['growth'].includes(name);
    const shouldRenderWeightInput = ['growth'].includes(name);
    const shouldRenderHeadInput = ['growth'].includes(name);

    return (
      <div className="activity__content">
        {shouldRenderActivityTimerMulti && <ActivityTimerMulti activity={activity} />}
        {shouldRenderActivityTimer && <ActivityTimer activity={activity} />}
        {shouldRenderDateTimePicker && (
          <CustomDateTimePicker
            value={time_start}
            onChange={this.handleDateTimeChange}
          />
        )}
        {shouldRenderAmountInput && (
          <NumberInput
            value={amount}
            unit={volumeUnit}
            showHundred={volumeUnit === 'ml'}
            hundredMax={5}
            tenMax={volumeUnit === 'oz' ? 2 : 9}
            showDecimal={volumeUnit === 'oz'}
            onChange={value => this.handleNumberInputChange('amount', value)}
          />
        )}
        {shouldRenderCustomSelector && (
          <CustomSelector
            name="type"
            options={CUSTOM_SELECTOR_OPTIONS[name]}
            value={type}
            onChange={this.handleInputChange}
          />
        )}
        {shouldRenderMenuInput && (
          <CustomTextInput
            id="type"
            name="type"
            label={translate('menu')}
            value={type}
            onChange={this.handleInputChange}
          />
        )}
        {shouldRenderHeightInput && (
          <NumberInput
            label={translate('height')}
            value={height}
            unit={lengthUnit}
            showHundred={lengthUnit === 'cm'}
            hundredMax={1}
            tenMax={lengthUnit === 'in' ? 5 : 9}
            showDecimal
            onChange={value => this.handleNumberInputChange('height', value)}
          />
        )}
        {shouldRenderWeightInput && (
          <NumberInput
            label={translate('weight')}
            value={weight}
            unit={weightUnit}
            showHundred={false}
            tenMax={weightUnit === 'lb' ? 7 : 3}
            showDecimal
            onChange={value => this.handleNumberInputChange('weight', value)}
          />
        )}
        {shouldRenderHeadInput && (
          <NumberInput
            label={translate('head')}
            value={head}
            unit={lengthUnit}
            showHundred={false}
            tenMax={lengthUnit === 'cm' ? 5 : 3}
            showDecimal
            onChange={value => this.handleNumberInputChange('head', value)}
          />
        )}
        <CustomTextInput
          className="activity__content__memo"
          id="memo"
          label={translate('memo')}
          name="memo"
          value={memo}
          onChange={this.handleInputChange}
          multiline
        />
      </div>
    );
  }

  render() {
    const { onBack, onCancel, onSave, error, closeSnackbar } = this.props;
    const { title } = this.props.activity;

    return (
      <div className="activity">
        <div className="activity__title">
          <h2>{title}</h2>
          <IconButton color="inherit" onClick={onBack} aria-label="Back">
            <Icon>arrow_back</Icon>
          </IconButton>
        </div>

        {this.renderContent()}

        <div className="activity__buttons">
          <button
            className="activity__buttons__cancel"
            onClick={onCancel}
          >
            <Icon>clear</Icon>
          </button>
          <button
            className="activity__buttons__confirm"
            onClick={onSave}
          >
            <Icon>check</Icon>
          </button>
        </div>

        <Snackbar
          className="snackbar error"
          open={!!error}
          autoHideDuration={2000}
          onClose={closeSnackbar}
          TransitionComponent={Transition}
          message={<span>{error}</span>}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default withTranslate(connect(mapStateToProps, actions)(Activity));