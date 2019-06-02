import React, {Component}                   from 'react';
import moment                               from 'moment';
import {Link}                               from 'react-router-dom';
import {Paper, TextField, MenuItem,
        Button,Input,InputLabel,
        InputAdornment,withStyles,
        Typography,FormControl,
        Grid,IconButton,Chip,Icon
        }                                   from 'material-ui';
import SearchCustomer                       from './SearchCustomer';
import SearchUsers                          from './SearchUsers';
// import IconButton from 'material-ui/IconButton/IconButton';
import {Search}                             from 'material-ui-icons';
import {styles}                             from '../../../css';
import ConfirmationDialog                   from '../../../../components/confirmationDialog';
import ReactMaterialUiNotifications         from '../../../../components/ReactMaterialUiNotifications';
import {getEntity, postEntity, putEntity}   from '../../../../actions/entity';

import _                                    from 'lodash'
//Local Components
import Days                                 from '../Components/Days';
import Addtime                              from '../Components/TimePicker';

import Maps from '../../../../components/Maps';



require('../style.css');
// var jsonData = require('../Data/data.json');

// export Days

class PickScheduleForm extends Component {
  constructor() {
    super();
    this.state = {
      openCustomerSearchDialog: false,
      openUserSearchDialog: false,
      courierFieldvalue: '',
      status: 'OPEN',
      confirm: false,
      req_phone: '',
      req_name: '',
      req_address: '',
      req_lat: -6.1751,
      req_lon: 106.8650,
      time:[],
      remarks: '',
      username: '',
      sche_courier_employee_id: '',
      ready: false,
    };
    this.geoCoder = null;
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };



