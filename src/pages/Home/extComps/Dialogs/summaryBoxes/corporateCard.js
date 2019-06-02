import React from 'react';
import {Paper, Divider, TextField, GridList, GridListTile} from 'material-ui';

const Styles = {
  cardTitle: {
    height: 250,
    backgroundColor: '#F1F4F5',
    boxShadow: 'none',
    borderRadius: 0,
    border: '1px solid #95989A',
    padding:'10px 20px',
  },
};
const CorporateCard = (props) => {
  const {methodData, classes, summaryHandler} = props;
  return (
    <Paper style={Styles.cardTitle}>
      <GridList cols={2} cellHeight="auto" classes={{root: classes.listRoot}}>
        <GridListTile cols={1}>
          <p>Corporate ID</p>
        </GridListTile>
        <GridListTile cols={1}>
          <TextField name="corporate_id" className={classes.cardLabel} />
        </GridListTile>
      </GridList>
    </Paper>
  );
};

export default CorporateCard;
