import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import "./login.css"

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
        <div className="description card" style={{float: 'left', backgroundColor: "#282828", color: 'white', padding: '1%', width: "50%"}}>
          <img className="card-img-top" style={{height:"150px", width:"150px"}} src="https://i.ibb.co/7v3gzrP/blockchain-insurance.jpg" alt="blockchain-insurance" border="0" />
          <h3>We cover for you!</h3>
          <p>Driven to provide insurance solutions to customers, 
            HDFC ERGO General Insurance has secured over #1.3 Crore+ customers. 
            Right from offering comprehensive car insurance to a wide range of health insurance plans, 
            we at HDFC ERGO always take a Customer First Approach. Our plethora of offerings mainly include car insurance,
             two wheeler insurance, home insurance, travel insurance, health insurance and other commercial products. 
             Backed by a super strong customer support team and seamless service driven claims operation, 
             we ensure 360 degree customer happiness.
          </p>
        </div>
        <div className="col-md-5 login-form-1" style={{backgroundColor: "#404040", borderRadius: "1%", float: 'right'}}>
            <div className="card card-container" style={{padding:"20px", backgroundColor: "#282828", color: 'white'}}>
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
    )
}
export default Login