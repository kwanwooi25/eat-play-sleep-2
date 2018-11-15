import {
  GET_BABIES,
  GET_BABIES_FAILED
} from '../actions/types';

const INITIAL_STATE = {
  all: [],
  currentBaby: null,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BABIES:
      return {
        all: action.payload.all,
        currentBaby: action.payload.currentBaby,
        error: ''
      };
    
    case GET_BABIES_FAILED:
      return {
        all: [],
        currentBaby: null,
        error: action.payload
      };

    default:
      return state;
  }
}