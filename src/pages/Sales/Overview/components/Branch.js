// @flow

import React from 'react';
import {View, Text} from 'react-native';
import {
  Button,
  Table,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Grid
} from 'material-ui';

import {
  PieChart, Pie, ResponsiveContainer, Sector, Label,
  BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine,
  ReferenceDot, XAxis, YAxis, Tooltip, Legend, ErrorBar, LabelList,
} from 'recharts';
import {intFormatNumber} from '../../../../helpers/formatNumber';
import {Top10Table} from './Top10Table';
const graphColors = [
  '#EC5555',
  '#FCD64A',
  '#499E4C',
  '#2695F3',
  '#FFB64E',
];
const boxData = 
      {
        total_connote: 100,
        total_delivered: 50,
        total_amount: 2789000,
        total_on_process: 50,
        total_weight: 120,
        pod: 50,
      }
    ;
export class Branch extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ctc_graph : [],
      payment_graph : [],
      service_graph : [],
      ctc_total : 0,
      payment_total : 0,
      service_total : 0
    }
  }
  componentDidMount(){
    let {kpi_data} = this.props;
    let {ctcDom,paymentType,services} = kpi_data;
    var ctc_data = ctcDom.map((v, i) => {
        return {
          name: v.key || 'UNKNOWN',
          colorf: graphColors[i % graphColors.length],
          value: v.value,
        };
      });
      var total_ctc = _.sumBy(ctc_data, 'value');


      var service_data = services.map((v, i) => {
        return {
          name: v.key || 'UNKNOWN',
          colorf: graphColors[i % graphColors.length],
          value: v.value,
        };
      });
      var total_service = _.sumBy(service_data, 'value');

      var payment_data = paymentType.map((v, i) => {
        return {
          name: v.key || 'UNKNOWN',
          colorf: graphColors[i % graphColors.length],
          value: parseInt(v.value),
        };
      });
      var total_payment = _.sumBy(payment_data, 'value');
      this.setState({
        ctc_graph:ctc_data,
        payment_graph:payment_data,
        ctc_total:total_ctc,
        payment_total:total_payment,
        service_graph:service_data,
        service_total:total_service
      })
  }
  render() {
    let {data,kpi_data,classes,packets,renderLabelContent,title} = this.props;
    let{ctc_graph,ctc_total,payment_graph,payment_total,service_graph,service_total} = this.state;
    let {selected,outbounddata, top_users_creator,data01,data02,sales_overview,animation,total01,total02} = data;
    return (
      <div>
        <div className={classes.pageHeaderWrapper}>
          <div>
            <br />
            <p className={classes.titleWrapper}>{title}</p>
          </div>
        </div>

        <div className={classes.pageRoot}>
          <Grid container spacing={24}>
            <Grid md={6} item xs={6} className={classes.overviewWidget}>
              <Paper style={formWrapper} className={classes.formWrapper}>
                <Grid container>
                <Grid item xs={4}>
                  <div style={paketStylewrap}><span>Total Connote</span><br />
                  <Typography style={paketStyle} variant="headline" gutterBottom>
                  <strong>{kpi_data.totalConnote}</strong>
                  </Typography>
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <div style={paketStylewrap}><span>Total Amount</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom>
                    <strong>Rp {intFormatNumber('en-US', kpi_data.totalAmount)}</strong>
                    </Typography>
                  </div>
                </Grid>
                </Grid>
                <Grid container>
                <Grid item xs={4}>
                  <div style={paketStylewrap}><span>Total Weight</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom>
                    <strong>{kpi_data.totalWeight}</strong>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <div style={paketStylewrap}><span>Total Delivered</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom>
                    <strong>{kpi_data.totalDelivered}</strong>
                    </Typography>
                  </div>
                </Grid>
                </Grid>
                <Grid container>
                <Grid item xs={4}>
                  <div style={paketStylewrap}><span>Total On Process</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom>
                    <strong>{kpi_data.totalOnProcess}</strong>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <div style={paketStylewrap}><span>POD</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom>
                    <strong>{kpi_data.pod ? kpi_data.pod : '0'}</strong>
                    </Typography>
                  </div>
                </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid md={6} item xs={6} className={classes.overviewWidget}>
              <Paper style={formWrapper} className={classes.formWrapper}>
                <Typography type="title"><strong>CTC / Domestic</strong></Typography>
                <br/>
                <div style={leftgrahside}>
                  { ((ctc_graph.length === 0 && <strong className={classes.infoText}>Not Enough Data</strong>)) || <PieChart width={600} height={260}>
                    <Pie
                      data={ctc_graph}
                      dataKey="value"
                      cx={300}
                      cy={130}
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={50}
                      outerRadius={90}
                      label={renderLabelContent}
                      paddingAngle={0}
                      isAnimationActive={animation}
                    >
                      {
                        ctc_graph.map((entry, index) => (
                          <Cell key={`slice-${index}`} fill={entry.colorf} />
                        ))
                      }
                      <Label width={50} position="center">{ctc_total}</Label>
                    </Pie>
                    <Tooltip />
                  </PieChart>}
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid md={6} item xs={6} className={classes.overviewWidget}>
            <Paper style={formWrapper} className={classes.formWrapper}>
              <Typography type="title"><strong>Services</strong></Typography>
                  <div style={leftgrahside}>
                    { ((service_graph.length === 0 && <strong className={classes.infoText}>Not Enough Data</strong>)) ||
                    <ResponsiveContainer height={220}>
                      <PieChart>
                        <Pie
                          data={service_graph}
                          dataKey="value"
                          startAngle={0}
                          endAngle={-360}
                          innerRadius={50}
                          outerRadius={90}
                          label={renderLabelContent}
                          paddingAngle={0}
                          isAnimationActive={animation}
                        >
                        {
                          service_graph.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.colorf} />
                          ))
                        }
                          <Label width={50} position="center">{service_total}</Label>
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  }
                  </div>
              </Paper>
            </Grid>
             <Grid md={6} item xs={6} className={classes.overviewWidget}>
              <Paper style={formWrapper} className={classes.formWrapper}>
              <Typography type="title"><strong>Payment Type</strong></Typography>
                  <div style={leftgrahside}>
                    { ((payment_graph.length === 0 && <strong className={classes.infoText}>Not Enough Data</strong>)) ||
                    <ResponsiveContainer height={220}>
                      <PieChart>
                        <Pie
                          data={payment_graph}
                          dataKey="value"
                          startAngle={0}
                          endAngle={-360}
                          innerRadius={50}
                          outerRadius={90}
                          label={renderLabelContent}
                          paddingAngle={0}
                          isAnimationActive={animation}
                        >
                          {
                            payment_graph.map((entry, index) => (
                              <Cell key={`slice-${index}`} fill={entry.colorf} />
                            ))
                          }
                          <Label width={50} position="center">{payment_total}</Label>
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  }
                  </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid md={6} item xs={6} className={classes.overviewWidget}>
              <Paper style={formWrapper} className={classes.formWrapper}>
                <Typography type="title"><strong>Top 10 Agent</strong></Typography>
                  <div style={leftgrahside}>
                   <Top10Table name="Agent" data={kpi_data.topAgent}/>
                  </div>
              </Paper>
            </Grid>
             <Grid md={6} item xs={6} className={classes.overviewWidget}>
              <Paper style={formWrapper} className={classes.formWrapper}>
                <Typography type="title"><strong>Top 10 Destination</strong></Typography>
                  <div style={leftgrahside}>
                  <Top10Table name="Destination" data={kpi_data.topDestination}/>
                  </div>
              </Paper>
            </Grid>
            
          </Grid>
        </div>
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
