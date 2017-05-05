import React, { Component } from 'react';
import { render } from 'react-dom';
import ContentContainer from './contentContainer.jsx'

export default class SearchResults extends Component {
    render() {
        let { carTypes, results, containerCSS } = this.props

        return (
            <ContentContainer classNames={containerCSS}>
                {this.setResultsDisplay()}
            </ContentContainer>
        )
    }

    setResultsDisplay(){
        let { carTypes, results } = this.props

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
}
