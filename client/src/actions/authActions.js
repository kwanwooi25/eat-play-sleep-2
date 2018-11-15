import axios from 'axios';
import {
  GET_CURRENT_USER,
  LOGIN_AS_GUEST,
  AUTH_ERROR,
  LOGOUT_USER,
} from './types';
import {
  getGuestUser,
  setGuestUser,
  logoutGuestUser,
} from '../helpers/localStorage';
import {
  getBabies
} from './babyActions';
import { IntlActions } from 'react-redux-multilingual';

export const getCurrentUser = () => async dispatch => {
  /** Guest */
  const guest = getGuestUser();
  if (guest && guest.isLoggedIn) {
    const userLanguage = guest.settings.displayLanguage;
    if (userLanguage) dispatch(IntlActions.setLocale(userLanguage));
    dispatch(getBabies(guest));
    return dispatch({ type: GET_CURRENT_USER, payload: guest });
  }

  /** Oauth */
  const res = await axios.get('/auth/current_user');
  const { success, error, data } = res.data;
  
  if (success) {
    const userLanguage = data.settings.displayLanguage;
    if (userLanguage) dispatch(IntlActions.setLocale(userLanguage));
    dispatch(getBabies(data));
    dispatch({ type: GET_CURRENT_USER, payload: data });
  } else {
    dispatch({ type: AUTH_ERROR, payload: error });
  } 
}

export const loginAsGuest = () => dispatch => {
  let user = getGuestUser();

  /**
   * when user exists,
   * set the user as logged in
   */
  if (user) {
    user.isLoggedIn = true;
  /**
   * when user doesn't exist,
   * generate new user
   */
  } else {
    user = {
      isLoggedIn: true,
      id: 'localuser',
      provider: 'local',
      settings: {},
    };
  }

  // save guest info to localStorage;
  setGuestUser(user);

  dispatch(getBabies(user));
  dispatch({ type: LOGIN_AS_GUEST, payload: user });
}

export const logoutUser = user => async dispatch => {
  dispatch({ type: LOGOUT_USER });
  
  // logout guest user
  if (user.provider === 'local') logoutGuestUser();

  // logout user
  else await axios.get('/auth/logout');
}

export const updateUser = user => async dispatch => {
  if (user.provider === 'local') setGuestUser(user);
  // else await axios.put(`${API_HOST}/api/users`, user);
  else await axios.put('/api/users', user);

  dispatch(getCurrentUser());
}