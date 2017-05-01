import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import _ from 'underscore'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:{},
        carTypes:{},
        results:{}
    }
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    console.log('render',this.state.results)

    let items = this.state.results.length > 0 ? (
        this.state.results.map((i) => {
            <li>{i}</li>
        })
    ) : ''

    return (
        <div>
            <div className="clearfix">
                <section className="sm-col sm-col-4">
                    <button onClick={this.handleClick}>Search</button>
                </section>
                <section className="sm-col sm-col-8 border">
                    <div>
                        <ul>
                            <li>{items}</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
  }

  handleClick(){
      this.fetchSearchResults()
  }

  setResultsSearch(response){
      let data = response.data,
      carTypes = data.MetaData.CarMetaData.CarTypes,
      results = data.Result
      console.log('results',results)
      console.log('carTypes',carTypes)
      this.setState({
          data,
          carTypes,
          results,
      })
  }

  setResultsError(error){
      console.log('error', error)
  }


  fetchSearchResults(){
      let data, carTypes, results
      axios.get('http://crossorigin.me/http://api.hotwire.com/v1/search/car', {
        params: {
            apikey:'23eecj3fhsxpwpgv967jywcr',
            format:'json',
            dest:'SFO',
            startdate:'07/04/2017',
            enddate:'07/05/2017',
            pickuptime:'10:00',
            dropofftime:'13:30'
        }
      }).then(function (response) {
          this.setResultsSearch(response)
      }.bind(this)).catch(function (error) {
          this.setResultsError(error)
    }.bind(this))
  }
}

render(<App/>, document.getElementById('app'));
