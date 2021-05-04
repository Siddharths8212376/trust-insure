import { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Web3 from 'web3'
import axios from 'axios'
import BlockSecureDeployer from '../abi/BlockSecureDeployer.json'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import '../css/InsuranceStatus.css'
const insUrl = 'http://localhost:3001/api/insurances'
const putUrl = 'http://localhost:3001/api/insurances'
const states = ['Confirm Details', 'Being Processed', 'Accepted Policy', 'Invoked Claim', 'Accepted Claim', 'Rejected Claim', 'Rejected Policy', 'Accept Policy']
const stateDesc = {
    0 : states[0],
    1 : states[1],
    2 : states[1],
    3 : states[1],
    4 : 'Bank UW Done',
    5 : 'Medical UW Done',
    "-1" : states[6],
    "-2" : states[5],
    6 : states[7],
    7 : states[2],
    8 : states[3],
    9 : states[3],
    10 : states[3],
    11: states[4]
}

const InsuranceDetails = ({insurance}) => {
    console.log(insurance)
    return (
        <div className="details">
            Subscriber: {insurance.name} <br/>
            Aadhaar Number: {insurance.aadhaarNumber} <br/>
            Insurance Name: {insurance.policyName} <br/>
            Insurance Provider: {insurance.insurerName} <br/>
            Sum Assured: {insurance.sumAssured} <br/>
            Policy Term: {insurance.policyTerm} <br/>
            Payment Term: {insurance.paymentTerm} <br/>
            Current State: {insurance.state} ( {insurance.state >= 0 ? stateDesc[insurance.state] : 'Rejected' } )<br/>           
            {/* {insurance.state >= 3 && <div>Bank UW Done: {insurance.bankUWResult?"True":"False"} </div>} */}
            {/* {insurance.state >= 5 && <div>Med UW Done: {insurance.medicalUWResult?"True":"False"} </div>} */}
                <div style={{ width: 200, height: 200, marginTop: "5%" }}>
                {insurance.state >= 0 && insurance.state <= 7 && <CircularProgressbar
                    value={insurance.state/7*100}
                    text={`${insurance.state}`}
                    styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'butt',
                        textSize: '16px',
                        pathTransitionDuration: 0.5,
                        pathColor: `rgba(173,216,230, ${(insurance.state / 7) * 1.5 > 1 ? 1 : (insurance.state / 7)})`,
                        textColor: 'lightblue',
                        trailColor: '#212121',
                        backgroundColor: '#3e98c7',
                    })}
                />}
                {insurance.state > 7 && <CircularProgressbar
                    value={(insurance.state - 7)/3*100}
                    text={`${insurance.state - 7}`}
                    styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'butt',
                        textSize: '16px',
                        pathTransitionDuration: 0.5,
                        pathColor: `rgba(144,238,144, ${(insurance.state - 7) / 4})`,
                        textColor: 'lightgreen',
                        trailColor: '#212121',
                        backgroundColor: '#3e98c7',
                    })}
                />}
                {insurance.state < 0 && <CircularProgressbar
                    value={100}
                    text={`R`}
                    styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'butt',
                        textSize: '16px',
                        pathTransitionDuration: 0.5,
                        pathColor: `rgba(199, 0, 0, ${1})`,
                        textColor: '#f88',
                        trailColor: 'red',
                        backgroundColor: '#3e98c7',
                    })}
                />}
                
                </div>    
        </div>
    )
}
const ConfirmAllDetails = async (insurance) => {
    // e.preventDefault()
    // console.log(insurance, " also here confirmed details")
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      web3.eth.getAccounts().then(console.log);
      if (web3) {
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const networkData = BlockSecureDeployer.networks[networkId]
        if (networkData) {
        const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
        console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
        
        // confirm details to be called.
        await deployedContract.methods.ConfirmDetails(Number(insurance.ID)-1).send({ from: accounts[0] })
        // update db
        insurance.state = 1;
        // fetch the current insurance from the db, and update it
        await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            .then(() => {
                        window.location.reload()
                    })
        }
    }
}
const ConfirmDetails = ({ insurance }) => {
    console.log(insurance, 'inside confirm details ')
    return (
        <button className="btn btn-primary" onClick={() => {ConfirmAllDetails(insurance)}}>Confirm Details</button>
    )
}
const ConfirmPolicyFinal = ({insurance}) => {
    console.log(insurance, 'inside confirm policy final')
    const [confirmPolicy, setConfirmPolicy] = useState('')
    const handleConfirmPolicy = (e) => {
        e.preventDefault()
        setConfirmPolicy(e.target.value)
    }
    const handleSubmitConfirmPolicy = async (e) => {
        e.preventDefault()
        const cp = confirmPolicy.toLowerCase()==='yes'?true:false
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                if (cp===true) {
                await deployedContract.methods.ConfirmPolicy(Number(insurance.ID)-1).send({ from: accounts[0] })
                // update db
                insurance.state = 7;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
                    .then(() => {
                        window.location.reload()
                    })
                } else {
                   await deployedContract.methods.Reject(Number(insurance.ID)-1).send({ from: accounts[0] }) 
                   insurance.state = -1;
                   await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
                            .then(() => {
                        window.location.reload()
                        // return <Redirect to="/profilehome" />
                    })
                }
            }
        }
    }
    return (
        <div>
            <form>

            <div className="form-group">
                <label for="customerVer"><bold>Confirm Policy?</bold></label>
                <input type="text" className="form-control" id="InputCustomerVer" value={confirmPolicy} placeholder="Yes/No" onChange={handleConfirmPolicy}/>
            </div>

            <button type="submit" class="btn btn-primary" onClick={handleSubmitConfirmPolicy}>Submit</button>
            </form> 
        </div>
    )
}

