import React from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI */
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

/** Components */
import DialogButtonGroup from '../DialogButtonGroup/DialogButtonGroup';

const Transition = props => <Slide direction="up" {...props} />;

const CustomDialog = ({
  translate,
  open,
  onClose,
  title,
  message,
  variant = 'alert', // alert, confirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => { onClose(false) }}
      TransitionComponent={Transition}
      keepMounted
    >
      <div className="custom-dialog">
        <div className="custom-dialog__title">
          <h3>{title}</h3>
        </div>
        <div className="custom-dialog__message">
          <p>{message}</p>
        </div>
        <DialogButtonGroup
          variant={variant}
          cancelLabel={translate('cancel')}
          confirmLabel={translate('confirm')}
          onCancel={() => onClose(false)}
          onConfirm={() => onClose(true)}
        />
      </div>
    </Dialog>
  )
}

export default withTranslate(CustomDialog);