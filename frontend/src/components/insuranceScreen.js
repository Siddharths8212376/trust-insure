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
        <div>Show insurance details!

            <span><bold>{insurance.policyName}</bold> Insured By: {insurance.insurerName} Sum Assured: {insurance.sumAssured} Term: {insurance.policyTerm}</span>
            <a href={`/apply/${insurance.id}`} role="button" className="btn btn-danger">Apply Here</a> 
        </div>
    )
} 
export default InsuranceScreen