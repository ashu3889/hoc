import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import {withSimpleTable} from '../../components/SimpleTable/withSimpleTable';
import SimpleTable from '../../components/SimpleTable';
import {TableTitle} from '../../components/Table';
import ExcelExportBtn from '../../components/ExcelExportBtn';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import Grid from 'material-ui/Grid/Grid';
import Button from 'material-ui/Button/Button';
import {Add} from 'material-ui-icons';
import {getEntityList} from '../../actions/entity';
import {styles} from '../css';
import UserLinearprogress from '../UserLinearprogress';
const columnData = [
  {
    id: 'transaction',
    numeric: false,
    disablePadding: true,
    label: 'Transaction #',
    get: 'transaction_number',
    get_id: 'transaction_id',
    type: 'transaction_link',
    sortable: true
  },
  {
    id: 'from_name',
    numeric: false,
    disablePadding: true,
    label: 'Customer Name',
    get: 'from_name',
    type: 'string',
    sortable: true
  },
  {
    id: 'total_amount',
    numeric: false,
    disablePadding: true,
    label: 'Total Amount',
    get: 'total_payment',
    type: 'string',
    sortable: true
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Date',
    get: 'transaction_date',
    type: 'datetime',
    sortable: true
  },
];

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: 2,
    paddingLeft: 0,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.dark,
          //   backgroundColor: lighten(theme.palette.secondary.light, 0.4),
        }
      : {
          //   color: lighten(theme.palette.secondary.light, 0.4),
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

export  class EnhancedTable extends React.Component<Props, State> {
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
  UNSAFE_componentWillMount () {
    let {
      startDate,
      endDate
    } = this.state;
  }

  render() {
    const {classes} = this.props;
     const {
      isLoading, tableData, page, sort_by, sort_order, rowsPerPage, handleChangeRowsPerPage,
      handleChangePage, handleRequestSort, searchKey, handleSearchChange, handleSearchSubmit,handleUpdateDate
    } = this.props;
    const {openPrintWindowDialog,defaultDate,startDate,endDate} = this.state;
    const {data, total} = tableData;
    const {handleToChangeDate, handlePrintWindowDialogClose} = this;

    // console.log(columnscell);
    // console.log(transdata);

    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Sales /{' '}
              <span className={classes.transactionBreadcrumbs}>
                {' '}
                Transactions{' '}
              </span>
            </div>
            <Button
              component={Link}
              to="/new-transaction"
              style={{float: 'right', width: '10%'}}
              variant="raised"
              color="primary"
            >
              <Add />&nbsp;New
            </Button>
            <br />
            <p className={classes.titleWrapper}>Transactions</p>
          </div>
        </div>
        <div>
          <Grid md={12} item>
            <Paper className={classes.formWrapper}>
              <TableTitle
                title="Transaction List"
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
              />
            </Paper>
          </Grid>
        </div>
      </div>
    );
  }
}


export default withSimpleTable(withStyles(styles)(EnhancedTable), 'transaction', {defaults: {sort_by: null, rowsPerPage: 10}});
