import moment from 'moment';
import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';

/** Components */
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import CustomSelector from '../CustomSelector/CustomSelector';
import CustomDateTimePicker from '../CustomDateTimePicker/CustomDateTimePicker';
import CustomSelect from '../CustomSelect/CustomSelect';
import DialogButtonGroup from '../DialogButtonGroup/DialogButtonGroup';

const GENDER_OPTIONS = [ 'boy', 'girl' ];
const RELATIONSHIP_OPTIONS = [ 'mom', 'dad', 'relative' ];

class BabyForm extends Component {
  constructor(props) {
    super(props);

    const { name, gender, birthday, relationship } = props;

    this.state = {
      name: name || '',
      gender: gender || 'boy',
      birthday: birthday || moment(),
      relationship: relationship || 'mom',
    }
  }

  validateField = (name, value) => {
    const { translate } = this.props;
    const errorLabel = name + 'Error';

    if (value) {
      this.setState({ [errorLabel]: '' });
      return true;
    } else {
      this.setState({ [errorLabel]: translate(errorLabel) });
      return false;
    }
  }

  handleCancel = () => {
    this.setState({
      name: '',
      gender: 'boy',
      birthday: moment(),
      relationship: 'mom',
      nameError: '',
    });

    this.props.onCancel();
  }

  handleSave = () => {
    const { name, gender, birthday, relationship } = this.state;
    const data = { name, gender, birthday, relationship };

    if (this.validateField('name', name)) this.props.onSave(data);
  }

  handleInputChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  handleDateChange = date => this.setState({ birthday: date });

  handleRelationshipChange = option => {
    if (option) this.setState({ relationship: option });
  }

  render() {
    const {
      translate,
      labelAlign,
      buttonsClassName,
    } = this.props;
    const {
      name,
      gender,
      birthday,
      relationship,
      nameError,
    } = this.state;

    const relationshipOptions = RELATIONSHIP_OPTIONS.map(option => {
      return { value: option, label: translate(option) };
    });

    return (
      <div className="baby-form">
        <div className="baby-form__inputs">
          <CustomTextInput
            id="name"
            name="name"
            label={translate('babyNameLabel')}
            labelAlign={labelAlign}
            value={name}
            onChange={this.handleInputChange}
            error={nameError}
          />
          <CustomSelector
            label={translate('babyGenderLabel')}
            labelAlign={labelAlign}
            name="gender"
            options={GENDER_OPTIONS}
            value={gender}
            onChange={this.handleInputChange}
            size="small"
          />
          <CustomDateTimePicker
            label={translate('babyBirthdayLabel')}
            labelAlign={labelAlign}
            value={birthday}
            onChange={this.handleDateChange}
            timePicker={false}
            showNowButton={false}
          />
          <CustomSelect
            label={translate('relationshipLabel')}
            labelAlign={labelAlign}
            value={translate(relationship)}
            options={relationshipOptions}
            onChange={this.handleRelationshipChange}
          />
        </div>
        <DialogButtonGroup
          variant='confirm'
          className={buttonsClassName}
          cancelLabel={translate('cancel')}
          confirmLabel={translate('save')}
          onCancel={this.handleCancel}
          onConfirm={this.handleSave}
        />
      </div>
    )
  }
}

export default withTranslate(BabyForm);