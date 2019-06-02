// @flow

import React from 'react';
import {connect} from 'react-redux';
import {View, Image, StyleSheet, ActivityIndicator, Text} from 'react-native';
import {Paper, Typography, Tabs, Tab, Grid} from 'material-ui';

import EmployeeTable from './components/EmployeeTable';
import VehicleTable from './components/VehicleTable';

import InventoryDetail from './components/InventoryDetail';
import NodeInfo from './components/NodeInfo';
import Maps from '../../components/Maps';
import {
  PieChart, Pie, ResponsiveContainer, Sector, Label,
  BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine,
  ReferenceDot, XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList,
} from 'recharts';
import convertSnakeCasedToCamelCase from '../../helpers/convertSnakeCasedToCamelCase';
import {DEFAULT_ROWS_PER_PAGE} from '../../components/Table/TableFooter';
import { getEntityList } from '../../api';
import randomColor from 'randomcolor';
import ActivityTable from '../../components/Dashboard/ActivityTable';
import SalesOverview from '../../pages/Sales/Overview/overview';

const TABS = [
  {label: 'Inventories', value: 'inventory'},
  {label: 'Vehicles', value: 'vehicle'},
  {label: 'Employees', value: 'employee'},
];

let getTableInitialState = () => ({
  rowsPerPage: DEFAULT_ROWS_PER_PAGE,
  activePage: 0,
  activeSortColumn: '',
  activeSortType: 'asc',
});
const renderLabelContent = (props) => {
  const {value, percent, x, y, midAngle, name} = props;

  return (
    <g transform={`translate(${x}, ${y})`} textAnchor={(midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
      <text x={0} y={0}>{`${name}`} </text>
    </g>
  );
};
class NodeDetail extends React.Component {
  state = {
    activeMainTab: this.props.tab || 'info',
    activeTab: 'inventory',
    vehicleTable: getTableInitialState(),
    employeeTable: getTableInitialState(),
    total: 0,
    kpi: null, info: null, activity: null,
  };
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
    const endPoint = this.state.activeMainTab === 'info' ? `nodes/${id}` : `nodes/${id}/${this.state.activeMainTab}`;
    const data = this.state.activeMainTab === 'activity' ? (activitydata ? activitydata : {l: 10, sort_by: 'record_id', sort_order: 'desc', page: 1}) : null;
    return getEntityList(endPoint, {params: data})
      .then((response) => {
        const infoResult = convertSnakeCasedToCamelCase(response);
        const {total, data} = infoResult.data;
        this.setState({total: total || data.length, [this.state.activeMainTab]: data});
      });
  }
  
  render() {
    const {handleChangeMainTab, renderMainTabContent} = this;
    let {activeTab, activeMainTab} = this.state;
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
    const {renderKPISummary, handleActivityData} = this;
    let {activeTab, kpi, info, activity, total} = this.state;
    const {classes} = this.props;
    let markerPosition;

    if (info && info.nodeLat && info.nodeLon) {
      markerPosition = {
        lat: Number(info.nodeLat),
        lng: Number(info.nodeLon),
      };
    }
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
                {info && <NodeInfo info={info} />}
              </Paper>
              {markerPosition && (
                <Paper
                  style={StyleSheet.flatten([
                    styles.generalCard,
                    styles.headerCard,
                    styles.mapCard,
                  ])}
                >
                  <View style={{flex: 1}}>
                    <Maps
                      markerPositionList={[markerPosition]}
                      defaultCenter={markerPosition}
                    />
                  </View>
                </Paper>
              )}
            </View>
            <View style={styles.activityContainer}>
              <Paper style={StyleSheet.flatten([styles.generalCard])}>
                <Tabs
                  value={activeTab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={(event, activeTab) => this.setState({activeTab})}
                >
                  {TABS.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                {this._renderTabContent(activeTab)}
              </Paper>
            </View>
          </div>
        )
      }
      case 'kpi': {
        return (
          <div>
          {
            kpi &&
            /*<Grid container spacing={24}>
            {
              Object.keys(kpi).map((kpikey, index) => renderKPISummary(kpikey, kpi[kpikey]))
            }
            </Grid>*/

            <SalesOverview kpi={kpi}/>
          }
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
  renderKPISummary = (title, value) => {
    const connote = value.summary && value.summary.connote || 0;
    const amount = value.summary && value.summary.amount || 0;
    let chartItem = [];
    Object.keys(value).map((item) => item !== 'summary' && chartItem.push({title: item, chart: this.getKPIChart(value[item])}));
    let width = (100 / chartItem.length) + '%';
    if (connote === 0) {
      return null;
    }
    return (
      <Grid key={title} md={6} item xs={6}>
        <Paper style={{padding: 20}}>
          <Typography variant="title">{title}</Typography>
          <div style={{padding: 10}}>
            <Grid container spacing={24} style={{margin: 0, width: '100%'}}>
              <Grid md={6} item xs={6}>
              <Typography variant="subheading">Connote</Typography>
              </Grid>
              <Grid md={6} item xs={6} style={{textAlign: 'right'}}>
              {connote}
              </Grid>
            </Grid>
            <Grid container spacing={24} style={{margin: 0, width: '100%'}}>
              <Grid md={6} item xs={6}>
              <Typography variant="subheading">Amount</Typography>
              </Grid>
              <Grid md={6} item xs={6} style={{textAlign: 'right'}}>
              {amount}
              </Grid>
            </Grid>
            <div style={{display:'flex'}}>
            {
              chartItem.length && chartItem.map((chart, index) =>
                <div key={index} style={{width}}>
                  <ResponsiveContainer height={180}><PieChart>{chart.chart}<Tooltip /></PieChart></ResponsiveContainer>
                  <Typography style={{textAlign: 'center'}} variant="subheading">{chart.title}</Typography>
                </div>
              )
            }
            </div>
          </div>
        </Paper>
      </Grid>
    );

  }
  getKPIChart = (data) => {
    return (
      <Pie data={data}
        dataKey="value"
        nameKey="key"
        innerRadius={30}
        outerRadius={50}
        fill="#8884d8" startAngle={90}
        endAngle={-270}
        label={renderLabelContent}
      >
      {
        data && data.map((entry, index) => <Cell key={`slice-${index}`} fill={randomColor()} />)
      }
      </Pie>
    );
  }
  _renderTabContent = (activeTab) => {
    let {
      id,
      node,
      fetchInventoryData,
      fetchEmployeeData,
      fetchVehicleData,
    } = this.props;
    let {vehicleTable, employeeTable} = this.state;

    switch (activeTab) {
      case 'inventory': {
        return <InventoryDetail data={node.inventory} />;
      }
      case 'employee': {
        let {
          rowsPerPage,
          activePage,
          activeSortColumn,
          activeSortType,
        } = employeeTable;
        return (
          <EmployeeTable
            data={node.employee}
            rowsPerPage={rowsPerPage}
            activePage={activePage}
            activeSortColumn={activeSortColumn}
            activeSortType={activeSortType}
            onTableSettingChanged={(changedSettings) => {
              this._onTableSettingChanged('employeeTable', changedSettings);
            }}
            fetchData={(
              limit,
              sortByColumn,
              sortOrderType,
              page,
            ) => {
              fetchEmployeeData(id, limit, sortByColumn, sortOrderType, page);
            }}
          />
        );
      }
      case 'vehicle': {
        let {
          rowsPerPage,
          activePage,
          activeSortColumn,
          activeSortType,
        } = vehicleTable;
        return (
          <VehicleTable
            data={node.vehicle}
            rowsPerPage={rowsPerPage}
            activePage={activePage}
            activeSortColumn={activeSortColumn}
            activeSortType={activeSortType}
            onTableSettingChanged={(changedSettings) => {
              this._onTableSettingChanged('vehicleTable', changedSettings);
            }}
            fetchData={(
              limit,
              sortByColumn,
              sortOrderType,
              page,
            ) => {
              fetchInventoryData(id, limit, sortByColumn, sortOrderType, page);
            }}
          />
        );
      }
    }
  };

  _onTableSettingChanged = (
    type: 'vehicleTable' | 'employeeTable',
    changedSettings: {[key: string]: any},
  ) => {
    this.setState({
      [type]: {
        ...this.state[type],
        ...changedSettings,
      },
    });
  };
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
  },
  header: {
    flexDirection: 'row',
  },
  generalCard: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 40,
    paddingRight: 40,
  },
  headerCard: {
    height: 450,
  },
  vehicleCard: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 15,
  },
  mapCard: {
    display: 'flex',
    flexGrow: 3,
    flexShrink: 3,
  },
  activityContainer: {
    flex: 1,
    marginTop: 25,
  },
  activityCard: {
    display: 'flex',
    flexGrow: 3,
    flexShrink: 3,
    maxHeight: 300,
  },
});

