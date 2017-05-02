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
        airport:'',
        dropoff:'',
        pickup:'',
        data:{},
        carTypes:[],
        results:[]
    }
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    let tomorrow = moment().add(1,'days').format("MM/DD/YYYY"),
        nextweek = moment().add(7,'days').format("MM/DD/YYYY"),
    displayContent

    let { loading, networkError, airport, pickup, dropoff } = this.state

    displayContent = loading ? this.getLoadingMessage() : this.setResultsDisplay()
    displayContent = this.isEmptyData() ? this.getEmptyDataMessage() : displayContent
    displayContent = networkError ? this.getResultsError() : displayContent

    return (
        <div>
            <div className="clearfix">
                <section className="sm-col sm-col-3 px1">
                    <p className="h2 center">Find</p>
                    <div className="border mb1 rounded p1 bg-white clearfix border--green">
                        <div className="mb1">
                            <label className="right-align col col-3 mr1">Airport</label>
                            <input type="text" onChange={this.handleFormChange.bind(this,'airport')} value={airport} className="field col-3" placeholder={"SFO"}/>
                        </div>
                        <div className="mb1">
                            <label className="right-align col col-3 mr1">Pick Up</label>
                            <input type="text" onChange={this.handleFormChange.bind(this,'pickup')} value={pickup} className="field col-3" placeholder={tomorrow}/>
                        </div>
                        <div className="mb1">
                            <label className="right-align col col-3 mr1">Drop Off</label>
                            <input type="text" onChange={this.handleFormChange.bind(this,'dropoff')} value={dropoff} className="field col-3" placeholder={nextweek}/>
                        </div>
                        <div className="center">
                            <button className="h4 rounded bg-green white" onClick={this.handleSubmit}>Search</button>
                        </div>
                    </div>
                </section>
                <section className="sm-col sm-col-9 px1">
                    <div>
                        <p className="h2 center">Available</p>
                        <ul className="list-reset mt0">
                           {displayContent}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
  }

  isEmptyData(){
      let { data } = this.state
      return Object.keys(data).length === 0 && data.constructor === Object ? true : false
  }

  handleFormChange(name,e){
      this.setState({[name]:event.target.value})
  }

  handleSubmit(){
      this.setLoadingMessage()
      this.fetchSearchResults()
  }

  getEmptyDataMessage(){
      return (
          <li className="border mb2 rounded p1 bg-white center border--green">Please enter a "Location" and "Pick Up" and "Drop Off" dates.</li>
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
          <li className="border mb2 rounded p1 bg-white center border--green"><span className="green">Loading...</span></li>
      )
  }

  setResultsDisplay(){
      let { carTypes, results } = this.state

      return (
          results.map((o,i) => {
              let thisCarType = carTypes.filter((a) => {
                  if(a.CarTypeCode === o.CarTypeCode){
                      return a
                  }
              })
              return (
                  <li key={i} className="border mb2 rounded p1 bg-white  border--green">
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
          <li className="border mb2 rounded p1 bg-white center border--green"><span className="red">Network Error.  Please refresh and try again.</span></li>
      )
  }

  setResultsError(){
      this.setState({
          networkError:true
      })
  }


  fetchSearchResults(){
      let { airport, pickup, dropoff } = this.state
      axios.get('http://crossorigin.me/http://api.hotwire.com/v1/search/car', {
        params: {
            apikey:'23eecj3fhsxpwpgv967jywcr',
            format:'json',
            dest:airport,
            startdate:pickup,
            enddate:dropoff,
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
