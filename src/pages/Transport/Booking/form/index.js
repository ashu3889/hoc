import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';

import withStyles from 'material-ui/styles/withStyles';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import Typography from 'material-ui/Typography/Typography';
import FormControl from 'material-ui/Form/FormControl';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

import Search from 'material-ui-icons/Search';

import ConfirmationDialog from '../../../../components/confirmationDialog';
import ReactMaterialUiNotifications from '../../../../components/ReactMaterialUiNotifications';
import EnhancedToolbar from '../../../../components/EnhancedToolbar'

import {getEntity, postEntity, putEntity} from '../../../../actions/entity';

import { styles as baseStyles } from '../../../css';

const styles = (theme) => ({
  ...baseStyles(theme)
})


class TransportBookingForm extends Component {
  constructor() {
    super();
    this.state = {
      openCustomerSearchDialog: false,
      openUserSearchDialog: false,
      courierFieldvalue: '',
      confirm: false,
      smu_label: 'SMU',
      airline_label: 'Airline',
      flight_no_label: 'Flight Number',
      vehicle_type_id: '',
      manifest_no: '',
      provider_id: '',
      provider_name: '',
      transport_route: '',
      origin: '',
      destination: '',
      etd: moment().add(3,'h').utc(+7).format('YYYY-MM-DDThh:mm'),
      eta: moment().add(6,'h').utc(+7).format('YYYY-MM-DDThh:mm'),
      max_weight: 0,
      max_koli: 0,
      max_volume: 0,
      vehicle_types: [],
      nodes_external: [],
      nodes_external_dest:[],
      provider: [],
    };
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };


  handleChangeOrigin = (name) => (event) => {
    this.setState({
      origin: event.target.value,
    });
    getEntity('external_nodes?vehicle_type='+this.state.vehicle_type_id+'&origin='+event.target.value).then((res) => {
      const {data} = res.data;
      this.setState({
        nodes_external_dest : data,
      });
    });
  };

  handleChangeDestination = (name) => (event) => {
    this.setState({
      destination: event.target.value,
    });
    getEntity('provider/'+this.state.provider_id+'?origin='+this.state.origin+'&destination='+event.target.value).then((res) => {
      const {data} = res.data;
    });
  };

  handleChangeManifest = () => (event) => {
    this.setState({
      vehicle_type_id: event.target.value,
    });
    if(event.target.value =='5'){
      this.setState({
        smu_label : 'SMU',
        airline_label : 'Airline',
        flight_no_label : 'Flight Number'
      });
    } else if(event.target.value =='6'){
      this.setState({
        smu_label : 'SML',
        airline_label : 'Ship',
        flight_no_label : 'Shipping Number'

      });
    } else if(event.target.value =='7'){
      this.setState({
        smu_label : 'SMK',
        airline_label : 'Train',
        flight_no_label : 'Train Number'
      });
    } else {
      this.setState({
        smu_label : 'SMU',
        airline_label : 'Airline',
        flight_no_label : 'Flight Number'
      });
    }
    getEntity('provider?vehicle_type='+event.target.value).then((res) => {
      const {data} = res.data;
      this.setState({
        provider : data,
      });
    });
    getEntity('external_nodes?vehicle_type='+event.target.value).then((res) => {
      const {data} = res.data;
      this.setState({
        nodes_external : data,
      });
    });
  };
  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.edit && getEntity(`transport_book/${id}`, null).then((response) => {
      const {data} = response.data;
      this.setState({
        ...data,
      });
    });

    getEntity('vehicletype').then((res) => {
      const {data} = res.data;
      this.setState({
        vehicle_types: data,
      });
    });

    getEntity('external_nodes').then((res) => {
      const {data} = res.data;
      this.setState({
        nodes_external : data,
      });
    });

