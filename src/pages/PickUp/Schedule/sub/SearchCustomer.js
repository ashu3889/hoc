import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import {Paper} from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';

import {getEntityList} from '../../../../actions/entity';

const Styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 200,
  },
});

const WAIT_INTERVAL = 1000;
class SearchCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search: '', data: []};
    this.timer = null;
  }
  componentWillMount() {
    this.timer = null;
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };
  handleSelect = (row) => (event) => {
    this.props.handleSelect(row);
  };
  handleChangeText = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const self = this;
       getEntityList(`customer?s=${this.state.search}`, null).then(
        (response) => {
        if(response.data.status.code == 200){
          const {data} = response.data;
          const data_res = data[0];
          console.log(data_res);
          this.props.handleSelect(data_res);
          return this.setState({data:data_res});
        } else {
           this.setState({
            search: ''
          });
          alert(response.data.status.description);
        }
      }).catch((error) => {
        /*console.log(error);*/
      });
    }
  };
  render() {
    const {openDialog, handleOpenDialog, classes} = this.props;
    const {search, data} = this.state;

    return (
      <Dialog
        open={openDialog}
        onClose={() => handleOpenDialog('openSearchDialog')}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Search Name, Corporate ID, or JLC
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name, Corporate, ID, or JLC"
            fullWidth
            value={search}
            onChange={this.handleChange('search')}
            onKeyPress={this.handleChangeText.bind(this)}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
export default withStyles(Styles)(SearchCustomer);
