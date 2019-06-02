import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FormControlLabel, FormLabel,
  Radio, Drawer, Select, MenuItem, Divider,
  TextField, withStyles, Grid, Paper, Typography, Button, Chip, Dialog, DialogTitle, DialogActions, FormControl, Input, InputLabel, GridList, GridListTile, } from 'material-ui';
import {getTransaction} from '../../../actions/transcationAction';
import KodePosTo from '../../Home/extComps/DestinationCard/fields/kodePosTo';
import UserLinearprogress from '../../UserLinearprogress';
import {voidTransaction} from '../../../actions/transcationAction';
import {styles} from '../../css';
class Transaction extends Component {
  state = {
    currentConnote: 0,
  };
  componentDidMount = () => {
    this.props.id && this.props.getTransaction(this.props.id);
  }
  componentWillReceiveProps = (nextprops) => {
    if (this.props.transaction) {
      /**
       * In case we are viewing second connote and user have asked to void this,
       * we will reset currentconnote to last available connote in the transaction to display
       */
      if (this.state.currentConnote >= nextprops.transaction.connotes.length) {
        this.setState({currentConnote: nextprops.transaction.connotes.length - 1});
      }
    }
  }
  handlePackageChange = (event) => {
    this.setState({currentConnote: event.target.value});
  }
  voidConnot = (event) => {
    const connote = this.props.transaction.connotes[this.state.currentConnote];
    this.props.voidTransaction(this.props.id, connote.connote_id);
  }
  printConnot = (event) => {
    const connote = this.props.transaction.connotes[this.state.currentConnote];
    window.open(
      'http://coreapi.skyware.systems/connote/' + connote.connote_number + '/label',
      'barcode',
      'toolbar=0,status=0,width=548,height=325',
    );
  }
  getView() {
    const {currentConnote} = this.state;
    const {handlePackageChange} = this;
    const {classes, transaction} = this.props;
    const {transaction_id, transaction_number, connotes} = this.props.transaction;
    const connote = connotes[currentConnote] || null;

    return (
      <div className={classes.root}>
        <div className={classes.pageTitle}>
          <div className={classes.breadCrumbs}>
            Point Of Sales / Transcation / { transaction_id || '...'}
          </div>
          <br />
          <p className={classes.titleWrapper}> { transaction_number || '...'} </p>
          <Input
            placeholder="Masukkan kode booking"
            name="kodeBooking"
            className={classes.kodeBooking}
          />
        </div>
        {
          connote ?
        <div className={classes.mainContainer}>
          <Grid container className={classes.rootGrid} spacing={0}>
            <Grid item xs={4}>
              <Grid container spacing={24} className={classes.cards}>
                <Grid item>
                  <Paper className={classes.originPaper}>
                    <GridList cols={2} cellHeight="auto">
                      <GridListTile cols={1}>
                        <Typography type="headline" className={classes.cardTitle}>Origin</Typography>
                      </GridListTile>
                    </GridList>
                    <TextField readOnly disabled value={connote.from_name} className={classes.inputField} label="Name Pengirim" />
                    <TextField readOnly disabled value={connote.from_phone} className={classes.inputField} label="Telepon Pengirim"  />
                    <TextField readOnly disabled value={connote.from_street_address} className={classes.inputField} label="Alamat Pengirim"  />
                    <TextField readOnly disabled value={connote.from_zip_code} className={classes.inputField} label="Kode Pos"  />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container className={classes.cards} spacing={24}>
                <Grid item>
                  <Paper className={classes.destinationPaper}>
                    <GridList cols={2} cellHeight="auto">
                      <GridListTile cols={1}>
                        <Typography type="headline" className={classes.cardTitle}>Destination</Typography>
                      </GridListTile>
                    </GridList>
                    <TextField readOnly disabled value={connote.to_name} label="Nama Penerima" className={classes.inputField}  />
                    <TextField readOnly disabled value={connote.to_phone} label="Telepon Penerima" className={classes.inputField}  />
                    <TextField readOnly disabled value={connote.to_street_address} label="Alamat Pengirim" className={classes.inputField}  />
                    <TextField readOnly disabled value={connote.to_administrative_address} label="Kelurahan / Kecamatan / Kota / Kode Pos" className={classes.inputField} />
                    <Grid container spacing={0} style={{width: 350}} className={classes.inputField}>
                      <Grid item md={6}>
                        <FormControl style={{marginRight: 10}}>
                          <TextField readOnly disabled value={connote.to_zip_code || ''} label="Kode Pos" />
                        </FormControl>
                      </Grid>
                      <Grid item md={6}>
                        <FormControl>
                          <TextField readOnly disabled value={connote.to_tariff_code || ''} label="Kode Tujuan" />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container className={classes.cards} spacing={24}>
                <Grid item>
                  <Paper className={classes.otherPaper}>
                    <Typography className={classes.cardTitle} type="headline"> Other Information</Typography>
                    <GridList cols={2} cellHeight="auto">
                      <GridListTile>
                        <div>
                          <TextField readOnly disabled value={connote.description || ''} label="Deskripsi Barang" className={classes.inputField} />
                          <FormControl className={classes.inputField}>
                            <FormLabel className={classes.radioLabel}>Service</FormLabel>
                            <FormControlLabel value={connote.service_code}
                              label={connote.service_code}
                              control={
                                <Radio
                                  inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                  }}
                                  checked={true}
                                />
                              }

                            />
                          </FormControl>
                          {/*<BlptBtn
                            gridListBlpt={classes.gridListBlpt}
                            koli={koli[0]}
                            blpt={classes.blpt}
                            handleChange={handleChange}
                            inputLabelFocused={classes.inputLabelFocused}
                            inputInkbarFocused={classes.inputInkbarFocused}
                            idx={0}
                            readOnly={readOnly}
                          />
                          <Pcs
                            text={leftSide[3]}
                            {...this.props}
                            koli={koli}
                            weightIcon={weightIcon}
                            remarksLabel={remarksLabel}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />*/}
                        </div>
                      </GridListTile>
                      <GridListTile>
                        <TextField readOnly disabled value={connote.amount_insurance || ''} label="Insured Value" className={classes.inputField} />
                        <TextField readOnly disabled value={connote.remarks || ''} label="Remarks" className={classes.inputField} />
                      </GridListTile>
                    </GridList>
                  </Paper>
                </Grid>
              </Grid>
              <Button
                variant="raised"
                color="primary"
                className={classes.finishRaisedBtn}
                onClick={this.voidConnot}
              >Void</Button>
              <Button
                variant="raised"
                color="primary"
                className={classes.finishRaisedBtn}
                onClick={this.printConnot}
              >Print</Button>
            </Grid>
          </Grid>

          <Drawer variant="permanent" classes={{paper: classes.drawerPaper}}anchor="right">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="package-length">{`${connotes.length} Package (s)`}</InputLabel>
              <Select className={classes.packageSelect} value={currentConnote} onChange={handlePackageChange} >
                {connotes.length > 0 ? (
                  connotes.map((item, index) => (
                    <MenuItem name={index} value={index} classes={{root: classes.menuItem}} key={index}>
                      <div key={index}>
                        <span>To:<strong>{item.to_name}</strong>{' '} | {item.to_zip_code}</span>
                        <br />
                        <span>{item.service_code} | Rp.{' '}{item.amount_price}</span>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>You have no package</MenuItem>
                )}
              </Select>
            </FormControl>
            <GridList cols={2} cellHeight="auto" style={{marginTop: 10}} classes={{root: classes.rightDrawerGrid}}>
              <GridListTile cols={1.2} >
                <label className={classes.rightDrawerSummaryItem}>Actual Weight</label>
              </GridListTile>
              <GridListTile cols={0.8}>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                  {connote.actual_weight + ' Kg'}
                </label>
              </GridListTile>
            </GridList>
            <GridList cols={2} cellHeight="auto">
              <GridListTile cols={1.2}>
                <label className={classes.rightDrawerSummaryItem}>Volume Weight</label>
              </GridListTile>
              <GridListTile cols={0.8}>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                  {0 + ' Kg'}
                </label>
              </GridListTile>
            </GridList>
            <GridList cols={2} cellHeight="auto">
              <GridListTile cols={1.2}>
                <label className={classes.rightDrawerSummaryItem}>Chargeable Weight</label>
              </GridListTile>
              <GridListTile cols={0.8}>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                  {connote.chargeable_weight + ' Kg'}
                </label>
              </GridListTile>
            </GridList>
            <Divider className={classes.divider} />
            <GridList cols={2} cellHeight="auto" style={{marginTop: 10}} >
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem}>Biaya Kirim</label>
              </GridListTile>
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                  Rp { connote.amount_price || 0 }
                </label>
              </GridListTile>
            </GridList>
            <GridList cols={2} cellHeight="auto">
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem}>Surcharges</label>
              </GridListTile>
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                  Rp {connote.amount_surcharge || 0 }
                </label>
              </GridListTile>
            </GridList>
            <GridList cols={2} cellHeight="auto">
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem}>
                  {'Asuransi'}
                </label>
              </GridListTile>
                <GridListTile>
                  <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                    Rp {connote.amount_insurance || 0}
                  </label>
              </GridListTile>
            </GridList>
          {/*<GridListTile cols={2}>
            <GridList cols={2} cellHeight="auto">
              <GridListTile>
                  <label
                    className={classes.tariffSummary}
                  >
                    Adm. Asuransi
                  </label>
                </GridListTile>
                <GridListTile>
                  <label
                    className={classes.tariffSummary}
                    style={{float: 'right', marginRight: 10}}
                  >
                    Rp {this.state.insurance ? 5000 : 0}
                  </label>
              </GridListTile>
            </GridList>
          </GridListTile>
              */}
            <GridList cols={2} cellHeight="auto">
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem}>Total Biaya</label>
              </GridListTile>
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                  Rp {connote.amount_price}
                </label>
              </GridListTile>
            </GridList>
            <Divider className={classes.divider} />
            <GridList cols={2} cellHeight="auto" style={{marginTop: 10}} >
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem}>Grand Total</label>
              </GridListTile>
              <GridListTile>
                <label className={classes.rightDrawerSummaryItem} style={{float: 'right', marginRight: 10}}>
                Rp {transaction.total_amount.total_tariff}
                </label>
              </GridListTile>
            </GridList>
          </Drawer>
        </div>
        : <div>No Connotes</div>
        }
    </div>
    );
  }
  render() {
    const {currentConnote} = this.state;

    return (
      <div className={this.props.classes.root}>
      {
        !this.props.transaction
        ?
         <UserLinearprogress />
        :
        this.getView()
      }
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTransaction: (id) => dispatch(getTransaction(id)),
    voidTransaction: (t,c) => dispatch(voidTransaction(t,c)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Transaction));
