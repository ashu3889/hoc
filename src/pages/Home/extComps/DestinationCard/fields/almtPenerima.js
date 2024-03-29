import React, {Component} from 'react';
import {FormControl, InputLabel, Input} from 'material-ui';
import _ from 'lodash';

class AlmtPenerima extends Component {
  constructor(props) {
    super(props);
    this.state = {
      almtToPrint: props.almtPenerimaReducer,
    };
  }

  printAlmtReduced = () => {
    const {almtPenerimaReducer, privateData} = this.props,
      {almtPenerima} = privateData,
      reducedClonedAlmt = almtPenerimaReducer.reduce((all, item, i) => {
        all = item;
        return all;
      }, {}),
      {
        subdistrict_name,
        district_name,
        city_name,
        province_name,
        country_name,
      } = reducedClonedAlmt,
      pickThtNeeded =
        '' +
        subdistrict_name +
        ', ' +
        district_name +
        ', ' +
        city_name +
        ', ' +
        province_name +
        ' - ' +
        country_name;

    return almtPenerimaReducer.lenght > 0 ? pickThtNeeded : almtPenerima;
  };

  render() {
    const {almtToPrint} = this.state;
    const {
      readOnly,
      classes,
      handleChange,
      item,
      almtPenerimaReducer,
      privateData,
    } = this.props;
    const {almtPenerima} = privateData;
    return (
      <FormControl fullWidth={true} margin="normal">
        <InputLabel
          FormLabelClasses={{focused: classes.inputLabelFocused}}
          htmlFor="focusedInput"
        >
          {item.label}
        </InputLabel>
        <Input readOnly={readOnly} disabled={readOnly}
          type="text"
          name="almtPenerima"
          value={item.value}
          onChange={handleChange}
          /*classes={{inkbar: classes.inputInkbarFocused}}*/
          id="focusedInput"
          rows={4}
          rowsMax={4}
          multiline
          inputProps={{
            readOnly: readOnly,
            disabled: readOnly,
            maxLength: 500,
          }}
          maxLength={500}
        />
      </FormControl>
    );
  }
}
export default AlmtPenerima;
