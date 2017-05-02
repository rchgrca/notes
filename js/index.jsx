import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import moment from 'moment'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        networkError:false,
        loading:false,
        location:'SFO',
        dropoff:moment().format("MM/DD/YYYY"),
        pickup:moment().add(7,'days').format("MM/DD/YYYY"),
        data:{},
        carTypes:[],
        results:[]
    }
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
         let today = moment().format("MM/DD/YYYY"),
          tomorrow = moment().add(1,'days').format("MM/DD/YYYY"),
       isEmptyData = Object.keys(this.state.data).length === 0 && this.state.data.constructor === Object ? true : false,
    displayContent = this.state.loading ? this.getLoadingMessage() : this.setResultsDisplay()
    displayContent = isEmptyData ? this.getEmptyDataMessage() : displayContent
    displayContent = this.state.networkError ? this.getResultsError() : displayContent
    return (
        <div>
            <div className="clearfix">
                <section className="sm-col sm-col-3 px1">
                    <h2 className="center">Find</h2>
                    <div className="border mb1 rounded p1 bg-white clearfix">
                        <div className="mb1"><label className="right-align col col-4 mr1">Location</label><input type="text" className="" name="location" placeholder={"SFO"}/></div>
                        <div className="mb1"><label className="right-align col col-4 mr1">Pick Up Date</label><input type="text" name="pickup" placeholder={today}/></div>
                        <div className="mb1"><label className="right-align col col-4 mr1">Drop Off Date</label><input type="text" name="dropoff" placeholder={tomorrow}/></div>
                        <div className="mb1 right-align col col-10 pr2"><button onClick={this.handleClick}>Search</button></div>
                    </div>
                </section>
                <section className="sm-col sm-col-9 px1">
                    <div>
                        <h2 className="center">Available</h2>
                        <ul className="list-reset mt0">
                           {displayContent}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
  }

  handleClick(){
      this.setLoadingMessage()
      this.fetchSearchResults()
  }

  getEmptyDataMessage(){
      return (
          <li className="border mb2 rounded p1 bg-white center">Please enter a "Location" and "Pick Up" and "Drop Off" dates.</li>
      )
  }

  setLoadingMessage(){
      this.setState({
          loading: true,
          data:{"has":"data"}
      })
  }

  getLoadingMessage(){
      return (
          <li className="border mb2 rounded p1 bg-white center"><span className="green">Loading...</span></li>
      )
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
                  <li key={i} className="border mb2 rounded p1 bg-white">
                      <h3 className="mt0">{thisCarType[0].CarTypeName}</h3>
                      <div className="mb1"><div className="bold">Models: </div><div>{thisCarType[0].PossibleModels}</div></div>
                      <div className="mb1"><div className="bold">Features:  </div><div>{thisCarType[0].PossibleFeatures}</div></div>
                      <div className="mb1"><div className="bold">Seats:  </div><div>{thisCarType[0].TypicalSeating}</div></div>
                      <div className="mb1"><div className="bold">Mileage:  </div><div>{o.MileageDescription}</div></div>
                      <div className="mb1"><div className="bold">Location:  </div><div>{o.LocationDescription} ({o.PickupAirport})</div></div>
                      <div className="mb1"><div className="bold">Daily Rate:  </div><div>${o.DailyRate}</div></div>
                      <div className="mb1"><div className="bold">Pick Up:  </div><div>{o.PickupDay} at {o.PickupTime}</div></div>
                      <div className="mb1"><div className="bold">Drop Off:  </div><div>{o.DropoffDay} at {o.DropoffTime}</div></div>
                      <div className="mb1"><div className="bold">Rental Days:  </div><div>{o.RentalDays}</div></div>
                      <div className="mb1"><div className="bold">Sub Total:  </div><div>${o.SubTotal}</div></div>
                      <div className="mb1"><div className="bold">Taxes & Fees:  </div><div>${o.TaxesAndFees}</div></div>
                      <div className="mb1"><div className="bold">Total Price:  </div><div>${o.TotalPrice}</div></div>
                  </li>
              )
          })
      )
  }

  setResultsSearch(response){
      this.setState({
          loading:false,
          data:response.data,
          carTypes:response.data.MetaData.CarMetaData.CarTypes,
          results:response.data.Result,
      })
  }

  getResultsError(error){
      return (
          <li className="border mb2 rounded p1 bg-white center"><span className="red">Network Error.  Please refresh and try again.</span></li>
      )
  }

  setResultsError(){
      this.setState({
          networkError:true
      })
  }


  fetchSearchResults(){
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
      }.bind(this)).catch(function(){
          this.setResultsError()
    }.bind(this))
  }

}

render(<App/>, document.getElementById('app'));
