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
} from 'material-ui';

import {
  TableHead,
  TableBody,
  TableTitle,
  TableFooter,
} from '../../../../components/Table';
import ConfirmationModalDialog from '../../../../components/ConfirmationModalDialog';

import {columnList} from '../contants';
import {DEFAULT_ROWS_PER_PAGE} from '../../../../components/Table/TableFooter';

import type {Item} from '../../../../data/inventoryBagging/InventoryBagging-type';
import type {BagItemType} from '../../../../data/bag/Bag-type';

type Props = {
  data: Array<Item>,
  service: ?string,
  destination: ?string,
  onNextPress: () => void,
};

type State = {
  rowsPerPage: number,
  activePage: number,
  isConfirmationDialogOpened: boolean,
};

export default class InventoryBaggingItemListTable extends React.Component<
  Props,
  State,
> {
  state = {
    rowsPerPage: DEFAULT_ROWS_PER_PAGE,
    activePage: 0,
    isConfirmationDialogOpened: false,
  };

  render() {
    let {data, service, destination, onNextPress, status, handleBack} = this.props;
    let {rowsPerPage, activePage, isConfirmationDialogOpened} = this.state;
    return (
      <Paper style={{padding: 40, marginTop: 20}}>
        <View style={{flexDirection: 'row'}}>
          <Typography
            variant="title"
            align="center"
            style={{justifyContent: 'center'}}
          >
            Bagging
          </Typography>
          <View style={{flex: 1, alignItems: 'center'}}>
            <div>
              {service && (
                <Typography variant="headline" style={{marginBottom: 5}}>
                  Service: {service}
                </Typography>
              )}
              {destination && (
                <Typography variant="headline">
                  Destination: {destination}
                </Typography>
              )}
            </div>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            {/* <View style={{alignItems: 'flex-end', marginHorizontal: 10}}>
              <Typography
                variant="title"
                style={{fontSize: 30, fontType: 'bold'}}
                align="center"
              >
                50
              </Typography>
              <Text>Actual Weight (KG)</Text>
            </View> */}
            <View style={{alignItems: 'flex-end', marginHorizontal: 10}}>
              <Typography
                variant="title"
                style={{fontSize: 30, fontType: 'bold'}}
                align="center"
              >
                {data.length}
              </Typography>
              <Text>Bagged</Text>
            </View>
          </View>
        </View>

        <Table style={{tableLayout: 'auto'}}>
          <TableHead columnList={columnList} />
          <TableBody
            data={data}
            render={({connote,value_number, type}, index) => {
              //console.log(connote);
              return (
                <TableRow key={value_number}>
                  <TableCell style={{width: 50}}>{index + 1}</TableCell>
                  <TableCell>{value_number}</TableCell>
                  <TableCell>{connote ? connote.to_tariff_code.substring(0, 4) : '-'}</TableCell>
                  <TableCell>{connote ? connote.service_code : '-'}</TableCell>
                  <TableCell>
                    <Label type={type} />
                  </TableCell>
                </TableRow>
              );
            }}
          />
          <TableFooter
            rowsPerPage={rowsPerPage}
            activePage={activePage}
            dataLength={data.length}
            onChangePage={(activePage: number) => {
              this.setState({activePage});
            }}
            onChangeRowsPerPage={(rowsPerPage) => {
              this.setState({rowsPerPage, activePage: 0});
            }}
          />
        </Table>
        <div style={{width: '100%'}}>
          {
            status === 0 &&
            <Button style={{float: 'right', marginLeft: 10}} onClick={this._openDialog} variant="raised" color="primary">
              SEALED
            </Button>
          }
          <Button style={{float: 'right'}} onClick={handleBack} variant="raised" color="primary">Back</Button>

        </div>
        <ConfirmationModalDialog
          isOpen={isConfirmationDialogOpened}
          title="Confirmation"
          content="Are you sure you want to close this bag?"
          onClose={this._closeDialog}
          cancelButtonAction={this._closeDialog}
          confirmButtonAction={() => {
            onNextPress();
          }}
          autofocusButton="cancel"
        />
      </Paper>
    );
  }

  _closeDialog = () => {
    this.setState({isConfirmationDialogOpened: false});
  };
  _openDialog = () => {
    this.setState({isConfirmationDialogOpened: true});
  };
}

type LabelProps = {
  type: BagItemType,
};

function Label(props: LabelProps) {
  let {type, ...otherProps} = props;
  let style = {padding: 10};
  let content;
  if (type === 'CON') {
    style = {
      ...style,
      backgroundColor: '#009688',
    };
    content = <Text style={{color: 'white'}}>Connote</Text>;
  } else if (type === 'BAG') {
    style = {
      ...style,
      backgroundColor: '#CDDC39',
    };
    content = <Text>Bag</Text>;
  }
  return (
    <View style={{alignItems: 'flex-start'}}>
      <View style={style} {...otherProps}>
        {content}
      </View>
    </View>
  );
}
