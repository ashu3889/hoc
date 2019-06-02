export const styles = (theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    //margin:'auto 60',

    // width: '95%',
    // minHeight: '40%',
    // margin: '1% 3.8% 2.3% 3.8%',
    flex: '1 1 0%',
    paddingRight: 60,
    paddingLeft: 60,
  },
  paperBg: {
    backgroundColor: theme.palette.background.paper,
  },
  join_widgets: {
    // height: '520px',
    display: 'flex',
  },
  body1: {
    fontSize: '1.2rem',
    paddingLeft: '20px',
  },
  bodyTitleText: {
    fontSize: '1.2rem',
  },
  button: {
    margin: theme.spacing.unit,
  },
  card: {
    marginTop: theme.spacing.unit * 3,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  flex: {
    flex: 1,
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: '10   px solid #ececec',
      },
    },
  },
  headerWrapper: {
    // width: '92%',
    // minHeight: '40%',
    // margin: '-10px auto 10px auto',
  },
  // pageTitle: {
  //   marginBottom: 35,
  //   marginTop: '2%',
  // },
  pageTitle: {
    marginLeft: 24,
    marginBottom:15
  },
  breadCrumbs: {
    float: 'left',
    color: '#323990',
    fontSize: 14,
  },
  transactionBreadcrumbs: {
    color: 'black',
    margin: 0,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  titleWrapperTitles: {
    flex: '0 0 auto',
    padding: '2% 1%',
    textTransform: 'capitalize',
  },
  titleWrapper: {
    fontSize: window.innerWidth >= 1024 ? 26 : 15,
    fontWeight: 'bold',
    marginTop: window.innerWidth >= 1024 ? 0 : 2,
    marginBottom: 0,
    textTransform: 'capitalize',
  },
  buttonAction: {
    float: 'right',
    width: '8.5%',
    bottom: 10
  },
  formWrapper: {
    padding: 30,
    width: '100%',
    textTransform: 'capitalize',
  },
  gridWrapper: {
    margin:'auto 40',
  },
  marginContainer:{
    marginTop:30
  },
  textField: {
    /*marginLeft: theme.spacing.unit,
     marginRight: theme.spacing.unit,*/
    marginTop: 37,
    marginBottom: 0,
    width: '100%',
    maxWidth: 600,
  },
  textField2: {
    /*marginLeft: theme.spacing.unit,
     marginRight: theme.spacing.unit,*/
    marginTop: 37,
    marginBottom: 0,
    width: '80%',
    maxWidth: 500,
  },
  textField3: {
    /*marginLeft: theme.spacing.unit,
     marginRight: theme.spacing.unit,*/
    marginTop: 37,
    marginBottom: 0,
    width: '100%',
  },
  chipWrapper: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    flexDirection: 'reverse',
  },
  menu: {
    top: 0,
    width: 200,
  },
  prefferedWrapper: {
    width: '100%',
    marginTop: theme.spacing.unit * 4,
  },
  prefferedTitle: {
    float: 'left',
    width: '50%',
  },
  prefferedBtn: {
    marginLeft: theme.spacing.unit * 2,
    float: 'left',
  },
  hours: {
    marginRight: 20,
    width: 150,
  },
  minutes: {
    width: 150,
  },
  serviceTextField: {
    // marginLeft: theme.spacing.unit * 17,
    // marginRight: theme.spacing.unit,
    top: theme.spacing.unit + 3,
    //width: 200,
    width: '80%',
    maxWidth: 500,
    // float: 'right'
  },
  maxWeight: {
    marginLeft: theme.spacing.unit * 17,
    // float: 'right',
  },
  packingkayuStatusCount: {

  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  chip: {
  margin: 4,
  // paddingLeft: 2,
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },

    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },

    typography:{
      fontSize:20,
      padding:0,
    },

  noPadding: {
    padding: 0,
  },

  voidColor: {
    color: '#e53935',
  },
  nameWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  nameIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
    marginBottom: 6,
  },
  nameField: {
    marginBottom: 6,
    width: '100%',
    maxWidth: 558,
  },
  rightPart: {
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
  },
  actionsContainer: {
    marginRight: '10%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  scanConnotesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  scanConnotes: {
    marginTop: 37,
    marginBottom: 0,
    maxWidth: 600,
    width: '50%',
  },
  scanConnotesTotal: {
    width: '50%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  runsheetScannedConnotes: {
    minHeight: 400,
  },
  runsheetSubmits: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  pageHeaderWrapper: {
    width: '92%',
    display: 'flex',
    margin: '30px auto',
    justifyContent: 'space-between',
  },
  pageRoot: {
    width: '92%',
    margin: '0 auto 20px',
  },
  pageListToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
