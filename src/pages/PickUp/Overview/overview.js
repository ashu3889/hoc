import React from 'react';
import {connect} from 'react-redux';
import {Route, Link} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import ToolTip from 'material-ui/Tooltip';
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
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import IconButton from 'material-ui/IconButton';
import EnhancedInboundTableHead from './extComps/tableHead';
import {Button, Chip} from 'material-ui';
import {makeBreadcrumbs} from '../../reusableFunc';
import {Train, Traffic, FlightTakeoff, Toys} from 'material-ui-icons';
import UserLinearProgress from '../../UserLinearprogress';
import { PieChart, Pie, ResponsiveContainer, Sector, Label, BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine, ReferenceDot,
  XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList } from 'recharts';
import GoogleMapReact from 'google-map-react';
import {getEntityList} from '../../../actions/entity';
import {styles} from '../../css';
import DateRangeComponent from '../../../components/DateRangeComponent';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
const columnscell = ["node_id", "Agent", "Address", "#Connote", "#Bag", "Weight (Kg)"];

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const renderLabelContent = (props) => {
  const { value, percent, x, y, midAngle, name } = props;

  return (
    <g transform={`translate(${x}, ${y})`} textAnchor={ (midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
      <text x={0} y={0}>{`${name}`}</text>
      {/*<text x={0} y={20}>{`(Percent: ${(percent * 100).toFixed(2)}%)`}</text>*/}
    </g>
  );
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: 2,
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
  table: {
    maxWidth: 200,
  },
});



class MarkerWithTooltip extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showToolTip: false
    }
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }
  toggleTooltip() {
    this.setState({
      showToolTip: !this.state.showToolTip,
    });
  }
  showTooltip() {
    this.setState({
      showToolTip: true,
    });
  }
  hideTooltip() {
    this.setState({
      showToolTip: false,
    });
  }
  render() {
    return (
      <Marker onMouseOver={this.showTooltip} onMouseOut={this.hideTooltip} position={this.props.position} >
        {this.state.showToolTip && <InfoWindow onCloseClick={this.toggleTooltip}><div>
          <strong>{this.props.position.node_name}</strong><br />
          {this.props.position.remark && <span>{this.props.position.remark}<br /></span>}
          {this.props.position.status && <span>({this.props.position.status})<br /></span>}
        </div></InfoWindow>}
      </Marker>
    );
  }
}


const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => {
    const {lat, lng, data} = props;
    const positions = data.map((position, index) => {
      return {
        lat: position.node_lat,
        lng: position.node_lon,
        node_name: position.node_name,
        status: position.status,
        remark: position.remark,
      };
    });

    if (this.mapRef && positions.length > 0 && !this.bounds) {
      this.bounds = new google.maps.LatLngBounds();
      if (positions.length > 0) {
        positions.forEach((position) => {
          if (!this.bounds.contains(position)) {
            this.bounds.extend(position);
          }
        });
        this.mapRef.fitBounds(this.bounds);
      }
    }
    return (
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{lat, lng}}
        ref={(ref) => {this.mapRef = ref;}}
        >
        {
          data && data.length > 0 &&
          <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={1}
            >
            {
              positions.map((position, index) => (
                <MarkerWithTooltip position={position} key={index}/>
              ))
            }
          </MarkerClusterer>
        }
      </GoogleMap>
    );
  }),
);

