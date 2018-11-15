import moment from 'moment';

const GUEST_USER = 'eps_guest_user';
const GUEST_BABIES = 'eps_guest_babies';
const GUEST_BABY_ID = 'eps_guest_baby_id';
const GUEST_ACTIVITIES = 'eps_guest_activities';
const GUEST_ACTIVITY_ID = 'eps_guest_activity_id';

/** Guest User Info */
export const getGuestUser = () => JSON.parse(localStorage.getItem(GUEST_USER));
export const setGuestUser = user => localStorage.setItem(GUEST_USER, JSON.stringify(user));
export const logoutGuestUser = () => {
  const guest = getGuestUser();
  guest.isLoggedIn = false;
  setGuestUser(guest);
}

/** Guest's baby info */
export const getGuestBabies = () => JSON.parse(localStorage.getItem(GUEST_BABIES));
export const setGuestBabies = babies => localStorage.setItem(GUEST_BABIES, JSON.stringify(babies));
export const getNextGuestBabyId = () => {
  const nextId = Number(localStorage.getItem(GUEST_BABY_ID)) + 1 || 1;
  localStorage.setItem(GUEST_BABY_ID, nextId);
  return nextId;
};
export const addGuestBaby = baby => {
  baby.id = getNextGuestBabyId();
  const babies = getGuestBabies() || [];
  babies.push(baby);
  setGuestBabies(babies);

  const user = getGuestUser();
  user.settings.currentBabyId = baby.id;
  setGuestUser(user);

  return getGuestBabies();
}
export const editGuestBaby = baby => {
  const babies = getGuestBabies();
  const updated = babies.filter(({ id }) => id !== baby.id).push(baby);
  setGuestBabies(updated);
  return getGuestBabies();
}
export const deleteGuestBaby = baby => {
  const babies = getGuestBabies();
  const updated = babies.filter(({ id }) => id !== baby.id);
  setGuestBabies(updated);

  const user = getGuestUser();
  user.settings.currentBabyId = '';
  setGuestUser(user);

  const activities = getGuestActivitiesAll() || [];
  const updatedActivities = activities.filter(({ baby_id }) => baby_id !== baby.id);
  setGuestActivities(updatedActivities);
}

/** Guest's babies' activities */
const activityOptions = {
  name: [
    'breast',
    'bottle',
    'pump',
    'babyfood',
    'diaper',
    'sleep',
    'growth',
  ],
};
const getGuestActivitiesAll = () =>
  JSON.parse(localStorage.getItem(GUEST_ACTIVITIES));

export const getGuestActivities = (babyID, options = activityOptions) => {
  const activities = getGuestActivitiesAll() || [];
  let filtered = activities;
  if (activities && babyID) {
    filtered = activities
      .filter(activity => activity.baby_id === babyID)
      .filter(activity => options.name.includes(activity.name))
      .sort((a, b) => {
        if (a.time_start > b.time_start) return -1;
        if (a.time_start < b.time_start) return 1;
        return 0;
      });
  }
  return filtered;
}

export const setGuestActivities = activities =>
  localStorage.setItem(GUEST_ACTIVITIES, JSON.stringify(activities));

export const getGuestActivityById = activityID => {
  const activities = getGuestActivitiesAll();
  const activity = activities.find(activity => activity.id === activityID);
  return activity;
};

