import React from 'react';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {withStyles} from 'material-ui/styles';
import {
  Grid,
  Paper
} from 'material-ui';
import {Add} from 'material-ui-icons';
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
} from '../../../components/Table';

import {postEntity} from '../../../actions/entity';
import SimpleTable from '../../../components/SimpleTable';
import {withSimpleTable} from '../../../components/SimpleTable/withSimpleTable';
import CustomButton from '../../../components/Buttons/CustomButton';
import UserLinearprogress from '../../UserLinearprogress';
import {styles} from '../../css';

const columnData = [
  {disablePadding: true, key: 'req_name', label: 'Name#', get: 'req_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'req_address', label: 'Address', get: 'req_address', type: 'string', sortable: true},
  {disablePadding: true, key: 'req_phone', label: 'Phone', get: 'req_phone', type: 'string', sortable: true},
  {disablePadding: true, key: 'courier_name', label: 'Courier', get: 'courier_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'req_date', label: 'Pick Up time', get: 'req_date', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'status', label: 'Status', get: 'status_description.value', type: 'chipCustom', sortable: false},
 ]


export class EnhancedTable extends React.Component {
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
    window.location.href= `/pickup/request/edit/${data.pickup_request_id}`;
  }
  handleClickNew = () => {
     postEntity('pickup/node', {
      n: sessionStorage.getItem('userNodeId'),
    }).then((response) => this.props.handleSearchSubmit());
  }
  reloadTable(response){

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
    const {url} = match;
    const {defaultDate,startDate,endDate} = this.state;
    const {data, total} = tableData;
    const {handleClickAction,handleToChangeDate,handleClickNew} = this;

    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Pickup /
              <span className={classes.transactionBreadcrumbs}> Request</span>
            </div>
            <br />
            <Button
              className={classes.buttonAction}
              onClick={handleClickNew}
              variant="raised"
              color="primary"
            >
              <Add />&nbsp;New
            </Button>
            <p className={classes.titleWrapper}>Request</p>
          </div>
        </div>
        <div>
          <Grid md={12} item>
            <Paper className={classes.formWrapper}>
            <View style={{flex: 1}}>
                 <TableTitle
                      title="Pickup Request"
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
                        {button: CustomButton, callback: handleClickAction,btnName : 'Edit'},
                      ]}
                  />
              </View> 
            </Paper>
          </Grid>
        </div>
      </div>
    );
  }
}
export default withSimpleTable(withStyles(styles)(EnhancedTable),'pickup', {defaults: {sort_by: null, rowsPerPage: 10}});
