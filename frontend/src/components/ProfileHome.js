import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Web3 from 'web3'
import BlockSecureDeployer from '../abi/BlockSecureDeployer.json'

const insUrl = 'http://localhost:3001/api/insurances'
const userUrl = 'http://localhost:3001/api/users'


const displayInsuranceDetails = (insurances) => (
    <div>
        <h4>Insurance Details </h4>
       <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Provider</th>
      <th scope="col">Type</th>
      <th scope="col">Sum Assured</th>
      <th scope="col">Claim Status</th>
      <th scope="col">Details</th>
    </tr>
  </thead>
  <tbody>
      {insurances.map((insurance) => 
      <tr>
        <th scope="row">{insurance.ID}</th>
        <td>{insurance.insurerAddress}</td>
        <td>{insurance.policyName}</td>
        <td>{insurance.sumAssured}</td>
        <td>{insurance.state}</td>
        <td><a href={`/insurance-status/${insurance.ID}`} role="button" className="btn btn-primary">Info</a></td>
        </tr>
          )}
        </tbody>
        </table>
        <GetInsuranceButton />
    </div>
)
const GetInsuranceButton = () => (
  <a href="/insurances-list" role="button" className="btn btn-danger">Buy Insurance</a>
)
const CreateInsuranceButton = () => (
  // route to a page where in I can add an insurance
  <a href="/create-insurance" role="button" className="btn btn-primary">Add Insurance</a>
)
const displayHospitalInsureeDetails = (insurances) => (
    <div>
      <p>Hospital Details Here!</p>
        <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Username</th>
      <th scope="col">Aadhaar Card Number</th>
      <th scope="col">EthereumAddress</th>
      <th scope="col">Name of Insurance</th>
      <th scope="col">Premium</th>
      <th scope="col">Current State</th>
      <th scope="col">Details</th>
    </tr>
  </thead>
  <tbody>
      {insurances.map((insuree) => 
      <tr>
        <th scope="row">{insuree.ID}</th>
        <td>{insuree.name}</td>
        <td>{insuree.aadhaarNumber}</td>
        <td>{insuree.userAddress}</td>
        <td>{insuree.policyName}</td>
        <td>{insuree.sumAssured}</td>
        <td>{insuree.state}</td>
        <td><a href={`/insurance-status/${insuree.ID}`} role="button" className="btn btn-primary">Get Info</a></td>
        </tr>
          )}
        </tbody>
        </table>
    </div>
)
const displayBankInsureeDetails = (insurances) => (
    <div>
      <p>Bank Details Here!</p>
        <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Username</th>
      <th scope="col">Aadhaar Card Number</th>
      <th scope="col">EthereumAddress</th>
      <th scope="col">Name of Insurance</th>
      <th scope="col">Premium</th>
      <th scope="col">Current State</th>
      <th scope="col">Details</th>
    </tr>
  </thead>
  <tbody>
      {insurances.map((insuree) => 
      <tr>
        <th scope="row">{insuree.ID}</th>
        <td>{insuree.name}</td>
        <td>{insuree.aadhaarNumber}</td>
        <td>{insuree.userAddress}</td>
        <td>{insuree.policyName}</td>
        <td>{insuree.sumAssured}</td>
        <td>{insuree.state}</td>
        <td><a href={`/insurance-status/${insuree.ID}`} role="button" className="btn btn-primary">Get Info</a></td>
        </tr>
          )}
        </tbody>
        </table>
    </div>
)
const displayInsureeDetails = (insurances) => (
    <div>
      <p>Insuree Details Here!</p>
        <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Username</th>
      <th scope="col">Aadhaar Card Number</th>
      <th scope="col">EthereumAddress</th>
      <th scope="col">Name of Insurance</th>
      <th scope="col">Premium</th>
      <th scope="col">Current State</th>
      <th scope="col">Details</th>
    </tr>
  </thead>
  <tbody>
      {insurances.map((insuree) => 
      <tr>
        <th scope="row">{insuree.ID}</th>
        <td>{insuree.name}</td>
        <td>{insuree.aadhaarNumber}</td>
        <td>{insuree.userAddress}</td>
        <td>{insuree.policyName}</td>
        <td>{insuree.sumAssured}</td>
        <td>{insuree.state}</td>
        <td><a href={`/insurance-status/${insuree.ID}`} role="button" className="btn btn-primary">Get Info</a></td>
        </tr>
          )}
        </tbody>
        </table>
        <CreateInsuranceButton />
    </div>

)
const ProfileHome = () => {
    const { user: currentUser } = useSelector((state) => state.authReducer)
    const [deployerContract, setDeployerContract] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [insurances, setInsurances] = useState([])
    useEffect(() => {
      const loadWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      web3.eth.getAccounts().then(console.log);
      console.log(web3, 'settled')
      console.log('loaded web3')
      if (web3) {
        const accounts = await web3.eth.getAccounts()
        console.log(accounts, 'here here here')
        setAccounts(accounts)
        const networkId = await web3.eth.net.getId()
        const networkData = BlockSecureDeployer.networks[networkId]
        if (networkData) {
          const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
        //   console.log(deployedContract, 'deployed now')
          if(deployerContract===null) {setDeployerContract(deployedContract)}
          else{ console.log(deployerContract, 'deployer idk inside application')
          const currentIdx = await deployerContract.methods.insuranceCounter().call()
          console.log(currentIdx, 'currentIdx')
          let getAllInsurances = await axios.get(insUrl)
          getAllInsurances = getAllInsurances.data
          console.log(getAllInsurances)
          if (currentUser.user.type==='individual') {
            const FetchedInsurances = []
              for (let j = 0; j < getAllInsurances.length; j++) {
                if (Number(currentUser.user.aadhaarCardNumber) === Number(getAllInsurances[j].aadhaarNumber)) {
                  FetchedInsurances.push(getAllInsurances[j])
                }
              }
          setInsurances(FetchedInsurances)
          console.log(FetchedInsurances, 'after fetch', insurances)
          } else if (currentUser.user.type==='Insurer') {
            const FetchedInsurances = []
            let getAllInsurances = await axios.get(insUrl)
            getAllInsurances = getAllInsurances.data
            console.log(getAllInsurances, 'all insurances!!')

            for (let j = 0; j < getAllInsurances.length; j++) {
                console.log(currentUser.user.address, 'and', getAllInsurances[j].insurerAddress)
                if (String(currentUser.user.address) === String(getAllInsurances[j].insurerAddress)) {
                  console.log('hey hey got it hey!')
                  FetchedInsurances.push(getAllInsurances[j])
                } else {
                  console.log('nuff')
                }
              } 

            setInsurances(FetchedInsurances)
            console.log(FetchedInsurances, 'fetched all insurances')
          } else if (currentUser.user.type==='Bank') {
            const FetchedInsurances = []
            let getAllInsurances = await axios.get(insUrl)
            getAllInsurances = getAllInsurances.data
            console.log(getAllInsurances, 'all insurances!!')

            for (let j = 0; j < getAllInsurances.length; j++) {
                console.log(currentUser.user.address, 'and', getAllInsurances[j].bankUWAddress)
                if (String(currentUser.user.address) === String(getAllInsurances[j].bankUWAddress)) {
                  console.log('hey hey got bankuw hey!')
                  FetchedInsurances.push(getAllInsurances[j])
                } else {
                  console.log('nuff')
                }
              } 
            setInsurances(FetchedInsurances)
          } else if (currentUser.user.type==='Hospital') {
            const FetchedInsurances = []
            let getAllInsurances = await axios.get(insUrl)
            getAllInsurances = getAllInsurances.data
            console.log(getAllInsurances, 'all insurances!!')

            for (let j = 0; j < getAllInsurances.length; j++) {
                console.log(currentUser.user.address, 'and', getAllInsurances[j].medUWAddress)
                if (String(currentUser.user.address) === String(getAllInsurances[j].medUWAddress)) {
                  console.log('hey hey got meduw hey!')
                  FetchedInsurances.push(getAllInsurances[j])
                } else {
                  console.log('nuff')
                }
              } 
              setInsurances(FetchedInsurances)
          }
        }
      }
      }
    }
    loadWeb3()
    }, [deployerContract])
    console.log(currentUser)
    if (!currentUser) {
        return <Redirect to="/login" />
    } else {
        console.log(currentUser.user.insurances)
    } 
    // console.log(insurances, 'render ')
    return (
        <div>
            {currentUser.user.type==='individual' ? <p>Your address: {currentUser.user.address}  Your email: {currentUser.user.email}  Your Aadhaar: {currentUser.user.aadhaarCardNumber}</p>
            : <div>Your email: {currentUser.user.email} Your address: {currentUser.user.address} </div>}
            {/* Add correct routing to these parts, from the insurance schema */}
            <div>{currentUser.user.type==='individual'
            ? displayInsuranceDetails(insurances) 
            : (currentUser.user.type==='Insurer'? displayInsureeDetails(insurances)
            : (currentUser.user.type==='Bank' ? displayBankInsureeDetails(insurances)
          : displayHospitalInsureeDetails(insurances))) }
            </div>
        </div>
    )
}
export default ProfileHome