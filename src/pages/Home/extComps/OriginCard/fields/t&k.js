import React from 'react';
import {Grid, FormControl, Input, InputLabel} from 'material-ui';

const Tlpdankodepos = (props) => {
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
        /*classes={{inkbar: classes.inputInkbarFocused}}*/
        id="focusedInput"
        maxLength={15}
        inputProps={{
          maxLength: 15,
        }}
      />
    </FormControl>
  );
};
export default Tlpdankodepos;
