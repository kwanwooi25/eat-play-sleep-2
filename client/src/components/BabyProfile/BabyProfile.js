import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import BabyForm from '../BabyForm/BabyForm';
import CustomDialog from '../CustomDialog/CustomDialog';
import SVGIcon from '../SVGIcon/SVGIcon';

/** Material UI Components */
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

/** Actions */
import * as actions from '../../actions';

class BabyProfile extends Component {
  state = {
    mode: 'view',
    isConfirmDialogOpen: false,
    babySelectAnchorEl: null,
  }

  openConfirmDialog = () => this.setState({ isConfirmDialogOpen: true });

  handleConfirmDialogClose = result => {
    const { user, baby, deleteBaby } = this.props;
    this.setState({ isConfirmDialogOpen: false });
    if (result) deleteBaby(user, baby);
  }

  enterEditMode = () => this.setState({ mode: 'edit' });

  enterNewMode = () => this.setState({ mode: 'new' });

  handleCancel = () => this.setState({ mode: 'view' });

  handleSaveEdit = data => {
    const { baby, user, editBaby } = this.props;
    const { name, gender, birthday } = data;
    const guardians = baby.guardians.map(({ id, relationship }) => {
      if (id === user.id) return { id, relationship: data.relationship };
      return { id, relationship };
    });

    const updatedBaby = { id: baby.id, name, gender, birthday, guardians };
    editBaby(user, updatedBaby);
    this.setState({ mode: 'view' });
  }

  handleSaveNew = data => {
    const { user, addBaby } = this.props;
    const { name, gender, birthday, relationship } = data;
    const baby = {
      name,
      gender,
      birthday,
      guardians: [{ id: user.id, relationship }]
    };

    addBaby(user, baby);
    this.setState({ mode: 'view' });
  }

  openBabySelect = e => this.setState({ babySelectAnchorEl: e.target });

  handleBabyChange = value => {
    const { user, updateUser } = this.props;
    user.settings.currentBabyId = value;
    if (value) updateUser(user);
    this.setState({ babySelectAnchorEl: null });
  }

  renderBabies = babies => {
    return babies.map(({ id, name }) => {
      return (
        <MenuItem key={id} onClick={() => this.handleBabyChange(id)}>
          {name}
        </MenuItem>
      )
    })
  }

  render() {
    const { mode, isConfirmDialogOpen, babySelectAnchorEl } = this.state;
    const { translate, user, baby, all } = this.props;

    const { name, gender, birthday } = baby;
    const { relationship } = baby.guardians.find(({ id }) => id === user.id);

    return (
      <div className="baby-profile">
        <div className="baby-profile__header">
          <h3 className="baby-profile__header__title">
            {
              mode === 'edit' ? translate('editBabyTitle') :
                mode === 'new' ? translate('addBabyTitle') :
                  translate('babyProfileTitle')
            }
          </h3>
          {mode === 'view' && (
            <div className="baby-profile__header__controls">
              {all.length >= 2 && (
                <div className="baby-profile__header__baby-select">
                  <button
                    className="baby-profile__header__controls__button"
                    onClick={this.openBabySelect}
                  >
                    <SVGIcon name="swap_baby" />
                  </button>
                  <Menu
                    anchorEl={babySelectAnchorEl}
                    open={Boolean(babySelectAnchorEl)}
                    onClose={() => this.handleBabyChange(false)}
                  >
                    {this.renderBabies(all)}
                  </Menu>
                </div>
              )}
              <button
                className="baby-profile__header__controls__button"
                onClick={this.enterNewMode}
              >
                <SVGIcon name="add_baby" />
              </button>
              <button
                className="baby-profile__header__controls__button"
                onClick={this.enterEditMode}
              >
                <Icon color="inherit">edit</Icon>
              </button>
              <button
                className="baby-profile__header__controls__button"
                onClick={this.openConfirmDialog}
              >
                <Icon color="inherit">delete</Icon>
              </button>
            </div>
          )}
          
        </div>
        {mode === 'edit' ? (
          <BabyForm
            name={name}
            gender={gender}
            birthday={birthday}
            relationship={relationship}
            labelAlign="row"
            onCancel={this.handleCancel}
            onSave={this.handleSaveEdit}
            buttonsClassName="baby-profile__form__buttons"
          />
        ) : mode === 'new' ? (
          <BabyForm
            labelAlign="row"
            onCancel={this.handleCancel}
            onSave={this.handleSaveNew}
            buttonsClassName="baby-profile__form__buttons"
          />
        ) : (
          <div className="baby-profile__info">
            <label>{translate('babyNameLabel')}</label>
            <span>{name}</span>
            <label>{translate('babyGenderLabel')}</label>
            <span>{translate(gender)}</span>
            <label>{translate('babyBirthdayLabel')}</label>
            <span>{moment(birthday).format(translate('dateFormatLong'))}</span>
            <label>{translate('relationshipLabel')}</label>
            <span>{translate(relationship)}</span>
          </div>
        )}

        <CustomDialog
          open={isConfirmDialogOpen}
          onClose={this.handleConfirmDialogClose}
          title={translate('deleteBabyTitle')}
          message={translate('deleteBabyMessage')}
          variant="confirm"
        />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {};
}

export default withTranslate(connect(mapStateToProps, actions)(BabyProfile));