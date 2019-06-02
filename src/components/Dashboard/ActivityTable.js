// @flow

import React, { Component } from 'react';
import {
  Table, TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from 'material-ui';

const columnData = [
  //{id: 'record_id', label: 'Record #', sortable: true, numeric: false, disablePadding: false},
  {id: 'user_id', label: 'User Id', sortable: true, numeric: false, disablePadding: false},
  {id: 'data_resource', label: 'Resources', sortable: true, numeric: false, disablePadding: false},
  {id: 'activity', label: 'Activity', sortable: true, numeric: false, disablePadding: false},
  {id: 'ip_address', label: 'IP Address', sortable: true, numeric: false, disablePadding: false},
  {id: 'timestamp_action', label: 'Time', sortable: true, numeric: false, disablePadding: false},
];

class ActivityTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sort_order: 'desc',
      //sort_by: 'record_id',
      sort_by: 'user_id',
      page: 0,
      rowsPerPage: 10,
      isLoading: true,
      searchKey: '',
    };
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value}, () => {
      this.loadData();
    });
  };
  handleChangePage = (event, page) => {
    this.setState({page}, () => {
      this.loadData();
    });
  };
  handleRequestSort = (property) => (event) => {
    this.setState({sort_by: property, sort_order: this.state.sort_by === property ? !this.state.sort_order : this.state.sort_order}, () => {
      this.loadData();
    });
  };
  handleSearch = (event) => {
    this.setState({searchKey: event.target.value}, () => {
      this.loadData();
    });
  }
  loadData = (reset = false) => {
    const {searchKey, rowsPerPage, sort_by, sort_order, page} = this.state;
    this.setState({page: reset ? 0 : page}, () => {
      this.props.onRequestData({l: rowsPerPage, sort_by, sort_order: sort_order ? 'desc' : 'asc', page: reset ? 1 : page + 1});
    });
  };
  render() {
    const {data, total} = this.props;
    const {isLoading, searchKey, rowsPerPage, sort_by, sort_order, page} = this.state;
    const emptyRows = rowsPerPage - data.length;
    return (
      <Table>
        <TableHead>
          <TableRow>
          {
            columnData.map((column) =>
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding ? 'none' : 'default'}
              sortDirection={sort_by === column.id ? 'asc' : 'desc'}
            >
              <Tooltip
                title="Sort"
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={sort_by === column.id}
                  direction={sort_order ? 'asc' : 'desc'}
                  onClick={this.handleRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          )}
          </TableRow>
        </TableHead>
        <TableBody>
        {
          data && data.map((n, index) =>
          <TableRow hover tabIndex={-1} key={index}>
            <TableCell padding="none">{n.name}</TableCell>
            <TableCell padding="none">{n.dataResource}</TableCell>
            <TableCell padding="none">{n.activity}</TableCell>
            <TableCell padding="none">{n.ipAddress}</TableCell>
            <TableCell padding="none">{n.timestampAction}</TableCell>
          </TableRow>
        )}
        {
          emptyRows > 0 &&
          <TableRow rowSpan={emptyRows}>
            <TableCell colSpan={5} />
          </TableRow>
        }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={total}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={
                data.length < 25 ? [5, 10] : [5, 10, 25]
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
    );
  }
}
export default ActivityTable;
