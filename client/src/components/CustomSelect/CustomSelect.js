import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class CustomSelect extends Component {
  state = { anchorEl: null };

  openMenu = e => this.setState({ anchorEl: e.target });

  handleClose = value => {
    const { onChange } = this.props;
    this.setState({ anchorEl: null });
    onChange(value);
  }

  render() {
    const {
      label,
      labelAlign = 'column',
      className = '',
      value,
      options,
    } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={`custom-select ${className} label-align--${labelAlign}`}>
        {label && <label>{label}</label>}
        <button onClick={this.openMenu}>{value}</button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => this.handleClose(false)}
        >
          {options.map(({ value, label }) => {
            return (
              <MenuItem
                key={value}
                value={value}
                onClick={() => this.handleClose(value)}
              >
                {label}
              </MenuItem>
            )
          })}
        </Menu>
      </div>
    )
  }
}

export default CustomSelect;