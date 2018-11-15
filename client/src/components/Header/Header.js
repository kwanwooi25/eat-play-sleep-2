import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** actions */
import * as actions from '../../actions';

const Header = ({
  translate,
  auth: { currentUser },
  babies: { currentBaby },
  logoutUser
}) => {
  let babyName = '';
  let babyAge = '';

  if (currentBaby) {
    const today = moment();
    const birthday = moment(currentBaby.birthday);
    babyName = currentBaby.name;
    babyAge = today.diff(birthday, 'days');
  }

  return (
    <header className="main-header">
      <div className="baby-info">
        {babyName && <h3 className="baby-name">{babyName}</h3>}
        {babyAge && (
          <span className="baby-age">
            ({translate('babyAge', { age: babyAge })})
          </span>
        )}
      </div>
      <button
        className="main-header__button"
        onClick={() => logoutUser(currentUser)}
      >
        {translate('logout')}
      </button>
    </header>
  )
}

const mapStateToProps = ({ auth, babies }) => {
  return { auth, babies }
}

export default withTranslate(connect(mapStateToProps, actions)(Header));