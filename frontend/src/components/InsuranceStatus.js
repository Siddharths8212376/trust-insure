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
const RequestBankUnderwriting = ({ insurance }) => {
    console.log(insurance, 'inside req buw')
    return (
        <button className="btn btn-primary" onClick={() => {RequestBankUnderwritingEvent(insurance)}}>Request Bank Underwriting</button>
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
const DisplayInsuranceStatus = ({ currentUser, insurance }) => {
    // based on the user type, we provide them with different functionalities

    if (insurance===null) return (
        <div>Loading Insurances... </div>
    )
    if (currentUser.user.type==='individual') {
        return (
            <div>
            <InsuranceDetails insurance={insurance}/> 
            {insurance.state===0&&<ConfirmDetails insurance={insurance}/>}
            {insurance.state!==0&&<div>Processing...</div>}
            </div>
        )
    } else if (currentUser.user.type==='Insurer' && insurance.state>=1) {
        return (
            <div>
                <InsuranceDetails insurance={insurance}/>
                {insurance.state==1&&<RequestBankUnderwriting insurance={insurance}/>}
                {insurance.state==2&&<div>Requested Bank Underwriting</div>}
                {insurance.state==4&&<div>Requested Medical Underwriting</div>}
            </div>
        )
    } else if (currentUser.user.type==='Bank') {
        return (
            <div>
                Bank func here
                <InsuranceDetails insurance={insurance}/>
                {insurance.state==2&&<UpdateFinancialHealth insurance={insurance}/>}
            </div>
        )
    } else if (currentUser.user.type==='Hospital') {
        return (
            <div>
                Hospital func here
                <InsuranceDetails insurance={insurance}/>
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