const RequestBankUnderwritingEvent = async (insurance) => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      web3.eth.getAccounts().then(console.log);
      if (web3) {
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const networkData = BlockSecureDeployer.networks[networkId]
        if (networkData) {
        const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
        console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
        
        // confirm details to be called.
        await deployedContract.methods.SendToBankUnderwriter(Number(insurance.ID)-1).send({ from: accounts[0] })
        // update db
        insurance.state = 2;
        // fetch the current insurance from the db, and update it
        await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            .then(() => {
                        window.location.reload()
                    })
        }
    }
}
const RequestMedicalUnderwritingEvent = async (insurance) => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      web3.eth.getAccounts().then(console.log);
      if (web3) {
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const networkData = BlockSecureDeployer.networks[networkId]
        if (networkData) {
        const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
        console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
        
        // confirm details to be called.
        await deployedContract.methods.SendToMedicalUnderwriter(Number(insurance.ID)-1).send({ from: accounts[0] })
            .then(() => {
                        window.location.reload()
                    })
        // update db
        insurance.state = 4;
        // fetch the current insurance from the db, and update it
        await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
        }
    }
}
const RequestBankUnderwriting = ({ insurance }) => {
    console.log(insurance, 'inside req buw')
    return (
        <button className="btn btn-primary" onClick={() => {RequestBankUnderwritingEvent(insurance)}}>Request Bank Underwriting</button>
    )
}
const RequestMedicalUnderwriting = ({ insurance }) => {
    return (
        <button className="btn btn-primary" onClick={() => {RequestMedicalUnderwritingEvent(insurance)}}>Request Medical Underwriting</button>
    )
}

const InvokeClaim = ({ insurance }) => {
    const [claimReason, setClaimReason] = useState('') 
    const [claimResponder, setClaimResponder] = useState('')
    const [requiresClaim, setRequiresClaim] = useState(false)
    const handleClaimReason = (e) => {
        e.preventDefault()
        setClaimReason(e.target.value)
    }
    const handleClaimResponder = (e) => {
        e.preventDefault()
        setClaimResponder(e.target.value) 
    }
    
    const handleSubmitInvokeClaim = async (e) => {
        e.preventDefault()
        // console.log(customerVerificationDone, active, financialHealthPoints, bankUWResult)
        const cr = claimReason
        const cres = claimResponder
        console.log(cr, cres)
 
        // update db
        insurance.state = 8;
        insurance.claimReason=cr;
        insurance.claimResponder=cres;

        // fetch the current insurance from the db, and update it
        await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
                    .then(() => {
                        window.location.reload()
                    })

    }
    return (
        <div>
            <form>

            <div className="form-group">
                <label for="claimReason"><bold>Claim Reason</bold></label>
                <input type="text" className="form-control" id="InputCR" value={claimReason} placeholder="Enter claim reason" onChange={handleClaimReason}/>
            </div>
            <div className="form-group">
                <label for="active"><bold>Claim Responder</bold></label>
                <input type="text" className="form-control" id="InputCRES" value={claimResponder} placeholder="Enter claim responder" onChange={handleClaimResponder}/>
            </div>
    <button type="submit" class="btn btn-primary" onClick={handleSubmitInvokeClaim}>Submit</button>
            </form>
     </div>
    )   
    
}

