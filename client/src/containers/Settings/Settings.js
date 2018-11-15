import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import SVGIcon from '../../components/SVGIcon/SVGIcon';
import NoBaby from '../../components/NoBaby/NoBaby';
import BabyProfile from '../../components/BabyProfile/BabyProfile';
import AppSettingsDialog from '../../components/AppSettingsDialog/AppSettingsDialog';

/** Actions */
import * as actions from '../../actions';

const APP_SETTINGS = [
  'displayActivities',
  'displayLanguage',
  'displayUnits'
];

class Settings extends Component {
  state = {
    isAppSettingsDialogOpen: false,
    settingsLabel: '',
  }

  openAppSettingsDialog = label => {
    this.setState({
      isAppSettingsDialogOpen: true,
      settingsLabel: label
    });
  }

  handleAppSettingsDialogClose = result => {
    const { settingsLabel } = this.state;
    const {
      auth: { currentUser },
      updateUser,
    } = this.props;

    if (result) {
      currentUser.settings[settingsLabel] = result;
      updateUser(currentUser);
    }
    
    this.setState({
      isAppSettingsDialogOpen: false,
      settingsLabel: '',
    });
  }

  render() {
    const {
      translate,
      auth: { currentUser },
      babies: { currentBaby, all },
    } = this.props;
    const {
      isAppSettingsDialogOpen,
      settingsLabel,
    } = this.state;

    return (
      <div className="settings">
        <div className="settings__baby-profile">
          {currentBaby ? (
            <BabyProfile
              user={currentUser}
              baby={currentBaby}
              all={all}
            />
          ) : (
            <NoBaby />
          )}
        </div>
        <div className="settings__app-settings">
          <div className="settings__app-settings__title">
            <h3>{translate('appSettingsTitle')}</h3>
          </div>
          <div className="settings__app-settings__buttons">
            {APP_SETTINGS.map(name => {
              return (
                <button
                  key={name}
                  className="settings__app-settings__buttons__button"
                  onClick={() => this.openAppSettingsDialog(name)}
                >
                  <div className="settings__app-settings__buttons__button__label">
                    {translate(name)}
                  </div>
                  <div className="settings__app-settings__buttons__button__icon">
                    <SVGIcon name="arrow_right" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <AppSettingsDialog
          open={isAppSettingsDialogOpen}
          onClose={this.handleAppSettingsDialogClose}
          settingsLabel={settingsLabel}
          displayActivities={currentUser.settings.displayActivities}
          displayLanguage={currentUser.settings.displayLanguage}
          displayUnits={currentUser.settings.displayUnits}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ auth, babies }) => {
  return { auth, babies };
}

export default withTranslate(connect(mapStateToProps, actions)(Settings));