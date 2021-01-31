import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const listUrl = 'http://localhost:3001/api/insurance-list'
const CreateForm = ({ currentUser, policyType, setPolicyType, sumAssured, setSumAssured, policyTerm, setPolicyTerm, premiumPayment, setPremiumPayment, paymentTerm, setPaymentTerm }) => {
    const handlePolicyType = (e) => {
        setPolicyType(e.target.value)
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
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(policyType, sumAssured, premiumPayment, policyTerm, paymentTerm, currentUser.user.address, currentUser.user.email)
        await axios.post(listUrl, {
            policyType: policyType,
            insurerAddress: currentUser.user.address,
            insurerName: currentUser.user.email,
            sumAssured: Number(sumAssured),
            premiumPayment: premiumPayment,
            policyTerm: Number(policyTerm),
            paymentTerm: Number(paymentTerm)
        })
    }
    
    return (
        <div>Creation Form Here
            <form>

            <div className="form-group">
                <label for="policytype"><bold>Policy Type</bold></label>
                <input type="text" className="form-control" id="InputPolicyType" value={policyType} placeholder="Enter Policy Type" onChange={handlePolicyType}/>
            </div>
            <div className="form-group">
                <label for="sumAssured"><bold>Sum Assured</bold></label>
                <input type="text" className="form-control" id="InputSumAssured" value={sumAssured} placeholder="Enter Sum Assured" onChange={handleSumAssured}/>
            </div>
            <div className="form-group">
                <label for="policyTerm"><bold>Policy Term</bold></label>
                <input type="text" className="form-control" id="InputPolicyTerm" value={policyTerm} placeholder="Enter Policy Term" onChange={handlePolicyTerm}/>
            </div>
            <div className="form-group">
                <label for="paymentTerm"><bold>Payment Term</bold></label>
                <input type="text" className="form-control" id="InputPaymentTerm" value={paymentTerm} placeholder="Enter Payment Term" onChange={handlePaymentTerm}/>
            </div>
            {/* <div className="form-group">
                <label for="sumAssured"><bold>Premium</bold></label>
                <input type="text" className="form-control" id="InputPremium" value={premiumPayment} placeholder="Premium or not?" onChange={handlePremiumPayment}/>
            </div> */}
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
const CreateInsurance = () => {
    // provide a form here
    const { user: currentUser } = useSelector((state) => state.authReducer)
    console.log(currentUser, 'is creating an insurance here')
    const [policyType, setPolicyType] = useState('')
    const [sumAssured, setSumAssured] = useState('')
    const [policyTerm, setPolicyTerm] = useState('')
    const [paymentTerm, setPaymentTerm] = useState('')
    const [premiumPayment, setPremiumPayment] = useState(true)
    // resolve the radio issue here
    return (
        <div>Create Insurance Here!
        <CreateForm currentUser={currentUser} policyType={policyType} setPolicyType={setPolicyType} sumAssured={sumAssured} setSumAssured={setSumAssured}  policyTerm={policyTerm} setPolicyTerm={setPolicyTerm} premiumPayment={premiumPayment} setPremiumPayment={setPremiumPayment} paymentTerm={paymentTerm} setPaymentTerm={setPaymentTerm} />
        </div>
    )
}
export default CreateInsurance