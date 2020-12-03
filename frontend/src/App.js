import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Router, Switch, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Login from './components/LandingLogin'
import Register from './components/Register'
import ProfileHome from './components/ProfileHome'

import { logout } from './actions/authActionCreater'
import { history } from './helpers/history'

function App() {
  const { user: currentUser }  = useSelector((state) => state.authReducer)

  const dispatch = useDispatch()
  const logOut = () => {
    dispatch(logout())
  }

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
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
      <div className="container mt-5" style={{width:"100%"}}>
        <Switch>
          <Route exact path={["/", "/login"]} component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profilehome" component={ProfileHome} />
        </Switch>
      </div>
      </div>
    </Router>
  )
}
export default App
