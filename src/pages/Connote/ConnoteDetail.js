// @flow

import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import styles from './components/styles';
import {Typography, Tabs, Tab,Paper,Grid} from 'material-ui';

import TrackingInfo from './components/TrackingInfo';
import {DEFAULT_ROWS_PER_PAGE} from '../../components/Table/TableFooter';

// imports Card
import FromCard from './components/FromCard';
import ToCard from './components/ToCard';
import InformationCard from './components/InformationCard';

import type {
  ConnoteSearchData,
  ConnoteSearchActivityState,
} from '../../data/connoteSearch/ConnoteSearch-type';

type ActiveTab = 'info' | 'kpi' | 'activity';

type Props = {
  tab?: ActiveTab,
  detailInfo: ConnoteSearchData,
  id: string,
  activity: ConnoteSearchActivityState,
  fetchConnoteDetail: (id: string) => void,
  fetchConnoteActivityData: (
    connoteID: string,
    limit: number,
    sortByColumn: string,
    sortOrderType: SortType,
    page: number,
  ) => void,
};

type State = {
  activeTab: ActiveTab,
};

export class ConnoteDetail extends React.Component<Props,State> {
    state = {
      activeTab: this.props.tab || 'info',
    }
  componentDidMount() {
    let {id} = this.props;
    if (id) {
      this.props.fetchConnoteDetail(id);
    }
  }

  render() {
    let {activeTab} = this.state;

    return (
      <View style={{padding: 40}}>
        <Paper>
          <View style={{paddingHorizontal: 20, paddingTop: 30}}>
            <Tabs
              value={activeTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this._onTabPress}
            >
              <Tab label="Info" value="info" />
              <Tab label="KPI" value="kpi" />
              <Tab label="Activity" value="activity" />
            </Tabs>
            <View>{this._renderContent(activeTab)}</View>
          </View>
        </Paper>
        </View>
    );
  }

  _onTabPress = (event: Event, activeTab: ActiveTab) => {
    if (this.state.activeTab !== activeTab) {
      this.setState({activeTab});
    }
  }

  _renderContent = (activeTab: ActiveTab) => {
    let {id, detailInfo} = this.props;
    let fromData = {};
    let toData = {};

    if (detailInfo) {
      let keys = Object.keys(detailInfo);
      /*
        I separate fromData to toData
        for each respective component props;
      */
      for (let key of keys) {
        if (key.match(/from/gi)) {
          fromData[key] = detailInfo[key];
        }
        if (key.match(/to/gi)) {
          toData[key] = detailInfo[key];
        }
      }
      fromData['createdOn'] = detailInfo['createdOn'];
      fromData['createdByNode'] = detailInfo['createdByNode']['nodeName'];
    }
    switch (activeTab) {
      case 'info': {
        return (
          <div style={{padding:30}}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={4} style={{minHeight:455}}>
              <FromCard data={fromData} />
            </Grid>
            <Grid item xs={12} sm={4} style={{minHeight:455}}>
              <ToCard data={toData} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InformationCard data={detailInfo ? detailInfo : null} />
            </Grid>
          </Grid>
           </div>
        )
      }
      case 'kpi': {
        return (
          <div>
            KPI
          </div>
        )
      }
      case 'activity': {
        return (
          <div style={{padding:30}}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Paper style={StyleSheet.flatten(styles.paper)}>
                  <TrackingInfo
                    activity={this.props.activity}
                    fetchData={(
                      limit: number,
                      sortByColumn: string,
                      sortOrderType: SortType,
                      page: number,
                    ) => {
                      this.props.fetchConnoteActivityData(
                        id,
                        limit,
                        sortByColumn,
                        sortOrderType,
                        page,
                      );
                    }}
                  />
                </Paper>
            </Grid>
            </Grid>
          </div>
        )
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

function mapStateToProps(state) {
  let {connoteSearch: {detailInfo, activity}} = state;
  return {
    detailInfo,
    activity,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchConnoteDetail: (connoteID: string) => {
      dispatch({
        type: 'GET_CONNOTE_BY_ID_REQUESTED',
        id: connoteID,
      });
      dispatch({
        type: 'GET_CONNOTE_ACTIVITY_BY_ID_REQUESTED',
        id: connoteID,
        limit: DEFAULT_ROWS_PER_PAGE,
        sortByColumn: '',
        sortOrderType: 'asc',
        page: 1,
      });
    },
    fetchConnoteActivityData: (
      connoteID: string,
      limit: number,
      sortByColumn: string,
      sortOrderType: SortType,
      page: number,
    ) => {
      dispatch({
        type: 'GET_CONNOTE_ACTIVITY_BY_ID_REQUESTED',
        id: connoteID,
        limit,
        sortByColumn,
        sortOrderType,
        page,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetail);
