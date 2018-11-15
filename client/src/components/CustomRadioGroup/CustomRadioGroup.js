import React from 'react';

const CustomRadioGroup = ({
  name,
  label,
  labelAlign = 'column',
  className = '',
  options = [],
  value,
  onChange,
}) => {
  return (
    <div className={`custom-radio-group ${className} label-align--${labelAlign}`}>
      {label && <label>{label}</label>}
      <div className="custom-radio-group__options">
        {options.map(option => {
          return (
            <label
              className="custom-radio-group__options__option"
              htmlFor={option.value}
              key={option.value}
            >
              <input
                type={'radio'}
                name={name}
                id={option.value}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
              />
              <span className="custom-radio-group__options__option__bg" />
              <span className="custom-radio-group__options__option__label">{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default CustomRadioGroup;