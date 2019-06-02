import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import axios, { post,fetch } from 'axios';

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

import ConfirmationDialog from '../../../components/confirmationDialog';
import ReactMaterialUiNotifications from '../../../components/ReactMaterialUiNotifications';
import EnhancedToolbar from '../../../components/EnhancedToolbar'

import {getEntity, postEntity, putEntity} from '../../../actions/entity';
import {BASE_API} from '../../../actions/http-client';

import { styles as baseStyles } from '../../css';

const styles = (theme) => ({
  ...baseStyles(theme)
})


class UploadConnoteForm extends Component {
  constructor() {
    super();
    this.state = {
      shipper_id : '',
      customer_id : '',
      weight : '',
      service_id : '',
      file : [],
      services : [],
      showInfo : false,
      shipper_info: [] 
    };
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onChange(e) {
    //console.log(e.target.files[0]);
    this.setState({file:e.target.files[0]})
  }
  componentDidMount() {
    getEntity('service').then((res) => {
      const {data} = res.data;
      this.setState({
        services : data,
      });
    });
  }
  onFormSubmit(e){
    const url = BASE_API+'excel';
    const node_id = sessionStorage.getItem('userNodeId');
    const formData = new FormData();
    formData.append('n',node_id);
    formData.append('service_id',this.state.service_id);
    formData.append('weight',this.state.weight);
    formData.append('customer_id',this.state.customer_id);
    formData.append('shipper_id',this.state.shipper_id);
    formData.append('file',this.state.file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    post(url, formData,config).then(results => {
      if(results.data.status.code = '201'){
        alert('Data berhasil diupload');
        this.setState({
          shipper_id : '',
          customer_id : '',
          weight : '',
          service_id : '',
          file : [],
          services : [],
          showInfo : false,
          shipper_info: [] 
        });
      } else {
        alert('Data Gagal diupload');
      }
    });
  }
  handleChange = (name) => (event) => {
    if (event.target.value == '') {
      return this.setState({[name]: '', loaderflag: false,});
    }
    this.setState({
      [name]: event.target.value,
    });
  }
  handleBlur = ()  => {
       const {shipper_id} = this.state;
       if(shipper_id){
          return getEntity(`customer/code/${shipper_id}`, null).then((response) => {
            const {data} = response.data;
            if(data.length == 0){
              this.setState({shipper_id : '',customer_id: '',shipper_info:[],showInfo:false});
              alert('data kosong');
            } else {
              this.setState({showInfo:true,shipper_info:data,customer_id: data[0].customer_id});
            }
          });
       }
       
  }
  render() {
    const {classes, history, match} = this.props;
    const {shipper_id,customer_id,weight,service_id,file,services,showInfo,shipper_info} = this.state;
    const {onFormSubmit,handleChange,handleBlur} = this;
    return (
      <div className={classes.root}>
        <EnhancedToolbar navs={['Upload', 'Connote']} />
        <Card className={classes.card}>
          <CardHeader title='Upload Connote' className={classes.cardHeader} />
          <CardContent>
            <Grid container spacing={40}>
              <Grid item xs={12} sm={6}>
                  <div>
                      <a href="http://coreapi.skyware.systems/docs/jtcexcel.xlsx">Download template</a>
                  </div>
                <TextField
                  fullWidth
                  margin="normal"
                  id="shipper_id"
                  label="Shipper"
                  value={shipper_id}
                  required
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  onChange={this.handleChange('shipper_id')}
                  onBlur={this.handleBlur}
                >
                </TextField>
                <div>
                  <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={this.onChange}/>
                </div>
             </Grid>
              <Grid item xs={12} sm={6}>
              { showInfo &&
                <div style={{fontSize:20,fontWeight:'bold'}}>
                  <div>Customer Name : {shipper_info[0].customer_name}</div>
                  <div>Customer Email : {shipper_info[0].cust_email}</div>
                  <div>Customer Phone : {shipper_info[0].cust_phone}</div>
                  <div>Customer Address : {shipper_info[0].address}</div>
                </div>
              }
              </Grid>
              
              <Grid item xs={12} >
                <Grid container justify="flex-end">
                  <Button variant="raised" color="primary" className={classes.button} onClick={() => {this.onFormSubmit()}}>
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(UploadConnoteForm);
