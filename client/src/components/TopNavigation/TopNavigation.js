import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import SVGIcon from '../SVGIcon/SVGIcon';

const TOP_NAV_ITEMS = ['summary', 'feed', 'sleep', 'diaper', 'growth'];

const TopNavigation = ({
  translate,
  auth: { currentUser : { settings : { displayActivities } } },
}) => {
  const pathname = window.location.pathname.slice(1).split('/')[1];
  let navItems = TOP_NAV_ITEMS;
  if (displayActivities) {
    navItems = TOP_NAV_ITEMS.filter(name => {
      if (name === 'summary') return true;
      if (name === 'feed') {
        return (
          displayActivities.includes('breast') ||
          displayActivities.includes('bottle') ||
          displayActivities.includes('babyfood')
        );
      }
      return displayActivities.includes(name);
    });
  }

  return (
    <div className="top-nav">
      {navItems.map(name => {
        const isActive = pathname === name;
        const className = isActive ? 'top-nav__button--active' : 'top-nav__button';
        
        return (
          <NavLink key={name} to={`/stats/${name}`}>
            <button className={className}>
              <SVGIcon name={name} className="top-nav__button__icon" />
              <span className="top-nav__button__label">
                {translate(`${name}Label`)}
              </span>
            </button>
          </NavLink>
        )
      })}
    </div>
  )
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default withTranslate(connect(mapStateToProps)(TopNavigation));