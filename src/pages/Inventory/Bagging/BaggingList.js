// @flow

import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  TextField,
  Typography,
  Paper,
  Table,
  TableRow,
  TableCell,
  Button,
} from 'material-ui';
import {Redirect} from 'react-router';

import Form from '../../../components/core-ui/Form';
import InventoryBaggingItemListTable from './components/InventoryBaggingItemListTable';
import Placeholder from './components/Placeholder';
import {getEntity, postEntity,postJsonEntity, putEntity } from '../../../actions/entity';

import type {
  InventoryBaggingState,
  Bag,
} from '../../../data/inventoryBagging/InventoryBagging-type';
import type {RootState, Dispatch} from '../../../storeTypes';

type Props = InventoryBaggingState & {
  bagID: string,
  nodeID: number,
  onBagConnote: (
    connoteNumber: string,
    nodeID: number,
    activeBag: ?Bag,
  ) => void,
  onCloseNotification: (notificationID: number) => void,
  onNextPress: (activeBag: Bag, nodeID: number) => void,
};

type State = {
  codeTextInput: string,
};

export class BaggingList extends React.Component<Props, State> {
  state = {
    codeTextInput: '',
    serviceState: [],
    bagState: [],
    bagActive: []
  };
  render() {
    var bagList = [];
    var serviceList = [];
    let {
      bagID,
      activeBag,
      baggingItemList,
      onCloseNotification,
      onNextPress,
      onBagConnote,
      service,
      nodeID,
      destination,
    } = this.props;
    this.timeOut = null;
    // if(activeBag){
    //   this.setState({bagDetail:activeBag});
    // }
    let {codeTextInput,bagState,serviceState,bagActive} = this.state;
    /*if (
      (bagID && !activeBag) ||
      (bagID && activeBag && activeBag.bagID !== Number(bagID))
    ) {
      return <Redirect to="/inventory/bagging" />;
    }*/
    return (
      <div style={StyleSheet.flatten(styles.root)}>
      <div>
        <div style={StyleSheet.flatten(styles.pageTitle)}>
          <div style={StyleSheet.flatten(styles.breadCrumbs)}>
            Inventory /
            <span style={StyleSheet.flatten(styles.transactionBreadcrumbs)}> Bagging</span>
          </div>
          <br />
          <p style={StyleSheet.flatten(styles.titleWrapper)}>Bagging</p>
          <View style={{width: '100%'}}>
            <Typography variant="title" style={{marginBottom: 10}}>
              {bagID && activeBag && activeBag.bagID === Number(bagID)
                ? activeBag.bagNumber
                : 'Bagging'}
            </Typography>
            {
              (!activeBag || activeBag.status === 0) &&
              <View style={{flexDirection: 'row'}}>
                <Form onSubmit={this._onFormSubmit}>
                  <TextField
                    id="search"
                    value={codeTextInput}
                    label="Masukan kode BAG / Connote"
                    type="search"
                    onChange={(event) => {
                      this._onCodeTextChange(event.target.value);
                    }}
                    style={{width: 300, marginRight: 20}}
                  />
                  {/*<Button
                    variant="raised"
                    color="primary"
                    onClick={this._onFormSubmit}
                  >
                    Add
                  </Button>*/}
                </Form>
              </View>
            }
          </View>
          <View style={{flex: 1}}>
            {bagID && activeBag && activeBag.bagID === Number(bagID) ? (
              <InventoryBaggingItemListTable
                data={bagActive}
                service={serviceState.join()}
                destination={bagState.join()}
                status={activeBag.status}
                handleBack={this._handleBack}
                onNextPress={() => {
                  activeBag && onNextPress(activeBag, nodeID);
                }}
              />
            ) : (
              <Placeholder />
            )}
          </View>
        </div>
      </div>
    </div>
    );
  }
  _handleBack = (event) => {
    this.props.history.goBack();
  }
  _onCodeTextChange = (codeTextInput: string) => {
    this.setState({codeTextInput});
  };

  _onFormSubmit = () => {
    let {codeTextInput,bagState,serviceState,bagActive} = this.state;
    let {activeBag, nodeID, onBagConnote,baggingItemList} = this.props;
    if(_.findIndex(bagActive,function(o){return o.value_no == codeTextInput;} ) !== -1){
      alert('Connote Number already inside bag!!');
      this.setState({codeTextInput:''});
      return false;
    }
     postEntity('bag', {
      node: sessionStorage.getItem('userNodeId'),
      value_no: codeTextInput,
      bag_id: activeBag.bagID
    }).then((response) => this.processResponseBag(response));
    //onBagConnote(codeTextInput, nodeID, activeBag);
    this.setState({codeTextInput: ''});
     // console.log(activeBag);

  };
  processResponseBag(response){
    if(response.data.status.code == 200 || response.data.status.code ==201){
            let{ data } = response.data;
            var bagList = [];
            var serviceList = [];
            if (data) {
             if(data.bag_detail){
                  data.bag_detail.map(function(item){
                    if(item.value_tlc){
                      if(!bagList.includes(item.value_tlc)){
                        bagList.push(item.value_tlc);
                      }
                    }
                    return bagList;
                  })
                  this.setState({bagState : bagList});
                } 
                if(data.bag_detail){
                  data.bag_detail.map(function(item){
                    if(item.connote){
                      if(!serviceList.includes(item.connote.service_code)){
                        serviceList.push(item.connote.service_code);
                      }
                    }
                    
                    return serviceList;
                  })
                  this.setState({serviceState : serviceList});
                } 
              this.setState({
                bagActive: data.bag_detail
              })
              
            }
        } else {
          alert('Resource not found!');
        }
  }
  componentWillReceiveProps(nextProps) {
    
  }
  //componentDidUpdate =() => 
  componentDidMount =() => {
    this.props.bagID && this.props.onBagConnoteListRequested(this.props.nodeID, this.props.bagID)
    getEntity(`bag/${this.props.bagID}`, null).then((res) => {
        this.processResponseBag(res);
      });
  }
}

function mapStateToProps(state: RootState) {
  return {
    ...state.inventoryBagging,
    nodeID: state.header.currentNode,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onBagConnote: (connoteNumber: string, nodeID: number, activeBag: ?Bag) => {
      dispatch({
        type: 'BAG_CONNOTE_REQUESTED',
        connoteNumber,
        nodeID,
        activeBag,
      });
    },
    onBagConnoteListRequested: (nodeID: number, bagID: number) => {
      dispatch({
        type: 'INVENTORY_BAG_CONNOTE_LIST_REQUESTED',
        nodeID,
        bagID,
      });
    },
    onNextPress: (activeBag: Bag, nodeID: number) => {
      dispatch({
        type: 'CLOSE_BAG_REQUESTED',
        activeBag,
        nodeID,
      });
    },
  };
}

const styles = StyleSheet.create({
  root: {
    flex: '1 1 0%',
    paddingRight: 60,
    paddingLeft: 60,
  },
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
  titleWrapper: {
    fontSize: window.innerWidth >= 1024 ? 26 : 15,
    fontWeight: 'bold',
    marginTop: window.innerWidth >= 1024 ? 0 : 2,
    marginBottom: 0,
    textTransform: 'capitalize',
  },
  menuRoot: {
    flex: 1,
    marginTop:15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BaggingList);