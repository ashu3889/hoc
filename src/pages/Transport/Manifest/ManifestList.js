// @flow

import React from 'react';
import {Link} from 'react-router-dom';
import {View} from 'react-native';
import moment from 'moment';
import {Typography, Tabs, Tab, Grid, Paper, Button} from 'material-ui';
import AddIcon from 'material-ui-icons/Add';

import PrintManifest from './ManifestTable/PrintManifest';
import {withStyles} from 'material-ui/styles';
import {styles as baseStyles} from '../../css';
import {withSimpleTable} from '../../../components/SimpleTable/withSimpleTable';
import UserLinearprogress from '../../UserLinearprogress';
import SimpleTable from '../../../components/SimpleTable';
import CheckButton from '../../../components/Buttons/CheckButton';
import EditButton from '../../../components/Buttons/EditButton';
import PrintButton from '../../../components/Buttons/PrintButton';
import {TableTitle} from '../../../components/Table';
import { getEntityList } from '../../../actions/entity';

const styles = (theme) => ({
  ...baseStyles(theme),
  leftIcon: {
    marginRight: theme.spacing.unit,
  }
})
const columnData = [
  {disablePadding: true, key: 'manifest_no', label: 'Manifest #', get: 'manifest_no', type: 'custom_link', sortable: true, get_id :'manifest_id',get_url:'/transport/manifest/edit'},
  {disablePadding: true, key: 'created_on', label: 'Date #', get: 'created_on', type: 'datetime', sortable: true},
  {disablePadding: true, key: 'vehicle_id', label: 'Mode', get: 'vehicle_type.type_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'origin_id', label: 'Origin', get: 'origin_detail.node_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'destination_id', label: 'Destination', get: 'destination_detail.node_name', type: 'string', sortable: true},
  {disablePadding: true, key: 'total_weight', label: 'Kg', get: 'additional_info.total_weight', type: 'string', sortable: false},
  {disablePadding: true, key: 'total_bag_count', label: 'Bags', get: 'total_bag_count', type: 'string', sortable: true},
  {disablePadding: true, key: 'status', label: 'Status', get: 'status_detail.value', type: 'string', sortable: true},
]
export class TransportManifestList extends React.Component<Props, State> {
  handleToChangeDate  = this.handleToChangeDate.bind(this);
  state = {
    openPrintWindowDialog: false,
    defaultDate:[moment(new Date(), 'YYYY-MM-DD'),moment(new Date(), 'YYYY-MM-DD')],
    startDate:moment(new Date()).format('YYYY-MM-DD'),
    endDate:moment(new Date()).format('YYYY-MM-DD'),
  };
  handleClickEdit = (data) => (event) => {
    this.props.history.push(`/transport/manifest/edit/${data.manifest_id}`);
  }
  handleToChangeDate(arr){
            this.setState({
              defaultDate:arr,
              startDate:moment(arr[0]).format('YYYY-MM-DD'),
              endDate:moment(arr[1]).format('YYYY-MM-DD')
            });
    }
  handleClickPrint = (data) => (event) => {
    getEntityList(`manifest/${data.manifest_id}`, null).then((response) => {
      const {data} = response.data;
      this.setState({
        openPrintWindowDialog: !this.state.openPrintWindowDialog,
        printdata: data,
      });
    });
  }
  handleClickCheck = (data) => (event) => {
    this.props.history.push(`/transport/manifest/check/${data.manifest_id}`);
  }
  handlePrintWindowDialogClose = (manifestID) => {
    return this.setState({
      openPrintWindowDialog: !this.state.openPrintWindowDialog,
    });
  };
  render() {
    const {classes, match} = this.props;
    const {url} = match;
    const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {openPrintWindowDialog,defaultDate,startDate,endDate} = this.state;
    const {data, total} = tableData;
    const {handleClickEdit, handleClickPrint, handleClickCheck, handlePrintWindowDialogClose,handleToChangeDate,} = this;
    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Transport /
              <span className={classes.transactionBreadcrumbs}> Manifest</span>
            </div>
          <br />
            <Button
              variant="raised"
              color="primary"
              className={classes.buttonAction}
              component={Link}
              to='/transport/manifest/create/'
            >
              <AddIcon />
              &nbsp;New
            </Button>
            <p className={classes.titleWrapper}>Manifest</p>
          </div>
        </div>
        <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <TableTitle
              title="Manifest List"
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
                {button: CheckButton, callback: handleClickCheck, renderWhen: {key: 'status_detail.value', value: 'FINISH'}},
                {button: PrintButton, callback: handleClickPrint}
              ]}
            />
          </View>
        </Paper>
        {openPrintWindowDialog && (
          <PrintManifest
            openDialog={openPrintWindowDialog}
            handleOpenDialog={handlePrintWindowDialogClose}
            printdatavalue={this.state.printdata}
          />
        )}
      </div>
    );
  }
}
export default withSimpleTable(withStyles(styles)(TransportManifestList), 'manifest', {defaults: {sort_by: null, rowsPerPage: 10}});
