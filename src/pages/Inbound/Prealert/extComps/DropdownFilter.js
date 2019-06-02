import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

function toCapitalize(str) 
{
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}

class DropDownFilter extends React.Component {
  render() {
    const { classes } = this.props;
    console.log(this.props);
    if(this.props.name =='three_letter'){
      var el_name = 'Origin';
    } else if(this.props.name =='destination_id'){
      var el_name = "Destination";
    } else {
      var el_name = toCapitalize(this.props.name.replace('_',' '));
    } 

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel>{el_name}</InputLabel>
          <Select
            value={this.props.value}
            onChange={this.props.onChange}
            inputProps={{
              name: this.props.id,
              id: this.props.id,
            }}
          >
              <MenuItem value=''>All {el_name}</MenuItem>
            {this.props.data ? this.props.data.map((item, i) =>
              <MenuItem key={i} value={item.key}>{item.value}</MenuItem>
            ) : ''}
          </Select>
        </FormControl>
      </form>
    );
  }
}



export default withStyles(styles)(DropDownFilter);
