import React, {Component} from 'react';
import {weightIcon} from '../../../../CusIcons/CustomIcons';
import {
  Paper,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  Input,
  InputLabel,
  IconButton,
  Grid,
  GridList,
  GridListTile,
  CircularProgress,
} from 'material-ui';
import {
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';
import LeftSideGrid from './LeftSideGrid';
import SurchargeCheckboxes from './SurchargeCheckboxes';
import {Add, Print} from 'material-ui-icons';
import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import {Toc} from 'material-ui-icons';
import DialogContent from 'material-ui/Dialog/DialogContent';
import InputAdornment from 'material-ui/Input/InputAdornment';
import {getEntityList} from '../../../../actions/entity';
import {reduxForm, Field} from 'redux-form';
import BlptBtn from './blptBtn';
import ReactPaginate from 'react-paginate';

const Styles = (theme) => ({
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3 - 2,
    width: 350,
  },
  inputLabelFocused: {
    color: 'rgb(50, 57, 144)',
    fontSize:12,
  },
  inputLabel: {
    marginLeft: theme.spacing.unit * 3,
  },
  inputInkbarFocused: {
    '&:after': {
      backgroundColor: 'rgb(50, 57, 144)',
    },
  },
  uniqueInputFill: {
    fill: 'rgb(50, 57, 144)',
  },
  remarksBtn: {
    marginTop: 25,
  },
  remarksImgEnabled: {
    width: 24,
    height: 24,
    marginRight: 5,
    marginBottom: 5,
  },
  remarksLabel: {
    fontSize: 13,
  },
  remarksImgDisabled: {
    width: 24,
    height: 24,
    opacity: 0.2,
    marginRight: 5,
    marginBottom: 5,
  },
  RBgroup: {
    margin: '12px 0px 7px 10px',
  },
  stRB: {
    display: 'inline-block',
    width: 100,
  },
  nextRB: {
    display: 'inline-block',
    width: 100,
    marginLeft: 12,
  },
  radioLabel: {
    color: 'rgba(0, 0, 0, 0.46)',
    fontSize: 15,
    marginLeft: 15,
  },
  radioSpacing: {
    marginLeft: 50,
  },
  gridListBlpt: {
    flexGrow: 1,
    maxWidth: '100%',
    flexBasis: 0,
    paddingLeft: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 3 - 2,
  },
  blpt: {
    width: 70,
  },
  dialogWrapper: {
    margin: '23px 30px 23px 30px',
    maxWidth: 411,
  },
  aturDialogWrapper: {
    margin: '23px 30px 23px 30px',
    maxWidth: 950,
    minWidth: 453,
  },
  table: {
    width: 700,
  },
  tableCell: {
    padding: '4px 10px',
  },
  title: {
    fontWeight: 'bold',
    color: '#424242',
    letterSpacing: 0.7,
    padding: '23px 0px 0px 24px',
  },
  formControl: {
    marginTop: 10,
  },
  chipWrapper: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    flexDirection: 'reverse',
  },
  chip: {
    margin: '7px 4px 4px 4px',
  },
  otherPaper: {
    height: '100%',
    borderRadius: 2,
    /*maxWidth: 850,
    marginTop: 47,*/
    padding: 20,
  },
  rightSideTextField: {
    marginLeft: theme.spacing.unit + 5,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3 - 1,
    width: 385,
  },
  additionalSurchargeLabel: {
    fontSize: 13,
  },
  additionalSurchargeBtn: {
    marginTop: theme.spacing.unit + 9,
  },
  radioGroup: {
    /*paddingLeft: 24,
    paddingRight: 24,*/
  },
  tableButton: {
    padding: 0,
  }
});
const leftSide = [
  {name: 'deskripsiBrg', label: 'Deskripsi Barang *', value: ''},
  {name: 'service', label: 'Service *', value: ''},
  {name: 'blpt'},
  {name: 'pcs', label: 'Jumlah *', value: 1,},
  {name: 'single_connote_no', label: 'Single Connote No', value: '',},
  {name: 'pra_connote', label: 'Pra Connote', value: '',},
];

