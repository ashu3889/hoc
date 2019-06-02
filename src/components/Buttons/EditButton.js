import React, {Component} from 'react';
import {Button} from 'material-ui';


const EditButton = (props) => {
  return (
    <Button style={{color: '#343b91'}} onClick={props.onClick}>Edit</Button>
  );
};
export default EditButton;
