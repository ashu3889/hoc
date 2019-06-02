import React from 'react';
import {Grid, FormControl, IconButton} from 'material-ui';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import SearchPeople from '../../Dialogs/searchPeeps';

const NamaPengirim = (props) => {
  const {
    classes,
    item,
    handleOpenDialog,
    handleChange,
    openSearchDialog,
    dataPengirim,
    handleChangeText,
    handleRowClick,
  } = props;

  return (
    <FormControl fullWidth={true} margin="normal">
      {' '}
      {/*namaPengirimField*/}
      <InputLabel
        FormLabelClasses={{focused: classes.inputLabelFocused}}
        htmlFor="focusedInput"
        className={classes.inputLabel}
      >
        {item.label}
      </InputLabel>
      <Input
        autoFocus
        type="text"
        name={item.name}
        onChange={handleChange}
        value={item.value}
        /*classes={{inkbar: classes.inputInkbarFocused}}*/
        id="focusedInput"
        maxLength={254}
        inputProps={{
          maxLength: 254,
        }}
      />
      {openSearchDialog && (
        <SearchPeople
          openDialog={openSearchDialog}
          handleChangeText={handleChangeText}
          handleRowClick={handleRowClick}
          handleOpenDialog={handleOpenDialog}
          dataPengirim={dataPengirim}
        />
      )}
    </FormControl>
  );
};
export default NamaPengirim;
