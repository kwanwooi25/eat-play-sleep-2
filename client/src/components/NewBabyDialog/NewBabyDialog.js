import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Material UI */
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import BabyForm from '../../components/BabyForm/BabyForm';

const Transition = props => <Slide direction="up" {...props} />;

class NewBabyDialog extends Component {
  state = {}

  handleCancel = () => this.props.onClose(false);

  handleSave = data => this.props.onClose(data);

  render() {
    const { translate, open } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.handleCancel}
        TransitionComponent={Transition}
        keepMounted
      >
        <div className="new-baby-dialog">
          <div className="new-baby-dialog__title">
            <h3>{translate('newBabyDialogTitle')}</h3>
          </div>
          <BabyForm
            labelAlign="row"
            onSave={this.handleSave}
            onCancel={this.handleCancel}
          />
        </div>
      </Dialog>
    )
  }
}

export default withTranslate(NewBabyDialog);