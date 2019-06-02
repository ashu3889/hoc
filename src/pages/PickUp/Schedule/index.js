// @flow

import React from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {View} from 'react-native';
import {Typography, Tabs, Tab, Grid, Paper, Button} from 'material-ui';
import AddIcon from 'material-ui-icons/Add';

import {withStyles} from 'material-ui/styles';
import {styles as baseStyles} from '../../css';
import {withSimpleTable} from '../../../components/SimpleTable/withSimpleTable';
import UserLinearprogress from '../../UserLinearprogress';
import SimpleTable from '../../../components/SimpleTable';
import CheckButton from '../../../components/Buttons/CheckButton';
import EditButton from '../../../components/Buttons/EditButton';
import PrintButton from '../../../components/Buttons/PrintButton';
import {TableTitle} from '../../../components/Table';

const styles = (theme) => ({
  ...baseStyles(theme),
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const columnData = [
  {disablePadding: true, key: 'schedule_day', label: 'Day', get: 'time[0].schedule_day', type: 'string', sortable: true},
  {disablePadding: true, key: 'sche_name', label: 'Name', get: 'sche_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'first_name', label: 'Courier', get: 'courier.first_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'status', label: 'Status', get: 'status', type: 'string', sortable: true},
]

export class EnhancedTable extends React.Component<Props, State> {
  handleToChangeDate  = this.handleToChangeDate.bind(this);
  state = {
    openPrintWindowDialog: false,
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
    this.props.history.push(`/pickup/schedule/edit/${data.pickup_schedule_id}`);
  }
  componentWillMount() {
    let {
      startDate,
      endDate
    } = this.state;
  }
  render() {
    const {classes, match} = this.props;
    const {url} = match;
    const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {openPrintWindowDialog,defaultDate,startDate,endDate} = this.state;
    const {data, total} = tableData;
    const {handleClickEdit,handleToChangeDate} = this;
    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
            Pickup /
              <span className={classes.transactionBreadcrumbs}> Schedule</span>
            </div>
          <br />
            <Button
              variant="raised"
              color="primary"
              className={classes.buttonAction}
              component={Link}
              to={`${url}/create`}
            >
              <AddIcon />
              &nbsp;New
            </Button>
            <p className={classes.titleWrapper}>Schedule</p>
          </div>
        </div>
        <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <TableTitle
              title="Pick Up Schedule List"
              searchTextInput={searchKey}
              onSearchTextChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              onChangeDate={defaultDate}
              handleToChangeDate= {handleToChangeDate.bind(this)}
              onUpdateDate= {handleUpdateDate}
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
              actionButtons={[{button: EditButton, callback: handleClickEdit},]}
            />
          </View>
        </Paper>
      </div>
    );
  }
}
export default withSimpleTable(withStyles(styles)(EnhancedTable), 'pickup_schedule', {defaults: {sort_by: 'pickup_schedule_id', rowsPerPage: 10}});
