import React, {Component} from 'react';

export function withActionButton(Component, data) {
  class ActionButton extends React.Component {
    render() {
      const Button = this.props.button;
      return (
        <Button />
      );
    }
  }
}
