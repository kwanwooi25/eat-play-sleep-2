import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI */
import Icon from '@material-ui/core/Icon';

const BOTTOM_NAV_ITEMS = [
  { label: 'home', icon: 'home' },
  { label: 'logs', icon: 'list' },
  { label: 'stats', icon: 'insert_chart' },
  { label: 'settings', icon: 'settings' },
];

const BottomNavigation = ({
  translate,
  babies,
}) => {

  const pathname = window.location.pathname.slice(1).split('/')[0];
  const isBabyExists = Boolean(babies.currentBaby);

  return (
    <div className="bottom-nav">
      {BOTTOM_NAV_ITEMS.map(({ label, icon }) => {
        
        const isActive = pathname === label;
        const shouldDisableNavLink = ['logs', 'stats'].includes(label) && !isBabyExists;
        const buttonClassName = isActive ? 'bottom-nav__button--active' : 'bottom-nav__button';
        const navLinkClassName = shouldDisableNavLink ? 'disabled-navlink' : '';

        return (
          <NavLink key={label} to={`/${label}`} className={navLinkClassName}>
            <button className={buttonClassName}>
              <Icon className="bottom-nav__button__icon" color="inherit">
                {icon}
              </Icon>
              <span className="bottom-nav__button__label">
                {translate(`${label}Label`)}
              </span>
            </button>
          </NavLink>
        )
      }
    )}
    </div>
  )
}

const mapStateToProps = ({ babies }) => {
  return { babies };
}

export default withTranslate(connect(mapStateToProps)(BottomNavigation));