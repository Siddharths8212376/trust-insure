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
            <ul>
            {insuranceList.map((insurance)=>
                <li key={insurance.id}><span><bold>{insurance.policyName}</bold> Insured By: {insurance.insurerName} Sum Assured: {insurance.sumAssured} Term: {insurance.policyTerm}</span>
                    <a href={`/insurance-screen/${insurance.id}`} role="button" className="btn btn-primary">Show Details</a> 
                </li>
            )}
            </ul>
        </div>
    )
}
export default InsurancesList