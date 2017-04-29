import React, { Component } from 'react';
import { render } from 'react-dom';

export default class App extends Component {
  render() {
    return (
        <div>
            <div className="clearfix border">
                <section className="sm-col sm-col-4 border">
                    left
                </section>
                <section className="sm-col sm-col-8 border">
                    right
                </section>
            </div>
        </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
