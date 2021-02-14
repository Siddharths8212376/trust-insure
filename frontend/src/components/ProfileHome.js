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
    </tr>
  </thead>
  <tbody>
      {insurances.map((insurance) => 
      <tr>
        <th scope="row">{insurance.ID}</th>
        <td>{insurance[6]}</td>
        <td>{insurance[7]}</td>
        <td>{insurance[8]}</td>
        <td>false</td>
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
const displayInsureeDetails = (insurances) => (
    <div>
        <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Username</th>
      <th scope="col">Aadhaar Card Number</th>
      <th scope="col">EthereumAddress</th>
      <th scope="col">Email</th>
      <th scope="col">Type of Insurance</th>
      <th scope="col">Premium</th>
      <th scope="col">Current State</th>
    </tr>
  </thead>
  <tbody>
      {insurances.map((insuree) => 
      <tr>
        <th scope="row">{insuree.ID}</th>
        <td>{insuree.username}</td>
        <td>{insuree[0]}</td>
        <td>{insuree.address}</td>
        <td>{insuree.email}</td>
        <td>{insuree[7]}</td>
        <td>{insuree[8]}</td>
        <td>{insuree[3]}</td>
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
            const FetchedInsurances = []
            for (let i = 0; i < currentIdx; i++) {
              const awaitedInsurance = await deployerContract.methods.FetchInsuranceByIndex(i).call({from: currentUser.user.address})           
              console.log(awaitedInsurance, i, currentUser.user.address,  ' ith here')
              if (awaitedInsurance[5] === currentUser.user.address) {
                console.log('found match!!!')
                awaitedInsurance.ID = i
                let users = await axios.get(userUrl)
                // console.log(users, 'users here')
                users = users.data
                for (let uIdx = 0; uIdx < users.length; uIdx++) {
                  // console.log(users[uIdx], 'ith user', users[uIdx].aadhaarCardNumber, 'adhar match', awaitedInsurance[0])
                  if (Number(users[uIdx].aadhaarCardNumber) === Number(awaitedInsurance[0])){
                    awaitedInsurance.username = users[uIdx].username
                    awaitedInsurance.email = users[uIdx].email
                    awaitedInsurance.address = users[uIdx].address
                    // console.log('found the matching users')
                  }
                }
                FetchedInsurances.push(awaitedInsurance)
              }
            }
            setInsurances(FetchedInsurances)
            // console.log(FetchedInsurances, 'fetched all insurances')
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
            : displayInsureeDetails(insurances) }
            </div>
        </div>
    )
}
export default ProfileHome