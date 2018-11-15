import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI Components */
import Icon from '@material-ui/core/Icon';

/** Components */
import NewBabyDialog from '../NewBabyDialog/NewBabyDialog';

/** Actions */
import * as actions from '../../actions';

class NoBaby extends Component {
  state = {
    isNewBabyDialogOpen: false
  }

  handleAddBabyButton = () => {
    this.setState({ isNewBabyDialogOpen: true });
  }

  handleNewBabyDialogClose = data => {
    const { auth, addBaby } = this.props;
    this.setState({ isNewBabyDialogOpen: false });

    if (data) {
      const baby = {
        name: data.name,
        gender: data.gender,
        birthday: data.birthday,
        guardians: [{ id: auth.currentUser.id, relationship: data.relationship }]
      }
      
      addBaby(auth.currentUser, baby);
    }
  }

  render() {
    const { translate } = this.props;
    const { isNewBabyDialogOpen } = this.state;

    return (
      <div className="no-baby">
        <div className="no-baby__display">
          <button
            className="no-baby__display__button"
            onClick={this.handleAddBabyButton}
          >
            <Icon fontSize="large">add</Icon>
          </button>
          <p className="no-baby__display__message">
            {translate('noBabyMessage_line1')}
          </p>
          <p className="no-baby__display__message">
            {translate('noBabyMessage_line2')}
          </p>
        </div>

        <NewBabyDialog
          open={isNewBabyDialogOpen}
          onClose={this.handleNewBabyDialogClose}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default withTranslate(connect(mapStateToProps, actions)(NoBaby));