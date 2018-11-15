import React from 'react';
import ActivityButton from '../ActivityButton/ActivityButton';

const ACTIVITY_BUTTONS = [
  'breast',
  'bottle',
  'pump',
  'babyfood',
  'diaper',
  'sleep',
  'growth'
];

const ActivityButtons = ({
  userSettings,
  activities,
  onActivityButtonClick,
}) => {
  const { lastActivities, activitiesInProgress } = activities;
  const { displayActivities } = userSettings;
  let buttonsToRender = ACTIVITY_BUTTONS;
  if (displayActivities) {
    buttonsToRender = ACTIVITY_BUTTONS.filter(name => displayActivities.includes(name));
  }

  return (
    <div className={`activity-buttons ${buttonsToRender.join(' ')}`}>
      {buttonsToRender.map(name => {
        const activityInProgress = activitiesInProgress
          .filter(activity => activity.name === name);

        return (
          <ActivityButton
            key={name}
            name={name}
            lastActivity={lastActivities && lastActivities[name]}
            activityInProgress={activityInProgress && activityInProgress[0]}
            onClick={onActivityButtonClick}
          />
        )
      })}
    </div>
  )
}

export default ActivityButtons;