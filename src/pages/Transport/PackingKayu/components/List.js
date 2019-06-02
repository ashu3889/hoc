import React from 'react';
import {Add} from 'material-ui-icons';
import {Route, Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import {
  Chip,
  Typography,
  Button,
  Table,
  TableCell,
  TableRow,
  Icon,
  TextField,
  TablePagination
} from 'material-ui';


import {styles} from '../../../css';
import {putEntity,getEntity,getEntityList} from '../../../../actions/entity';
import {
  TableHead,
  TableBody,
  TableTitle,
  TableFooter,
} from '../../../../components/Table';

class List extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      rowIdInEditMode : false,
      rowEdit_kgbefore: '',
      rowEdit_kgafter: '',
      order: 'asc',
      data: [],
      page: 0,
      rowsPerPage: 10,
      total_page: 0
    };
  }

  _setEditRowId = ( row ) => {
    this.setState({
      rowIdInEditMode: row.koli_id,
      rowEdit_kgbefore: row.kgbefore,
      rowEdit_kgafter: row.kgafter,
    })
  }

  _reset_setEditRowId = (row) => {
    this.setState({
      rowIdInEditMode: false,
      rowEdit_kgbefore: '',
      rowEdit_kgafter: ''
    })
  }

  _updateRow = ( row ) => {
    const {rowEdit_kgbefore,rowEdit_kgafter} = this.state;
    if(rowEdit_kgbefore == null){
      alert('You must change Kg before first!')
      return false;
    }
   this.updateEntity(row.koli_id);
  }

  _renderStatus = ( row ) => {
    return row.status;
  }

  keyPress(e){
    if(e.keyCode == 69){
      e.preventDefault()
    }
   }

  componentDidMount() {
    this.state.data.length === 0 && this.getList();
  }

  getList(){
      const {rowsPerPage,page} = this.state;
     return getEntityList('packingkayu/connote?l='+rowsPerPage+'&page='+page, null).then((response) => {
      const {data,total} = response.data;
      return this.setState({data,total_page:total});
    });
  }

  updateEntity = (id) => {
    putEntity(`koli/${id}/weight`, {
      kgafter: this.state.rowEdit_kgafter,
      kgbefore: this.state.rowEdit_kgbefore,
    }).then((response) => this.entitySubmitSuccess());
  };

  entitySubmitSuccess = () => {
    alert('Data has been successfully update!');
    this.setState({
      rowIdInEditMode: false,
      rowEdit_kgbefore: '',
      rowEdit_kgafter: ''
    })
    this.getList();
  };
    

  handleChangePage = (event, page) => {
    //this.set
    this.setState({page:event});
    this.getList();
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value});
  };

  render() {

    const {data, order,rowsPerPage, page,total_page} = this.state;
   //console.log(this.state);return false;
    let columnList = [
  {
    id: 'connote_number',
    numeric: false,
    label: 'Connote / Koli Number',
    sortable: true,
  },
  {
    id: 'created_on',
    numeric: false,
    label: 'Kg Before',
    sortable: true,
  },
  {
    id: 'to_tariff_code',
    numeric: false,
    label: 'Kg After',
    sortable: true,
  },
  {
    id: 'packing_kayu_id',
    numeric: true,
    label: 'PK Type',
    sortable: true,
  },
  {
    id: 'chargeable_weight',
    numeric: true,
    label: 'Status',
    sortable: true,
  },
  {
    id: 'node_name',
    numeric: true,
    label: 'Agent/KP/Cust',
    sortable: true,
  },
  {
    id: 'action',
    label: '',
  }
];

// let rowsPerPage =10;
// let activePage = 0;
// let total = data.length;


// console.log('-----state')
// console.log('-----state')
// console.log( this.state )

    return (
      <div>


        <Table>

        <TableHead
            columnList={columnList}
            // onSortClick={(
            //   activeSortType: SortType,
            //   activeSortColumn: string,
            // ) => {
            //   fetchData(
            //     searchTextInput,
            //     rowsPerPage,
            //     activeSortColumn,
            //     activeSortType,
            //     activePage + 1,
            //     activeNode,
            //   );
            //   this.setState({activeSortColumn, activeSortType});
            // }}
          />

        <TableBody
            data={data}
            render={(row) => {
              return (
                <TableRow>
                  <TableCell>{row.awb}</TableCell>
                  <TableCell style={{width:'150px'}}>
                    {
                      this.state.rowIdInEditMode == row.koli_id
                      ?
                      (
                        <TextField
                          value={this.state.rowEdit_kgbefore}
                          onChange={(e) => { this.setState({ rowEdit_kgbefore: e.target.value})}}
                          matchrgin="normal"
                          type="number"
                          onKeyDown={this.keyPress}
                          style={{width:'80px'}}
                        />
                      )
                      :
                      row.kgbefore
                    }
                  </TableCell>
                  <TableCell style={{width:'150px'}}>
                    {
                      this.state.rowIdInEditMode == row.koli_id
                      ?
                      (
                        <TextField
                          value={this.state.rowEdit_kgafter}
                          onChange={(e) => { this.setState({ rowEdit_kgafter: e.target.value})}}
                          matchrgin="normal"
                          type="number"
                          onKeyDown={this.keyPress}
                          style={{width:'80px'}}
                        />
                      )
                      :
                      row.kgafter
                    }
                  </TableCell>
                  <TableCell style={{width:'150px'}}>{row.packing_kayu_id ? row.packing_kayu_id : '-'}</TableCell>
                  <TableCell style={{width:'150px'}}>{this._renderStatus(row)}</TableCell>
                  <TableCell style={{width:'250px'}}>{row.node_name}</TableCell>
                  <TableCell>
                    {
                      this.state.rowIdInEditMode == row.koli_id
                      ?
                      (
                        <div>
                          <Button onClick={() =>this._updateRow(row)}>
                            Update
                          </Button>
                          <br/>
                          <Button onClick={() =>this._reset_setEditRowId(row)}>
                            Cancel
                          </Button>
                        </div>
                      )
                      :
                      (
                        <Button onClick={() =>this._setEditRowId(row)}>
                          <i className="material-icons">mode_edit</i>
                        </Button>
                      )
                    }
                  </TableCell>
                </TableRow>
              );
            }}
          />

          <TableFooter 
                  dataLength={total_page}
                  rowsPerPage={rowsPerPage}
                  activePage={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}>
          
          </TableFooter>

        </Table>
      </div>
    )
  }
}

export default withStyles(styles)(List);