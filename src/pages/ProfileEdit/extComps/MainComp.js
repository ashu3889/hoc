import React from 'react';
import {Grid, withStyles, Hidden} from 'material-ui';
import ProfileEditCard from './ProfileEditCard';
const Styles = (theme) => ({
  rootGrid: {
    flexGrow: 1,
  },
  root: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
  },
  paper: {
    width: "100%",
    display:" inline",
  },
  cards:{
    display:" inline",
  }
});
const MainHomeComp = (props) => {
  const {
    classes,
    handleSearch,
    almtPenerimaReducer,
    BASE_API,
    almtPenerimaChecker,
    kodePosFunc,
    readOnly,
    handleFocusSearch,
    handleBlurSearch,
  } = props;
  const {
    setInputDestination,
    setInputOrigin,
    setInputOtherInfo,
    removeSurchargeItem,
  } = props.store;
  const {
    originReducer,
    destReducer,
    otherInfoReducer,
    allReducer,
  } = props.privateData;

  console.log("props.store   ", props.store);
  return (
    <div className={classes.root}>
      <Grid container className={classes.rootGrid} spacing={0}>
        <Grid item  xs={12}>
          <Grid container spacing={24} className={classes.cards}>
            <Grid  item>
              <ProfileEditCard
                setInputOrigin={setInputOrigin}
                privateData={originReducer}
                allReducer={allReducer}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={4}>
          <Grid container className={classes.cards} spacing={24}>
            <Grid item>
              <DestinationCard
                setInputDestination={setInputDestination}
                privateData={destReducer}
                handleSearch={handleSearch}
                handleFocusSearch={handleFocusSearch}
                handleBlurSearch={handleBlurSearch}
                almtPenerimaReducer={almtPenerimaReducer}
                almtPenerimaChecker={almtPenerimaChecker}
                kodePosFunc={kodePosFunc}
                allReducer={allReducer}
                readOnly={readOnly}
              />
            </Grid>
          </Grid>
        </Grid> */}
        {/* <Grid item xs={6}>
          <Grid container className={classes.cards} spacing={24}>
            <Grid item>
              <OtherCard
                setInputOtherInfo={setInputOtherInfo}
                readOnly={readOnly}
                privateData={otherInfoReducer}
                removeSurchargeItem={removeSurchargeItem}
                almtPenerimaReducer={almtPenerimaReducer}
                BASE_API={BASE_API}
                allReducer={allReducer}
              />
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>

      {/*Mobile*/}
      <Hidden smUp>
        <Grid
          container
          className={classes.rootGrid}
          spacing={16}
          justify="center"
        >
          <Grid item md={4}>
            <Grid container spacing={0}>
              <Grid item>
                <ProfileEditCard
                  setInputOrigin={setInputOrigin}
                  privateData={originReducer}
                  readOnly={readOnly}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item md={4}>
            <Grid container className={classes.cards} spacing={0}>
              <Grid item>
                <DestinationCard
                  readOnly={readOnly}
                  setInputDestination={setInputDestination}
                  privateData={destReducer}
                  almtPenerimaReducer={almtPenerimaReducer}
                />
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid item md={6}>
            <Grid container className={classes.cards} spacing={0}>
              <Grid item>
                <OtherCard
                  readOnly={readOnly}
                  setInputOtherInfo={setInputOtherInfo}
                  privateData={otherInfoReducer}
                  removeSurchargeItem={removeSurchargeItem}
                  almtPenerimaReducer={almtPenerimaReducer}
                />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Hidden>
    </div>
  );
};
export default withStyles(Styles)(MainHomeComp);
