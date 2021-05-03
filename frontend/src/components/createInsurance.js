import { Link, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const listUrl = 'http://localhost:3001/api/insurance-list'
const CreateForm = ({ currentUser, policyName, setPolicyName, sumAssured, setSumAssured, policyTerm, setPolicyTerm, premiumPayment, setPremiumPayment, paymentTerm, setPaymentTerm, setCreatedMessage, setInsuranceCreated, insuranceDescription, setInsuranceDescription}) => {
    const handlePolicyName = (e) => {
        setPolicyName(e.target.value)
    }
    const handleSumAssured = (e) => {
        setSumAssured(e.target.value)
    }
    const handlePolicyTerm = (e) => {
        setPolicyTerm(e.target.value)
    }
    const handlePremiumPayment = (e) => {
        setPremiumPayment(!premiumPayment)
    }
    const handlePaymentTerm = (e) => {
        setPaymentTerm(e.target.value)
    }
    const handleInsuranceDescription = (e) => {
        setInsuranceDescription(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(policyName, sumAssured, premiumPayment, policyTerm, paymentTerm, currentUser.user.address, currentUser.user.email)
        await axios.post(listUrl, {
            policyName: policyName,
            insurerAddress: currentUser.user.address,
            insurerName: currentUser.user.name,
            insurerEmail: currentUser.user.email,
            sumAssured: Number(sumAssured),
            premiumPayment: premiumPayment,
            policyTerm: Number(policyTerm),
            paymentTerm: Number(paymentTerm),
            insuranceDescription: insuranceDescription
        })
        .then((response) => {
            console.log(response.data)
            setCreatedMessage('Success!!')
            setTimeout(() => {
                setCreatedMessage('')
                setInsuranceCreated(true)
            }, 1500)
        })
        .catch((err) => {
            setInsuranceCreated(false)
        })
    }
    
    return (
        <div>Creation Form Here
            <form>

            <div className="form-group">
                <label for="policyname"><bold>Policy Name</bold></label>
                <input type="text" className="form-control" id="InputPolicyType" value={policyName} placeholder="Enter Policy Type" onChange={handlePolicyName}/>
            </div>
            <div className="form-group">
                <label for="insuranceDescription"><bold>Description</bold></label>
                <input type="text" className="form-control" id="InsuranceDesc" value={insuranceDescription} placeholder="Add a description" onChange={handleInsuranceDescription}/>
            </div>
            <div className="form-group">
                <label for="sumAssured"><bold>Sum Assured</bold></label>
                <input type="text" className="form-control" id="InputSumAssured" value={sumAssured} placeholder="Enter Sum Assured (Rs.)" onChange={handleSumAssured}/>
            </div>
            <div className="form-group">
                <label for="policyTerm"><bold>Policy Term</bold></label>
                <input type="text" className="form-control" id="InputPolicyTerm" value={policyTerm} placeholder="Enter Policy Term (years)" onChange={handlePolicyTerm}/>
            </div>
            <div className="form-group">
                <label for="paymentTerm"><bold>Payment Term</bold></label>
                <input type="text" className="form-control" id="InputPaymentTerm" value={paymentTerm} placeholder="Enter Payment Term (years)" onChange={handlePaymentTerm}/>
            </div>
            
            <label for="premium"><bold>Premium Payment</bold></label>
            <br/>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value={premiumPayment}  onChange={handlePremiumPayment} checked/>
                <label class="form-check-label" for="exampleRadios1">
                   Yes 
                </label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value={premiumPayment} onChange={handlePremiumPayment}/>
                <label class="form-check-label" for="exampleRadios2">
                   No 
                </label>
            </div>
    <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    )
}
const NotifyInsuranceCreated = ({ createdMessage }) => {
    if ({createdMessage} !== '') {
    return (
        <div role="alert" className="alert alert-primary" style={{margin:"30px"}}>
        {createdMessage}
        </div>
    ) 
    }
}
const CreateInsurance = () => {
    // provide a form here
    const { user: currentUser } = useSelector((state) => state.authReducer)
    console.log(currentUser, 'is creating an insurance here')
    const [policyName, setPolicyName] = useState('')
    const [sumAssured, setSumAssured] = useState('')
    const [policyTerm, setPolicyTerm] = useState('')
    const [insuranceDescription, setInsuranceDescription] = useState('')
    const [paymentTerm, setPaymentTerm] = useState('')
    const [premiumPayment, setPremiumPayment] = useState(true)
    const [insuranceCreated, setInsuranceCreated] = useState(false)
    const [createdMessage, setCreatedMessage] = useState('')
    // resolve the radio issue here
    if (insuranceCreated) return <Redirect to="/profilehome" />
    return (
        <div style={{color: 'white'}}>
        <CreateForm currentUser={currentUser} policyName={policyName} setPolicyName={setPolicyName} sumAssured={sumAssured} setSumAssured={setSumAssured}  policyTerm={policyTerm} setPolicyTerm={setPolicyTerm} premiumPayment={premiumPayment} setPremiumPayment={setPremiumPayment} paymentTerm={paymentTerm} setPaymentTerm={setPaymentTerm} setCreatedMessage={setCreatedMessage} setInsuranceCreated={setInsuranceCreated} insuranceDescription={insuranceDescription} setInsuranceDescription={setInsuranceDescription}/>
        <NotifyInsuranceCreated createdMessage={createdMessage} />
        </div>
    )
}
export default CreateInsurance