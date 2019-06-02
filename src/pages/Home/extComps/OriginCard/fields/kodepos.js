import React from 'react';
import {Grid, FormControl, Input, InputLabel} from 'material-ui';

const kodepos = (props) => {
  const {classes, item, handleChange} = props;
  return (
    <FormControl fullWidth={true} margin="normal">
      <InputLabel
        FormLabelClasses={{focused: classes.inputLabelFocused}}
        htmlFor="focusedInput"
        className={classes.inputLabel}
      >
        {item.label}
      </InputLabel>
      <Input
        type="text"
        name={item.name}
        value={item.value}
        onChange={handleChange}
        id="focusedInput"
      />
    </FormControl>
  );
};
export default kodepos;
