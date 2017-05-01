import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:{},
        carTypes:[],
        results:[]
    }
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    return (
        <div>
            <div className="clearfix">
                <section className="sm-col sm-col-4">
                    <button onClick={this.handleClick}>Search</button>
                </section>
                <section className="sm-col sm-col-8">
                    <div>
                        <ul className="list-reset">
                           {this.setResultsDisplay()}
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

  setResultsDisplay(){
      let carTypes = this.state.carTypes,
           results = this.state.results

      return (
          results.map((o,i) => {
              let thisCarType = carTypes.filter((a) => {
                  if(a.CarTypeCode === o.CarTypeCode){
                      return a
                  }
              })
              return (
                  <li key={i} className="border">
                      <div>Type: {thisCarType[0].CarTypeName}</div>
                      <div>Models: {thisCarType[0].PossibleModels}</div>
                      <div>Features: {thisCarType[0].PossibleFeatures}</div>
                      <div>Seats: {thisCarType[0].TypicalSeating}</div>
                      <div>Mileage: {o.MileageDescription}</div>
                      <div>Location: {o.LocationDescription} ({o.PickupAirport})</div>
                      <div>Daily Rate: ${o.DailyRate}</div>
                      <div>Pick Up: {o.PickupDay} at {o.PickupTime}</div>
                      <div>Drop Off: {o.DropoffDay} at {o.DropoffTime}</div>
                      <div>Rental Days: {o.RentalDays}</div>
                      <div>Sub Total: ${o.SubTotal}</div>
                      <div>Taxes and Fees: ${o.TaxesAndFees}</div>
                      <div>Total Price: ${o.TotalPrice}</div>
                  </li>
              )
          })
      )
  }

  setResultsSearch(response){
      let data = response.data,
      carTypes = data.MetaData.CarMetaData.CarTypes,
      results = data.Result
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
      }).then(function(response){
          this.setResultsSearch(response)
      }.bind(this)).catch(function(error){
          this.setResultsError(error)
    }.bind(this))
  }
}

render(<App/>, document.getElementById('app'));
