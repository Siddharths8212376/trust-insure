import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import axios from 'axios'
const listUrl = 'http://localhost:3001/api/insurance-list'
const InsuranceObject = () => (
    <div>
        Object Here!
    </div>
)

const InsurancesList = () => {
    // fetch list of insurances from the db
    const [insuranceList, setInsuranceList] = useState([])
    useEffect(() => {
        axios.get(listUrl).then((response)=>{
            setInsuranceList(response.data)
        })
    }, [])
    console.log(insuranceList, "list here")
    const { user: currentUser } = useSelector((state) => state.authReducer)
    console.log(currentUser)
    if (!currentUser) {
        return <Redirect to="/login" />
    } else {
        console.log('logged in!')
        console.log(currentUser)
    } 
    return (
        <div>
            <ul style={{ listStyleType: "none"}}>
            {insuranceList.map((insurance)=>
                <li key={insurance.id}>
                    <div className="card" style={{margin: "2%", backgroundColor: "#282828", color: "white"}}>
                        <div className="card-body">
                        <h5 className="card-title">{insurance.policyName}</h5>
                        <p className="card-body"> Insured By: {insurance.insurerName} <br/>
                         Address: {insurance.insurerAddress} <br/>
                         Sum Assured: {insurance.sumAssured} Term: {insurance.policyTerm}
                        </p>
                        <a href={`/insurance-screen/${insurance.id}`} role="button" className="btn btn-primary">Show Details</a> 
                        </div>
                    </div>
                </li>
            )}
            </ul>
        </div>
    )
}
export default InsurancesList