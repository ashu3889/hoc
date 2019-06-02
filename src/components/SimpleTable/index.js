import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import Moment from 'react-moment';
import {
  Toolbar, Typography, IconButton,
  Tooltip, Table, TableHead, TableRow, Grid,Icon,Chip,
  TableCell, TableBody, TableFooter, TablePagination, TableSortLabel,
} from 'material-ui';
import {withStyles} from 'material-ui/styles';
import FilterListIcon from 'material-ui-icons/FilterList';
import {getEntityList} from '../../actions/entity';
import UserLinearProgress from '../../pages/UserLinearprogress';
import ExcelExportBtn from '../ExcelExportBtn';
import classNames from 'classnames';
import { Button } from 'material-ui';
import ActionButton, { withActionButton } from '../Buttons/ActionButton';

const styles = (theme) => ({
  tableToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
});

class SimpleTable extends Component {

  handleClickRow = (value) => (event) => {
    if (this.props.handleClickRow) {
      this.props.handleClickRow(value, event);
    }
  }
  createSortHandler = (property) => (event) => {
    this.props.handleRequestSort(event, property);
  };
  render() {
    const {
      classes,
      columnData,
      actions,
      rowData,
      orderBy,
      order,
      page,
      count,
      rowsPerPageOptions,
      rowsPerPage,
      handleRequestSort,
      onChangePage,
      onChangeRowsPerPage,
      status,
      actionButtons,
    } = this.props;
    const {handleClickRow, createSortHandler} = this;
    return (
      <Table className={classes.table} style={{marginLeft:25}}>
        <TableHead>
          <TableRow>
            {columnData.map((column, index) => {
              return (
                <TableCell
                  style={{fontSize: 'inherit'}}
                  key={index}
                  numeric={column.numeric}
                  padding={column.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === column.key ? order : false}
                >
                {
                  column.sortable ?
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={order}
                    onClick={this.createSortHandler(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                  :
                  column.label
                }
                </TableCell>
              );
            })}
            {
              ( actions || actionButtons) && <TableCell style={{fontSize: 'inherit'}}>Actions</TableCell>
            }

          </TableRow>
        </TableHead>
        <TableBody>
        {
          rowData && rowData.map((n, rowIndex) =>
          <TableRow hover  tabIndex={-1} key={rowIndex}>
          {
            columnData.map((column, columnIndex) =>
            <TableCell padding="none" key={columnIndex}>
            {
              column.type === 'button' ?
              <Button variant="flat" dense="false" color="primary" component={Link} style={{color: '#42a5f5'}}
                to={`${column.url}/${_.get(n, column.urlKey, 0)}`}
              >
              {column.get ? _.get(n, column.get) : n[column.key]}
              </Button>
              :
              column.type === 'datetime' ?
                <div>
                  {column.get && _.get(n, column.get) != null ?
                    <Moment format="DD MMM/HH:mm">
                    {_.get(n, column.get)}
                    </Moment>
                    :
                    '-'
                  }
                </div>
              :
              column.type === 'link2' ?
              <a href={`/inbound/prealert/edit/${_.get(n, column.get_id)}`}>
              {column.get ? _.get(n, column.get) : n[column.key]}
              </a>
              :
              column.type === 'transaction_link' ?
              <a href={`/sales/connote/${_.get(n, column.get_id)}`}>
              {column.get ? _.get(n, column.get) : n[column.key]}
              </a>
              :
              column.type === 'custom_link' ?
              <a href={`${column.get_url}/${_.get(n, column.get_id)}`}>
              {column.get ? _.get(n, column.get) : n[column.key]}
              </a>
              :
              column.type === 'check_circle' ?
                <div>
                {column.get && _.get(n, column.get) == 1 ?
                <Icon style={{color: 'green', alignSelf: 'center'}}>
                          check_circle
                </Icon>
                :
                ''
                }</div>
              :
              column.type === 'chip' ?
              <Chip label={
                            _.get(n, column.get) === 0 ? 'OPEN' :
                              (_.get(n, column.get) === 1 ? 'SEALED' :
                                (_.get(n, column.get) === 2 ? 'CLOSED' : '')
                              )
                          }
              />
              :
              column.type === 'chipCustom' ?
              <Chip label={
                            column.get ? _.get(n, column.get) : '-'
                          }
              />
              :
              column.type === 'twoparam' ?
                <div>
                {column.get ?
                  _.get(n, column.get)+'/'+_.get(n, column.param2)
                  :
                  '-'
                }
                </div>
              :
              column.get ? _.get(n, column.get) : n[column.key]

            }
            </TableCell>)
          }
          {
            actions && <TableCell>
            {
              actions.map((action, index) =>
              <Button key={index} color="primary" component={Link} to={`${action.url}/${_.get(n, action.id)}`}>
                {action.label}
              </Button>
              )
            }
            </TableCell>
          }
          {
            actionButtons && <TableCell>
              <Grid container spacing={16}>
              {
                actionButtons.map((button, index) =>
                  <Grid item key={index}>
                    <span>
                  {
                    button.renderWhen ?
                      _.get(n, button.renderWhen.key) === button.renderWhen.value && <button.button onClick={button.callback(n)} btnName = {button.btnName}/>
                    :
                      <button.button onClick={button.callback(n)} btnName = {button.btnName}/>
                  }
                  </span>
                </Grid>)
              }
              </Grid>
            </TableCell>
          }
          </TableRow>
          )
        }
        {
          status &&
          <TableRow>
            <TableCell colSpan={columnData.length} style={{textAlign: 'center', padding: '15px'}}>{status}</TableCell>
          </TableRow>
        }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={count}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={count < 25 ? [5, 10] : [5, 10, 25]}
              page={page}
              backIconButtonProps={{'aria-label': 'Previous Page'}}
              nextIconButtonProps={{'aria-label': 'Next Page'}}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
}

export default withStyles(styles)(SimpleTable);