    getEntity('external_nodes?vehicle_type='+this.state.vehicle_type_id+'&origin='+this.state.origin).then((res) => {
      const {data} = res.data;
      this.setState({
        nodes_external_dest : data,
      });
    });
  }
  handleAddSubmit = () => {
    return this.setState({
      confirm: !this.state.confirm});
  };
  handleDraftSubmit = () => {
    return this.setState({
      confirm: !this.state.confirm,
      booking_status : 0
    });
  };
  handleConfirmSubmit = () => {
    return this.setState({
      confirm: !this.state.confirm,
      booking_status : 1
    });
  };
  handleAction = (action) => {
    this.setState({confirm: false});
    action === 'yes' && !this.props.edit && this.saveEntity();
    action === 'yes' && this.props.edit && this.updateEntity();
  };
  updateEntity = () => {
    const {id} = this.props.match.params;
    putEntity(`transport_book/${id}`, {
      vehicle_type_id: this.state.vehicle_type_id,
      manifest_no: this.state.manifest_no,
      provider_id: this.state.provider_id,
      provider_name: this.state.provider_name,
      transport_route: this.state.transport_route,
      origin: this.state.origin,
      destination: this.state.destination,
      eta: this.state.eta,
      etd: this.state.etd,
      max_weight: this.state.max_weight,
      max_koli: this.state.max_koli,
      max_volume: this.state.max_volume,
      status: this.state.booking_status,
    }).then((response) => this.entitySubmitSuccess());
  };
  saveEntity = () => {
    postEntity('transport_book', {
      vehicle_type_id: this.state.vehicle_type_id,
      manifest_no: this.state.manifest_no,
      provider_id: this.state.provider_id,
      provider_name: this.state.provider_name,
      transport_route: this.state.transport_route,
      origin: this.state.origin,
      destination: this.state.destination,
      eta: this.state.eta,
      etd: this.state.etd,
      max_weight: this.state.max_weight,
      max_koli: this.state.max_koli,
      max_volume: this.state.max_volume,
      status: this.state.booking_status,
    }).then((response) => this.entitySubmitSuccess());
  };
  entitySubmitSuccess = () => {
    this.showNotification('booking');
    this.props.history.push(`/transport/booking`);
  };
  showNotification = (entity) => {
    ReactMaterialUiNotifications.showNotification({
      text: this.props.edit
        ? `Edit ${entity} success`
        : `Add ${entity} success`,
    });
  };

  render() {
    const {
      handleAddSubmit,
      handleDraftSubmit,
      handleConfirmSubmit,
      handleAction,
    } = this;
    const {classes, edit, history, match} = this.props;
    const {
      vehicle_type_id,
      manifest_no,
      provider_id,
      provider_name,
      transport_route,
      origin,
      destination,
      smu_label,
      airline_label,
      flight_no_label,
      eta,
      etd,
      max_weight,
      max_koli,
      max_volume,
      booking_status,
      confirm,
      openCustomerSearchDialog,
      openUserSearchDialog,
      vehicle_types,
      nodes_external,
      nodes_external_dest,
      provider,
    } = this.state;
    return (
      <div className={classes.root}>
        <EnhancedToolbar navs={['Transport', 'Booking', edit ? `Edit Booking` : `New Booking`]} />
        <Card className={classes.card}>
          <CardHeader title={edit ? `Edit Booking` : `New Booking`} className={classes.cardHeader} />
          <CardContent>
            <Grid container spacing={40}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="vehicle_type_id"
                  select
                  label="Type"
                  required
                  value={vehicle_type_id}
                  onChange={this.handleChangeManifest()}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                >
                  {vehicle_types.map((item) => (
                    <MenuItem key={item.vehicle_type_id} value={`${item.vehicle_type_id}`}>
                      {item.type_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  margin="normal"
                  onChange={this.handleChange('manifest_no')}
                  id="manifest_no"
                  label={smu_label}
                  value={manifest_no}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  onChange={this.handleChange('provider_id')}
                  id="provider_id"
                  select
                  value={provider_id}
                  label={airline_label}
                  required
                >
                {provider.map((item) => (
                    <MenuItem key={item.id} value={`${item.id}`}>
                      {item.provider_name}
                    </MenuItem>
                ))}
                </TextField>
                <TextField
                  fullWidth
                  margin="normal"
                  onChange={this.handleChange('transport_route')}
                  id="transport_route"
                  value={transport_route}
                  label={flight_no_label}
                  required
                />
                <FormControl className={classes.textField3}>
                  <InputLabel htmlFor="origin">Origin</InputLabel>
                  <Select value={origin} onChange={this.handleChangeOrigin('origin')}
                  inputProps={{ name: 'origin', id: 'origin', }} required>
                  {nodes_external.map((item,i) =>
                    <MenuItem key={i} value={`${item.node_id}`}>{item.node_name}</MenuItem>
                  )}
                  </Select>
                </FormControl>
                <FormControl className={classes.textField3}>
                  <InputLabel htmlFor="destination">Destination</InputLabel>
                  <Select
                    onChange={this.handleChangeDestination('destination')}
                    value={destination}
                    inputProps={{
                      name: 'destination',
                      id: 'destination',
                    }}
                    required
                  >
                  {nodes_external_dest.map((item,i) =>
                    <MenuItem key={i} value={`${item.node_id}`}>{item.node_name}</MenuItem>
                  )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="datetime-local"
                  label="ETD"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={etd ? etd.replace(' ', 'T') : ''}
                  onChange={this.handleChange('etd')}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="datetime-local2"
                  label="ETA"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={eta ? eta.replace(' ', 'T') : ''}
                  onChange={this.handleChange('eta')}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  onChange={this.handleChange('max_weight')}
                  id="max_weight"
                  value={max_weight}
                  label="Max Weight / Kg"
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  onChange={this.handleChange('max_koli')}
                  id="max_koli"
                  value={max_koli}
                  label="Max Koli / Bag"
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  onChange={this.handleChange('max_volume')}
                  id="max_volume"
                  value={max_volume}
                  label="Max Volume / m3"
                  required
                />
              </Grid>
              <Grid item xs={12} >
                <Grid container justify="flex-end">
                  <Button className={classes.button} onClick={() => history.goBack()}>
                    Cancel
                  </Button>
                  <Button variant="raised" color="primary" className={classes.button} onClick={handleDraftSubmit}>
                    Draft
                  </Button>
                  <Button variant="raised" color="primary" className={classes.button} onClick={handleConfirmSubmit}>
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <ConfirmationDialog
          yeslabel={edit ? 'Save' : 'Add'}
          title={edit ? `Edit booking` : `New booking`}
          description={
            edit
              ? `Are you sure you want to save this booking?`
              : `Are you sure you want to add this booking?`
          }
          open={confirm}
          handleAction={handleAction}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TransportBookingForm);
