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
  let navColor = '#282828'
  if (currentUser) {
    if (currentUser.user.type==='individual') navColor='#900C3F'
    else if (currentUser.user.type==='Insurer') navColor='#FBC021'
    else if (currentUser.user.type==='Bank') navColor='#2598F3'
    else navColor='#378022'
  }
  return (
    

    <Router history={history}>
      <div style={{width: "100%", height: "100%"}}>
      <div style={{backgroundColor:"#222222", display:"flex", flexFlow:"column",
       backgroundImage: !currentUser ? "url(" + "https://i.ibb.co/sPBf7X9/insure-new.jpg" + ")" : "",
       backgroundRepeat: 'no-repeat',
       backgroundSize: "cover",
       backgroundPosition: 'center'
       }}>
        <nav className="navbar navbar-expand navbar-dark" style={{backgroundColor:navColor, position: 'fixed', top: 0, width: "100%", zIndex: 10, boxShadow: "0px 0px 4px #121212"}}>
          <Link to={"/"} className="navbar-brand nav-title">
            {!currentUser?<div>Blockchain Enabled Insurance</div>
            : currentUser.user.type==='individual' ? <div>Hey {currentUser.user.username}!</div> : 
            currentUser.user.type==='Insurer' ? <div>Welcome {currentUser.user.name}</div> : 
            currentUser.user.type==='Bank' ? <div>Welcome {currentUser.user.name} </div> :
            <div>Welcome {currentUser.user.name}</div>
            }
          </Link>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/"} className="nav-link">
                  Home
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
      <div className="mt-5" style={{minHeight:"100vh", marginRight:"4%", marginLeft:"4%", paddingTop: "40px"}}>
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
      {!currentUser &&<div className="footer-copyright text-center py-3 ff" style={{backgroundColor:"#181818", position: 'fixed', bottom: 0, width: "100%", color: 'lightyellow', height:"40px", padding: "10px"}}> &#169; 2021 BEI</div>}
      </div>
    </Router>
  )
}
export default App
