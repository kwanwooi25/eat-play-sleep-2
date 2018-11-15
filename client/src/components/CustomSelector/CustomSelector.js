import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import SVGIcon from '../SVGIcon/SVGIcon';

const CustomSelector = ({
  translate,
  name,
  label,
  labelAlign = 'column',
  className = '',
  options = [],
  value,
  onChange,
  size = 'medium',
  multiChoice = false,
}) => {
  return (
    <div className={`custom-selector ${className} label-align--${labelAlign}`}>
      {label && <label>{label}</label>}
      <div className="custom-selector__options">
        {options.map(label => {
          return (
            <label className={`custom-selector__options__option ${size}`} htmlFor={label} key={label}>
              <input
                className={label}
                type={multiChoice ? 'checkbox' : 'radio'}
                name={name}
                id={label}
                value={label}
                checked={multiChoice ? value.includes(label) : value === label}
                onChange={onChange}
              />
              <span className="custom-selector__options__option__bg" />
              <SVGIcon name={label} className="custom-selector__options__option__icon" />
              <span className="custom-selector__options__option__title">{translate(label)}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default withTranslate(CustomSelector);