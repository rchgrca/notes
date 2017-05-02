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
        data:{},
        carTypes:[],
        results:[]
    }
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    let today = moment().format("MM/DD/YYYY"),
     tomorrow = moment().add(1,'days').format("MM/DD/YYYY"),
    displayContent = this.state.loading ? this.getLoadingMessage() : this.setResultsDisplay()
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

  setLoadingMessage(){
      this.setState({
          loading: true
      })
  }

  getLoadingMessage(){
      return (
          <li className="border mb2 rounded p1 bg-white center"><img src="https://css-tricks.com/wp-content/uploads/2011/02/spinnnnnn.gif"/></li>
      )
  }

  setResultsDisplay(){
      let carTypes = this.state.carTypes,
           results = this.state.results

      return (
          results.map((o,i) => {
              let css = {
                  container: "mb1",
                  label: "block bold",
                  value: "block"
              }
              let thisCarType = carTypes.filter((a) => {
                  if(a.CarTypeCode === o.CarTypeCode){
                      return a
                  }
              })
              return (
                  <li key={i} className="border mb2 rounded p1 bg-white">
                      <h3 className="mt0">{thisCarType[0].CarTypeName}</h3>
                      <div className={css.container}><span className={css.label}>Models: </span><span className={css.value}>{thisCarType[0].PossibleModels}</span></div>
                      <div className={css.container}><span className={css.label}>Features:  </span><span className={css.value}>{thisCarType[0].PossibleFeatures}</span></div>
                      <div className={css.container}><span className={css.label}>Seats:  </span><span className={css.value}>{thisCarType[0].TypicalSeating}</span></div>
                      <div className={css.container}><span className={css.label}>Mileage:  </span><span className={css.value}>{o.MileageDescription}</span></div>
                      <div className={css.container}><span className={css.label}>Location:  </span><span className={css.value}>{o.LocationDescription} ({o.PickupAirport})</span></div>
                      <div className={css.container}><span className={css.label}>Daily Rate:  </span><span className={css.value}>${o.DailyRate}</span></div>
                      <div className={css.container}><span className={css.label}>Pick Up:  </span><span className={css.value}>{o.PickupDay} at {o.PickupTime}</span></div>
                      <div className={css.container}><span className={css.label}>Drop Off:  </span><span className={css.value}>{o.DropoffDay} at {o.DropoffTime}</span></div>
                      <div className={css.container}><span className={css.label}>Rental Days:  </span><span className={css.value}>{o.RentalDays}</span></div>
                      <div className={css.container}><span className={css.label}>Sub Total:  </span><span className={css.value}>${o.SubTotal}</span></div>
                      <div className={css.container}><span className={css.label}>Taxes & Fees:  </span><span className={css.value}>${o.TaxesAndFees}</span></div>
                      <div className={css.container}><span className={css.label}>Total Price:  </span><span className={css.value}>${o.TotalPrice}</span></div>
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
          <li className="border mb2 rounded p1 bg-white center">Network Error.  Please refresh and try again.</li>
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