const ClaimVerificationFromHospital = ({ insurance }) => {
    const handleClaimVerificationFromHospital = async (e) => {
        e.preventDefault()
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                const cr = insurance.claimReason
                const cres = insurance.claimResponder

                // confirm details to be called.
                await deployedContract.methods.InvokeClaim(Number(insurance.ID)-1, cr, cres).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                // update db
                insurance.state = 9;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }

    }
    return (
        <div>
            <div>
               Claim Reason:  {insurance.claimReason} <br/>
               Claim Responder: {insurance.claimResponder} <br/>
            </div>
            <button type="submit" class="btn btn-primary" onClick={handleClaimVerificationFromHospital}>Claim Verification from Hospital</button>
        </div>
    )
}

const SubmitClaimDetails = ({ insurance }) => {
    const [claimReasonVerification, setClaimReasonVerification] = useState('')
    const [claimReasonRemark, setClaimReasonRemark] = useState('')
    const handleClaimReasonVerification = (e) => {
        e.preventDefault()
        setClaimReasonVerification(e.target.value)
    }
    const handleClaimReasonRemark = (e) => {
        e.preventDefault()
        setClaimReasonRemark(e.target.value) 
    }
    
    const handleSubmitClaimDetails = async (e) => {
        e.preventDefault()
        // console.log(customerVerificationDone, active, financialHealthPoints, bankUWResult)
        const crv = claimReasonVerification==='Yes'?true:false
        const crem = claimReasonRemark
        console.log(crv, crem)

        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                await deployedContract.methods.SubmitClaimDetails(Number(insurance.ID)-1, crv, crem).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                // update db
                insurance.state = 10;
                insurance.claimReasonVerification=crv;
                insurance.claimReasonRemark=crem;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }

    }
    return (
        <div>
            <form>

            <div className="form-group">
                <label for="claimReasonV"><bold>Claim Reason Verified? (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputCRV" value={claimReasonVerification} placeholder="Yes/No" onChange={handleClaimReasonVerification}/>
            </div>
            <div className="form-group">
                <label for="active"><bold>Remarks for claim reason</bold></label>
                <input type="text" className="form-control" id="InputCREM" value={claimReasonRemark} placeholder="claim remarks" onChange={handleClaimReasonRemark}/>
            </div>
    <button type="submit" class="btn btn-primary" onClick={handleSubmitClaimDetails}>Submit</button>
            </form>
        </div>
    )    
}

const AcceptOrRejectClaim = ({ insurance }) => {

    const handleSubmitAccepted = async (e) => {
        e.preventDefault()


        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                await deployedContract.methods.ClaimRequestAccepted(Number(insurance.ID)-1).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                // update db
                insurance.state = 11;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }

    }

    const handleSubmitRejected = async (e) => {
        e.preventDefault()
  
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                await deployedContract.methods.ClaimRequestRejected(Number(insurance.ID)-1).send({ from: accounts[0] })
                    
                // update db
                insurance.state = -2;
                console.log(insurance.state, 'insurance rejected');
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
                        .then(() => {
                        window.location.reload()
                        // return <Redirect to="/profilehome"/>
                    })
            }
        }

    }

    return (
        <div>
            <button type="submit" class="btn btn-success" onClick={handleSubmitAccepted}>Accept</button>
            <button type="submit" class="btn btn-danger" onClick={handleSubmitRejected}>Reject</button>
        </div>
    )
}

