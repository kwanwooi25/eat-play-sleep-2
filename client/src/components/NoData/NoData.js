import React from 'react';
import Icon from '@material-ui/core/Icon';

const NoData = ({ icon, message }) => {
  return (
    <div className="no-data">
      <Icon className="no-data__icon" color="inherit">{icon}</Icon>
      <div className="no-data__message">{message}</div>
    </div>
  )
}

export default NoData;