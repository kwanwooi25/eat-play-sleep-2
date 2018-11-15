import axios from 'axios';
import {
  GET_BABIES,
  GET_BABIES_FAILED
} from './types';
import { getCurrentUser } from './authActions';
import {
  getGuestBabies,
  addGuestBaby,
  editGuestBaby,
  deleteGuestBaby,
} from '../helpers/localStorage';
import { getActivities, updateActivitiesInProgress } from './activityActions';

export const getBabies = user => async dispatch => {
  const { id, provider } = user;
  let all = [];

  if (provider === 'local') {
    all = getGuestBabies() || [];
  } else {
    const res = await axios.get(`/api/babies?userID=${id}`);
    const { success, error, data } = res.data;
    if (error) return dispatch({ type: GET_BABIES_FAILED, payload: error });
    if (success) all = data;
  }

  const currentBaby = all.find(({ id }) => id === user.settings.currentBabyId) || all[0];

  if (currentBaby) {
    dispatch(getActivities(user, currentBaby.id));
    dispatch(updateActivitiesInProgress([]));
  }
  dispatch({ type: GET_BABIES, payload: { all, currentBaby } });
}

export const addBaby = (user, baby) => async dispatch => {
  if (user.provider === 'local') addGuestBaby(baby);
  else await axios.post(`/api/babies`, baby);

  dispatch(getCurrentUser());
}

export const editBaby = (user, baby) => async dispatch => {
  if (user.provider === 'local') editGuestBaby(baby);
  else await axios.put(`/api/babies`, baby);

  dispatch(getBabies(user));
}

export const deleteBaby = (user, baby) => async dispatch => {
  if (user.provider === 'local') deleteGuestBaby(baby);
  else await axios.delete(`/api/babies?babyID=${baby.id}`);

  dispatch(getBabies(user));
}