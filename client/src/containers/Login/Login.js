/** Dependancies */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI Components */
import Paper from '@material-ui/core/Paper';

/** Components */
import SVGIcon from '../../components/SVGIcon/SVGIcon';
import CustomDialog from '../../components/CustomDialog/CustomDialog';

/** Actions */
import * as actions from '../../actions';

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:5000';

const OAUTH_PROVIDERS = [ 'google', 'facebook', 'kakao', 'naver' ];

class Login extends Component {
  state = {
    isConfirmModalOpen: false
  }

  handleGuestLogin = () => {
    this.setState({ isConfirmModalOpen: true });
  }

  handleModalClose = result => {
    this.setState({ isConfirmModalOpen: false });
    if (result === true) this.props.loginAsGuest();
  }

  renderOauthButtons = providers => {
    return providers.map(name => {
      return (
        <a
          key={name}
          href={`${API_HOST}/auth/${name}`}
          className="social-login__button"
        >
          <SVGIcon name={name} />
        </a>
      )
    })
  }

  render() {
    const { translate } = this.props;
    const { isConfirmModalOpen } = this.state;

    return (
      <div className="login">
        <Paper className="login-form">
          <div className="login-form__title">
            <h2>{translate('login')}</h2>
          </div>
          <div className="social-login">
            {this.renderOauthButtons(OAUTH_PROVIDERS)}
          </div>
          <div className="login-form__divider">OR</div>
          <div className="guest-login">
            <button
              className="guest-login__button"
              onClick={this.handleGuestLogin}
            >
              {translate('continueAsGuest')}
            </button>
          </div>
        </Paper>
        
        <CustomDialog
          open={isConfirmModalOpen}
          onClose={this.handleModalClose}
          title={translate('guestLogin')}
          message={translate('guestLoginAlert')}
          variant="confirm"
        />
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default withTranslate(
  connect(
    mapStateToProps,
    actions
  )(Login)
);