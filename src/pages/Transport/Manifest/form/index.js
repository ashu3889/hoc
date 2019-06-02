import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {Paper, TextField, Button, Chip} from 'material-ui';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import WarningDialog from '../../../../components/warningDialog';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography/Typography';
import { MenuItem } from 'material-ui/Menu';
import FormControl from 'material-ui/Form/FormControl';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import SearchDestination from './SearchDestination';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton/IconButton';
import EnhancedInboundTableHead from './extComps/tableHead';
import {Search, ArrowDropDown} from 'material-ui-icons';
import {styles} from '../../../css';
import ConfirmationDialog from '../../../../components/confirmationDialog';
import ReactMaterialUiNotifications from '../../../../components/ReactMaterialUiNotifications';
import ReferenceDropDown from '../../../../components/refrencedropdown';
import renderIf from '../../../../components/renderIf';
import {getEntityList, getEntity, postEntity, putEntity, deleteEntity} from '../../../../actions/entity';
import UserLinearProgress from '../UserLinearprogress';

const WAIT_INTERVAL = 1000;
var baglistscanneddata = [];
var baglistsorted = [];
var textContent = '';
var manifest_ID = '';
var destination_ID = '';
class AddMenifestListForm extends Component {

  constructor() {
    super();
    this.state = {
      vehicletype: [],
      vehicletypeid: 36,
      vehicle_type: null,
      detail_info : null,
      origin_id: '',
      origin_name: null,
      destination_id: null,
      destination_name: null,
      transport_book: [],
      transport_id: null,
      transport: null,
      manifest_id: null,
      courierFieldvalue: '',
      confirm: false,
      confirmBag: false,
      req_bagnumber: '',
      username: '',
      selected: [],
      menifesttype: 36,
      msgg: null,
      smuvalue: '',
      name: 'first',
      manifest_no: '...',
      plate_number: null,
      add_plate_number: null,
      driver_id: null,
      driver_name: null,
      checker_id: null,
      checker_name: null,
      baglistgetitem: [],
      manifest_type_id: null,
      vehicle_type_id: null,
      manifest_type_name: null,
      vehicleTypeData: [],
      manifestTypevalue: [],
      platenumberdata: [],
      manifest_status: '',
      driveranccheckerlist: [],
      ready: false,
      loaderflag: false,
      rowdata:[],
      emptyValDialog: false,
    };
    this.handleModal = this.handleModal.bind(this);
  }
  handleModal = (key) => {
    return this.setState({[key]: !this.state[key]});
  };
  handleVehicleTypeChange = (event) => {
    const {value} = event.target;
    let vehicle_type = this.state.vehicletype.filter((item) => item.vehicle_type_id === value);
    this.setState({vehicletypeid: event.target.value, vehicle_type: vehicle_type[0]});
  }
  handleUpdate = (name) => (value) => {
    this.setState({[name]: value}, () => {
      this.loadTransportBooking();
    });
  };
  handleChangeTransport = (event) => {
    const {value} = event.target;
    let transport = this.state.transport_book.filter((item) => item.transport_id === value);
    this.setState({transport_id: value, transport: transport[0]});
    return getEntity(`transport_book/${value}`, null).then((response) => {
        const {data} = response.data;
        this.setState({
          detail_info : data
        })
      }, () => {
         this.setState({
          detail_info : null
        })
        });
  }
  loadTransportBooking = () => {
    const {vehicletypeid, destination_id, origin_id} = this.state;
    if (vehicletypeid && destination_id && origin_id) {
      getEntityList(`transport_book?destination=${destination_id}&origin=${origin_id}&vehicle_type_id=${vehicletypeid}`, null).then((response) => {
        const {data} = response.data;
        this.setState({transport_book: data});
      });
    }
  }
  componentWillMount() {
    this.timer = null;
  }

