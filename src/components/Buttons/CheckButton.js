import React, {Component} from 'react';
import {Button} from 'material-ui';


const CheckButton = (props) => {
  return (
    <Button onClick={props.onClick}>CHECK</Button>
  );
};
export default CheckButton;
