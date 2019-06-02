import React from 'react';
import {GridList, GridListTile} from 'material-ui';
import {getBaseTarif} from '../../../../tariff_engine';
import {getBasePrice} from './surchargeResult';
import {getTotalBasePrice} from './totalResult';
import {intFormatNumber} from '../../../../helpers/formatNumber';

let chargeableWeight = 0;
export let basePrice = 0;

export const chargeableWeightBase = (e) => {
  //
  chargeableWeight = e;
};

const BaseTariff = (props) => {
  const {classes, allReducer, baseTariff, otherInfoReducer} = props;
  const data = otherInfoReducer.serviceData.filter((item) => {
    return item.service_code === otherInfoReducer.service;
  });
  basePrice = data.length ? getBaseTarif(data[0].tarif, chargeableWeight) : 0;
  getBasePrice(basePrice);
  getTotalBasePrice(basePrice);
  sessionStorage.setItem('baseTariff', basePrice);
  sessionStorage.setItem('firstTariff', data.length ? data[0]['tarif']['price_1'] : 0);
  return (
    <GridList cols={2} cellHeight="auto">
      <GridListTile cols={2}>
        <GridList cols={2} cellHeight="auto">
          <GridListTile>
            <label className={classes.tariffSummary}>Biaya Kirim</label>
          </GridListTile>
          <GridListTile>
            <label
              className={classes.tariffSummary}
              style={{float: 'right', marginRight: 10}}
            >
              {basePrice > 0 ? (
                <span style={{color: '#000'}}>Rp {intFormatNumber('en-US', basePrice)}</span>
              ) : (
                `Rp ` + 0
              )}
            </label>
          </GridListTile>
        </GridList>
      </GridListTile>
    </GridList>
  );
};
export default BaseTariff;
