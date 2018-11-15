import React, { Component } from 'react';

class CustomTextInput extends Component {
  componentDidMount() {
    const { id, multiline } = this.props;

    if (multiline) {
      const textarea = document.getElementById(id);
      textarea.style.cssText = "height: auto;";
      textarea.style.cssText = `height: ${textarea.scrollHeight}px`;
      textarea.addEventListener("keydown", () => {
        setTimeout(() => {
          textarea.style.cssText = "height: auto;";
          textarea.style.cssText = `height: ${textarea.scrollHeight}px`;
        }, 0);
      });
    }
  }

  render() {
    const {
      id,
      label,
      className = '',
      multiline = false,
      error = '',
      labelAlign = 'column', // 'column', 'row'
      ...props
    } = this.props;

    let elementClassName = `custom-text-input ${className} label-align--${labelAlign}`;
    if (error) elementClassName += ' error';

    return (
      <div className={elementClassName}>
        {label && <label htmlFor={id}>{label}</label>}
        <div className="custom-text-input__input">
          {multiline ? (
            <textarea id={id} rows={1} {...props} />
          ) : (
            <input id={id} {...props} />
          )}
          {error && <p className="custom-text-input__input__error">{error}</p>}
        </div>
      </div>
    )
  }
}

export default CustomTextInput;