  handlePlacesChanged = (searchBox) => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0 && typeof places[0].address_components !== 'undefined') {
        this.setState({
          req_address: places[0].formatted_address,
          req_lat: places[0].geometry.location.lat(),
          req_lon: places[0].geometry.location.lng(),
        });
      }
    }
  };
  handleChangeMarker = (event) => {
    this.updateLatLang(event.latLng);
  };
  handleMapClick = (event) => {
    this.updateLatLang(event.latLng);
  };
  updateLatLang = (latLng) => {
    this.setState({req_lat: latLng.lat(), req_lon: latLng.lng()}, () => {
      if (!this.geoCoder) {
        this.geoCoder = new google.maps.Geocoder();
      }
      this.geoCoder.geocode({location: {lat: this.state.req_lat, lng: this.state.req_lon}}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          this.setState({
            req_address: results[0].formatted_address,
          });
        }
      });
    });
  }
  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.edit !== true && this.setState({ready: true});
    this.props.edit &&
      getEntity(`pickup_schedule/${id}`, null).then((response) => {
        const {data} = response.data;
        // console.log("data.courier.employee_id",data.courier.employee_id)

        this.setState({
          ...data,
          ready: true,
          time: this.formatTime(data.time),
          sche_lat: parseFloat(data.sche_lat),
          sche_lon: parseFloat(data.sche_lon),
          username: data.courier.first_name + ' ' + (data.courier.last_name || ''),
          sche_courier_employee_id: data.courier.employee_id,


        });

        /*req_address: data.req_address,
          req_name: data.req_name,*/


        //console.log("time",this.state.time);
        console.log("api_time",data.time);
        console.log("employee_id",data.courier.employee_id);
      });
  }

  //API Changes : Requested
  formatTime(responseTimeArr) {

    for(var i=0;i<responseTimeArr.length;i++) {
      if( _.isArray(responseTimeArr[i].schedule_time) ) {
        _.forEach(responseTimeArr[i].schedule_time, function(item, index) {
            let time = responseTimeArr[i].schedule_time.substring(3,8);
            responseTimeArr[i].schedule_time[index] = time;
        });
      } else {
        let time = responseTimeArr[i].schedule_time.substring(3,8);
        responseTimeArr[i].schedule_time = [time];
      }
    }
    return responseTimeArr;
  }

  handleAddSubmit = () => {
    return this.setState({confirm: !this.state.confirm});
  };


  handleAction = (action) => {
    this.setState({confirm: false});
    action === 'yes' && !this.props.edit && this.saveEntity();
    action === 'yes' && this.props.edit && this.updateEntity();
  };

  updateEntity = () => {
    const {id} = this.props.match.params;
    console.log("time",this.state.time)
    putEntity(`pickup_schedule/${id}`, {
      req_name: this.state.req_name,
      req_phone: this.state.req_phone,
      req_address: this.state.req_address,
      sche_remarks: this.state.sche_remarks,
      sche_lat: this.state.sche_lat,
      sche_lon: this.state.sche_lon,
      sche_courier_employee_id: this.state.sche_courier_employee_id,
      time: this.state.time,
    }).then((response) => this.entitySubmitSuccess());
  };
  saveEntity = () => {
    postEntity('pickup_schedule', {
      req_name: this.state.req_name,
      req_phone: this.state.req_phone,
      req_address: this.state.req_address,
      sche_remarks: this.state.sche_remarks,
      sche_lat: this.state.sche_lat,
      sche_lon: this.state.sche_lon,
      sche_courier_employee_id: this.state.sche_courier_employee_id,
      time: this.state.time,
    }).then((response) => this.entitySubmitSuccess());
  };
  entitySubmitSuccess = () => {
    this.showNotification('pickup_schedule');
    this.props.history.push(`/pickup/schedule`);
  };
  showNotification = (entity) => {
    ReactMaterialUiNotifications.showNotification({
      text: this.props.edit
        ? `Edit ${entity} success`
        : `Add ${entity} success`,
    });
  };
  /**
   * Added By Sameer 01/02/2018
   * To search customer dilogue
   */
  handleCustomerSearchDialog = (key) => {
    return this.setState({
      openCustomerSearchDialog: !this.state.openCustomerSearchDialog,
    });
  };
  handleUserSearchDialog = (key) => {
    return this.setState({
      openUserSearchDialog: !this.state.openUserSearchDialog,
    });
  };

  /** timePicker  **/

  handleSelectTime =(timeArr,day) => {

    let currentTime = this.state.time;
        //scheduleTime = time['hour']+':'+time['minute'];

    //console.log('Current Day : ',day);
    if(day === '') return;

    let isDayFound = _.find(currentTime, { schedule_day: day })

    if(typeof isDayFound === 'undefined' ) {
      currentTime.push(Object.assign({
        id:this.state.pickup_schedule_id,
        pickup_schedule_id: this.state.pickup_schedule_id,
        schedule_day: day,
        schedule_time: [timeArr]
      }));
    } else {
      currentTime.map( (o, i) => {
        if( o.day == day) {
          currentTime[i].schedule_time = timeArr;
        }
      })
    }

   this.setState({ time: currentTime  });
  };

  getTimeForDay(day) {
    //console.log("day::",day.toUpperCase());
    //console.log("time::",this.state.time)
    let isDayFound = _.find(this.state.time, { schedule_day: day });
    // console.log("currentTime:",isDayFound);
    return (typeof isDayFound === 'undefined')? [] : isDayFound.schedule_time;
  }

  handleSelect = (data) => {
    this.state.openCustomerSearchDialog && this.setCustomerData(data);
    this.state.openUserSearchDialog && this.setUserData(data);
    return this.setState({
      openCustomerSearchDialog: false,
      openUserSearchDialog: false,
    });
  };
  setCustomerData = (data) => {
    this.setState({
      req_phone: data.cust_phone,
      req_name: data.customer_name,
      req_address: data.address,
    });
  };
  setUserData = (data) => {
    this.setState({
      username: data.courier.first_name + ' ' + (data.courier.last_name || ''),
      sche_courier_employee_id: data.id,
    });
  };


  render() {
    const {
      handleAddSubmit,
      handleCustomerSearchDialog,
      handleUserSearchDialog,
      handleSelect,
      handleAction,
    } = this;
    const {classes, edit, history, match} = this.props;
    const {
      ready,
      req_lat,
      req_lon,
      req_phone,
      req_name,
      req_address,
      sche_remarks,
      status,
      courier,
      confirm,
      openCustomerSearchDialog,
      openUserSearchDialog,
    } = this.state;

    let weekDays = [
      { day:'SUNDAY',   'label':'Minggu'},
      { day:'MONDAY',   'label':'Senin'},
      { day:'TUESDAY',  'label':'Selasa'},
      { day:'WEDNESDAY','label':'Rabu'},
      { day:'THURSDAY', 'label':'Khamis'},
      { day:'FRIDAY',   'label':'Jumat'},
      { day:'SATURDAY', 'label':'Sabtu'},
    ];

    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Pickup /
              <span className={classes.transactionBreadcrumbs}> Schedule /</span>
              <span className={classes.transactionBreadcrumbs}>
                {' '}
                {edit ? `Edit Schedule` : `New Schedule`}
              </span>
            </div>
            <br />
            <p className={classes.titleWrapper}>
              {edit ? `Edit Schedule` : `New Schedule`}
            </p>
          </div>
        </div>
        <div>
          <Grid xs={12} md={12} item>
            <Paper className={classes.formWrapper}>
              <Typography className={classes.typography} type="headline">{' '} {edit ? `Edit Schedule `+req_name : `New Schedule `}</Typography>
              <Grid container>
                <Grid item xs={6} sm={6}>
                  <div>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="name">Name*</InputLabel>
                      <Input
                        id="req_name"
                        type="text"
                        value={req_name}
                        onChange={this.handleChange('req_name')}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={this.handleCustomerSearchDialog}
                            >
                           <Search />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <br />
                    <TextField
                      onChange={this.handleChange('req_phone')}
                      id="req_phone"
                      label="Phone"
                      value={req_phone}
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('req_address')}
                      id="req_address"
                      value={req_address}
                      label="Address"
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('sche_remarks')}
                      id="sche_remarks"
                      value={sche_remarks}
                      label="Remarks"
                      required
                      className={classes.textField}
                    />
                    <br />
                    <TextField
                      onChange={this.handleChange('courier')}
                      id="courier"
                      value={this.state.username}
                      label="Courier"
                      required
                      className={classes.textField}
                    />
                    <br/>

                  </div>
                </Grid>
                <Grid item xs={6} sm={6}>
                  {ready && (
                    //data={{name: req_name, address: req_address, status: status}}
                    <Maps
                      showSearch={true}
                      allowMarker={true}
                      onUpdateMarker={this.handleChangeMarker}
                      onPlacesChanged={this.handlePlacesChanged}
                      onClick={this.handleMapClick}
                      defaultCenter={{lat: req_lat, lng: req_lon}}
                    />
                  )}
                </Grid>
              </Grid>
              <br/>
              <p style={{fontWeight: 'bold'}}> {'Set Schedule:'}</p>
              <br/>
              <div className={classes.root}>
                <Grid  container spacing={24}>
                  {
                    _.map(weekDays,(x) => x.day).map( (o,i) => {
                      return(
                          <Grid className='sevencolumns' key={o} item xs={2} md={2}>
                            <Days
                              key={o} id={o}
                              label={ weekDays[i].label }
                              className={this.props.classes}
                              handleSelectTime={ (time,day) => this.handleSelectTime(time,day) }
                              setTime={ this.getTimeForDay.bind(this) }
                            />
                          </Grid>
                      );
                    })
                  }
                </Grid>
              </div>
              <div>
                <div>
                <p style={{fontWeight: 'bold'}}> {'Schedule Time:'}</p>
                <br/>
                { this.state.time.map( (o,i)=> {
                      let day = _.find(weekDays,{ day: o.schedule_day })
                      if(o.schedule_time.length > 0 )
                        return <div key={i}>{ day.label } | {o.schedule_time.join(',')}</div>
                  })
                }
                </div>
                <div style={{ marginLeft: '83%', marginTop: '2%' }}>
                  <Button
                    style={{marginRight: 12}}
                    onClick={() => history.goBack()}
                    component={Link}
                    to={`${match.url}`}
                  >
                    Cancel
                  </Button>
                  <Button
                  variant="raised"
                  color="primary"
                  onClick={handleAddSubmit}>
                    {edit ? `EDIT` : `ADD`}
                  </Button>
                </div>
              </div>

              {openCustomerSearchDialog && (
                <SearchCustomer
                  handleSelect={handleSelect}
                  openDialog={openCustomerSearchDialog}
                  handleOpenDialog={handleCustomerSearchDialog}
                />
              )}
              {openUserSearchDialog && (
                <SearchUsers
                  handleSelect={handleSelect}
                  openDialog={openUserSearchDialog}
                  handleOpenDialog={handleUserSearchDialog}
                />
              )}

              <ConfirmationDialog
                yeslabel={edit ? 'EDIT' : 'ADD'}
                title={edit ? `Edit pickup Schedule` : `New pickup Schedule`}
                description={
                  edit
                    ? `Are you sure you want to save this pickup?`
                    : `Are you sure you want to add this pickup?`
                }
                open={confirm}
                handleAction={handleAction}
              />
            </Paper>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PickScheduleForm);
