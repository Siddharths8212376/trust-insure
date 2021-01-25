import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const listUrl = 'http://localhost:3001/api/insurance-list'
const ApplicationForm = ({ aadhaar, setAadhaar, name, setName, gender, setGender, pan, setPan, bankuw, setBankuw, meduw, setMeduw, insurance }) => {
    const handleAadhaar = (e) => {
        setAadhaar(e.target.value)
        console.log(aadhaar, 'set aadhar')
    }
    const handleName = (e) => {
        setName(e.target.value)
    }
    const handleGender = (e) => {
        setGender(e.target.value)
    }
    const handlePan = (e) => {
        setPan(e.target.value)
    }
    const handleBankUW = (e) => {
        setBankuw(e.target.value)
    }
    const handleMedUW = (e) => {
        setMeduw(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(aadhaar, pan, name, gender, bankuw, meduw, insurance.policyName, insurance.policyTerm, insurance.insurerName, insurance.sumAssured, 'submitted')
        // on successful submission, add it to blockchain, update in db, reroute to profile home
        // on failure, send the message, re - route to home
    }
    return (
    <div>
        <form>
        <div className="form-group">
            <label for="inputName">Name</label>
            <input type="text" className="form-control" id="exampleName" value={name} placeholder="Enter Name" onChange={handleName}/>
        </div>
        <div className="form-group">
            <label for="aadhaar"><bold>Aadhaar Number</bold></label>
            <input type="text" className="form-control" id="InputAadhaar" value={aadhaar} aria-describedby="aadhaarHelp" placeholder="Enter aadhaar number" onChange={handleAadhaar}/>
            <small id="aadhaarHelp" className="form-text text-muted">We'll never share your aadhaar with anyone else.</small>
        </div>
        <div className="form-group">
            <label for="inputName">Gender</label>
            <input type="text" className="form-control" id="exampleGender" value={gender} placeholder="Specify Gender" onChange={handleGender}/>
        </div>
        <div className="form-group">
            <label for="pan"><bold>PAN</bold></label>
            <input type="text" className="form-control" id="InputPAN" value={pan} placeholder="Enter PAN number" onChange={handlePan}/>
        </div>
        <div className="form-group">
            <label for="exampleInputAddress">Bank UW Ethereum Address</label>
            <input type="text" className="form-control" id="exampleInputAddress" value={bankuw} placeholder="Bank UW Address" onChange={handleBankUW}/>
        </div>
        <div className="form-group">
            <label for="exampleInputAddress">Medical UW Ethereum Address</label>
            <input type="text" className="form-control" id="exampleInputAddress" value={meduw} placeholder="Medical UW Address" onChange={handleMedUW}/>
        </div>
        <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"/ >
            <label className="form-check-label text-muted" for="exampleCheck1">I acknowledge the data is true to the best of my knowledge.</label>
        </div>
    <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </form>
    </div>
)
}
const Apply = () => {
    const [insurance, setInsurance] = useState([])
    const [aadhaar, setAadhaar] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('')
    const [pan, setPan] = useState('')
    const [bankuw, setBankuw] = useState('')
    const [meduw, setMeduw] = useState('')

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
        <div>
        Apply Here
        <div>
        <span><bold>{insurance.policyName}</bold> Insured By: {insurance.insurerName} Sum Assured: {insurance.sumAssured} Term: {insurance.policyTerm}</span>
        </div>
        <div>
        Address: 0xABCDEF..
        Form Here Add to the contract here!! 
        We need web3 connection over here
        </div>
        <ApplicationForm aadhaar={aadhaar} setAadhaar={setAadhaar} name={name} setName={setName} gender={gender} setGender={setGender} pan={pan} setPan={setPan} bankuw={bankuw} setBankuw={setBankuw} meduw={meduw} setMeduw={setMeduw} insurance={insurance} />
        </div>
    )
}

export default Apply