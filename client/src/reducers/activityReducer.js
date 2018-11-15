import {
  GET_ACTIVITIES,
  GET_ACTIVITY_BY_ID,
  GET_ACTIVITY_SUMMARY_BY_DATE,
  GET_ACTIVITY_TREND_BY_NAME,
  RESET_CURRENT_ACTIVITY,
  START_ACTIVITY,
  UPDATE_ACTIVITY_IN_PROGRESS,
  UPDATE_ACTIVITIES_IN_PROGRESS,
  ACTIVITY_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
  all: [],
  lastActivities: {},
  activitiesInProgress: [],
  currentActivity: {},
  summaryByDate: {},
  trend: {},
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVITIES:
      const { all, lastActivities } = action.payload;
      return Object.assign({}, state, { all, lastActivities });

    case GET_ACTIVITY_BY_ID:
      return Object.assign({}, state, { currentActivity: action.payload });

    case GET_ACTIVITY_SUMMARY_BY_DATE:
      return Object.assign({}, state, { summaryByDate: action.payload });

    case GET_ACTIVITY_TREND_BY_NAME:
      const { name, trendByName } = action.payload;
      const { trend } = state;
      trend[name] = trendByName;
      return Object.assign({}, state, { trend });
    
    case RESET_CURRENT_ACTIVITY:
      return Object.assign({}, state, { currentActivity: {} });
    
    case START_ACTIVITY:
      state.activitiesInProgress.push(action.payload);
      return state;
      
    case UPDATE_ACTIVITY_IN_PROGRESS:
      const updatedActivity = action.payload;
      state.activitiesInProgress.forEach(activity => {
        if (activity.name === updatedActivity.name) {
          activity = updatedActivity;
        }
      });
      return state;
      
    case UPDATE_ACTIVITIES_IN_PROGRESS:
      return Object.assign({}, state, { activitiesInProgress: action.payload });
    case ACTIVITY_ERROR:
      return Object.assign({}, state, { error: action.payload });
      
    default:
      return state;
  }
}