import React, { Component } from 'react';
import { render } from 'react-dom';

export default class ContentContainer extends Component {
    render() {
        let { classNames } = this.props
        return (
           <ul className={classNames}>
               {this.props.children}
           </ul>
        )
    }
}
