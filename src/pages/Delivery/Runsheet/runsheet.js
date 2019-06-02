import React from 'react';
import {Route, Link} from 'react-router-dom';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Toolbar from 'material-ui/Toolbar';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import ExcelExportBtn from '../../../components/ExcelExportBtn';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import IconButton from 'material-ui/IconButton';
import EnhancedDeliveryTableHead from './extComps/tableHead';
import {Button, Chip, TextField} from 'material-ui';
import {Add} from 'material-ui-icons';
import {makeBreadcrumbs} from '../../reusableFunc';
import UserLinearProgress from '../../UserLinearprogress';
import {getEntity} from '../../../actions/entity';

import {styles} from '../../css';

const columnscell = ['ID', 'Name', '# of Connotes Assigned', 'Status'];
let delordercelldata = [];

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

let EnhancedTableToolbar = (props) => {
  const {numSelected, classes, value, handleSearch, data} = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography type="subheading">{numSelected} selected</Typography>
        ) : (
          <Typography type="subheading"><strong>Runsheet</strong></Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <TextField
          id="search"
          label="Search..."
          type="search"
          onChange={handleSearch}
          value={value}
        />
      </div>
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className={classes.actions}>
        <ExcelExportBtn
          columnList={columnscell}
          data={data}
          filename="delorder_list.xlsx"
          orgName="JNT"
          title="runsheet"
        />
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

class DeliveryOrder extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showToolTip: false,
      componentWidth: 300,
      order: 'asc',
      orderBy: 'PickUpTime',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      searchValue: '',
      data: [],
      filterData: [],
    };
    this.styles = {
      '.pie-chart-lines': {
        stroke: 'rgba(0, 0, 0, 1)',
        strokeWidth: 1
      },
      '.pie-chart-text': {
        fontSize: '10px',
        fill: 'white'
      }
    };

  }

  componentWillMount() {
    getEntity('delivery', null).then((res) => {
      console.log(res.data);
      const {data} = res.data;
      this.setState({
        data,
        filterData: data,
      });
    });
  }

  handleSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const filterData =
      order === 'desc'
        ? this.state.filterData.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.filterData.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({filterData, order, orderBy});
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({selected: this.state.filterData.map((n) => n.id)});
      return;
    }
    this.setState({selected: []});
  };

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value});
  };

  handleSearch = (event) => {
    const {data} = this.state;
    let filteredDatas = []
    filteredDatas = data.filter((e) => {
      const regex = new RegExp(event.target.value, 'gi');
      return (`${e.courier_detail.first_name} ${e.courier_detail.last_name}`).match(regex);
    });
    this.setState({filterData: filteredDatas, searchValue: event.target.value});
  }

  render() {

    const {classes, match, location} = this.props;
    const {filterData, irregularitydata, order, orderBy, selected, rowsPerPage, page} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filterData.length - page * rowsPerPage);
    const breadCrumbs = makeBreadcrumbs(location);
    const {url} = match;

    return (
      <div className={classes.root}>

        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Delivery /
              <span className={classes.transactionBreadcrumbs}> Runsheet</span>
            </div>
            <Button
              style={{float: 'right', width: '8.5%'}}
              onClick={() => this.props.history.push(`/delivery/runsheet/create`)}
              variant="raised"
              color="primary"
            >
              <Add />&nbsp;New
            </Button>
            <br />
            <p className={classes.titleWrapper}>Runsheet</p>
          </div>
        </div>

        <div>
          <Grid container>
            <Grid md={12} item xs={12}>
              <Paper className={classes.formWrapper}>
                <EnhancedTableToolbar numSelected={selected.length} handleSearch={this.handleSearch} value={this.searchValue} />
                <div className={classes.tableWrapper}>
                  {this.state.data.length === 0 && <UserLinearProgress />}
                  <Table className={classes.table}>
                    <EnhancedDeliveryTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onSort={this.handleSort}
                      rowCount={filterData.length}
                    />
                    <TableBody>
                      {filterData
                        .sort(
                          (a, b) =>
                            a.node < b.node ? -1 : 1,
                        )
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((n) => {
                          console.log(n);
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={n.id}
                            >
                              <TableCell padding="none">
                                <Link to={`${match.url}/edit/${n.id}`}>
                                  {n.courier_id}
                                </Link>
                              </TableCell>
                              <TableCell padding="none">{`${n.courier_detail.first_name ? n.courier_detail.first_name : ''} ${n.courier_detail.last_name ? n.courier_detail.last_name : ''}`}</TableCell>
                              <TableCell padding="dense" numeric style={{paddingRight: 60}}>
                                {n.delivery_detail.length}
                              </TableCell>
                              <TableCell>
                                <Chip label={n.status_name} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {emptyRows > 0 && (
                          <TableRow style={{height: 49 * emptyRows}}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={filterData.length}
                          rowsPerPage={rowsPerPage}
                          rowsPerPageOptions={
                            filterData.length < 25 ? [5, 10] : [5, 10, 25]
                          }
                          page={page}
                          backIconButtonProps={{
                            'aria-label': 'Previous Page',
                          }}
                          nextIconButtonProps={{
                            'aria-label': 'Next Page',
                          }}
                          onChangePage={this.handleChangePage}
                          onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>

      </div>
    );
  }
}

const divStyle = {
  textAlign: 'right',
  fontSize: 30,
  color: '#323990'
};

const excellexportbt = {
  display: 'block',
  textAlign: 'right'
}

DeliveryOrder.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(DeliveryOrder));
