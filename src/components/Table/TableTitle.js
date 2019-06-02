// @flow

import React from 'react';
import { DatePicker } from 'antd';
import {Route, Link} from 'react-router-dom';
import 'antd/dist/antd.css';
import moment from 'moment';
import {
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Icon,
  Button,
  Grid
} from 'material-ui';
import {View, Text} from 'react-native';
import ExcelExportBtn from '../ExcelExportBtn';
import DropDownFilter from '../../pages/Inbound/Prealert/extComps/DropdownFilter';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

type Props = {
  title: string,
  searchTextInput: string,
  searchTextInputPlaceholder?: string,
  onSearchTextChange: (textInput: string) => void,
  onSearchSubmit: (searchTextInput: string) => void,
  onChangeDate: array,
  handleToChangeDate: array,
  handleToFilterDropdown: (textInput: string) => void,
  onUpdateDate: (searchTextInput: string) => void,
  onUpdateFilter: (textInput: string) => void
};

export default class TableTitle extends React.Component<Props, void> {
  _timeoutID: ?number;
  componentWillUnmount() {
    if (this._timeoutID) {
      clearTimeout(this._timeoutID);
    }
  }
  render() {
    let {title,
          nodeValue,
          originValue,
          destinationValue,
          destination,
          searchTextInput,
          searchTextInputPlaceholder,
          onChangeDate,
          handleToChangeDate,
          handleToFilterDropdown,
          match,
          scanning,
          bagging,
          node_type,
          origin} = this.props;
    let {onChange} = this;
    if(scanning){
      var xsc = 6;
    } else {
      var xsc = 12;
    }
    return (
      <Toolbar>
        <Grid container>
        <Grid item xs={xsc}>
            <div style={{paddingTop: 20}}>
              <Typography variant="title">{title}</Typography>
            </div>
        </Grid>
        {
            scanning &&
            <Grid item xs={6}>
            <Button
                variant="flat"
                dense="false"
                color="primary"
                component={Link}
                style={{width: '140px', marginTop: '25px',float:'right'}}
                to={`${match.url}/edit/scan`}
              >
                Scan Here
            </Button>
            </Grid>
          }
        <Grid item xs={4}>
        <div style={{paddingTop: 20}}>
          <RangePicker 
          defaultValue={moment(new Date(), 'YYYY-MM-DD')} 
          value={onChangeDate} 
          onChange={this._onHandleUpdateDate}/>
        </div>
        </Grid>
        <Grid item xs={4}>
        <div style={{marginBottom:20}}>
        {
          bagging && 
          <div>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end',float:'right'}}>
              <DropDownFilter 
                  id="destination_id" 
                  name="destination_id"
                  data={destination}
                  value={destinationValue}
                  onChange={(event) => {
                    this._onDropdownFilterHandler(event);
                  }} 
              />
            </View>
          </div>
        }
        { scanning &&
          <div>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end',float:'right'}}>
              <DropDownFilter 
                  id="node_types" 
                  name="node_types"
                  data={node_type}
                  value={nodeValue}
                  onChange={(event) => {
                    this._onDropdownFilterHandler(event);
                  }} 
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end',float:'right'}}>
              <DropDownFilter 
                  id="three_letter" 
                  name="three_letter" 
                  data={origin} 
                  value={originValue} 
                  onChange={(event) => {
                    this._onDropdownFilterHandler(event);
                  }}
              />
            </View>
          </div>
        }
        </div>
        
        </Grid>
        <Grid item xs={4}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end',float:'right'}}>
          <TextField
            id="search"
            label={searchTextInputPlaceholder || 'Search field'}
            type="search"
            value={searchTextInput}
            onChange={(event) => {
              this._onSearchTextChangeHandler(event.target.value);
            }}
          />
          <View style={{flexDirection: 'row', paddingTop: 20, float:'right'}}>
            <ExcelExportBtn
              columns={this.props.columns}
              data={this.props.data}
              filename={this.props.filename}
              orgName={this.props.orgName}
              title={title}
            />
          </View>
        </View>
        </Grid>
        </Grid>
      </Toolbar>
    );
  }
  _onDropdownFilterHandler = (e) => {
    let {handleToFilterDropdown,onUpdateFilter} = this.props;
    handleToFilterDropdown(e);
    this._timeoutID = setTimeout(() => {
      onUpdateFilter(e);
    }, 800);
  }
  _onHandleUpdateDate = (date,dateString) => {
    let {handleToChangeDate,onUpdateDate} = this.props;
      handleToChangeDate(date);
    if (this._timeoutID) {
      clearTimeout(this._timeoutID);
    }
    this._timeoutID = setTimeout(() => {
      onUpdateDate(date);
    }, 800);
  }
  _onSearchTextChangeHandler = (searchTextInput) => {
    let {onSearchTextChange, onSearchSubmit} = this.props;
    onSearchTextChange(searchTextInput);

    if (this._timeoutID) {
      clearTimeout(this._timeoutID);
    }
    this._timeoutID = setTimeout(() => {
      onSearchSubmit(searchTextInput);
    }, 800);
  };
}
