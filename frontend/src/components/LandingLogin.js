import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import "./login.css"
import './LandingLogin.css'

import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'

import { login } from '../actions/authActionCreater'

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        )
    }
}
const Login = (props) => {
    const form = useRef()
    const checkBtn = useRef()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { isLoggedIn } = useSelector(state=>state.authReducer)
    const { message } = useSelector(state=>state.messageReducer)
    const dispatch = useDispatch()

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        form.current.validateAll()
        if (checkBtn.current.context._errors.length === 0) {
            dispatch(login(email, password))
                .then(() => {
                    props.history.push('/profilehome')
                    window.location.reload()
                })
                .catch(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }
    if (isLoggedIn) {
        return <Redirect to="/profilehome" />
    }
    return (
      <div>
      <div className="row">
        <div className="col-6">
        <div className="row base-margin-bottom">
          <h1>Trust Insure</h1>
        </div>
        <div className="row base-margin-bottom">
          <h3>Your Security, Our Promise!</h3>
        </div>
        <div className="row">
        <div className="col-4 secure">
        
        <img src="https://i.ibb.co/FVMN8rV/bwu.png" alt="bwu" border="0"/> 
        <h6>Easy Claims Processing</h6>
        </div>
        <div className="col-4 secure">
        <img src="https://i.ibb.co/J7qbNCb/muw.png" alt="muw" border="0"/> 
        <h6>Better Medical Protection</h6>
        </div>

        <div className="col-4 secure">
        <img src="https://i.ibb.co/Nx38CVc/ipt.png" alt="ipt" border="0"/> 
        <h6>Ultra Secure Transactions</h6>
        </div>
        </div>
        </div>
        <div className="col-2"></div>
        <div className="col-4" style={{borderRadius: "1%"}}>
            <div className="card card-container" style={{padding:"20px", backgroundColor: "#282828", color: 'white', boxShadow: "2px 2px 4px #121212"}}>
              <Form onSubmit={handleLogin} ref={form} style={{padding:"20px"}}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>

                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                  )}
                  <CheckButton style={{ display: "none" }} ref={checkBtn} />
              </Form>
            </div>
        </div>
        </div>
        <div className="row">
          {/* <div className="col-8">
            <div className="card" >
              <h5>With us, you can stay assured!</h5>
            </div>
          </div> */}
        </div>
        </div>
    )
}
export default Login