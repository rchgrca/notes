import React, { Component } from 'react';
import { render } from 'react-dom';

export default class ContentContainer extends Component {
    render() {
        let { classNames, ol } = this.props
        return (
            ol ?
                <ol className={classNames}>{this.props.children}</ol>
                :
                <ul className={classNames}>{this.props.children}</ul>
        )
    }
}
ContentContainer.defaultProps = { ol: false };
