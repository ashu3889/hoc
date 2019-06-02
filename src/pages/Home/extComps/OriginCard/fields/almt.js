import React from 'react';
import {FormControl, InputLabel, Input} from 'material-ui';

const AlmtField = (props) => {
  const {classes, item, handleChange} = props;
  return (

    <FormControl fullWidth={true} margin="normal">
      <InputLabel htmlFor="focusedInput">{item.label}</InputLabel>
      <Input
        type="text"
        name={item.name}
        onChange={handleChange}
        /*classes={{inkbar: classes.inputInkbarFocused}}*/
        id="focusedInput"
        value={item.value}
        rows={4}
        rowsMax={4}
        maxLength={500}
        inputProps={{
          maxLength: 500,
        }}
        multiline
      />
    </FormControl>
  );
};
export default AlmtField;
