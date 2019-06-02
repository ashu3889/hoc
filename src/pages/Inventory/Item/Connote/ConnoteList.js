// @flow

import React from 'react';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  Icon,
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
import type {RootState, Dispatch} from '../../../../storeTypes';
type Props = {
 activeNode: number,
 bagConnoteRequested: (connoteNumber: string, nodeID: number) => void,
};

const columnData = [
  {disablePadding: true, key: 'connote_number', label: 'Connote #', get: 'connote_number',get_id:'connote_number', type: 'custom_link',get_url:'/connote', sortable: true},
  {disablePadding: true, key: 'created_on', label: 'Date #', get: 'created_on', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'to_tariff_code', label: 'Destination', get: 'to_tariff_code', type: 'string', sortable: true},
  {disablePadding: true, key: 'actual_weight', label: 'Weight', get: 'actual_weight', type: 'string', sortable: true},
  {disablePadding: true, key: 'service_code', label: 'Service', get: 'service_code', type: 'string', sortable: true},
  {disablePadding: true, key: 'sla_date', label: 'SLA', get: 'sla_date', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'is_wood_package', label: 'Wood Package', get: 'is_wood_package', type: 'check_circle', sortable: false},
]

export class ConnoteList extends React.Component<Props, State> {
  handleToChangeDate  = this.handleToChangeDate.bind(this);
  state = {
    defaultDate:[moment(new Date(), 'YYYY-MM-DD'),moment(new Date(), 'YYYY-MM-DD')],
    startDate:moment(new Date()).format('YYYY-MM-DD'),
    endDate:moment(new Date()).format('YYYY-MM-DD'),
  };
  handleToChangeDate(arr){
          this.setState({
            defaultDate:arr,
            startDate:moment(arr[0]).format('YYYY-MM-DD'),
            endDate:moment(arr[1]).format('YYYY-MM-DD')
          });
  }
  handleClickAction = (data) => (event) => {
    let {
      activeNode,bagConnoteRequested
    } = this.props;
    bagConnoteRequested(data.connote_number, activeNode);
    //this.bagConnoteRequested(datum.connoteNumber, activeNode);props.history.push(`/transport/manifest/check/${data.manifest_id}`);
  }
  componentWillMount() {
    let {
      startDate,
      endDate
    } = this.state;
  }

  render() {
    const {classes, match,activeNode,bagConnoteRequested} = this.props;
    const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {openPrintWindowDialog,defaultDate,startDate,endDate} = this.state;
    const {data, total} = tableData;
    const {handleClickAction,handleToChangeDate} = this;
    return (

      <View style={{flex: 1}}>
         <TableTitle
              title="Connote List"
              searchTextInput={searchKey}
              onSearchTextChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onChangeDate={defaultDate}
              handleToChangeDate= {handleToChangeDate.bind(this)}
              onUpdateDate= {handleUpdateDate}
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
                {button: CustomButton, callback: handleClickAction,btnName : 'Bag'},
              ]}
          />
      </View>
    );
  }
}
function mapStateToProps(state: RootState) {
  return {
    activeNode: state.header.currentNode,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    bagConnoteRequested: (connoteNumber: string, nodeID: number) => {
      dispatch({
        type: 'BAG_CONNOTE_REQUESTED',
        connoteNumber,
        nodeID,
      });
    },
  };
}
export default withSimpleTable(connect(mapStateToProps,mapDispatchToProps)(ConnoteList),'connote', {defaults: {sort_by: null, rowsPerPage: 10}});