const UpdateFinancialHealth = ({ insurance }) => {
    const [customerVerificationDone, setCustomerVerificationDone] = useState('')
    const [active, setActive] = useState('')
    const [financialHealthPoints, setFinancialHealthPoints] = useState('')
    const [bankUWResult, setBankUWResult] = useState('')
    const handleCustomerVerificationDone = (e) => {
        e.preventDefault()
        setCustomerVerificationDone(e.target.value)
    }
    const handleActive = (e) => {
        e.preventDefault()
        setActive(e.target.value) 
    }
    const handleFinancialHealthPoints = (e) => {
        e.preventDefault()
        setFinancialHealthPoints(e.target.value)
    }
    const handleBankUWResult = (e) => {
         e.preventDefault()
        setBankUWResult(e.target.value)
    }
    const handleSubmitBUWDone = async (e) => {
        e.preventDefault()
        // console.log(customerVerificationDone, active, financialHealthPoints, bankUWResult)
        const cv = customerVerificationDone.toLowerCase()==='yes'?true:false
        const act = active.toLowerCase()==='yes'?true:false
        const fhp = Number(financialHealthPoints)
        const buwr = (bankUWResult.toLowerCase()==='yes'||bankUWResult.toLowerCase()==='done')?true:false
        console.log(cv, act, fhp, buwr)
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                await deployedContract.methods.UpdateFinancialHealth(Number(insurance.ID)-1, cv, act, fhp, buwr).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                // update db
                insurance.state = 3;
                insurance.financialHealthPoints=fhp;
                insurance.customerVerification=cv;
                insurance.active=act;
                insurance.bankUWResult=buwr;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }
    }
    return (
        <div>
            <form>

            <div className="form-group">
                <label for="customerVer"><bold>Customer Verification Done (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputCustomerVer" value={customerVerificationDone} placeholder="Yes/No" onChange={handleCustomerVerificationDone}/>
            </div>
            <div className="form-group">
                <label for="active"><bold>Active Status (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputActive" value={active} placeholder="Application active or not" onChange={handleActive}/>
            </div>
            <div className="form-group">
                <label for="fhp"><bold>Financial Health Points (out of 100)</bold></label>
                <input type="text" className="form-control" id="InputFHP" value={financialHealthPoints} placeholder="Enter financial health points" onChange={handleFinancialHealthPoints}/>
            </div>
            <div className="form-group">
                <label for="buwres"><bold>Bank UW Result</bold></label>
                <input type="text" className="form-control" id="InputBUWRes" value={bankUWResult} placeholder="Enter bank UW result" onChange={handleBankUWResult}/>
            </div>
    <button type="submit" class="btn btn-primary" onClick={handleSubmitBUWDone}>Submit</button>
            </form>
        </div>
    )
}
const UpdateMedicalHealth = ({ insurance }) => {
    const [physicalVerificationDone, setPhysicalVerificationDone] = useState('')
    const [activeStatus, setActiveStatus] = useState('')
    const [healthScore, setHealthScore] = useState('')
    const [medUWResult, setMedUWResult] = useState('')
    const handlePhysicalVerificationDone = (e) => {
        e.preventDefault()
        setPhysicalVerificationDone(e.target.value)
    }
    const handleActiveStatus = (e) => {
        e.preventDefault()
        setActiveStatus(e.target.value) 
    }
    const handleHealthScore = (e) => {
        e.preventDefault()
        setHealthScore(e.target.value)
    }
    const handleMedUWResult = (e) => {
         e.preventDefault()
        setMedUWResult(e.target.value)
    }
    const handleSubmitMWReject = async (e) => {
        e.preventDefault()
                const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                // confirm details to be called.
                await deployedContract.methods.Reject(Number(insurance.ID)-1).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                insurance.state = -3
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }
    }
    const handleSubmitMUWDone = async (e) => {
        e.preventDefault()
        // console.log(customerVerificationDone, active, financialHealthPoints, bankUWResult)
        const pv = physicalVerificationDone.toLowerCase()==='yes'?true:false
        const act = activeStatus.toLowerCase()==='yes'?true:false
        const mhp = Number(healthScore)
        const muwr = (medUWResult.toLowerCase()==='yes'||medUWResult.toLowerCase()==='done')?true:false
        console.log(pv, act, mhp, muwr)
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                await deployedContract.methods.UpdateMedicalHealth(Number(insurance.ID)-1, act, mhp, pv, muwr).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                // update db
                insurance.state = 5;
                insurance.healthScore=mhp;
                insurance.physicalVerification=pv;
                insurance.activeStatus=act;
                insurance.medUWResult=muwr;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }
    }
    return (
        <div>
            <form>

            <div className="form-group">
                <label for="physicalVer"><bold>Physical Verification Done (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputPhysicalVer" value={physicalVerificationDone} placeholder="Yes/No" onChange={handlePhysicalVerificationDone}/>
            </div>
            <div className="form-group">
                <label for="active"><bold>Active Status (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputActive" value={activeStatus} placeholder="Application active or not" onChange={handleActiveStatus}/>
            </div>
            <div className="form-group">
                <label for="mhp"><bold>Medical Health Score (out of 100)</bold></label>
                <input type="text" className="form-control" id="InputMHP" value={healthScore} placeholder="Enter medical health score" onChange={handleHealthScore}/>
            </div>
            <div className="form-group">
                <label for="muwres"><bold>Medical UW Result</bold></label>
                <input type="text" className="form-control" id="InputMUWRes" value={medUWResult} placeholder="Enter medical UW result" onChange={handleMedUWResult}/>
            </div>
           
          
            
            
    <span>
        <button type="submit" class="btn btn-primary" onClick={handleSubmitMUWDone} style={{marginRight:"2%"}}>Submit</button>
        <button type="submit" class="btn btn-danger" onClick={handleSubmitMWReject}>Reject</button>
    </span>
            </form>
        </div>
    )
}

const RecalculatePolicy = ({ insurance }) => {
    const [premiumReceived, setPremiumReceived] = useState('')
    const [policyNumber, setPolicyNumber] = useState('')
    const [issuanceDate, setIssuanceDate] = useState('')
    const [maturityDate, setMaturityDate] = useState('')
    const [premiumFinal, setPremiumFinal] = useState('')
    const [sumAssuredFinal, setSumAssuredFinal] = useState('')
    const [policyIssued, setPolicyIssued] = useState('')
    const handlePremiumFinal = (e) => {
        e.preventDefault()
        setPremiumFinal(e.target.value)
    }
    const handleSumAssuredFinal = (e) => {
        e.preventDefault()
        setSumAssuredFinal(e.target.value)
    }
    const handlePolicyIssued = (e) => {
        e.preventDefault()
        setPolicyIssued(e.target.value)
    }
    const handlePremiumReceived = (e) => {
        e.preventDefault()
        setPremiumReceived(e.target.value)
    }
    const handlePolicyNumber = (e) => {
        e.preventDefault()
        setPolicyNumber(e.target.value) 
    }
    const handleIssuanceDate = (e) => {
        e.preventDefault()
        setIssuanceDate(e.target.value)
    }
    const handleMaturityDate = (e) => {
         e.preventDefault()
        setMaturityDate(e.target.value)
    }
    const handleSubmitRecalculatePolicy = async (e) => {
        e.preventDefault()
        // console.log(customerVerificationDone, active, financialHealthPoints, bankUWResult)
        const pr = premiumReceived.toLowerCase()==='yes'?true:false
        const pn = Number(policyNumber)
        const issd = issuanceDate.toString()
        const matd = maturityDate.toString()
        const pf = Number(premiumFinal)
        const saf = Number(sumAssuredFinal)
        const pi = policyIssued.toLowerCase()==='yes'?true:false

        console.log(pr, pn, issd, matd, pf, saf, pi)
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        web3.eth.getAccounts().then(console.log);
        if (web3) {
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()
            const networkData = BlockSecureDeployer.networks[networkId]
            if (networkData) {
                const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
                console.log(deployedContract, 'to change state', accounts[0], insurance.ID, 'also')
                
                // confirm details to be called.
                await deployedContract.methods.RecalculatePolicy(Number(insurance.ID)-1, pr, pn, issd, matd, pf, saf, pi).send({ from: accounts[0] })
                    .then(() => {
                        window.location.reload()
                    })
                // update db
                insurance.state = pi===true?6:-1;
                insurance.premiumReceived=pr;
                insurance.policyNumber=pn;
                insurance.issuanceDate=issd;
                insurance.maturityDate=matd;
                insurance.premiumFinal=pf;
                insurance.sumAssuredFinal=saf;
                insurance.policyIssued=pi;
                // fetch the current insurance from the db, and update it
                await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
            }
        }
    }
    return (
        <div>
            <form>

            <div className="form-group">
                <label for="premRec"><bold>Premium Received (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputPremRec" value={premiumReceived} placeholder="Yes/No" onChange={handlePremiumReceived}/>
            </div>
            <div className="form-group">
                <label for="policyNum"><bold>Policy Number</bold></label>
                <input type="text" className="form-control" id="InputPolicyNum" value={policyNumber} placeholder="Enter policy number" onChange={handlePolicyNumber}/>
            </div>
            <div className="form-group">
                <label for="issd"><bold>Issuance Date</bold></label>
                <input type="text" className="form-control" id="InputISSD" value={issuanceDate} placeholder="Enter Issuance Date" onChange={handleIssuanceDate}/>
            </div>
            <div className="form-group">
                <label for="matd"><bold>Maturity Date</bold></label>
                <input type="text" className="form-control" id="InputMATD" value={maturityDate} placeholder="Enter Maturity Date" onChange={handleMaturityDate}/>
            </div>
            <div className="form-group">
                <label for="premF"><bold>Final Premium</bold></label>
                <input type="text" className="form-control" id="InputPremF" value={premiumFinal} placeholder="Enter final premium" onChange={handlePremiumFinal}/>
            </div>
           <div className="form-group">
                <label for="sumAF"><bold>Final Sum Assured</bold></label>
                <input type="text" className="form-control" id="InputSumAF" value={sumAssuredFinal} placeholder="Enter final sum assured" onChange={handleSumAssuredFinal}/>
            </div>
            <div className="form-group">
                <label for="polIss"><bold>Policy Issued (Yes/No)</bold></label>
                <input type="text" className="form-control" id="InputPolIss" value={policyIssued} placeholder="Yes/No" onChange={handlePolicyIssued}/>
            </div>
            
    <button type="submit" class="btn btn-primary" onClick={handleSubmitRecalculatePolicy}>Submit</button>
            </form>
        </div>
    )
}
const DisplayInsuranceStatus = ({ currentUser, insurance }) => {
    // based on the user type, we provide them with different functionalities
    // const mapStateDescription = {
    //     0 : "Applied For Insurance",
    //     1 : "Confirm Details",
    //     2 : "Send to Bank Underwriter",
    // }
    if (insurance===null) return (
        <div>Loading Insurances... </div>
    )
    if (currentUser.user.type==='individual') {
        console.log(insurance, 'now')
        return (
            <div>
            <InsuranceDetails insurance={insurance}/> 
            {insurance.state===0&&<ConfirmDetails insurance={insurance}/>}
            {insurance.state===1&&<div>Thanks for confirming your details. The application is being processed. </div>}
            {insurance.state===5&&<div>The policy is being recalculated.</div>}
            {insurance.state===-1&&<div>Your Application was rejected.</div>}
            {insurance.state===6&&<ConfirmPolicyFinal insurance={insurance}/>}
            {insurance.state===7&&<div>You have confirmed the policy. You are eligible for invoking claims <InvokeClaim insurance={insurance}/></div>}
            {(insurance.state===8||insurance.state===9)&&<div>The claim has been invoked. Waiting for claim verification from hospital. </div>}
            {insurance.state===10&&<div>The claim has been verified by the hospital. Waiting for final response from insurance provider</div>}
            {insurance.state===11&&<div>The claim has been accepted! </div>}
            {insurance.state===-2&&<div>The claim was rejected. </div>}
            {(insurance.state===4 || insurance.state === 3)&&<div>The application is being processed </div>}
            
            </div>
        )
    } else if (currentUser.user.type==='Insurer' && (insurance.state>=1 || insurance.state < 0)) {
        return (
            <div>
                <InsuranceDetails insurance={insurance}/>
                {insurance.state===1&&<RequestBankUnderwriting insurance={insurance}/>}
                {insurance.state===2&&<div>Requested Bank Underwriting</div>}
                {insurance.state===3&&<RequestMedicalUnderwriting insurance={insurance}/>}
                {insurance.state===4&&<div>Requested Medical Underwriting</div>}
                {insurance.state===5&&<RecalculatePolicy insurance={insurance}/>}
                {insurance.state===6&&<div>The insurance application was approved. Waiting for client confirmation.</div>}
                {insurance.state===7&&<div>The client has accepted the policy.</div>}
                {insurance.state===8&&<div>The client has invoked the claim. <ClaimVerificationFromHospital insurance={insurance}/> </div>}
                {insurance.state===9&&<div>The claim has been requested for verification from the hospital </div>}
                {insurance.state===10&&<div>The claim has been verified. <AcceptOrRejectClaim insurance={insurance}/></div>}
                {insurance.state===11&&<div>The claim has been accepted! </div>}
                {insurance.state===-2&&<div>The claim was rejected. </div>}
                {insurance.state===-1&&<div>The insurance application was rejected</div>}
            </div>
        )
    } else if (currentUser.user.type==='Bank') {
        return (
            <div>
                <InsuranceDetails insurance={insurance}/>
                {insurance.state===2&&<UpdateFinancialHealth insurance={insurance}/>}
                {insurance.state===3&&<div>Financial Health Updated. Sent to Insurance Provider. </div>}
                {insurance.state===4&&<div>Requested Medical Underwriting</div>}
                {insurance.state===5&&<div>Medical Underwriting Done. Health Score Updated.</div>}
                {insurance.state===6&&<div>The insurance application was approved. Waiting for client confirmation </div>}
                {insurance.state===7&&<div>The client has accepted the policy </div>}
                {insurance.state===-1&&<div>The insurance application was rejected.</div>}

            </div>
        )
    } else if (currentUser.user.type==='Hospital') {
        return (
            <div>
                <InsuranceDetails insurance={insurance}/>
                {insurance.state===4&&<UpdateMedicalHealth insurance={insurance}/>}
                {insurance.state===5&&<div>Medical Underwriting Done. Health Score Updated.</div>}
                {insurance.state===6&&<div>The insurance application was approved. Waiting for client confirmation </div>}
                {insurance.state===7&&<div>The client has accepted the policy </div>}
                {insurance.state===-1&&<div>The insurance application was rejected</div>}
                {insurance.state===9&&<div>The claim was invoked. Please verify claim details and submit. <SubmitClaimDetails insurance={insurance}/> </div>}
                {insurance.state===10&&<div>The claim was verified.</div>}
            </div>
        )
    }
}
const updateDbAndBlockchain = async () => {
    // on call it calls function on blockchain, based on ID
    // it fetches the current state from the blockchain
    // updates the state back to the db, and the db displays on frontend 
}
const InsuranceStatus = () => {
    const { user: currentUser } = useSelector((state) => state.authReducer)
    const [insurance, setInsurance] = useState(null)
    const [deployerContract, setDeployerContract] = useState(null)
    const id = useParams().id
    useEffect(() => {
      const loadWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      web3.eth.getAccounts().then(console.log);
      if (web3) {
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const networkData = BlockSecureDeployer.networks[networkId]
        if (networkData) {
          const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
          if(deployedContract===null) {setDeployerContract(deployedContract)}
          else{ 
              // fetch the current contract with index id
              console.log(deployedContract, 'heres the deployed contract')
            //   const currentInsurance = await deployedContract.methods.FetchInsuranceByIndex(Number(id)-1).call()
            //   console.log(currentInsurance, "found current Insurance here")
            let getAllInsurances = await axios.get(insUrl)
            getAllInsurances = getAllInsurances.data
            console.log(getAllInsurances, 'all insurances!!')
            let currentInsurance = [];
            for (let j = 0; j < getAllInsurances.length; j++) {
                console.log(id, 'and', getAllInsurances[j].ID)
                if (Number(id) === Number(getAllInsurances[j].ID)) {
                    currentInsurance  = getAllInsurances[j]
                }
        }
              setInsurance(currentInsurance)
        }
      }
      }
    }
    loadWeb3()
    }, [deployerContract])
    if (!currentUser) {
        return <Redirect to="/login"/>
    } else {
        console.log(currentUser, 'logged In')
    }
    console.log(insurance, 'after load');
    return (
        <div style={{color: "lightyellow", backgroundColor: "#282828", padding: "2%", borderRadius: "1%", marginBottom: "2%"}}>Insurance Id: {id}  <br/>
        {/* Insurance Details Here: */}
        <DisplayInsuranceStatus currentUser={currentUser} insurance={insurance}/>
        </div>
    )
}
export default InsuranceStatus