const rightSide = [
  {name: 'insuredVal', label: 'Insured Value', value: 0,},
  {name: 'remarks', label: 'Remarks', value: '',},
];

class OtherInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      openPraConnoteDialog: false,
      openSingleConnoteDialog: false,
      aturBtnCounter: true,
      aturBtnDialog: false,
      searchDrawer: false,
      Chips: [],
      serviceCout: '',
      serviceData: null,
      classes: props.classes,
      surcharges: [],
      temp_surcharges:[],
      currentKoli: null,
      input: null,
      pageCount: 0,
      page: 0,
      rangePage: 10,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleModal = (key) => this.setState({[key]: !this.state[key]});
  
  HandleChips = () => {
    const {classes} = this.props;
    const {adtSurcharge, koli} = this.props.privateData;
    //console.log(koli);
    let surcharges = [];
    /**
     * Overweight
    */
    const overWeight = koli.filter((koliitem) => koliitem.surcharge === 'Overweight');
    //console.log(overWeight);
    // if (overWeight.length) {
    //   surcharges.push({label: 'Overweight', type: 'Overweight', total: overWeight.length, delete: false});
    // }
    /**
     * packingKayu
    */
    const packingKayu = koli.filter((koliitem) => koliitem.packingKayu === true);
    if (packingKayu.length) {
      surcharges.push({label: 'Packing Kayu', type: 'packingKayu', total: packingKayu.length, delete: koli.length === 1});
    }
    /**
     * Other Surcharges
    */
    this.props.surcharges.map((surcharge) => {
      const kolisurcharge = koli.filter((koliitem) => surcharge.surcharge_name === koliitem.surcharge);
      if (kolisurcharge.length) {
        surcharges.push({label: surcharge.surcharge_name, type: 'surcharge', total: kolisurcharge.length, delete: koli.length === 1});
      }
    });
    return surcharges.map((item, index) => (
      <div className={classes.chipWrapper} key={index}>
      {
        item.delete ?
          <Chip onDelete={() => this.handleRequestDeleteSurcharge(this.props.privateData.koli[0], item.type, '', false)}
            className={classes.chip} label={koli.length === 1 ? item.label : item.label + '(' + item.total + ')'}
          />
        :
          <Chip className={classes.chip} label={koli.length === 1 ? item.label : item.label + '(' + item.total + ')'} />
      }
      </div>
    ));
  };
  fireOIaction = async (key, value) => {
    const {setInputOtherInfo} = this.props;
    if (key === 'adtSurcharge') {
      await setInputOtherInfo(key, value);
    } else {
      await setInputOtherInfo(key, value);
      value = '';
      await value;
    }
  };
  handleSubmit = async (key) => {
    (await key) === 'openDialog' ? this.HandleChips() : '';
    await this.setState({[key]: false});
  };
  handleBlur = (e) => {
    let value = e.target.value;
    value = (value === '' || value === '0') ? 1 : value;
    this.fireOIaction('changepcs', value);
    this.fireOIaction('pcs', value);
    this.setState({aturBtnCounter: value > 1 ? false : true});
  }
  handleChange = (e, sd) => {
    switch (e.target.name) {
      case 'berat':
      case 'lebar':
      case 'panjang':
      case 'tinggi':
        ///
        let value = e.target.value.replace(/[^0-9\.]/g, '');
        if (value.split('.').length > 2) {
          value = value.replace(/\.+$/, '');
        }
        return this.fireOIaction(e.target.name, {
          val: value,
          index: sd,
        });
      case 'pk':
        /////
        return this.fireOIaction(e.target.name, e.target.value);
      case 'packingKayu':
      case 'pkType':
      case 'surcharge':
        return this.handleChangeSurcharges(this.props.privateData.koli[0], e.target.name, e.target.value, e.target.checked);
        /*
        if (e.target.value === 'Packing Kayu') {
          this.fireOIaction('pk', '');
        }
        return this.fireOIaction(e.target.name, [e.target.value]);
        */
      case 'service':
        this.setState({serviceCout: e.target.value});
        this.fireOIaction('serviceData', this.props.privateData.serviceData);
        return this.fireOIaction(e.target.name, e.target.value);
      // case 'berat':
      //     return this.fireOIaction(e.target.name, e.target.value)
      case 'pcs':
        let pcs = e.target.value.replace(/[^0-9]/g, '');
        if (pcs < 1000 && pcs > 0) {
          this.setState({aturBtnCounter: pcs > 1 ? false : true});
          this.fireOIaction('changepcs', pcs || 1);
          return this.fireOIaction(e.target.name, pcs);
        } else if(pcs > 999){
          return false
        } else {
          //return false;
          //this.fireOIaction('changepcs', e.target.value || '');
          this.fireOIaction(e.target.name, pcs || '')
        }

      case 'single_connote_no':
      case 'pra_connote':
        let val_con = e.target.value;
        val_con = val_con.replace(/[^0-9]/, '');
        return this.fireOIaction(e.target.name, val_con);

      case 'insuredVal':
        let val = e.target.value;
        val = parseFloat(val) || 0;
        return this.fireOIaction(e.target.name, val);
    }
    return this.fireOIaction(e.target.name, e.target.value);
  };

  actionsModal = (
    <Button
      variant="raised"
      color="primary"
      onClick={() => this.handleSubmit('openDialog')}
      name="adtSurcharge"
    >
      Submit
    </Button>
  );

  
  handleRequestPrintKoli = (koli) => {
    return this.props.handleRequestPrintKoli(koli);
  }
  focusUsernameInputField = (input) => {
    if (input) {
      this.setState({input});
    }
  };
  componentWillReceiveProps(nextProps) {
    rightSide[0].value = parseFloat(nextProps.privateData.insuredVal) || 0;
    rightSide[1].value = nextProps.privateData.remarks || '';

    leftSide[0].value = nextProps.privateData.deskripsiBrg || '';
    leftSide[1].value = nextProps.privateData.service || '';
    leftSide[3].value = nextProps.privateData.pcs || '';
    leftSide[4].value = nextProps.privateData.single_connote_no || '';
    leftSide[5].value = nextProps.privateData.pra_connote || '';
    
    if (nextProps.privateData.focusField === 'deskripsiInput' && this.state.input) {
      setTimeout(() => {this.state.input.focus();}, 100);
    }
    if (this.state.currentKoli) {
      this.setState({currentKoli: nextProps.privateData.koli[this.state.currentKoli.id]});
    }
  }
  handleChg = (n, e) => {
    this.handleChange(e, n.id);
    /*let {localkoli} = this.state;
    localkoli[n.id][e.currentTarget.name] = e.currentTarget.value;
    this.setState({localkoli});*/
  };
  handleCloseSurchargeModal = (event) => {
    return this.setState({openDialog: false, surcharges: [], currentKoli: null});
  }
  onRequestSurchargeModal = (koli) => {
    let {surcharges} = this.props;
    let temp_surcharges = [];
    if (koli.overWeight) {
      temp_surcharges = [{surcharge_name: 'Overweight'}].concat(surcharges);
    } else {
      temp_surcharges = [].concat(surcharges);
    }
    return this.setState({openDialog: true, temp_surcharges: temp_surcharges, currentKoli: koli});
  } 
  handleRequestDeleteSurcharge = (koli, name) => {
    this.props.updateKoliSurcharge(koli, name, '', false);
  }
  handleChangeSurcharges = (e) => {
    this.props.updateKoliSurcharge(this.state.currentKoli, e.target.name, e.target.value, e.target.checked);
  }
  handleRequestPrintKoli = (koli) => {
    this.props.handleRequestPrintKoli(koli);
  }
  handleOpenPraConnoteDialog = () => {
      this.setState({openPraConnoteDialog: !this.state.openPraConnoteDialog});
  };
  handleOpenSingleConnoteDialog = () => {
      this.setState({openSingleConnoteDialog: !this.state.openSingleConnoteDialog});
  };
  handlePageClick = () => {
    console.log('test');
  }

  render() {
    const {HandleChips, RightSideGrid, handleChangeSurcharges, handleRequestPrintKoli, handleChange, handleBlur,
      focusUsernameInputField, onRequestSurchargeModal,handleOpenPraConnoteDialog,handleOpenSingleConnoteDialog
    } = this;
    const {openDialog,openPraConnoteDialog,openSingleConnoteDialog, aturBtnCounter, aturBtnDialog, page, pageCount,
      currentKoli,
      rangePage,
    } = this.state;
    const {
      removeSurchargeItem,
      classes,
      almtPenerimaReducer,
      BASE_API,
      privateData,
      readOnly,
      surcharges,
    } = this.props;
    let {adtSurcharge, pcs, service, pk,single_connote_no,pra_connote, koli, overWeight, focusField, serviceData, loadingService,aturBeratBtn} = this.props.privateData;
    return (
      <Paper className={classes.otherPaper}>
         <Grid container justify="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="headline">
              Other Information
            </Typography>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'right'}}>
            <span style={{marginRight:15}}>
              <a href="javascript:void(0);" onClick={this.handleOpenPraConnoteDialog}>+ Pra Connote</a>  
            </span>
            <span>
              <a href="javascript:void(0);" onClick={this.handleOpenSingleConnoteDialog}>+ Single Connote</a>
            </span>
          </Grid>
        </Grid>
        <GridList cols={2} cellHeight="auto" style={{marginLeft: -15, marginRight: -15}}>
          <GridListTile cols={1} style={{paddingLeft: 15, paddingRight: 15}}>
            <FormControl className={classes.formControl} fullWidth={true} margin="normal">
              <InputLabel htmlFor="focusedInput">{leftSide[0].label}</InputLabel>
              <Input readOnly={readOnly} disabled={readOnly} inputRef={focusUsernameInputField}
                onChange={handleChange} name={leftSide[0].name}
                value={leftSide[0].value} inputProps={{readOnly: readOnly, disabled: readOnly}}
              />
            </FormControl>
            <FormControl className={classes.formControl} fullWidth={true} margin="normal">
              <FormLabel>{leftSide[1].label}</FormLabel>
              <RadioGroup aria-label={leftSide[1].name} name={leftSide[1].name} onChange={this.handleChange}
                value={service} style={{display: 'inline-block'}} className={classes.radioGroup}
              >
              {
                serviceData && serviceData.map((item, index) =>
                  <FormControlLabel key={index} value={item.service_code} label={item.service_code}
                    control={
                      <Radio inputProps={{readOnly: readOnly, disabled: readOnly}} className={classes.uniqueInputFill} checked={service === item.service_code} />
                    }
                  />
              )}
              </RadioGroup>
              {
                loadingService && <CircularProgress className={classes.progress} />
              }
            </FormControl>
            <FormControl className={classes.formControl} fullWidth={true} margin="normal">
              <InputLabel htmlFor="focusedInput" value={rightSide[0].value}>{rightSide[0].label}</InputLabel>
              <Input onChange={handleChange} name={rightSide[0].name} value={rightSide[0].value}
                startAdornment={<InputAdornment position="start">Rp.</InputAdornment>}
                inputProps={{maxLength: 15, readOnly: this.props.readOnly, disabled: this.props.readOnly}}
              />
            </FormControl>
            <FormControl className={classes.formControl} fullWidth={true} margin="normal">
              <InputLabel htmlFor="focusedInput" value={rightSide[1].value}>{rightSide[1].label}</InputLabel>
              <Input onChange={handleChange} name={rightSide[1].name} value={rightSide[1].value}
                inputProps={{readOnly: readOnly, disabled: readOnly}}
              />
            </FormControl>
          </GridListTile>
          <GridListTile cols={1} style={{paddingLeft: 15, paddingRight: 15}}>
            <GridList cols={2}>
              <GridListTile style={{height: 'auto'}}>
                <FormControl className={classes.formControl} fullWidth={true} margin="normal">
                  <InputLabel htmlFor="focusedInput">{leftSide[3].label}</InputLabel>
                  <Input readOnly={readOnly} disabled={readOnly} onChange={handleChange} onBlur={handleBlur} defaultValue={1} 
                    maxLength="1000" name={leftSide[3].name} value={leftSide[3].value}
                    inputProps={{readOnly: readOnly, disabled: readOnly}}
                  />
                </FormControl>
              </GridListTile>
              <GridListTile style={{height: 'auto'}}>
                <Button classes={{root: classes.remarksBtn, label: classes.remarksLabel}} disabled={aturBtnCounter || readOnly} 
                  onClick={() => this.handleModal('aturBtnDialog')} dense="true"
                >
                  <img src={weightIcon} alt="weight" className={!aturBtnCounter ? classes.remarksImgEnabled : classes.remarksImgDisabled} />
                  ATUR BERAT
                </Button>
              </GridListTile>
            </GridList>
            <BlptBtn gridListBlpt={classes.gridListBlpt} koli={koli[0]} blpt={classes.blpt} handleChange={handleChange}
              inputLabelFocused={classes.inputLabelFocused} inputInkbarFocused={classes.inputInkbarFocused} idx={0} 
              readOnly={readOnly || koli.length > 1} hideValues={koli.length > 1}
            />
            <GridList cols={1}>
              <GridListTile style={{height: 'auto'}}>
                <Button classes={{root: classes.additionalSurchargeBtn, label: classes.additionalSurchargeLabel}} 
                  onClick={() => onRequestSurchargeModal(koli[0])} dense="true" disabled={readOnly || koli.length > 1}
                >
                  <Add /> Additional Surcharge <br />
                </Button>
              </GridListTile>
              <GridListTile style={{height: 'auto'}}>
                <HandleChips />
              </GridListTile>
            </GridList>
          </GridListTile>
        </GridList>
        <Dialog
          open={this.state.aturBtnDialog}
          aria-labelledby="aturBtn-title"
          aria-describedby="aturBtn-content"
          classes={{paperWidthSm: classes.aturDialogWrapper}}
        >
          <DialogContent id="aturBtn-content">
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>No.</TableCell>
                  <TableCell className={classes.tableCell}>Berat</TableCell>
                  <TableCell className={classes.tableCell}>Lebar</TableCell>
                  <TableCell className={classes.tableCell}>Panjang</TableCell>
                  <TableCell className={classes.tableCell}>Tinggi</TableCell>
                  <TableCell className={classes.tableCell}>Surcharges</TableCell>
                  <TableCell className={classes.tableCell}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                koli.slice(page * rangePage, page * rangePage + rangePage)
                .map((item, index) =>
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>{ page * rangePage + index + 1}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <Input className={classes.blpt} onChange={this.handleChg.bind(this, item)}
                        name="berat" inputProps={{readOnly: readOnly || item.completed, disabled: readOnly || item.completed}}
                        value={item.berat} endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Input className={classes.blpt} onChange={this.handleChg.bind(this, item)}
                        name="lebar" inputProps={{readOnly: readOnly || item.completed, disabled: readOnly || item.completed}}
                        value={item.lebar} endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Input className={classes.blpt} onChange={this.handleChg.bind(this, item)}
                        name="panjang" inputProps={{readOnly: readOnly || item.completed, disabled: readOnly || item.completed}}
                        value={item.panjang} endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Input className={classes.blpt} onChange={this.handleChg.bind(this, item)}
                        name="tinggi" inputProps={{readOnly: readOnly || item.completed, disabled: readOnly || item.completed}}
                        value={item.tinggi} endAdornment={<InputAdornment position="end">cm</InputAdornment>}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                    {
                      item.packingKayu &&
                        <div className={classes.chipWrapper}>
                          <Chip onDelete={() => this.handleRequestDeleteSurcharge(item, 'packingKayu')} className={classes.chip} label={'Packing Kayu'} />
                        </div>
                    }
                    {
                      item.surcharge && item.surcharge === 'Overweight' &&
                        <div className={classes.chipWrapper}><Chip className={classes.chip} label={item.surcharge} /></div>
                    }
                    {
                      item.surcharge && item.surcharge !== 'Overweight' && <div className={classes.chipWrapper}>
                          <Chip onDelete={() => this.handleRequestDeleteSurcharge(item, 'surcharge')} className={classes.chip} label={item.surcharge} />
                        </div>
                    }
                    </TableCell>
                    <TableCell padding='none' className={classes.tableCell}>
                      <Button
                        classes={{label: classes.additionalSurchargeLabel, root: classes.tableButton}}
                        onClick={() => onRequestSurchargeModal(item)} dense="true" disabled={readOnly}
                      >
                        <Add /> Surcharge
                      </Button>
                    </TableCell>
                  </TableRow>,
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button variant="raised" className={classes.addMoreRaisedBtn}
            onClick={() => {
              /*handleSaveKoli(localkoli);*/
              this.handleModal('aturBtnDialog');
            }}
          >Save</Button>
          <Button variant="raised" className={classes.addMoreRaisedBtn}
            onClick={() => {
              this.handleModal('aturBtnDialog');
            }}
          >Cancel</Button>
          <div id="react-paginate">
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={<a href="">...</a>}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={10}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </div>
        </DialogActions>
      </Dialog>
        <Dialog
          open={openDialog}
          onClose={() => this.handleSubmit('openDialog')}
          aria-labelledby="service-title"
          aria-describedby="service-content"
          classes={{paperWidthSm: classes.dialogWrapper}}
        >
          <DialogTitle id="service-title">Additional Services</DialogTitle>
          <DialogContent id="service-content">
            <SurchargeCheckboxes
              surcharges={this.state.temp_surcharges}
              handleChange={this.handleChangeSurcharges}
              adtReducer={adtSurcharge}
              koli={currentKoli}
              pk={pk}
            />
          </DialogContent>
          <DialogActions>{this.actionsModal}</DialogActions>
        </Dialog>
        <Dialog
          open={openPraConnoteDialog}
          onClose={() => this.handleSubmit('openPraConnoteDialog')}
          aria-labelledby="connote-title"
          aria-describedby="connote-content"
          classes={{paperWidthSm: classes.dialogWrapper}}
        >
          <DialogTitle id="pra-connote-title">Add Pra Connote Number</DialogTitle>
          <DialogContent id="pra-connote-content">
            <FormControl className={classes.formControl} fullWidth={true} margin="normal">
              <InputLabel htmlFor="focusedInput">{leftSide[5].label}</InputLabel>
              <Input readOnly={readOnly} disabled={readOnly}
                onChange={handleChange} name={leftSide[5].name}
                maxLength={15}
                value={leftSide[5].value} inputProps={{readOnly: readOnly, disabled: readOnly,maxLength: 15}}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
                variant="raised"
                color="primary"
                onClick={() => this.handleSubmit('openPraConnoteDialog')}
                name="adtPraConnote"
              >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSingleConnoteDialog}
          onClose={() => this.handleSubmit('openSingleConnoteDialog')}
          aria-labelledby="singleconnote-title"
          aria-describedby="singleconnote-content"
          classes={{paperWidthSm: classes.dialogWrapper}}
        >
          <DialogTitle id="single-connote-title">Add Single Connote Number</DialogTitle>
          <DialogContent id="single-connote-content">
            <FormControl className={classes.formControl} fullWidth={true} margin="normal">
              <InputLabel htmlFor="focusedInput">{leftSide[4].label}</InputLabel>
              <Input readOnly={readOnly} disabled={readOnly}
                onChange={handleChange} name={leftSide[4].name}
                maxLength={15}
                value={leftSide[4].value} inputProps={{readOnly: readOnly, disabled: readOnly,maxLength: 15}}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
                variant="raised"
                color="primary"
                onClick={() => this.handleSubmit('openSingleConnoteDialog')}
                name="adtSingleConnote"
              >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    );
  }
}

 export default withStyles(Styles)(
  reduxForm({
    form: 'OtherInfo',
  })(OtherInfo),
);
