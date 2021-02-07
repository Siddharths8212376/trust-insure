import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Web3 from 'web3'
import BlockSecureDeployer from '../abi/BlockSecureDeployer.json'

const insUrl = 'http://localhost:3001/api/insurances'


const displayInsuranceDetails = (insurances) => (
    <div>
        <h4>Insurance Details </h4>
       <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Provider</th>
      <th scope="col">Type</th>
      <th scope="col">Premium</th>
      <th scope="col">Claim Status</th>
    </tr>
  </thead>
  <tbody>
      {/* {insurances.map((insurance) => 
      <tr>
        <th scope="row">{insurance._id}</th>
        <td>{insurance.insurer}</td>
        <td>{insurance.typeOfInsurance}</td>
        <td>{insurance.premium}</td>
        <td>{insurance.claimStatus}</td>
        </tr>
          )} */}
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
const displayInsureeDetails = (insurees) => (
    <div>
        <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Username</th>
      <th scope="col">Address</th>
      <th scope="col">Type of Insurance</th>
      <th scope="col">Premium</th>
      <th scope="col">Claim Status</th>
    </tr>
  </thead>
  <tbody>
      {insurees.map((insuree) => 
      <tr>
        <th scope="row">{insuree._id}</th>
        <td>{insuree.username}</td>
        <td>{insuree.address}</td>
        <td>{insuree.typeOfInsurance}</td>
        <td>{insuree.premium}</td>
        <td>{insuree.claimStatus}</td>
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
          if (currentUser.user.type==='individual') {
            const FetchedInsurances = []
            for (let i = 0; i < currentIdx; i++) {
              const awaitedInsurance = await deployerContract.methods.FetchInsuranceByIndex(i).call({from: currentUser.user.address})           
              console.log(awaitedInsurance, i , ' ith here', awaitedInsurance[0], currentUser.user.aadhaarCardNumber)
              if (Number(awaitedInsurance.aadhaarCardNumber)===Number(currentUser.user.aadhaarCardNumber)) {
                console.log('match found', currentUser.user.aadhaarCardNumber)
                awaitedInsurance.ID = i
                // console.log(awaitedInsurance, 'here and now', i)
                // setInsurances([...insurances, awaitedInsurance])
                FetchedInsurances.push(awaitedInsurance)
              }
              // console.log(insurances, 'after fetch')
          }
          setInsurances(FetchedInsurances)
          console.log(FetchedInsurances, 'after fetch', insurances)
          } else {
            for (let i = 0; i < currentIdx; i++) {
              const awaitedInsurance = await deployerContract.methods.FetchInsuranceByIndex(i).call({from: currentUser.user.address})           
              console.log(awaitedInsurance, i, ' ith here')
            }
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
            <p>Your address: {currentUser.user.address}  Your email: {currentUser.user.email}  Your Aadhaar: {currentUser.user.aadhaarCardNumber}</p>
            {/* Add correct routing to these parts, from the insurance schema */}
            <div>{currentUser.user.type==='individual'
            ? displayInsuranceDetails(insurances) 
            : displayInsureeDetails(currentUser.user.insurees) }
            </div>
        </div>
    )
}
export default ProfileHome