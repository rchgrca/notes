import React, { Component } from 'react'
import { render } from 'react-dom'
import axios from 'axios'
import moment from 'moment'
import ContentContainer from './components/contentContainer.jsx'
import StatusMessage from './components/statusMessage.jsx'
import SearchResults from './components/searchResults.jsx'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        networkError:false,
        loading:false,
        airport:'',
        dropoff:'',
        pickup:'',
        statusDesc:'',
        errors:[],
        carTypes:[],
        results:[]
    }
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    let { loading, networkError, statusDesc, errors, carTypes, results, airport, pickup, dropoff } = this.state
    let tomorrow = moment().add(1,'days').format("MM/DD/YYYY"),
        nextweek = moment().add(8,'days').format("MM/DD/YYYY"),
       hasNoData = !results.length ? true : false,
       hasErrors = errors.length ? true : false,
    containerCSS = "list-reset mt0",
       statusCSS = 'border mb2 rounded p1 bg-white center border--green clearfix',
        displayContent

    switch(true){
        case networkError:
            displayContent = (
                <ContentContainer classNames={containerCSS}>
                    <StatusMessage classNames={statusCSS}><span className="red">Network Error.  Please refresh and try again.</span></StatusMessage>
                </ContentContainer>
            )
            break
        case hasErrors:
            displayContent = (
                <ContentContainer classNames={containerCSS}>
                    <StatusMessage classNames={statusCSS}>{this.getValidationErrors()}</StatusMessage>
                </ContentContainer>
            )
            break
        case loading:
            displayContent = (
                <ContentContainer classNames={containerCSS}>
                    <StatusMessage classNames={statusCSS}><span className="green">Loading...</span></StatusMessage>
                </ContentContainer>
            )
            break
        case hasNoData:
            displayContent = (
                <ContentContainer classNames={containerCSS}>
                    <StatusMessage classNames={statusCSS}>Please enter a "Location" and "Pick Up" and "Drop Off" dates</StatusMessage>
                </ContentContainer>
            )
            break
        default:
            displayContent = (
                <SearchResults carTypes={carTypes} results={results} containerCSS={containerCSS}/>
            )
            break
    }

    return (
        <div>
            <div className="clearfix">
                <section className="sm-col sm-col-3 px1">
                    <p className="h2 center">Find</p>
                    <div className="border mb1 rounded p1 bg-white clearfix border--green">
                        <div className="mb1">
                            <label className="right-align col col-3 mr1">Airport</label>
                            <input type="text" onChange={this.handleFormChange.bind(this,'airport')} value={airport} className="field col-8" placeholder={"SFO"}/>
                        </div>
                        <div className="mb1">
                            <label className="right-align col col-3 mr1">Pick Up</label>
                            <input type="text" onChange={this.handleFormChange.bind(this,'pickup')} value={pickup} className="field col-8" placeholder={tomorrow}/>
                        </div>
                        <div className="mb1">
                            <label className="right-align col col-3 mr1">Drop Off</label>
                            <input type="text" onChange={this.handleFormChange.bind(this,'dropoff')} value={dropoff} className="field col-8" placeholder={nextweek}/>
                        </div>
                        <div className="center">
                            <button className="h4 rounded bg-green white" onClick={this.handleSubmit}>Search</button>
                        </div>
                    </div>
                </section>
                <section className="sm-col sm-col-9 px1">
                    <div>
                        <p className="h2 center">Available</p>
                        {displayContent}
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

  getValidationErrors() {
      let { statusDesc, errors } = this.state

      let listErrors = errors.map((o,i) => {
            return (
                <li className="left-align capitalize">{o.ErrorMessage}</li>
            )
      })

      let errorContent = (
          <div className="mx-auto p1">
              <div className="center mb1 capitalize red">Hotwire API: "{statusDesc}"</div>
              <ol>
                  {listErrors}
              </ol>
          </div>
      )


      return errorContent
  }

  setResultsSearch(response){
      let {
          data: {
              Errors,
              StatusDesc,
              Result = [],
              MetaData: {
                  CarMetaData: {
                      CarTypes = []
                  } = {}
              } = {}
          }
      } = response
      Errors = Errors.Error  ? [Errors.Error] : Errors
      this.setState({
          loading:false,
          errors:Errors,
          carTypes:CarTypes,
          statusDesc:StatusDesc,
          results:Result
      })
  }

  setResultsError(){
      this.setState({
          networkError:true
      })
  }


  fetchSearchResults(){
      const apikey = '23eecj3fhsxpwpgv967jywcr',
      crossorigin = 'http://crossorigin.me/http://api.hotwire.com/v1/search/car',
      herokuapp = 'http://hotwire.herokuapp.com/v1/search/car',
      format = 'json'

      let { airport, pickup, dropoff } = this.state,
      domain = (false) ? crossorigin : herokuapp

      axios.get(domain, {
        params: {
            apikey,
            format,
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
