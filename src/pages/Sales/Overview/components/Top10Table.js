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

export class Top10Table extends Component {
  constructor(props, context) {
    super(props, context);
    
  }
  render() {
    let {name,data} = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell numeric>No.</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell numeric>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
       {data.map((n,key) => {
            return (
              <TableRow key={key}>
                <TableCell numeric>{key+1}</TableCell>
                <TableCell component="th" scope="row">
                  {n.name ? n.name : '-'}
                </TableCell>
                <TableCell numeric>{n.value}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
