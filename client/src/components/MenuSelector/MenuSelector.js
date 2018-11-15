import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI Components */
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class MenuSelector extends Component {
  state = { anchorEl: null };

  openMenu = e => this.setState({ anchorEl: e.target });

  handleCloseMenu = result => {
    this.setState({ anchorEl: null });
    if (result) this.props.onChange(result);
  }

  renderMenuItems = menuItems => {
    const { translate } = this.props;

    return menuItems.map(menuItem => (
      <MenuItem key={menuItem} onClick={() => this.handleCloseMenu(menuItem)}>
        {translate(menuItem)}
      </MenuItem>
    ));
  }

  render() {
    const {
      translate,
      buttonClassName = '',
      menuSelected,
      menuItems,
    } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className="menu-selector">
        <button
          className={`menu-selector__button ${buttonClassName}`}
          onClick={this.openMenu}
        >
          {translate(menuSelected)}
        </button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => this.handleCloseMenu(false)}
        >
          {this.renderMenuItems(menuItems)}
        </Menu>
      </div>
    )
  }
}

export default withTranslate(MenuSelector);