  handleChange = (name) => (event) => {
    if (event.target.value == '') {
      return this.setState({[name]: '', loaderflag: false,});
    }
    this.setState({
      [name]: event.target.value,
      loaderflag: true,
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.search(), WAIT_INTERVAL);
  };

  search = (key) => {
    if (this.state.req_bagnumber.length > 13) {
      const {vehicle_type, manifest_id,manifest_no, req_bagnumber, vehicletypeid, transport, origin_id, destination_id, vehicle_id, police_no, driver_id, checker_id,add_plate_number,vehicleTypeData} = this.state;
      let data = {
        manifest_no: transport ? transport.manifest_no : undefined,
        vehicle_type_id: vehicletypeid,
        origin_id,
        destination_id,
        bag: req_bagnumber,
        police_no : undefined,
        driver_id : driver_id?driver_id : 0,
        vehicle_id : add_plate_number?add_plate_number : 0,
        checker_id : checker_id?checker_id : 0
      };
      if (!_.includes(data, null)) {
        if (manifest_id) {
          data['manifest_id'] = manifest_id;
        }
        
        var current_scan = this.state.req_bagnumber;        
        if(_.findIndex(this.state.baglistgetitem,function(o){return o.bag_no == current_scan;} ) !== -1){
          alert('Bag Number already inside manifest!!');
          this.setState({req_bagnumber:'',loaderflag: false});
          return false;
        }
        
        return postEntity(`manifest/bag`, data).then(
          (response) => {
            const {data} = response.data;
            if (data && data != null) {
              if(response.status == 200 || response.status == 201){
                this.setState({
                  baglistgetitem: data.manifest_detail,
                });
                return this.setState({manifest_id: data.manifest_id,manifest_no:data.manifest_no, rowdata: data, req_bagnumber: '', loaderflag: false});
              } 
          } else {
            alert('Bag Detail is not available!!');
            this.setState({loaderflag: false});
          }
        }).catch(e=>{
          if (e.response.status == 300) {
                  this.setState({
                    confirmBag:true,
                    loaderflag: false
                  });
              } else if (e.response.status == 400){
                  this.setState({
                    loaderflag: false
                  });
                  alert('Bag number is invalid!!');
              }
        });
      }
    }
    this.setState({loaderflag: false});
  };

  handlePlateChange = event => {
    //var sel_platenum = event.nativeEvent.explicitOriginalTarget.nodeValue;
    this.setState({
      [event.target.name]: event.target.value,
      //platenumname: sel_platenum
    });
  };

  handlePlateChangeAddNew = event => {
    //var sel_platenum = event.nativeEvent.explicitOriginalTarget.nodeValue;
    this.setState({
      [event.target.name]: event.target.value,
      //platenumname: sel_platenum
    });
  };

  handleDriverChange = event => {
    //var sel_drivername = event.nativeEvent.explicitOriginalTarget.nodeValue;
    this.setState({
      [event.target.name]: event.target.value,
      //drivername: sel_drivername
    });
  };

  handleCheckerChange = event => {
    //var sel_checkername = event.nativeEvent.explicitOriginalTarget.nodeValue;
    this.setState({
      [event.target.name]: event.target.value,
      //checkername: sel_checkername
    });
  };

  componentDidMount() {

    let pathClass = window.location.pathname.split('/').join(' ').trim();
    document.body.className = (pathClass) ? pathClass : 'home';
    var root = document.getElementsByTagName( 'html' )[0];
    root.className += ' manifesteditpage';

    const {id} = this.props.match.params;
    this.props.edit !== true && this.props.check !== true && this.setState({ready: true});

    if (this.props.edit || this.props.check) {
      return getEntity(`manifest/${id}`, null).then((response) => {
        const {data} = response.data;
        this.setState({
          ...data,
          ready: true,
          manifestno: data.manifest_no,
          menifesttype: data.vehicle_type.vehicle_type_id,
          vehicletypeid: data.vehicle_type.vehicle_type_id,
          vehicleid: data.vehicle_id?data.vehicle_id : 0,
          plate_number: data.police_no,
          driver_id: parseInt(data.driver_id)?data.driver_id:0,
          driver_name: data.driver_name,
          checker_id: parseInt(data.checker_id)?data.checker_id:0,
          checker_name: data.checker_name,
          baglistgetitem: data.manifest_detail,
          manifest_status: data.status,
          transport_id  : data.transport ? data.transport.transport_id :'',
        }, () => {
          if (this.props.edit) {
            this.loadOtherData();
          }
        });
      });
    }
    this.loadOtherData();
  }
  loadOtherData = (editdata) => {
    getEntityList(`transport_book/${this.state.transport_id }`, null).then((response) => {
          const {data} = response.data;
          console.log(data);
          this.setState({
            detail_info : data
          })
    });
    getEntityList('vehicletype', null).then((response) => {
      const {data} = response.data;
      this.setState({vehicletype: data});
    });
    getEntityList('vehicle', null).then((response) => {
      const {data} = response.data;
      this.setState({vehicleTypeData: data});
    });
    getEntityList(`employee?type=4`, null).then((response) => {
      const {data} = response.data;
      this.setState({driveranccheckerlist: data});
    });
    this.loadTransportBooking();
  }
  handleAddSubmit = (actionvalue) => {
    var ac_status = '';
    if (actionvalue == 'finish') {
      ac_status = 0;
    }else{
      ac_status = 1;
    }
    return this.setState({confirm: !this.state.confirm, manifest_st: ac_status});
  };
  handleRemoveBag = (bag_id) => {
    console.log(this.state.manifest_id);
    return deleteEntity(`manifest_detail/${bag_id}`).then(
          (response) => {
              return getEntity(`manifest/${this.state.manifest_id}`, null).then((response2) => {
                const {data} = response2.data;
                this.setState({
                  baglistgetitem: data.manifest_detail,
                });
                // baglistsorted = data.manifest_detail;
                // baglistscanneddata.push(data);
                return this.setState({manifest_id: data.manifest_id,manifest_no:data.manifest_no, rowdata: data, req_bagnumber: '', loaderflag: false});
              });
        }).catch(e=>{
            alert('Removing bag error');
        });
  };
  handleAction = (action) => {
    this.setState({confirm: false});
    action === 'yes' && !this.props.edit && this.saveEntity();
    action === 'yes' && this.props.edit && this.updateEntity();
  };

  handleActionBag = (action) => {
    this.setState({confirmBag: false});
    action === 'yes' && !this.props.edit && this.saveEntityBag();
    action === 'yes' && this.props.edit && this.saveEntityBag();
  };

  saveEntityBag = () => {
    const {vehicle_type, manifest_id,manifest_no, req_bagnumber, vehicletypeid, transport, origin_id, destination_id, vehicle_id, police_no, driver_id, checker_id,add_plate_number,vehicleTypeData} = this.state;
    let data = {
      manifest_no: transport ? transport.manifest_no : undefined,
      vehicle_type_id: vehicletypeid,
      origin_id,
      destination_id,
      bag: req_bagnumber,
      police_no : undefined,
      driver_id : driver_id?driver_id : 0,
      vehicle_id : add_plate_number?add_plate_number : 0,
      checker_id : checker_id?checker_id : 0
    };
    if (!_.includes(data, null)) {
      if (manifest_id) {
        data['manifest_id'] = manifest_id;
      }
      return postEntity(`manifest/bag?ignore=all`, data).then(
        (response) => {
            const {data} = response.data;
            if (data && data != null) {
              if(response.status == 200 || response.status == 201){
                this.setState({
                  baglistgetitem: data.manifest_detail,
                });
                // baglistsorted = data.manifest_detail;
                // baglistscanneddata.push(data);
                // // // for (var i = baglistscanneddata.length; i > 0; i--) {
                // // //   baglistsorted.push(baglistscanneddata[i-1]);
                // // // }
                // // // console.log(baglistsorted);
                return this.setState({manifest_id: data.manifest_id,manifest_no:data.manifest_no, rowdata: data, req_bagnumber: '', loaderflag: false});
              } 
          } else {
            alert('Bag Detail is not available!!');
            this.setState({loaderflag: false});
          }
        }).catch(e=>{
          if (e.response.status == 300) {
                  this.setState({
                    confirmBag:true,
                    loaderflag: false
                  });
              } else if (e.response.status == 400){
                  this.setState({
                    loaderflag: false
                  });
                  alert('Bag number is invalid!!');
              }
        });
    }
  }
  updateEntity = () => {
    let userNodeId = null;
    let userNodeName = null;
    let bagarr = [];
    let bagdata = "";

    this.state.baglistgetitem.map((baglistdata, index) => (
      (baglistdata.bag_id && baglistdata.bag_id != null) ?
        bagarr.push(baglistdata.bag_id)
      :
        bagarr.push('0')
    ));

    bagdata = bagarr.join(",");
    const {id} = this.props.match.params;
    //if (this.state.menifesttype == 23) {
      putEntity(`manifest/${id}`, {
        manifest_id: this.state.manifest_id,
        manifest_no: this.state.manifest_no,
        vehicle_type_id: this.state.menifesttype,
        origin_id: this.props.activeNode.nodeID,
        origin_name: this.props.activeNode.nodeName,
        destination_name: 'Destination Id- '+this.state.destination_id,
        destination_id: this.state.destination_id,
        vehicle_id: this.state.vehicle_id?this.state.vehicle_id:0,
        //police_no: this.state.platenumname,
        driver_id: this.state.driver_id?this.state.driver_id:0,
        //driver_name: this.state.drivername,
        checker_id: this.state.checker_id?this.state.checker_id:0,
        //checker_name: this.state.checkername,
        bag: bagdata,
        status: this.state.manifest_st,
      }).then((response) => this.entitySubmitSuccess());
    //}
    // else{
    //   putEntity(`manifest/${id}`, {
    //     manifest_no: this.state.manifestno,
    //     manifest_type_id: this.state.menifesttype,
    //     origin_id: this.props.activeNode.nodeID,
    //     origin_name: this.props.activeNode.nodeName,
    //     destination_name: 'Destination Id- '+this.state.destination_id,
    //     destination_id: this.state.destination_id,
    //     bag: bagdata,
    //     status: this.state.manifest_st,
    //   }).then((response) => this.entitySubmitSuccess());
    // }
  };
  saveEntity = () => {
    let userNodeId = null;
    let userNodeName = null;
    let bagarr = [];
    let bagdata = "";

    this.state.baglistgetitem.map((baglistdata, index) => (
      (baglistdata.bag_id && baglistdata.bag_id != null) ?
        bagarr.push(baglistdata.bag_id)
      :
        bagarr.push('0')
    ));

    bagdata = bagarr.join(",");
    //if (this.state.vehicle_type.vehicle_mode.mode_id === 1) {
      postEntity('manifest', {
        manifest_id: this.state.manifest_id,
        manifest_no: this.state.manifest_no,
        vehicle_type_id: this.state.menifesttype,
        origin_id: this.props.activeNode.nodeID,
        origin_name: this.props.activeNode.nodeName,
        destination_name: 'Destination Id- '+this.state.destination_id,
        destination_id: this.state.destination_id,
        vehicle_id: this.state.add_plate_number?this.state.add_plate_number:0,
        //police_no: this.state.platenumname,
        driver_id: this.state.driver_id?this.state.driver_id:0,
        //driver_name: this.state.drivername,
        checker_id: this.state.checker_id?this.state.checker_id:0,
        //checker_name: this.state.checkername,
        bag: bagdata,
        status: this.state.manifest_st,

      }).then((response) => this.entitySubmitSuccess());
    // } else {
    //   postEntity('manifest', {
    //     manifest_no: this.state.manifestno,
    //     manifest_type_id: this.state.menifesttype,
    //     origin_id: this.props.activeNode.nodeID,
    //     origin_name: this.props.activeNode.nodeName,
    //     destination_name: 'Destination Id- '+this.state.destination_id,
    //     destination_id: this.state.destination_id,
    //     bag: bagdata,
    //     status: this.state.manifest_st,
    //   }).then((response) => this.entitySubmitSuccess());
    // }
  };
  entitySubmitSuccess = () => {
    this.showNotification('manifest');
    window.location ='/transport/manifest';
    //this.props.history.push(`/transport/manifest`);
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
      handleVehicleTypeChange,
      handleChangeTransport,
      handleUpdate,
      handleResetvalue,
      handleChange,
      handleAddSubmit,
      handleAction,
      handleActionBag,
      handleRemoveBag
    } = this;
    const {classes, edit, check, history, match, location} = this.props;
    const {
      vehicletype, vehicletypeid, vehicle_type,
      origin_id, origin_name,
      destination_id, destination_name,
      transport_book, transport_id,
      ready,
      username,
      req_bagnumber,
      confirm,
      confirmBag,
      plate_number,
      add_plate_number,
      menifesttype,
      manifest_type_id,
      vehicle_type_id,
      manifest_type_name,
      driver_id,
      driver_name,
      checker_id,
      checker_name,
      vehicleTypeData,
      manifestTypevalue,
      platenumberdata,
      detail_info,
      manifest_status,
      loaderflag,
      msgg,
      driveranccheckerlist,
      manifest_no,
      emptyValDialog,
      errortext
    } = this.state;
    const {rowdata, selected, baglistgetitem} = this.state;
    const {url} = match;

    // if (Object.keys(baglistdatast).length > 0) {
    //   console.log('tattrtrtrtr');
    //   console.log(baglistdatast);
    // }else{
    //   console.log('baglistdatast');
    //   console.log(baglistdatast);
    // }

    var totalbag = 0;
    var bag_connoteSum = 0;
    if(manifest_status == 0){
       var manifest_status_txt = 'Finish';
    } else if(manifest_status == 1 ) {
       var manifest_status_txt = 'Depart';
    } else {
       var manifest_status_txt = '-';
    }
    if (baglistgetitem.length > 0) {
      totalbag += baglistgetitem.length;
      for (let i = 0; i < baglistgetitem.length; i++) {
        if (baglistgetitem[i].total_weight) {
          bag_connoteSum += parseFloat(baglistgetitem[i].total_weight);
        }
      }
    }

    return (
    <div className={classes.root}>
      <div className={'mainwrapedit'}>
        <div className={'editmaniheader'}>
          <div className={classes.headerWrapper}>
            <div className={classes.pageTitle}>
              <div className={classes.breadCrumbs}>
                Transport /
                <span className={classes.transactionBreadcrumbs}> Manifest /</span>
                <span className={classes.transactionBreadcrumbs}>
                  {check ? `Manifest #${manifest_no}` : (edit ? `Edit Manifest` : `New Manifest`)}
                </span>
              </div>
              <br />
              <p className={classes.titleWrapper}>
                {check ? `Manifest #${manifest_no}` : (edit ? `Edit Manifest #${manifest_no}` : `New Manifest`)}
              </p>
              <div>
                <a href="javascript:window.print()" >{edit ? 'Print' : ''}</a>
                {edit ? <div style={{float:'right',fontSize:20,fontWeight:'bold'}}>Status : {manifest_status_txt}</div> : ''}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Grid container spacing={24}>
          {
            this.props.check !== true &&
            <Grid item xs={12} sm={12}>
              <Paper className={classes.formWrapper}>
                <Grid container>
                  <Grid item xs={6} sm={6}>
                    <Typography type="headline" style={{fontSize: 18, color: "#424242"}}>
                      <strong>{edit ? `Edit Manifest` : `New Manifest`}</strong>
                    </Typography>
                    <br/>
                    <FormControl className={classes.textField} id="manifest_type">
                      <InputLabel>Type*</InputLabel>
                      <Select 
                        value={vehicletypeid} 
                        onChange={handleVehicleTypeChange}
                        readOnly = {manifest_status == 1}>
                        {vehicletype.map((option, index) => (
                          <MenuItem key={option.vehicle_type_id} value={option.vehicle_type_id}>
                            {option.type_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.textField}>
                      <ReferenceDropDown
                        className={classes.textField}
                        value={this.state.origin_id ? parseInt(origin_id, 10) : 'none'}
                        selectedValue={
                          origin_name && {node_name: origin_name, node_id: origin_id}
                        }
                        remoteCall={getEntityList}
                        entity={`external_nodes?vehicle_type=${vehicletypeid}&type_request=created_manifest`}
                        valueKey={'node_id'}
                        labelKey={'node_name'}
                        searchkey={'s'}
                        placeholder={'Origin'}
                        onUpdate={handleUpdate('origin_id')}
                        disabled = {manifest_status == 1}
                      />
                    </FormControl>
                    <FormControl className={classes.textField}>
                      <ReferenceDropDown
                        className={classes.textField}
                        value={this.state.destination_id ? parseInt(destination_id, 10) : 'none'}
                        selectedValue={
                          destination_name && {node_name: destination_name, node_id: destination_id}
                        }
                        remoteCall={getEntityList}
                        entity={`external_nodes?vehicle_type=${vehicletypeid}&origin=${origin_id}&type_request=created_manifest`}
                        valueKey={'node_id'}
                        labelKey={'node_name'}
                        searchkey={'s'}
                        placeholder={'Destination'}
                        onUpdate={handleUpdate('destination_id')}
                        disabled = {manifest_status == 1}
                      />
                    </FormControl>
                    <FormControl className={classes.textField}>
                      <InputLabel htmlFor="menifestsmu">SMU#</InputLabel>
                      <Select 
                        value={transport_id || 'undefined'} 
                        onChange={handleChangeTransport} 
                        readOnly = {manifest_status == 1}>
                      <MenuItem value='undefined'>
                        Generate
                      </MenuItem>
                      {
                          transport_book && transport_book.map((option, index) => (
                            <MenuItem key={option.transport_id} value={option.transport_id}>
                              {option.manifest_no}
                            </MenuItem>
                          ))

                      }
                      </Select>
                    </FormControl>

                  </Grid>
                <Grid item xs={6} sm={6}>
                {
                  vehicle_type && (
                      vehicle_type.vehicle_type_id !== 5 &&
                      vehicle_type.vehicle_type_id !== 6 &&
                      vehicle_type.vehicle_type_id !== 7) && (
                      <div>
                      <Typography type="headline" style={{opacity: 0, fontSize: 18, color: "#424242"}}>
                        <strong>New Manifest</strong>
                      </Typography>
                      <br/>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="plate_number">Plate Number</InputLabel>
                        {this.state.plate_number != null ?
                          <Select
                            value={this.state.plate_number}
                            onChange={this.handlePlateChange}
                            inputProps={{
                              name: 'plate_number',
                              id: 'plate_number',
                            }}
                            readOnly = {manifest_status == 1}
                          >
                            {vehicleTypeData.map((option, index) => (
                              <MenuItem key={option.vehicle_id} value={option.police_no}>
                                {option.police_no}
                              </MenuItem>
                            ))}
                          </Select>
                          :
                          <Select
                            value={(this.state.add_plate_number) ? this.state.add_plate_number : 'none'}
                            onChange={this.handlePlateChangeAddNew}
                            inputProps={{
                              name: 'add_plate_number',
                              id: 'add_plate_number',
                            }}
                            readOnly = {manifest_status == 1}
                          >
                            {vehicleTypeData.map((option, index) => (
                              <MenuItem key={option.vehicle_id} value={option.vehicle_id}>
                                {option.police_no}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                      </FormControl>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="driver_id">Driver</InputLabel>
                        {this.state.driver_id != null ?
                          <Select
                            value={this.state.driver_id}
                            onChange={this.handleDriverChange}
                            inputProps={{
                              name: 'driver_id',
                              id: 'driver_id',
                            }}
                            readOnly = {manifest_status == 1}
                          >
                            {driveranccheckerlist.map((option, index) => (
                              <MenuItem key={option.employee_id} value={option.employee_id}>
                                {option.first_name} {option.last_name}
                              </MenuItem>
                            ))}
                          </Select>
                        :
                        <Select
                          value={'none'}
                          onChange={this.handleDriverChange}
                          inputProps={{
                            name: 'driver_id',
                            id: 'driver_id',
                          }}
                          readOnly = {manifest_status == 1}
                        >
                          {driveranccheckerlist.map((option, index) => (
                            <MenuItem key={option.employee_id} value={option.employee_id}>
                              {option.first_name} {option.last_name}
                            </MenuItem>
                          ))}
                        </Select>
                      }
                      </FormControl>
                      <FormControl className={classes.textField}>
                        <InputLabel htmlFor="checker_id">Checker</InputLabel>
                        {this.state.checker_id != null ?
                          <Select
                            value={this.state.checker_id}
                            onChange={this.handleCheckerChange}
                            inputProps={{
                              name: 'checker_id',
                              id: 'checker_id',
                            }}
                            readOnly = {manifest_status == 1}
                          >
                            {driveranccheckerlist.map((option, index) => (
                              <MenuItem key={option.employee_id} value={option.employee_id}>
                                {option.first_name} {option.last_name}
                              </MenuItem>
                            ))}
                          </Select>
                          :
                          <Select
                            value={'none'}
                            onChange={this.handleCheckerChange}
                            inputProps={{
                              name: 'checker_id',
                              id: 'checker_id',
                            }}
                            readOnly = {manifest_status == 1}
                          >
                            {driveranccheckerlist.map((option, index) => (
                              <MenuItem key={option.employee_id} value={option.employee_id}>
                                {option.first_name} {option.last_name}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                      </FormControl>
                      </div>
                )}
                 { detail_info && (
                      <div>
                      <FormControl className={classes.textField} fullWidth={true} margin="normal">
                      <InputLabel htmlFor="transport_name">Transport Name</InputLabel>
                      <Input 
                          readOnly="true"
                          disabled="true" 
                          value={detail_info.provider_name}
                      />
                      </FormControl>

                      <FormControl className={classes.textField} fullWidth={true} margin="normal">
                      <InputLabel htmlFor="transport_route">Transport Route</InputLabel>
                      <Input 
                          readOnly="true"
                          disabled="true" 
                          value={detail_info.transport_route}
                      />
                      </FormControl>

                      <FormControl className={classes.textField} fullWidth={true} margin="normal">
                      <InputLabel htmlFor="etd">ETD</InputLabel>
                      <Input 
                          readOnly="true"
                          disabled="true" 
                          value={moment(detail_info.etd).format('DD-MMM, HH:mm')+' WIB'}
                      />
                      </FormControl>

                      <FormControl className={classes.textField} fullWidth={true} margin="normal">
                      <InputLabel htmlFor="eta">ETA</InputLabel>
                      <Input 
                          readOnly="true"
                          disabled="true" 
                          value={moment(detail_info.eta).format('DD-MMM, HH:mm')+' WIB'}
                      />
                      </FormControl>

                      </div>
                      )}
                      <br/>
                      <p></p>
                </Grid>
                </Grid>
              </Paper>
            </Grid>
            }
            <Grid item xs={9} sm={9}>
              <Paper className={classes.formWrapper}>
                <Typography type="headline" style={{fontSize: 18, color: "#424242"}}>
                  <strong>{' '}
                  {edit ? `Edit bag` : `List of Bags`}</strong>
                </Typography>
                <div>
                  <FormControl className={classes.textField}>
                    <InputLabel htmlFor="req_bagnumber">Masukkan kode bag</InputLabel>
                    <Input
                      id="req_bagnumber"
                      type="text"
                      value={req_bagnumber}
                      onChange={this.handleChange('req_bagnumber')}
                      readOnly={manifest_status == 1}
                    />
                    {/*<Button style={{position: 'absolute', right: 0, top: 18}} variant="flat" color="primary" onClick={handleResetvalue}>
                      Reset
                    </Button>*/}
                  </FormControl>
                  <br />

                  <div className={classes.tableWrapper}>
                    {(loaderflag && rowdata != null && rowdata.length === 0) && <UserLinearProgress />}
                    {
                      check !== true &&
                    <Table className={classes.table}>
                      <EnhancedInboundTableHead
                        numSelected={selected.length}
                      />
                      <TableBody>
                      {emptyValDialog && (
                        <WarningDialog
                          text={errortext}
                          open={emptyValDialog}
                          handleModal={() => handleModal('emptyValDialog')}
                        />
                      )}
                      {baglistgetitem.map((baglistval, index) => (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={index}
                            >
                              <TableCell>{baglistval.bag_no ? baglistval.bag_no : '-'}</TableCell>
                              <TableCell>{baglistval.total_weight ? baglistval.total_weight : 0}</TableCell>
                              <TableCell>{baglistval.total_connote ? baglistval.total_connote : 0}</TableCell>
                              <TableCell>{baglistval.bag.destination_tlc ? baglistval.bag.destination_tlc : '-'}</TableCell>
                              <TableCell>
                                {manifest_status == 1 ? '' :
                                <Button variant="raised" color="primary" onClick={() => {this.handleRemoveBag(baglistval.id)}}>
                                  Remove
                                </Button>
                                }
                              </TableCell>
                            </TableRow>
                         ))
                        }
                      </TableBody>
                    </Table>
                    }
                  </div>
                </div>
                <ConfirmationDialog
                  yeslabel={edit ? 'Save' : 'Add'}
                  title={edit ? `Edit Manifest` : `New Manifest`}
                  description={
                    edit
                      ? `Are you sure you want to save this Manifest?`
                      : `Are you sure you want to add this Manifest?`
                  }
                  open={confirm}
                  handleAction={handleAction}
                />
                <ConfirmationDialog
                  yeslabel={edit ? 'Save' : 'Add'}
                  title={edit ? `Edit Bag` : `New Bag`}
                  description={
                    `Destination of bag is not same as destination of manifest. Do you wnat to continue?`
                  }
                  open={confirmBag}
                  handleAction={handleActionBag}
                />
              </Paper>
              <div className={'actionbuttons'}>
                {
                  edit ?
                  <div style={{display: 'flex', margin: '10px 0px', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    
                    {
                      manifest_status == 1 && origin_id === this.props.activeNode.nodeID ?
                      <Button variant="raised" color="default" onClick={() => {window.location.href = '/transport/manifest/'}}>
                        Back
                      </Button>
                      :
                      <div>
                      <Button variant="raised" color="primary" onClick={() => {this.handleAddSubmit('finish')}}>
                        Finish
                      </Button>
                      <Button variant="raised" color="primary" style={{marginLeft: 20}} onClick={() => {this.handleAddSubmit('depart')}}>
                        Depart
                      </Button>
                      </div>
                    }
                  </div>
                  :
                  <div style={{display: 'flex', margin: '10px 0px', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    <Button variant="raised" color="primary" onClick={() => {this.handleAddSubmit('finish')}}>
                      Finish
                    </Button>
                    {
                      origin_id === this.props.activeNode.nodeID &&
                    <Button variant="raised" color="primary" style={{marginLeft: 20}} onClick={() => {this.handleAddSubmit('depart')}}>
                      Depart
                    </Button>
                    }
                  </div>
                }
                
              </div>

            </Grid>

            <Grid item xs={3} sm={3}>
              <Paper className={classes.formWrapper} style={{minHeight:228}}>
                <Typography type="headline" style={{fontSize: 18, color: "#424242"}}>
                  <strong>Manifest Information</strong>
                </Typography>
                <p>
                  Bag: <strong style={{color: "#333333"}}>{totalbag}/15</strong>
                </p>
                <p>
                  Total Weight (Kg): <strong style={{color: "#333333"}}>{bag_connoteSum}/300</strong>
                </p>
              </Paper>
            </Grid>
          </Grid>



        </div>
      </div>
    </div>
    );
  }
}

const removebt = {
  color: '#e62e28'
}

const mapStateToProps = (state) => ({
  activeNode: state.header.activeNode,
});

export default connect(mapStateToProps)(withStyles(styles)(AddMenifestListForm));
