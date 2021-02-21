import { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Web3 from 'web3'
import axios from 'axios'
import BlockSecureDeployer from '../abi/BlockSecureDeployer.json'
const insUrl = 'http://localhost:3001/api/insurances'
const putUrl = 'http://localhost:3001/api/insurances'
const InsuranceDetails = ({insurance}) => {
    return (
        <div>
            Username: {insurance.name} <br/>
            Aadhaar Number: {insurance.aadhaarNumber} <br/>
            Insurance Name: {insurance.policyName} <br/>
            Insurance Provider: {insurance.insurerName} <br/>
            Sum Assured: {insurance.sumAssured} <br/>
            Policy Term: {insurance.policyTerm} <br/>
            Payment Term: {insurance.paymentTerm} <br/>
            Current State: {insurance.state} <br/>           
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
        const cp = confirmPolicy==='Yes'?true:false
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
                } else {
                   await deployedContract.methods.Reject(Number(insurance.ID)-1).send({ from: accounts[0] }) 
                   insurance.state = -1;
                   await axios.put(`http://localhost:3001/api/insurances/${insurance.ID}`, insurance)
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
        await deployedContract.methods.SendToBankUnderwriter(Number(insurance.ID)-1).send({ from: accounts[0] })
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
        const cv = customerVerificationDone==='Yes'?true:false
        const act = active==='Yes'?true:false
        const fhp = Number(financialHealthPoints)
        const buwr = bankUWResult==='Yes'?true:false
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
    const handleSubmitMUWDone = async (e) => {
        e.preventDefault()
        // console.log(customerVerificationDone, active, financialHealthPoints, bankUWResult)
        const pv = physicalVerificationDone==='Yes'?true:false
        const act = activeStatus==='Yes'?true:false
        const mhp = Number(healthScore)
        const muwr = medUWResult==='Yes'?true:false
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
           
          
            
            
    <button type="submit" class="btn btn-primary" onClick={handleSubmitMUWDone}>Submit</button>
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
        const pr = premiumReceived==='Yes'?true:false
        const pn = Number(policyNumber)
        const issd = Number(issuanceDate) 
        const matd = Number(maturityDate)
        const pf = Number(premiumFinal)
        const saf = Number(sumAssuredFinal)
        const pi = policyIssued==='Yes'?true:false

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
            {insurance.state===5&&<div>The policy is being recalculated.</div>}
            {insurance.state===-1&&<div>Your Application was rejected.</div>}
            {insurance.state===6&&<ConfirmPolicyFinal insurance={insurance}/>}
            {insurance.state===7&&<div>Your have confirmed the policy. You are eligible for invoking claims </div>}
            </div>
        )
    } else if (currentUser.user.type==='Insurer' && insurance.state>=1) {
        return (
            <div>
                <InsuranceDetails insurance={insurance}/>
                {insurance.state===1&&<RequestBankUnderwriting insurance={insurance}/>}
                {insurance.state===2&&<div>Requested Bank Underwriting</div>}
                {insurance.state===3&&<RequestMedicalUnderwriting insurance={insurance}/>}
                {insurance.state===4&&<div>Requested Medical Underwriting</div>}
                {insurance.state===5&&<RecalculatePolicy insurance={insurance}/>}
                {insurance.state===6&&<div>The insurance application was approved. Waiting for client confirmation.</div>}
                {insurance.state===7&&<div>The client has accepted the policy </div>}
                {insurance.state===-1&&<div>The insurance application was rejected</div>}
            </div>
        )
    } else if (currentUser.user.type==='Bank') {
        return (
            <div>
                Bank func here
                <InsuranceDetails insurance={insurance}/>
                {insurance.state===2&&<UpdateFinancialHealth insurance={insurance}/>}
                {insurance.state===3&&<div>Financial Health Updated. Sent to Insurance Provider. </div>}
                {insurance.state===4&&<div>Requested Medical Underwriting</div>}
                {insurance.state===5&&<div>Medical Underwriting Done. Health Score Updated.</div>}
                {insurance.state===6&&<div>The insurance application was approved. Waiting for client confirmation </div>}
                {insurance.state===7&&<div>The client has accepted the policy </div>}
                {insurance.state===-1&&<div>The insurance application was rejected</div>}
            </div>
        )
    } else if (currentUser.user.type==='Hospital') {
        return (
            <div>
                Hospital func here
                <InsuranceDetails insurance={insurance}/>
                {insurance.state===4&&<UpdateMedicalHealth insurance={insurance}/>}
                {insurance.state===5&&<div>Medical Underwriting Done. Health Score Updated.</div>}
                {insurance.state===6&&<div>The insurance application was approved. Waiting for client confirmation </div>}
                {insurance.state===7&&<div>The client has accepted the policy </div>}
                {insurance.state===-1&&<div>The insurance application was rejected</div>}
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
    return (
        <div>Insurance with id: {id} here! <br/>
        {/* Insurance Details Here: */}
        <DisplayInsuranceStatus currentUser={currentUser} insurance={insurance}/>
        </div>
    )
}
export default InsuranceStatus