import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import { Dispatch } from '../../../storeTypes';
import {Grid,Button,Paper} from 'material-ui';
import {View} from 'react-native';

import Add from 'material-ui-icons/Add';
import {
  TableHead,
  TableBody,
  TableTitle,
  TableFooter,
} from '../../../components/Table';

import columns from './columns';
import { styles as baseStyles } from '../../css';
import SimpleTable from '../../../components/SimpleTable';
import {withSimpleTable} from '../../../components/SimpleTable/withSimpleTable';
import CustomButton from '../../../components/Buttons/CustomButton';

import UserLinearprogress from '../../UserLinearprogress';

const styles = (theme) => ({
  ...baseStyles(theme),
  leftIcon: {
    marginRight: theme.spacing.unit,
  }
})
const columnData = [
  {disablePadding: true, key: 'manifest_no', label: 'Manifest #', get: 'manifest_no',get_id:'transport_id',get_url:'/transport/booking/edit', type: 'custom_link', sortable: true},
  {disablePadding: true, key: 'vehicle_type_name', label: 'Type', get: 'vehicle_type_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'provider_name', label: 'Transporter', get: 'provider_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'max_koli', label: 'Koli', get: 'min_koli',param2: 'max_koli', type: 'twoparam', sortable: true},
  {disablePadding: true, key: 'max_weight', label: 'Weight', get: 'min_weight',param2: 'max_weight', type: 'twoparam', sortable: true},
  {disablePadding: true, key: 'transport_route', label: 'Vehicle #', get: 'transport_route', type: 'string', sortable: true},
  {disablePadding: true, key: 'to_node_name', label: 'Destination', get: 'to_node_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'eta', label: 'ETA', get: 'eta', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'etd', label: 'ETD', get: 'etd', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'status', label: 'Status', get: 'status_detail.value', type: 'chipCustom', sortable: false},
  ]
export class BookingList extends React.Component {
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
  handleClickEdit = (data) => (event) => {
    window.location.href= `/transport/booking/edit/${data.transport_id}`;  
  }
  componentWillMount() {
    let {
      startDate,
      endDate
    } = this.state;
  }
  render() {
    const {classes, match} = this.props;
    const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {defaultDate,startDate,endDate} = this.state;
    const {data, total} = tableData;
    const {handleClickEdit,handleToChangeDate} = this;

    return (
      <div className={classes.root}>
      <div className={classes.headerWrapper}>
        <div className={classes.pageTitle}>
        <div className={classes.breadCrumbs}>
          Transport /
          <span className={classes.transactionBreadcrumbs}> Booking</span>
        </div>
        <br />
          <Button
            variant="raised"
            color="primary"
            className={classes.buttonAction}
            component={Link}
            to={`${match.url}/create`}
          >
            <Add />
            &nbsp;New
          </Button>
          <p className={classes.titleWrapper}>Booking</p>
      </div>
      </div>
      <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
          <TableTitle
              title="Booking List"
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
          />
          </View>
      </Paper>


      </div>
    );
  }
}
export default withSimpleTable(withStyles(styles)(BookingList),'transport_book', {defaults: {sort_by: null, rowsPerPage: 10}});
