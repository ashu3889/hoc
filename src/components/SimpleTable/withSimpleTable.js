import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getEntity} from '../../actions/entity';
import moment from 'moment';

export function withSimpleTable(Component, entity, tableProps) {
  class SimpleTableHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sort_order: true,
        sort_by: tableProps.defaults.sort_by,
        tableData: {data: [], total: 0},
        page: 0,
        rowsPerPage: tableProps.defaults.rowsPerPage,
        isLoading: true,
        searchKey: '',
        startDate: moment(new Date()).format('YYYY-MM-DD'),
        endDate: moment(new Date()).format('YYYY-MM-DD'),
      };
      this.timeOut = null;
    }
    handleChangeRowsPerPage = (event) => {
      this.setState({rowsPerPage: event.target.value}, () => {
        this.loadData(true);
      });
    };
    handleChangePage = (event, page) => {
      this.setState({page}, () => {
        this.loadData();
      });
    };
    handleRequestSort = (event, property) => {
      this.setState({sort_by: property, sort_order: this.state.sort_by === property ? !this.state.sort_order : this.state.sort_order}, () => {
        this.loadData();
      });
    };
    handleSearchChange = (searchKey) => {
      this.setState({
        searchKey,
      });
    };
    handleToChangeDate = (arr) => {
       this.setState({
              defaultDate:arr,
              startDate:moment(arr[0]).format('YYYY-MM-DD'),
              endDate:moment(arr[1]).format('YYYY-MM-DD')
            });
      this.loadData(true);
    };
     handleToFilterDropdown = (event) => {
        if (event && event.preventDefault) {
          event.preventDefault();
        }
        this.setState({[event.target.name]: event.target.value});
        this.loadData(true);
      };
    handleUpdateDate = (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      this.loadData(true);
    };
    handleSearchSubmit = (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      this.loadData(true);
    };
    componentWillMount = () => {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
    }
    componentDidMount = () => this.loadData();
    componentWillReceiveProps = (nextprops) => nextprops.activeNode !== this.props.activeNode && this.loadData(true);
    loadData = (reset) => {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.setState({isLoading: true});
      const {searchKey, rowsPerPage, sort_by, sort_order, page,startDate,endDate,node_types,three_letter,destination_id} = this.state;
      const params = {s: searchKey !== '' ? 
                      searchKey : null,
                      startDate: startDate ,
                      endDate :endDate,
                      node_type:  node_types !== '' ? node_types : '',
                      three_letter:  three_letter !== '' ? three_letter : '',
                      destination_tlc:  destination_id !== '' ? destination_id : '',
                      l: rowsPerPage,
                      sort_by,
                      sort_order: sort_order ? 'desc' : 'asc',
                      page: reset ? 1 : page + 1,
                    };
      return getEntity(entity, params).then((response) => {
        const {data} = response;
        this.setState({page: reset ? 0 : page, isLoading: false, tableData: data}, () => {
          this.timeOut = setTimeout(this.loadData, 30000);
        });
      });
    }
    render() {
      const {handleChangeRowsPerPage, handleChangePage, handleRequestSort,handleToChangeDate, handleSearchChange, handleSearchSubmit,handleUpdateDate,handleToFilterDropdown} = this;
      const {searchKey, page, tableData, rowsPerPage, sort_by, sort_order, isLoading,startDate,endDate} = this.state;
      return (
        <Component
          {...this.props}
          searchKey={searchKey}
          isLoading={isLoading}
          tableData={tableData}
          page={page}
          sort_by={sort_by}
          sort_order={sort_order ? 'desc' : 'asc'}
          rowsPerPage={rowsPerPage}
          handleSearchSubmit={handleSearchSubmit}
          handleSearchChange={handleSearchChange}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          handleRequestSort={handleRequestSort}
          handleUpdateDate={handleToChangeDate}
          handleUpdateFilter={handleToFilterDropdown}
        />
      );
    }
  }
  const mapStateToProps = (state) => ({
    activeNode: state.header.activeNode,
  });
  return connect(mapStateToProps)(SimpleTableHOC);
}
