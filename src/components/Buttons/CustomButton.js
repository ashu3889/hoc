import React, {Component} from 'react';
import {Button} from 'material-ui';


const CustomButton = (props) => {
  return (
    <Button 
    	variant="raised"
        style={{backgroundColor: 'blue', color: 'white', marginRight: 10  }}
        onClick={props.onClick}>{props.btnName}</Button>
  );
};
export default CustomButton;
