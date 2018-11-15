import React from 'react';

const DialogButtonGroup = ({
  className = '',
  variant = 'alert', // 'alert': one button, 'confirm': two buttons
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className={`dialog-button-group ${className}`}>
      {variant === 'confirm' && (
        <button
          className="dialog-button-group__button--cancel"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
      )}
      <button
        className="dialog-button-group__button--confirm"
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  )
}

export default DialogButtonGroup;