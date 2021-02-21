import { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Web3 from 'web3'
import axios from 'axios'
import BlockSecureDeployer from '../abi/BlockSecureDeployer.json'
const insUrl = 'http://localhost:3001/api/insurances'

const DisplayInsuranceStatus = ({ currentUser, insurance }) => {
    if (insurance===null) return (
        <div>Loading Insurances... </div>
    )
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