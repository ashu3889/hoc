import React, {Component} from 'react';
import {Button} from 'material-ui';


const PrintButton = (props) => {
  return (
    <Button style={{color: '#42a5f5'}} onClick={props.onClick}>Print</Button>
  );
};
export default PrintButton;
