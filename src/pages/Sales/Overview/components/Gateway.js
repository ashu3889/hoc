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

const boxData = 
      {
        bag_received: 42,
        weight_received: 82,
        bag_send: 30,
        weight_send: 70,
        person_capacity : 6
      }
    ;

export class Gateway extends React.Component<
  Props,
  State,
> {
  render() {
    let {data,classes,packets,renderLabelContent,title} = this.props;
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
                <Typography type="title"><strong>Origin</strong></Typography>
                <br/>
                <div style={leftgrahside}>
                  { ((data02.length === 0 && <strong className={classes.infoText}>Not Enough Data</strong>)) || <PieChart width={600} height={260}>
                    <Pie
                      data={data02}
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
                        data02.map((entry, index) => (
                          <Cell key={`slice-${index}`} fill={entry.colorf} />
                        ))
                      }
                      <Label width={50} position="center">{total02}</Label>
                    </Pie>
                    <Tooltip />
                  </PieChart>}
                </div>
              </Paper>
            </Grid>
            <Grid md={6} item xs={6} className={classes.overviewWidget}>
              <Paper style={formWrapper} className={classes.formWrapper}>
                <Typography type="title"><strong>Destination</strong></Typography>
                <br/>
                <div style={leftgrahside}>
                  { ((data02.length === 0 && <strong className={classes.infoText}>Not Enough Data</strong>)) || <PieChart width={600} height={260}>
                    <Pie
                      data={data02}
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
                        data02.map((entry, index) => (
                          <Cell key={`slice-${index}`} fill={entry.colorf} />
                        ))
                      }
                      <Label width={50} position="center">{total02}</Label>
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
                  <Grid container>
                  <Grid item xs={6}>
                    <div style={paketStylewrap}><span>Bag Received</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom><strong>{boxData.bag_received}</strong></Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div style={paketStylewrap}><span>Weight Received</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom><strong>{boxData.weight_received}</strong></Typography>
                    </div>
                  </Grid>
                  </Grid>
                  <Grid container>
                  <Grid item xs={6}>
                    <div style={paketStylewrap}><span>Bag Send</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom><strong>{boxData.bag_send}</strong></Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div style={paketStylewrap}><span>Weight Send</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom><strong>{boxData.weight_send}</strong></Typography>
                    </div>
                  </Grid>
                  </Grid>
                  <Grid container>
                  <Grid item xs={12}>
                    <div style={paketStylewrap}><span>Avg Handle Capacity per person</span><br />
                    <Typography style={paketStyle} variant="headline" gutterBottom><strong>{boxData.person_capacity}</strong></Typography>
                    </div>
                  </Grid>
                  </Grid>
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
