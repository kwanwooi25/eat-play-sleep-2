import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI Components */
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';

/** Components */
import Log from '../../components/Log/Log';
import EditActivityDialog from '../../components/EditActivityDialog/EditActivityDialog';
import CustomDialog from '../../components/CustomDialog/CustomDialog';
import CustomSelector from '../../components/CustomSelector/CustomSelector';
import NoData from '../../components/NoData/NoData';

/** Actions */
import * as actions from '../../actions';

const DISPLAY_TOGGLE_OPTIONS = [
  'breast',
  'bottle',
  'pump',
  'babyfood',
  'diaper',
  'sleep',
  'growth',
];

const Transition = props => <Slide direction="left" {...props} />;

class Logs extends Component {
  state = {
    show: DISPLAY_TOGGLE_OPTIONS,
    isEditActivityDialogOpen: false,
    isConfirmModalOpen: false,
    isSnackbarOpen: false,
    snackbarType: '',
    snackbarMessage: ''
  }

  handleMenuClick = (activityID, menuClicked) => {
    const { auth: { currentUser }, getActivityById } = this.props;
    
    getActivityById(currentUser, activityID);

    if (menuClicked === 'edit') this.openEditActivityDialog();
    else if (menuClicked === 'delete') this.openConfirmDialog();
  }

  handleDisplayOptionClick = e => {
    const { value } = e.target;
    const {
      auth: { currentUser },
      babies: { currentBaby },
      getActivities
    } = this.props;
    let { show } = this.state;

    if (show.includes(value)) show = show.filter(i => i !== value);
    else show.push(value);
    
    getActivities(currentUser, currentBaby.id, { name: show });
    this.setState({ show });
  }

  openEditActivityDialog = () => {
    this.setState({ isEditActivityDialogOpen: true });
  }

  handleEditActivityDialogClose = (result, data) => {
    const {
      translate,
      auth: { currentUser },
      updateActivity,
      resetCurrentActivity,
    } = this.props;

    if (result) {
      updateActivity(currentUser, data);
      const title = translate(data.name);
      this.showSnackbar(translate('successActivityUpdate', { title }), 'success');
    }

    resetCurrentActivity();
    this.setState({ isEditActivityDialogOpen: false });
  }

  openConfirmDialog = () => this.setState({ isConfirmModalOpen: true });

  handleConfirmModalClose = result => {
    const {
      translate,
      auth: { currentUser },
      activities: { currentActivity },
      removeActivity,
      resetCurrentActivity,
    } = this.props;

    if (result) {
      removeActivity(currentUser, currentActivity);
      const title = translate(currentActivity.name);
      this.showSnackbar(translate('successActivityRemove', { title }), 'success');
    }

    resetCurrentActivity();
    this.setState({ isConfirmModalOpen: false });
  }

  showSnackbar = (message, type) => {
    this.setState({
      isSnackbarOpen: true,
      snackbarMessage: message,
      snackbarType: type,
    });
  }

  handleSnackbarClose = () => {
    this.setState({
      isSnackbarOpen: false,
      snackbarMessage: '',
      snackbarType: '',
    });
  }

  renderLog = (data, shouldDisplay) => {
    const {
      translate,
      auth: { currentUser: { settings: { displayUnits } } },
    } = this.props;
    const mappedByDates = {};

    if (shouldDisplay) {
      data = data.filter(({ name }) => shouldDisplay.includes(name));
    }

    data.forEach(activity => {
      const date = moment(activity.time_start).format('YYYYMMDD');
      if (mappedByDates[date]) {
        mappedByDates[date].push(activity);
      } else {
        mappedByDates[date] = [activity];
      }
    });

    return Object.keys(mappedByDates).sort((a, b) => b - a).map(date => {
      const activities = mappedByDates[date];
      const isToday = moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD');
      const dateString = isToday ?
        translate('today') :
        moment(date).format(translate('dateFormatLong'));
        
      return (
        <div className="logs__group" key={date}>
          <div className="logs__group__title">{dateString}</div>
          <div className="logs__group__list">
            {activities.map(activity => (
              <Log
                key={activity.id}
                activity={activity}
                amountUnit={displayUnits ? displayUnits.volume : 'ml'}
                onMenuClick={this.handleMenuClick}
              />
            ))}
          </div>
        </div>
      )
    });
  }

  render() {
    const {
      show,
      isEditActivityDialogOpen,
      isConfirmModalOpen,
      isSnackbarOpen,
      snackbarType,
      snackbarMessage
    } = this.state;
    const {
      translate,
      auth: { currentUser : { settings: { displayActivities, displayUnits } } },
      activities
    } = this.props;
    const { all, currentActivity } = activities;

    let toggleOptions = DISPLAY_TOGGLE_OPTIONS;
    if (displayActivities) {
      toggleOptions = DISPLAY_TOGGLE_OPTIONS.filter(name => displayActivities.includes(name));
    }

    return (
      <div className="logs">
        <div className="logs__display-options">
          <CustomSelector
            options={toggleOptions}
            value={show}
            onChange={this.handleDisplayOptionClick}
            multiChoice={true}
          />
        </div>
        {all.length === 0
          ? <NoData icon="list" message={translate('noLogs')} />
          : this.renderLog(all, displayActivities)}

        <EditActivityDialog
          open={isEditActivityDialogOpen}
          onClose={this.handleEditActivityDialogClose}
          activity={currentActivity}
          displayUnits={displayUnits}
        />

        <CustomDialog
          open={isConfirmModalOpen}
          onClose={this.handleConfirmModalClose}
          title={translate('confirmActivityDeleteTitle')}
          message={translate('confirmActivityDeleteMessage')}
          variant="confirm"
        />

        <Snackbar
          className={`snackbar ${snackbarType}`}
          open={isSnackbarOpen}
          autoHideDuration={2000}
          onClose={this.handleSnackbarClose}
          TransitionComponent={Transition}
          message={<span>{snackbarMessage}</span>}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ auth, babies, activities }) => {
  return { auth, babies, activities };
}

export default withTranslate(connect(mapStateToProps, actions)(Logs));