import React from 'react';
import {connect} from 'react-redux';
import {Route, Link} from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import ToolTip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import _ from 'lodash';
import DateRangeComponent from '../../../components/DateRangeComponent';
import {MainBranch} from './components/MainBranch';
import {Branch} from './components/Branch';
import {Agent} from './components/Agent';
import {Outbound} from './components/Outbound';
import {Inbound} from './components/Inbound';
import {Delivery} from './components/Delivery';
import {Gateway} from './components/Gateway';

//import {makeBreadcrumbs} from '../../reusableFunc';
import {
  PieChart, Pie, ResponsiveContainer, Sector, Label,
  BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine,
  ReferenceDot, XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList,
} from 'recharts';
import {getEntity} from '../../../actions/entity';
import {styles} from '../../css';
import 'react-dates/lib/css/_datepicker.css';
const userdata = [
  {name: 'Intracity', OKE: 2000, YES: 2013, REG: 4500, time: 1},
  {name: 'Domestic', OKE: 3300, YES: 2000, REG: 6500, time: 2},
];



const graphColors = [
  '#EC5555',
  '#FCD64A',
  '#499E4C',
  '#2695F3',
  '#FFB64E',
];


const renderLabelContent = (props) => {
  const {value, percent, x, y, midAngle, name} = props;

  return (
    <g transform={`translate(${x}, ${y})`} textAnchor={(midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
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

let EnhancedTableToolbar = (props) => {
  const {numSelected, classes} = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        <Typography type="title">Sales</Typography>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

class SalesOverview extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.mouseOverHandler = this.mouseOverHandler.bind(this);
    this.mouseOutHandler = this.mouseOutHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.timeOut = null;
    this.state = {
      showToolTip: false,
      componentWidth: 300,
      selected: [],
      sales_overview: {},
      top_users_creator: [],
      data01: [],
      total01: [],
      data02: [],
      total02: [],
      outbounddata: [],
      linedata: LineExample,
      loading: false,
      startDate: null, endDate: null,
    };
    this.styles = {
      '.pie-chart-lines': {
        stroke: 'rgba(0, 0, 0, 1)',
        strokeWidth: 1,
      },
      '.pie-chart-text': {
        fontSize: '10px',
        fill: 'white',
      },
    };

    this.defaultData = [
      {
        x: '',
        y: '',
      },
      {
        x: 'MES',
        y: 2200,
        color: '#f17676',
      },
      {
        x: 'CGK',
        y: 3500,
        color: '#6cb26f',
      },
      {
        x: 'BDO',
        y: 2900,
        color: '#fddf6d',
      },
      {
        x: 'SBY',
        y: 1800,
        color: '#68b7bf',
      },
    ];

  }
  /** */
  componentDidMount = () => this.loadData();
  UNSAFE_componentWillReceiveProps = (nextprops) => nextprops.activeNode !== this.props.activeNode && this.loadData();
  /** */
  loadData = () => {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    return getEntity('sales/overview', {date_from: this.state.startDate, date_to: this.state.endDate}).then(({data}) => {
      const {data01, total01, data02, total02, outbounddata, top_users_creator} = this.populateGraph(data.data);
      this.setState({
        sales_overview: data.data, data01, total01, data02, total02, outbounddata, top_users_creator,
      }, () => {
        this.timeOut = setTimeout(this.loadData, 3000);
      });
    });
  }
  onDateRangeChange = ({startDate, endDate}) => {
    this.setState({startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')}, () => {
      this.loadData();
    });
  }
  mouseOverHandler(d, e) {
    this.setState({
      showToolTip: true,
      top: e.y,
      left: e.x,
      value: d.value,
      key: d.data.key});
    this.createTooltip();
  }

  mouseMoveHandler(e) {
    if (this.state.showToolTip) {
      this.setState({top: e.y, left: e.x});
    }
  }

  mouseOutHandler() {
    this.setState({showToolTip: false});
  }

  populateGraph = (data) => {
    let data01 = [];
    let total01 = 0;
    let data02 = [];
    let total02 = 0;
    let outbounddata = [];
    // Data 01
    if ('connote_by_services' in data) {
      data01 = data.connote_by_services.map((v, i) => {
        return {
          name: v.service_code || 'UNKNOWN',
          colorf: graphColors[i % graphColors.length],
          value: v.value,
        };
      });

      total01 = _.remove(data01, (d) => {
        return d.name === 'Total';
      });
      total01 = total01.length ? total01[0] : {value: 0};
    }

    // Data 02

    if ('top_destination' in data) {
      data02 = data.top_destination.map((v, i) => {
        return {
          name: v.city_name || 'UNKNOWN',
          colorf: graphColors[i % graphColors.length],
          value: v.value,
        };
      });
      total02 = _.sumBy(data02, 'value');
    }

    // outbounddata
    if ('sales_destination' in data) {
      const obIntracity = {};
      data.sales_destination.intracity.forEach((v, i) => {
        obIntracity[v.service_code] = v.value;
      });
      const obDomestic = {};
      data.sales_destination.domestik.forEach((v, i) => {
        obDomestic[v.service_code] = v.value;
      });
      outbounddata = [
        {name: 'Intracity', ...obIntracity},
        {name: 'Domestic', ...obDomestic},
      ];
    }

    // top_users_creator
    let top_users_creator = [];
    if ('top_users_creator' in data) {
      data.top_users_creator.map((v, i) => top_users_creator.push({name: v.user.name, total: v.value}));
    }
    return {data01, total01, data02, total02, outbounddata, top_users_creator};
  }
  createTooltip() {
    if (this.state.showToolTip) {
      return (
        <ToolTip
          top={this.state.top}
          left={this.state.left}
        >
          The value of {this.state.key} is {this.state.value}
        </ToolTip>
      );
    }
    return false;
  }

  render() {
    const {classes, match, location,kpi} = this.props;
    const {selected, sales_overview, data01, total01, data02, total02, outbounddata, top_users_creator} = this.state;
    const {onDateRangeChange} = this;
    //const breadCrumbs = makeBreadcrumbs(location);
    let totalSales = 0;
    let packets = 0;
    if (_.isObject(sales_overview) && 'sales_per_node' in sales_overview && _.isObject(sales_overview.sales_per_node)) {
      totalSales = new Intl.NumberFormat('en-US').format(sales_overview.sales_per_node.amount_price);
    }
    if (_.isObject(sales_overview) && 'total_connote_per_node' in sales_overview) {
      packets = sales_overview.total_connote_per_node || 0;
    }
    //const {data01, total01, data02, total02, outbounddata} = this.populateGraph();
    //console.log(outbounddata)
    return (
      <div>
       {
        kpi.mainBranch &&
          <MainBranch 
              title="Cabang Utama"
              data={this.state}
              kpi_data ={kpi.mainBranch} 
              classes={classes} 
              packets={packets} 
              sales_overview={sales_overview}
              renderLabelContent={renderLabelContent}
          />
       }
       {
        kpi.branch &&
          <Branch 
              title="Cabang"
              data={this.state}
              kpi_data ={kpi.branch} 
              classes={classes} 
              packets={packets} 
              sales_overview={sales_overview}
              renderLabelContent={renderLabelContent}
          />
       }
      {
        kpi.agent &&
        <Agent 
            title="Agent"
            data={this.state} 
            kpi_data ={kpi.agent} 
            classes={classes} 
            packets={packets} 
            sales_overview={sales_overview}
            renderLabelContent={renderLabelContent}
        />
      }
      {
        kpi.outboundStation &&
        <Outbound 
            title="Outbound Station"
            data={this.state} 
            kpi_data ={kpi.outboundStation} 
            classes={classes} 
            packets={packets} 
            sales_overview={sales_overview}
            renderLabelContent={renderLabelContent}
        />
      }
      {
        kpi.inboundStation &&
        <Inbound 
            title="Inbound Station"
            data={this.state}
            kpi_data ={kpi.inboundStation}  
            classes={classes} 
            packets={packets} 
            sales_overview={sales_overview}
            renderLabelContent={renderLabelContent}
        />
      }
      {
        kpi.deliveryStation &&
        <Delivery 
            title="Delivery Station"
            data={this.state} 
            kpi_data ={kpi.deliveryStation} 
            classes={classes} 
            packets={packets} 
            sales_overview={sales_overview}
            renderLabelContent={renderLabelContent}
        />
      }
      {
        kpi.gateway &&
        <Gateway 
            title="Gateway"
            data={this.state}
            kpi_data ={kpi.gateway} 
            classes={classes} 
            packets={packets} 
            sales_overview={sales_overview}
            renderLabelContent={renderLabelContent}
        />
      }

      </div>
    );
  }
}

const headerWrapper = {
  display: 'flex',
  margin: '30px auto',
  justifyContent: 'space-between',
};

const formWrapper = {
  height: '100%',
}

const pageTitle = {
  margin: 0,
};

const divStyle = {
  textAlign: 'right',
  fontSize: 30,
  color: '#323990',
};

const rpStylewrap = {
  display: 'block',
  marginBottom: 40,
  textAlign: 'right',
};

const rpStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block',
};

const paketStylewrap = {
  display: 'block',
  textAlign: 'right',
};

const paketStyle = {
  fontSize: 40,
  color: '#323990',
  display: 'inline-block',
};
const pendingStyle = {
  fontSize: 40,
  color: '#ec5455',
  display: 'inline-block',
};

const leftgrahside = {
  textAlign: 'center',
  marginTop: 50,
};

SalesOverview.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeNode: state.header.currentNode,
});
const LineExample = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

export default connect(mapStateToProps)(withStyles(styles)(SalesOverview));
