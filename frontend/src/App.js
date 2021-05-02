import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Router, Switch, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Web3 from 'web3'

import Login from './components/LandingLogin'
import Register from './components/Register'
import ProfileHome from './components/ProfileHome'
import InsurancesList from './components/InsurancesList'
import InsuranceScreen from './components/insuranceScreen'
import Apply from './components/applyInsurance'
import CreateInsurance from './components/createInsurance'
import InsuranceStatus from './components/InsuranceStatus'

import { logout } from './actions/authActionCreater'
import { history } from './helpers/history'

import BlockSecureDeployer from './abi/BlockSecureDeployer.json'
import background from "./components/bgm.PNG";
import "./css/App.css";


function App() {
  
  const [web3, setWeb3] = useState({})
  const [deployerContract, setDeployerContract] = useState(null)
  const [insuranceCount, setInsuranceCount] = useState(-1)
  useEffect(() => {
    const loadWeb3 = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    web3.eth.getAccounts().then(console.log);
    console.log(web3, 'settled')
    console.log('loaded web3')
    if (web3) {
      const accounts = await web3.eth.getAccounts()
      console.log(accounts, 'here here here')
      const networkId = await web3.eth.net.getId()
      const networkData = BlockSecureDeployer.networks[networkId]
      if (networkData) {
        const deployedContract = new web3.eth.Contract(BlockSecureDeployer.abi, networkData.address)
        console.log(deployedContract, 'deployed now')
        if(deployerContract===null) {setDeployerContract(deployedContract)}
        console.log(deployerContract, 'deployer idk')
        const insuranceCount = await deployedContract.methods.insuranceCounter().call()
      }
    }
  }
  loadWeb3()
  }, [deployerContract])
  const { user: currentUser }  = useSelector((state) => state.authReducer)
  const getInsuranceCount = () => {
    const count = async ()  => {
    const insuranceCount = await deployerContract.methods.insuranceCounter().call()
    console.log(insuranceCount, 'count here in function')
    setInsuranceCount(insuranceCount)
    }
    count()
    return (
      <div>{insuranceCount}</div>
    ) 
  }
  const dispatch = useDispatch()
  const logOut = () => {
    dispatch(logout())
  }
  return (
    

    <Router history={history}>
      <div classname='bg' style={{ backgroundImage: `url(${background})`}}>
      
    
      
        <nav className="navbar navbar-expand navbar-dark">
          <Link to={"/"} className="navbar-brand">
            Insurances
          </Link>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profilehome"} className="nav-link">
                  User
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  Log Out
                </a>
              </li>
            </div>
          )
          : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Register
                </Link>
              </li>
            </div>
          )}
        </nav>
      <div className="container mt-5" style={{height:"100vh"}}>
        <Switch>
          <Route exact path={["/", "/login"]} component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profilehome" component={ProfileHome} />
          <Route exact path="/insurances-list" component={InsurancesList} /> 
          <Route exact path="/insurance-screen/:id" component={InsuranceScreen} />
          <Route exact path="/apply/:id" component={Apply}/>
          <Route exact path="/create-insurance" component={CreateInsurance}/>
          <Route exact path="/insurance-status/:id" component={InsuranceStatus} />
        </Switch>
      </div>
      {/* <button onClick={getInsuranceCount}>Get Count</button>
      <div style={{color:'white'}}>Insurance Count : {insuranceCount} </div> */}
      </div>
      
    </Router>
  )
}
export default App
