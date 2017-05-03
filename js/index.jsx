import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import moment from 'moment'
import StatusMessage from './components/StatusMessage.jsx'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        networkError:false,
        loading:false,
        airport:'',
        dropoff:'',
        pickup:'',
        carTypes:[],
        results:[]
    }
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    let { loading, networkError, results, airport, pickup, dropoff } = this.state
    let tomorrow = moment().add(1,'days').format("MM/DD/YYYY"),
        nextweek = moment().add(8,'days').format("MM/DD/YYYY"),
       hasNoData = !results.length ? true : false,
       statusCSS = 'border mb2 rounded p1 bg-white center border--green',
        displayContent

    displayContent = loading ?
        <StatusMessage classNames={statusCSS}><span className="green">Loading...</span></StatusMessage>
        : this.setResultsDisplay()
    displayContent = hasNoData ?
        <StatusMessage classNames={statusCSS}>Please enter a "Location" and "Pick Up" and "Drop Off" dates</StatusMessage>
        : displayContent
    displayContent = networkError ?
        <StatusMessage classNames={statusCSS}><span className="red">Network Error.  Please refresh and try again.</span></StatusMessage>
        : displayContent

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

  handleFormChange(name,e){
      this.setState({[name]:event.target.value})
  }

  handleSubmit(){
      this.setLoadingMessage()
      this.fetchSearchResults()
  }

  setLoadingMessage(){
      this.setState({
          loading: true,
          results:["gettingdata"]
      })
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
      let {
          data: {
              Result,
              MetaData: {
                  CarMetaData: {
                      CarTypes
                  }
              }
          }
      } = response
      this.setState({
          loading:false,
          carTypes:CarTypes,
          results:Result
      })
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
