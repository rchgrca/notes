import React, { Component } from 'react';
import { render } from 'react-dom';

export default class StatusMessage extends Component {
    render() {
        let { classNames } = this.props
        return (
           <li className={classNames}>
               {this.props.children}
           </li>
        )
    }
}
