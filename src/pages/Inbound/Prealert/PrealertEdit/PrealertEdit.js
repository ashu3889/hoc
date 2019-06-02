import React from 'react';
import {Route, Link} from 'react-router-dom';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles/index';
import {styles} from '../../../css';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid/Grid';
import IconButton from 'material-ui/IconButton';
import Description from 'material-ui-icons/Description';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import {Button, TextField} from 'material-ui';
import {FormGroup, FormControlLabel, FormControl} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import EnhancedInboundTableHead from '../extComps/tableHead';
import WarningDialog from '../../../../components/warningDialog';
import {makeBreadcrumbs} from '../../../reusableFunc';
import UserLinearProgress from '../../../UserLinearprogress';
import {connect} from 'react-redux';

class PrealertEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unBagActive: false,
      bagCode: '',
      manifestData: {},
      loading: false,
      bagList: [],
      errMsg: '',
      manifestList: [],
      emptyValDialog: false,
      bagCount: 0,
      lockBtn: 0
    };
    this.handleModal = this.handleModal.bind(this);
  }
  componentDidMount() {
    if (this.state.loading) {
      return;
    }
    this.setState({
      loading: true,
    });
    if (_.get(this.props, 'id', 'scan') !== 'scan') {
      fetch(`http://coreapi1.skyware.systems/api/manifest/${_.get(this.props, 'id', 0)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json(),
      ).then((data) => {
          this.setState({
            manifestData: _.get(data, 'data', {}),
             bagCount: _.sumBy(_.get(data,'data.manifest_detail', []), (bag) => (
                _.get(bag, 'is_received', '0') === '1'
            ) ? 1 : 0),
            loading: false,
          });
          var ttl_bag = _.get(data,'data.manifest_detail',[]);
          if(this.state.bagCount == ttl_bag.length){
            this.setState({ lockBtn : 1 });
          }
          console.log(this.state.manifestData);
        },
      ).catch((err) => {
        this.setState({
          loading: false,
          errMsg: 'There was an error fetching data.',
        });
        console.log(err);
      });
    }
  }
  toggleCheckBox(e, isChecked) {
    this.setState({
      unBagActive: isChecked,
    });
  }
  handleModal = (key) => {
    return this.setState({[key]: !this.state[key]});
  };
  handleSubmit(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (this.state.loading) {
      return;
    }
    this.setState({
      loading: true,
      errMsg: '',
    });
    let {bagList,bagCode} = this.state;
    if(bagList.length > 0){
       if(_.findIndex(bagList,function(o){return o.bag_no == bagCode;} ) !== -1){
          this.setState({
            loading: false,
            bagCode: '',
            errMsg: '',
            emptyValDialog: true,
            errortext: 'Duplicate Bag No Detected!'
          });
          return false;
        }
    }
    

    let formData = new FormData();
    formData.append('n', sessionStorage.getItem('userNodeId'));
    formData.append('bag_no', this.state.bagCode);
    formData.append('manifest_id', this.props.id);
    formData.append('auto_unbag', this.state.unBagActive ? 1 : 0);
    fetch('http://coreapi.skyware.systems/api/manifest/receive', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json()).then((data) => {
      let {bagList} = this.state;
      let bagInfo = _.filter(_.get(data, 'data', []), (bag) => (bag.bag_no === this.state.bagCode));
      let newBagList = [];
      if (_.findIndex(bagList, (item) => item.id === _.first(bagInfo).id) > -1) {
        newBagList = _.map(bagList, (obj) => _.find(bagInfo, (o) => o.id === obj.id) || obj);
      } else {
        newBagList = bagList;
        newBagList.push(_.first(bagInfo));
      }
      if(data.status.code == 200 || data.status.code == 201){
        this.setState({
          bagList: newBagList,
          loading: false,
          bagCode: '',
          errMsg: '',
          bagCount: _.sumBy(_.get(data,'data', []), (bag) => (
                _.get(bag, 'is_received', '0') === '1'
            ) ? 1 : 0),
        });
       var ttl_bag = this.state.manifestData.manifest_detail;
        if(this.state.bagCount == ttl_bag.length){
          this.setState({ lockBtn : 1 });
        }
      } else {
        this.setState({
          bagList: [],
          loading: false,
          bagCode: '',
          errMsg: '',
          emptyValDialog: true,
          errortext: data.status.description
        });
      }
    }).catch(() => {
      this.setState({
        loading: false,
        //errMsg: 'There was an error fetching data.',
        bagCode: '',
        emptyValDialog: true,
        errortext: 'There was an error fetching data.'
      });
    });
  }
  handleScan(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    let formData = new FormData();
    formData.append('n', sessionStorage.getItem('userNodeId'));
    formData.append('bag_no', this.state.bagCode);
    formData.append('auto_unbag', this.state.unBagActive ? 1 : 0);
    fetch('http://coreapi.skyware.systems/api/manifest/receive/scan', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json()).then((data) => {
      let {bagList, manifestList} = this.state;
      let bagInfo = _.filter(_.get(data, 'data', []), (bag) => (bag.bag_no === this.state.bagCode));
      let manifestInfo = _.get(_.first(bagInfo), 'manifest', {});
      let newBagList = [];
      let newManifestList = [];
      // if (_.findIndex(manifestList, (item) => item.id === manifestInfo.manifest_id) > -1) {
      //   newManifestList = _.map(manifestList, (obj) => _.find(bagInfo, (o) => o.manifest.manifest_id === obj.manifest_id) || obj);
      // } else {
      //   newManifestList = manifestList;
      //   newManifestList.push(manifestInfo);
      // }
      if (_.findIndex(bagList, (item) => item.id === _.first(bagInfo).id) > -1) {
        newBagList = _.map(bagList, (obj) => _.find(bagInfo, (o) => o.id === obj.id) || obj);
      } else {
        newBagList = bagList;
        newBagList.push(_.first(bagInfo));
      }
      if(data.status.code == 200 || data.status.code == 201){
        this.setState({
          bagList: newBagList,
          loading: false,
          bagCode: '',
          errMsg: '',
        });
      } else {
        this.setState({
          bagList: [],
          loading: false,
          bagCode: '',
          errMsg: '',
          emptyValDialog: true,
          errortext: data.status.description
        });
      }
    }).catch(() => {
      this.setState({
        loading: false,
        //errMsg: 'There was an error fetching data.',
        bagCode: '',
        emptyValDialog: true,
        errortext: 'There was an error fetching data.'
      });
    });
  }
  renderToolbar() {
    let { lockBtn } = this.state;
    return (
      <Toolbar>
        <div>
          <Typography type="subheading"><strong>List of Bags</strong></Typography>
        </div>
          <FormGroup row spacing={24} style={{marginLeft: '30%'}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.unBagActive}
                  onChange={(e, isChecked) => this.toggleCheckBox(e, isChecked)}
                  disabled={lockBtn}
                />
              }
              label="Auto Un-Bag"
            />
          </FormGroup>
      </Toolbar>
    );
  }
  handleChange(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  renderListTableHead() {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            No
          </TableCell>
          <TableCell>
            Bag
          </TableCell>
          <TableCell>
            Weight (kg)
          </TableCell>
          <TableCell>
            Total Connote
          </TableCell>
          <TableCell>
            Destination
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
  renderManifestTableHead() {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            SMU
          </TableCell>
          <TableCell>
            Bag
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
  render() {
    const {handleModal} = this;
    const {classes, match, location} = this.props;
    const {manifestData, bagList, loading, emptyValDialog,errortext,bagCount,lockBtn} = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.headerWrapper}>
          <div className={classes.pageTitle}>
            <div className={classes.breadCrumbs}>
              Inbound / Pre-alert Inbound /
              <span className={classes.transactionBreadcrumbs}> Manifest { this.props.id !== 'scan' ? `#${_.get(manifestData, 'manifest_no', '')}` : ''}</span>
            </div>
            <br />
            <p className={classes.titleWrapper}>Manifest {this.props.id !== 'scan' ? `#${_.get(manifestData, 'manifest_no', '')}` : ''}</p>
          </div>
        </div>
        <div>
          <Grid container spacing={24}>
            <Grid item xs={8}>
              <Paper className={classes.formWrapper}>
                {this.renderToolbar()}
                <Toolbar>
                  <FormControl className={classNames(classes.margin, classes.textField)}>
                    <form onSubmit={(e) => this.props.id !== 'scan' ? this.handleSubmit(e) : this.handleScan(e)}>
                      <InputLabel htmlFor="adornment-password">Masukkan kode bag/connote</InputLabel>
                      <Input
                        id="code"
                        type="text"
                        name="bagCode"
                        style={{width: '80%'}}
                        value={this.state.bagCode}
                        autoFocus={true}
                        onChange={(e) => this.handleChange(e)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <Description />
                            </IconButton>
                          </InputAdornment>
                        }
                        disabled={lockBtn}
                      />
                    </form>
                  </FormControl>
                </Toolbar>
                {
                  (!this.state.loading && this.state.errMsg !== '') &&
                  (
                    <Toolbar style={{color: '#FF0000'}}>
                      {this.state.errMsg}
                    </Toolbar>
                  )
                }
                {/*<EnhancedTableToolbar numSelected={selected.length} handleSearch={(e) => this.handleSearch(e)} value={this.state.searchValue}  handleChange={(e) => this.handleChange(e)} match={match}/>*/}
                {
                  (!_.isEmpty(this.state.bagList)) &&
                  (
                    <div className={classes.tableWrapper}>
                      {(loading) && (<UserLinearProgress />)}
                      <Table className={classes.table} style={{marginTop: '30px'}}>
                        {this.renderListTableHead()}
                        <TableBody>
                          {
                            _.map(bagList, (n, key) => {
                              if(n !== undefined){
                                return (
                                  <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={key}
                                  >
                                    <TableCell padding="none">{key + 1}</TableCell>
                                    <TableCell padding="none">{_.get(n, 'bag_no', '')}</TableCell>
                                    <TableCell padding="none">{_.get(n, 'total_weight', '')}</TableCell>
                                    <TableCell padding="none">{_.get(n, 'total_connote', '')}</TableCell>
                                    <TableCell padding="none">{_.get(n, 'bag_destination', '')}</TableCell>
                                  </TableRow>
                                );
                              }
                            })
                          }
                        </TableBody>
                      </Table>
                    </div>
                  )
                }
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.formWrapper}>
                <Toolbar>
                  <Typography type="subheading"><strong>Manifest Information</strong></Typography>
                </Toolbar>
                {/*<EnhancedTableToolbar numSelected={selected.length} handleSearch={(e) => this.handleSearch(e)} value={this.state.searchValue}  handleChange={(e) => this.handleChange(e)} match={match}/>*/}
                <div className={classes.tableWrapper}>
                  {/*<UserLinearProgress />*/}
                  <Table className={classes.table}>
                    {(this.props.id !== 'scan') && this.renderManifestTableHead()}
                    {
                      (this.props.id !== 'scan') &&
                      (
                        <TableBody>
                          <TableRow
                            hover
                            tabIndex={-1}
                          >
                            <TableCell padding="none">{_.get(manifestData, 'manifest_no', '')}</TableCell>
                            <TableCell padding="none">{`${bagCount}/${_.get(manifestData, 'manifest_detail', []).length}`}</TableCell>
                          </TableRow>
                        </TableBody>
                      )
                    }
                  </Table>
                </div>
              </Paper>
            </Grid>
            {emptyValDialog && (
              <WarningDialog
                text={errortext}
                open={emptyValDialog}
                handleModal={() => handleModal('emptyValDialog')}
              />
            )}
            <Toolbar style={{width: '100%', textAlign: 'right', display: 'block'}}>
              <Button
                variant="raised"
                dense="false"
                color="primary"
                component={Link}
                style={{marginTop: '20px'}}
                to={'/inbound/prealert'}
              >
                {`< Back`}
              </Button>
            </Toolbar>
          </Grid>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    node: state.node,
  };
}
export default connect(mapStateToProps)(withStyles(styles)(PrealertEdit));