function mapStateToProps(state: RootState) {
  return {
    node: state.node.globalSearch,
    activeNode: state.header.currentNode,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    requestNodeDetail: (nodeID: string) => {
      dispatch({
        type: 'GET_NODE_DETAIL_REQUESTED',
        nodeID: Number(nodeID),
      });
      dispatch({
        type: 'GET_NODE_INVENTORY_LIST_REQUESTED',
        nodeID: Number(nodeID),
        limit: DEFAULT_ROWS_PER_PAGE,
        sortByColumn: '',
        sortOrderType: 'asc',
        page: 1,
      });
      dispatch({
        type: 'GET_NODE_VEHICLE_LIST_REQUESTED',
        nodeID: Number(nodeID),
        limit: DEFAULT_ROWS_PER_PAGE,
        sortByColumn: '',
        sortOrderType: 'asc',
        page: 1,
      });
      dispatch({
        type: 'GET_NODE_EMPLOYEE_LIST_REQUESTED',
        nodeID: Number(nodeID),
        limit: DEFAULT_ROWS_PER_PAGE,
        sortByColumn: '',
        sortOrderType: 'asc',
        page: 1,
      });
    },
    fetchInventoryData: (
      nodeID: string,
      limit: number,
      sortByColumn: string,
      sortOrderType: SortType,
      page: number,
    ) => {
      dispatch({
        type: 'GET_NODE_INVENTORY_LIST_REQUESTED',
        nodeID: Number(nodeID),
        limit,
        sortByColumn,
        sortOrderType,
        page,
      });
    },
    fetchVehicleData: (
      nodeID: string,
      limit: number,
      sortByColumn: string,
      sortOrderType: SortType,
      page: number,
    ) => {
      dispatch({
        type: 'GET_NODE_VEHICLE_LIST_REQUESTED',
        nodeID: Number(nodeID),
        limit,
        sortByColumn,
        sortOrderType,
        page,
      });
    },
    fetchEmployeeData: (
      nodeID: string,
      limit: number,
      sortByColumn: string,
      sortOrderType: SortType,
      page: number,
    ) => {
      dispatch({
        type: 'GET_NODE_EMPLOYEE_LIST_REQUESTED',
        nodeID: Number(nodeID),
        limit,
        sortByColumn,
        sortOrderType,
        page,
      });
    },
  };
}

 export default connect(mapStateToProps, mapDispatchToProps)(NodeDetail);
