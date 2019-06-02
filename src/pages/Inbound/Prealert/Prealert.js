import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import {Route, Link} from 'react-router-dom';
import {View} from 'react-native';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import {
  TableHead,
  TableBody,
  TableTitle,
  TableFooter,
} from '../../../components/Table';
import SimpleTable from '../../../components/SimpleTable';
import {withSimpleTable} from '../../../components/SimpleTable/withSimpleTable';
import Tooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import IconButton from 'material-ui/IconButton';
import DropDownFilter from './extComps/DropdownFilter';
import {Button, Chip, TextField} from 'material-ui';
import {Add} from 'material-ui-icons';
import {makeBreadcrumbs} from '../../reusableFunc';
import UserLinearprogress from '../../UserLinearprogress';
// import fetch from "whatwg-fetch";

import {styles} from '../../css';

const columnscell = ["Type", "From", "Manifest No.", "# Bag", "Weight (Kg)", "Vehcile No", "Driver", "ETA", "ETD", "Landed", "Arrived"];

let colmndata = [];
var node_types_json = [];
var three_letter_json = []
let prealertcelldata = [];
const columnData = [
  {disablePadding: true, key: 'type', label: 'Type', get: 'vehicle_type.type_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'type', label: 'From', get: 'from.node_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'type', label: 'Manifest No', get: 'manifest_no', get_id: 'manifest_id',type: 'link2', sortable: true},
  {disablePadding: true, key: 'type', label: 'Bag', get: 'bag_count', type: 'string', sortable: true},
  {disablePadding: true, key: 'type', label: 'Weight (Kg)', get: 'bag_detail.total_weight', type: 'string', sortable: true},
  {disablePadding: true, key: 'type', label: 'Vehicle No', get: 'police_no', type: 'string', sortable: true},
  {disablePadding: true, key: 'type', label: 'Driver', get: 'driver_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'type', label: 'ETA', get: 'eta', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'type', label: 'ETD', get: 'etd', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'type', label: 'Landed', get: 'actual_depart', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'type', label: 'Arrived', get: 'actual_arrived', type: 'datetime', sortable: true},
  ]
  {colmndata.length > 0 &&
                    colmndata.map((prealert, index) => {
    prealertcelldata.push([prealert.type, prealert.from, prealert.manifest_no, prealert.manifest, prealert.bag, prealert.weight_kg, prealert.vehcile_no, prealert.driver, prealert.eta, prealert.etd, prealert.landed, prealert.arrived]);
  })}

export class InboundPrealert extends React.Component {
  handleToChangeDate  = this.handleToChangeDate.bind(this);
  handleToFilterDropdown  = this.handleToFilterDropdown.bind(this);
  state = {
    defaultDate:[moment(new Date(), 'YYYY-MM-DD'),moment(new Date(), 'YYYY-MM-DD')],
    startDate:moment(new Date()).format('YYYY-MM-DD'),
    endDate:moment(new Date()).format('YYYY-MM-DD'),
    node_types: '',
    three_letter: '',
  };
  
  handleToChangeDate(arr){
          this.setState({
            defaultDate:arr,
            startDate:moment(arr[0]).format('YYYY-MM-DD'),
            endDate:moment(arr[1]).format('YYYY-MM-DD')
          });
  }
  handleToFilterDropdown(event){
          this.setState({
            [event.target.name]: event.target.value
          });
  }
  // handleToFilterDropdown = (event) => {
  //   if (event && event.preventDefault) {
  //     event.preventDefault();
  //   }
  //   this.setState({[event.target.name]: event.target.value});
  // };

  componentWillMount() {
    let {
      startDate,
      endDate,
      node_types,
      three_letter
    } = this.state;
  }

  render() {

    const {classes, match, location} = this.props;
    const breadCrumbs = makeBreadcrumbs(location);
    const {url} = match;
    const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,handleUpdateFilter,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {defaultDate,startDate,endDate,node_types,three_letter} = this.state;
    const {data, total,node_type,origin_tlc} = tableData;
    const {handleToChangeDate,handleToFilterDropdown} = this;
    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Inbound /
              <span className={classes.transactionBreadcrumbs}> Pre-alert Inbound</span>
            </div>
            <br />
            <p className={classes.titleWrapper}>Pre-alert Inbound</p>
          </div>
        </div>
        <div>
            <View style={{flex: 1}}>
              <Paper style={{padding:20}}>
              <TableTitle
                title="Pre-Alert Inbound List"
                searchTextInput={searchKey}
                onSearchTextChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onChangeDate={defaultDate}
                handleToChangeDate= {handleToChangeDate.bind(this)}
                handleToFilterDropdown= {handleToFilterDropdown.bind(this)}
                onUpdateDate= {handleUpdateDate}
                onUpdateFilter= {handleUpdateFilter}
                scanning='1'
                match={match}
                node_type={node_type}
                origin={origin_tlc}
                nodeValue={node_types}
                originValue={three_letter}
                //onUpdateDate= {handleSearchSubmit}
              />
              {isLoading && <UserLinearprogress />}
              <SimpleTable
                  rowData={data}
                  count={total}
                  page={page}
                  onChangePage={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  columnData={columnData}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  handleRequestSort={handleRequestSort}
                  status={status}
                />
                </Paper>
              </View>
        </div>

      </div>
    );
  }
}


export default withSimpleTable(withStyles(styles)(InboundPrealert),'inbound/prealert', {defaults: {sort_by: null, rowsPerPage: 10}});