class PickUpOverview extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.timeOut = null;
    this.state = {
      showToolTip: false,
      componentWidth: 300,
      order: 'asc',
      sort_by: 'PickUpTime',
      selected: [],
      pickupdata: [],
      page: 0,
      rowsPerPage: 5,
      data: [],
      total: 0,
      ready: true,
      lat: -6.2115,
      lng: 106.8452,
      total_inventory: null,
      entityChart: 'pickup/overview/services',
      entity: 'pickup/overview/table',
      startDate: null, endDate: null,
      entityOverview: 'pickup/overview',
      isLoading: false
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
  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value}, () => {

      this.getOverview();
    });
  };
  handleChangePage = (event, page) => {
    this.setState({page}, () => {

      this.getOverview();
    });
  };
  handleRequestSort = (event, property) => {
    this.setState({sort_by: property, sort_order: this.state.sort_by === property ? !this.state.sort_order : this.state.sort_order}, () => {
      this.getOverview();
    });
  };

  /**
   * Date Range Change Event
  */
  onDateRangeChange = ({startDate, endDate}) => {
    this.setState({startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')}, () => {
      this.getOverview();
    });
  };
  // getList = () => {
  //   this.setState({isLoading: true});
  //   let {searchKey, rowsPerPage, sort_by, sort_order, page} = this.state;
  //   return getEntityList(this.state.entity, {s: searchKey !== '' ? searchKey : null, l: rowsPerPage, sort_by, sort_order: sort_order ? 'desc' : 'asc', page: page + 1})
  //     .then((response) => {
  //       const {total, data, total_inventory} = response.data;
  //       return this.setState({isLoading: false, data, total, total_inventory});
  //   });
  // };
  getChart = () => {
    let {searchKey, rowsPerPage, sort_by, sort_order, page} = this.state;
    return getEntityList(this.state.entityChart,{},null)
      .then((response) => {
        const {data} = response.data;
        return this.setState({pickupdata: data});
    });
  };
  getOverview = (reset = 0 ) => {
    let {searchKey, rowsPerPage, sort_by, sort_order, page} = this.state;
    this.setState({isLoading: true});
    return getEntityList(this.state.entityOverview, {l: rowsPerPage, sort_by, sort_order: sort_order ? 'desc' : 'asc', page: reset ? 1 : page + 1})
      .then((response) => {
        const {total, data, total_inventory} = response.data.data.table;
        const pickupdata = response.data.data.service;
        return this.setState({isLoading: false, data, total, total_inventory, pickupdata}, () => {
          setTimeout(this.getOverview, 30000);
        });
    });
  }
  componentDidMount() {
    this.getOverview();
  }

  componentWillReceiveProps = (nextprops) => {
    if (nextprops.activeNode !== this.props.activeNode) {
      return this.getOverview().then((response) => {
        this.getOverview();
      });
    }
  }

  render() {

    const {classes, match, location} = this.props;
    const {data, pickupdata, irregularitydata, order, orderBy, selected, rowsPerPage, page, ready, lat, lng, total,
      total_inventory,
      isLoading
    } = this.state;
    const {onDateRangeChange} = this;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const breadCrumbs = makeBreadcrumbs(location);

    var connoteSum = 0;
    var bagSum = 0;
    var weight_kgSum = 0;

    if (data.length >0) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].connote_inventory) {
              connoteSum += parseInt(data[i].connote_inventory.connote_qty);
            }
            if (data[i]['bag_inventory']) {
              bagSum += parseInt(data[i]['bag_inventory'].bag_qty);
            }
            if (data[i].connote_inventory) {
              weight_kgSum += parseInt(data[i].connote_inventory.actual_weight);
            }

        }
    }

    let pickupexcelldata = [];
    var connote;
    var bagnum;
    var weight_kg;
    if (data.length > 0) {
      data.map((pickupexcellvalue, index) => {

        if (pickupexcellvalue.connote_inventory) {
          connote = parseInt(pickupexcellvalue.connote_inventory.connote_qty);
        } else {
          connote = 0;
        }

        if (pickupexcellvalue.bag_inventory) {
          bagnum = parseInt(pickupexcellvalue.bag_inventory.bag_qty);
        } else {
          bagnum = 0;
        }

        if (pickupexcellvalue.connote_inventory) {
          weight_kg = parseInt(pickupexcellvalue.connote_inventory.actual_weight);
        } else {
          weight_kg = 0;
        }

        pickupexcelldata.push([pickupexcellvalue.node_id, pickupexcellvalue.agent_name, pickupexcellvalue.node_address, pickupexcellvalue.connote, pickupexcellvalue.bagnum, pickupexcellvalue.weight_kg]);
      });
    }

    return (
      <div>
        <div className={classes.pageHeaderWrapper}>
          <div>
            <div className={classes.breadCrumbs}>
              Pick Up /
              <span className={classes.transactionBreadcrumbs}> Overview</span>
            </div>
            <br />
            <p className={classes.titleWrapper}>Overview</p>
          </div>
          <DateRangeComponent onChange={onDateRangeChange} />
        </div>
        <div className={classes.pageRoot}>
          <Grid container spacing={16}>
            <Grid md={9} item xs={9} className={classes.join_widgets}>
              <Paper className={classes.formWrapper}>
                <div style={bodyTitle}>
                  <Typography className={classes.bodyTitleText} type="headline"><strong>Pick Up Overview</strong></Typography>
                  <ExcelExportBtn
                    columnList={columnscell}
                    data={pickupexcelldata}
                    filename="pickup_list.xlsx"
                    orgName="JNT"
                    title="pickup list"
                  />
                </div>
                
                <br/>
                <div className={classes.tableWrapper}>
                  { isLoading && <UserLinearProgress />}
                  <Table className={classes.table}>
                    <EnhancedInboundTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onSort={this.handleSort}
                      rowCount={data.length}
                    />
                    <TableBody>
                      {data && data.map((n) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={n.node_id}
                            >
                              <TableCell>{n.agent_name}</TableCell>
                              <TableCell>{n.node_address}</TableCell>                              
                              <TableCell>
                                {n.connote_inventory != null ? n.connote_inventory.connote_qty : 0}
                              </TableCell>
                              <TableCell>
                                {n.bag_inventory !=null ? n.bag_inventory.bag_qty : 0}
                              </TableCell>
                              <TableCell>
                                {n.connote_inventory != null ? n.connote_inventory.actual_weight : 0}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow>
                          <TableCell><strong>SUM</strong></TableCell>
                          <TableCell></TableCell>
                          <TableCell><strong>{connoteSum}</strong></TableCell>
                          <TableCell><strong>{bagSum}</strong></TableCell>
                          <TableCell><strong>{weight_kgSum}</strong></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={total}
                          rowsPerPage={rowsPerPage}
                          rowsPerPageOptions={
                            total < 25 ? [5, 10] : [5, 10, 25]
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
            <Grid md={3} item xs={3} className={classes.join_widgets}>
              <Paper className={classes.formWrapper}>
                <div style={bodyTitle}>
                  <Typography className={classes.bodyTitleText} type="headline"><strong>Services</strong></Typography>
                </div>
                <div style={leftgrahside}>
                  {pickupdata &&
                    <PieChart width={250} height={260}>
                        <Pie
                          data={pickupdata}
                          dataKey="value"
                          cx={140}
                          cy={120}
                          startAngle={90}
                          endAngle={-270}
                          innerRadius={40}
                          outerRadius={70}
                          label={renderLabelContent}
                          paddingAngle={0}
                          isAnimationActive={this.state.animation}
                        >
                          {
                            pickupdata.map((entry, index) => (
                              <Cell key={`slice-${index}`} fill={entry.colorf}/>
                            ))
                          }
                        </Pie>
                        <Tooltip />
                      </PieChart>
                  }
                </div>
                <div style={leftserviceside}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography type="subheading">Connotes</Typography>
                      <Typography style={servicesparam} type="title"><strong>{total_inventory ? total_inventory.qty_total_connote : 0}</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography type="subheading">Bags</Typography>
                      <Typography style={servicesparam} type="title"><strong>{total_inventory ? total_inventory.qty_total_bag : 0}</strong></Typography>
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <div className={classes.pageRoot}>
          <Grid container spacing={24}>
            <Grid md={12} item xs={12}>
              <Paper className={classes.formWrapper}>
                <div style={bodyTitle}>
                  <Typography className={classes.bodyTitleText} type="headline"><strong>Nearest Agent</strong></Typography>
                </div>
                {ready && (
                  <MapWithAMarker
                    lat={lat}
                    lng={lng}
                    data={data}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCo6jr7MpgztNao-k74aTZcrOIIASChoqA&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{height: `100%`}} />}
                    containerElement={<div style={{height: `400px`}} />}
                    mapElement={<div style={{height: `100%`}} />}
                  />
                )}
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

const bagStylewrap = {
  display: 'block',
  'margin-bottom': 40
};

const bagStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block',
  'margin-right': 15
};

const connoteStylewrap = {
  display: 'block'
};

const connoteStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block',
  'margin-right': 15
};

const leftgrahside = {
  textAlign: 'center'
};
const leftserviceside = {
  textAlign: 'center',
  marginTop: 30
};

const laggicon = {
  display: 'inline-block',
  backgroundColor: '#d8d8d8',
  width: 20,
  height: 20,
  textAlign: 'center',
  'border-radius': '100%',
  'vertical-align': 'middle'
};

const laggiconsize = {
  fontSize: 15,
  'vertical-align': 'middle'
};

const servicesparam = {
  fontSize: 30,
};

const bodyTitle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px 24px 24px 24px',
};
const bodyTitleText = {
  fontSize: '1.2rem',
}

PickUpOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  activeNode: state.header.currentNode,
});

export default withStyles(styles)(connect(mapStateToProps)(PickUpOverview));
