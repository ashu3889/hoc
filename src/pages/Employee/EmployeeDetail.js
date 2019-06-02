// @flow

import React, { Component } from 'react';
import {connect} from 'react-redux';
import {View, Image, StyleSheet, ActivityIndicator, Text} from 'react-native';
import {Typography, Tabs, Tab,Paper,Grid} from 'material-ui';

import PersonalInfo from './components/PersonalInfo';
import ActivityInfo from './components/ActivityInfo';

import {DEFAULT_ROWS_PER_PAGE} from '../../components/Table/TableFooter';
import { getEntityList } from '../../actions/entity';
import convertSnakeCasedToCamelCase from '../../helpers/convertSnakeCasedToCamelCase';
import ActivityTable from '../../components/Dashboard/ActivityTable';

class EmployeeDetail extends Component {
  state = {
    activeMainTab: this.props.tab || 'info',
  }

  handleChangeMainTab = (event, activeMainTab) => {
    if (this.state.activeMainTab !== activeMainTab) {
      this.setState({activeMainTab}, () => {
        this. loadData();
      });
    }
  }
  componentDidMount = () => this. loadData();
  componentWillReceiveProps = (nextprops) => nextprops.activeNode !== this.props.activeNode && this.loadData();

  handleActivityData = (data) => {
    this. loadData(data);
  }
   loadData = ( activitydata = null ) => {
    let {id} = this.props;
    const endPoint = this.state.activeMainTab === 'info' ? `employee/${id}` : `employee/${id}/${this.state.activeMainTab}`;
    const data = this.state.activeMainTab === 'activity' ? (activitydata ? activitydata : {l: 10, sort_by: 'record_id', sort_order: 'desc', page: 1}) : null;
    return getEntityList(endPoint, data)
      .then((response) => {
        const infoResult = convertSnakeCasedToCamelCase(response);
        const {data} = infoResult.data;
        return this.state.activeMainTab === 'activity' ?
          this.setState({total: data.total, [this.state.activeMainTab]: data.data}) :
          this.setState({[this.state.activeMainTab]: data});
      });
  }
  render() {
    const {activeMainTab} = this.state;
    const {handleChangeMainTab, renderMainTabContent} = this;
    return (
      <View style={{padding: 40}}>
        <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <Tabs value={activeMainTab} indicatorColor="primary" textColor="primary" onChange={handleChangeMainTab}>
              <Tab label="Info" value="info" />
              <Tab label="KPI" value="kpi" />
              <Tab label="Activity" value="activity" />
            </Tabs>
            <View>
              <div style={{padding:30}}>
                {renderMainTabContent(activeMainTab)}
              </div>
            </View>
          </View>
        </Paper>
      </View>
    );
  }
  
  renderMainTabContent = (activeMainTab) => {
    const {handleActivityData} = this;
    let {kpi, info, activity, total} = this.state;
    switch (activeMainTab) {
      case 'info': {
        return (
          <div>
            <View style={styles.header}>
              <Paper
                style={StyleSheet.flatten([
                  styles.generalCard,
                  styles.headerCard,
                  styles.vehicleCard,
                ])}
              >
                {info && <PersonalInfo info={info} />}
              </Paper>
            </View>
          </div>
        )
      }
      case 'kpi': {
        return (
          <div>
            <Grid container spacing={24}>
              KPI
            </Grid>
          </div>
        );
      }
      case 'activity': {
        return (
          <div>{ activity && <ActivityTable total={total} onRequestData={handleActivityData} data={activity} />}</div>
        );
      }
      default:
        return (
          <div>
            default
          </div>
        )
    }
  };
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
  },
  generalCard: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 10,
    paddingRight: 10,
  },
  personalInfoCard: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    maxHeight: 300,
    marginRight: 15,
  },
  activityCard: {
    display: 'flex',
    flexGrow: 3,
    flexShrink: 3,
    height: 500,
  },
});

function mapStateToProps(state: RootState) {
  return {
    employee: state.employee,
    activeNode: state.header.currentNode,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    requestEmployeeDetail: (employeeID: string) => {
      dispatch({
        type: 'GET_EMPLOYEE_DETAIL_REQUESTED',
        employeeID: Number(employeeID),
      });
      dispatch({
        type: 'GET_EMPLOYEE_ACTIVITY_LIST_REQUESTED',
        employeeID: Number(employeeID),
        limit: DEFAULT_ROWS_PER_PAGE,
        sortByColumn: '',
        sortOrderType: 'asc',
        page: 1,
      });
    },
    fetchActivityData: (
      employeeID: string,
      limit: number,
      sortByColumn: string,
      sortOrderType: SortType,
      page: number,
    ) => {
      dispatch({
        type: 'GET_EMPLOYEE_ACTIVITY_LIST_REQUESTED',
        employeeID: Number(employeeID),
        limit,
        sortByColumn,
        sortOrderType,
        page,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);
