import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const listUrl = 'http://localhost:3001/api/insurance-list'

const InsuranceScreen = () => {
    const [insurance, setInsurance] = useState([])
    const id = useParams().id
    useEffect(() => {
        axios.get(listUrl).then((response)=>{
            const insurances = response.data
            const insurance = insurances.find(ins => ins.id === id)
            setInsurance(insurance)
        })
    }, [])
    const { user: currentUser } = useSelector((state) => state.authReducer)
    console.log(currentUser)
    if (!currentUser) {
        return <Redirect to="/login" />
    } else {
        console.log('logged in!')
    } 
 
    return (
        <div className="card" style={{backgroundColor: "#282828", color: 'white'}}>
            <div className="card-body">
            <h5 className="card-title">{insurance.policyName}</h5>
            <p className="card-text">{insurance.insuranceDescription}</p>
            Insured By: {insurance.insurerName} <br />
            Sum Assured: {insurance.sumAssured} <br />
            Term: {insurance.policyTerm} years <br />

            <p><a href={`/apply/${insurance.id}`} role="button" className="btn btn-danger">Apply Here</a> </p>
            </div>
        </div>
    )
} 
export default InsuranceScreen