export const getGuestActivitySummaryByDate = (babyID, range) => {
  const {
    from = moment().startOf('date'),
    to = moment().endOf('date')
  } = range;

  const activities = getGuestActivities(babyID)
    .filter(({ time_start }) =>
      from <= moment(time_start) && moment(time_start) <= to
    );

  const summary = {
    breast: { count: 0, duration: 0 },
    bottle: { count: 0, amount: 0 },
    babyfood: { count: 0, amount: 0 },
    pump: { count: 0, amount: 0 },
    diaper: { count: 0, pee: 0, poo: 0 },
    sleep: { count: 0, duration: 0 },
  };

  activities.forEach(({
    name,
    duration_total,
    amount,
    type,
  }) => {
    if (name !== 'growth') summary[name].count ++;

    switch (name) {
      case 'breast':
      case 'sleep':
        summary[name].duration += duration_total;
        break;
      
      case 'bottle':
      case 'babyfood':
      case 'pump':
        summary[name].amount += amount;
        break;

      case 'diaper':
        if (type === 'peepoo') {
          summary[name].pee ++;
          summary[name].poo ++;
        } else {
          summary[name][type] ++;
        }
        break;

      default:
        break;
    }
  });

  return summary;
};

export const getGuestActivityTrendByName = (babyID, options) => {
  const trend = { name: options.name, keys: [], totalCount: 0 };
  switch (options.name) {
    case 'breast':
    case 'sleep':
      trend.totalDuration = 0;
      break;

    case 'bottle':
    case 'babyfood':
      trend.totalAmount = 0;
      break;
    
    case 'diaper':
      trend.totalPee = 0;
      trend.totalPoo = 0;
      break;

    default:
      break;
  }
  
  for (let i = moment(options.from); i < moment(options.to); i.add(1, 'days')) {
    const date = i.format('MM-DD');
    trend.keys.push(date);
    trend[date] = { count: 0 };
    switch (options.name) {
      case 'breast':
      case 'sleep':
        trend[date].duration = 0;
        break;

      case 'bottle':
      case 'babyfood':
        trend[date].amount = 0;
        break;
      
      case 'diaper':
        trend[date].pee = 0;
        trend[date].poo = 0;
        break;
      
      case 'growth':
        trend[date].height = 0;
        trend[date].weight = 0;
        trend[date].head = 0;
        break;

      default:
        break;
    }
  }

  getGuestActivities(babyID)
    .forEach(({
      name,
      time_start,
      duration_total,
      amount,
      type,
      height,
      weight,
      head,
    }) => {
      const isNameSame = name === options.name;
      const isInRange =
        options.from <= moment(time_start) &&
        moment(time_start) <= options.to;

      if (isNameSame && isInRange) {
        const date = moment(time_start).format('MM-DD');
    
        trend[date].count ++;
        trend.totalCount ++;

        switch (options.name) {
          case 'breast':
          case 'sleep':
            trend[date].duration += duration_total;
            trend.totalDuration += duration_total;
            break;
    
          case 'bottle':
          case 'babyfood':
            trend[date].amount += amount;
            trend.totalAmount += amount;
            break;
          
          case 'diaper':
            if (type && type === 'peepoo') {
              trend[date].pee ++;
              trend[date].poo ++;
              trend.totalPee ++;
              trend.totalPoo ++;
            } else {
              trend[date][type] ++;
              if (type === 'pee') trend.totalPee ++;
              else if (type === 'poo') trend.totalPoo ++;
            }
            break;

          case 'growth':
            trend[date].height = height;
            trend[date].weight = weight;
            trend[date].head = head;
            break;
    
          default:
            break;
        } 
      }
    });

  return trend;
}

export const getNextActivityId = () => {
  const nextId = Number(localStorage.getItem(GUEST_ACTIVITY_ID)) + 1 || 1;
  localStorage.setItem(GUEST_ACTIVITY_ID, nextId);
  return nextId;
};

export const addGuestActivity = data => {
  data.id = getNextActivityId();
  const activities = getGuestActivities() || [];
  activities.push(data);
  setGuestActivities(activities);
  return data;
};

export const updateGuestActivity = data => {
  const activities = getGuestActivitiesAll();
  const updated = activities.map(activity => {
    if (activity.id === data.id) return data;
    return activity;
  });
  setGuestActivities(updated);
  return data;
};

export const removeGuestActivity = id => {
  const activities = getGuestActivitiesAll();
  const updated = activities.filter(activity => activity.id !== id);
  setGuestActivities(updated);
  return id;
};