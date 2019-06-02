// @flow

import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import {
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  Icon,
  Chip,
} from 'material-ui';

import {View} from 'react-native';
import BlockUI from 'react-block-ui';

import {
  TableHead,
  TableBody,
  TableTitle,
  TableFooter,
} from '../../../../components/Table';

import SimpleTable from '../../../../components/SimpleTable';
import {withSimpleTable} from '../../../../components/SimpleTable/withSimpleTable';
import CustomButton from '../../../../components/Buttons/CustomButton';

import UserLinearprogress from '../../../UserLinearprogress';
const columnData = [
  {disablePadding: true, key: 'bag_no', label: 'Bag #', get: 'bag_no', get_id:'bag_id',get_url:'/inventory/bagging', type: 'custom_link', sortable: true},
  {disablePadding: true, key: 'bag_date', label: 'Date #', get: 'bag_date', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'connote_qty', label: '# Connote', get: 'connote_qty', type: 'string', sortable: true},
  {disablePadding: true, key: 'weight', label: 'Weight (kg)', get: 'weight', type: 'string', sortable: true},
  {disablePadding: true, key: 'origin', label: 'Origin', get: 'origin', type: 'string', sortable: true},
  {disablePadding: true, key: 'destination', label: 'Dest.', get: 'destination', type: 'string', sortable: true},
  {disablePadding: true, key: 'consolidation', label: 'Consolidation', get: 'consolidation', type: 'check_circle', sortable: false},
  {disablePadding: true, key: 'closing_time', label: 'Sealed Time', get: 'closing_time', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'status', label: 'Status', get: 'status', type: 'chip', sortable: false},
  ]
export class BagList extends React.Component<Props> {
  handleToChangeDate  = this.handleToChangeDate.bind(this);
  handleToFilterDropdown  = this.handleToFilterDropdown.bind(this);
  state = {
    defaultDate:[moment(new Date(), 'YYYY-MM-DD'),moment(new Date(), 'YYYY-MM-DD')],
    startDate:moment(new Date()).format('YYYY-MM-DD'),
    endDate:moment(new Date()).format('YYYY-MM-DD'),
    destination_id: '',
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
  handleClickAction = (data) => (event) => {
    console.log(data);
    if(data.status == 0){
      alert('You must sealed this bag to unbagging!');
    }
    //this.props.history.push(`/transport/manifest/check/${data.manifest_id}`);
  }
  handleClickEdit = (data) => (event) => {
    window.location.href= `/inventory/bagging/${data.bag_id}`;
    //this.props.history.push(`/transport/manifest/check/${data.manifest_id}`);/inventory/bagging/:bagID
  }
  componentWillMount() {
    let {
      startDate,
      endDate,
      destination_id
    } = this.state;
  }

  render() {
    const {classes, match} = this.props;
    const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,handleUpdateFilter,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {openPrintWindowDialog,defaultDate,startDate,endDate,destination_id} = this.state;
    const {data, total,destination_tlc} = tableData;
    const {handleClickAction,handleClickEdit,handleToChangeDate,handleToFilterDropdown} = this;

    return (
      <View style={{flex: 1}}>
         <TableTitle
              title="Bag List"
              searchTextInput={searchKey}
              onSearchTextChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onChangeDate={defaultDate}
              handleToChangeDate= {handleToChangeDate.bind(this)}
              handleToFilterDropdown= {handleToFilterDropdown.bind(this)}
              onUpdateDate= {handleUpdateDate}
              onUpdateFilter= {handleUpdateFilter}
              bagging='1'
              match={match}
              destination={destination_tlc}
              destinationValue={destination_id}
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
            actionButtons={[
                //{button: CustomButton, callback: handleClickEdit,btnName : 'Edit'},
                {button: CustomButton, callback: handleClickAction,btnName : 'Unbag'},
              ]}
          />
      </View>
    );
  }
}
export default withSimpleTable(BagList,'bag', {defaults: {sort_by: null, rowsPerPage: 10}});
