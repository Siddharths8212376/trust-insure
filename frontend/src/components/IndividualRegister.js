import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import { registerUser } from '../actions/authActionCreater'
import { Redirect } from 'react-router-dom'
import { required, validEmail, validAddress, validPassword, validOrgtype, validUsername } from '../helpers/validations'
import "./Register.css";


export const Individual = () => {
    const form = useRef()
    const checkBtn = useRef()
  
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [successful, setSuccessful] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [address, setAddress] = useState("")
    const [aadhaarCardNumber, setAadhaarCardNumber] = useState('')
    const type = 'individual'
    const firmType = 'None'
  
    const { message } = useSelector(state => state.messageReducer)
    const dispatch = useDispatch()
  
    const onChangeUsername = (e) => {
      const username = e.target.value
      setUsername(username)
    }
  
    const onChangeEmail = (e) => {
      const email = e.target.value
      setEmail(email)
    }
  
    const onChangePassword = (e) => {
      const password = e.target.value
      setPassword(password)
    }
  
    const onChangeAddress = (e) => {
        setAddress(e.target.value)
    }

    const onChangeAadhaar = (e) => {
        setAadhaarCardNumber(e.target.value)
    }
    
    const handleRegister = (e) => {
      e.preventDefault()
  
      setSuccessful(false)
  
      form.current.validateAll()
  
      if (checkBtn.current.context._errors.length === 0) {
        dispatch(registerUser(username, email, password, Number(aadhaarCardNumber), address, type, firmType))
          .then((response) => {
            console.log(response, 'registered user!')
            setSuccessMessage('Success!! Redirecting to login..')
            setTimeout(() => {
              setSuccessMessage('')
              setSuccessful(true)
            }, 1500)
          })
          .catch((response) => {
            setSuccessful(false)
          })
      }
    }
    if (successful) return <Redirect to="/login" />
    if (successMessage != '') return (
        <div role="alert" className="alert alert-primary" style={{margin:"30px"}}>
        {successMessage}
        </div>
      )
  
      return (
      <div className="container login-container">
      <div className="card card-container" style={{backgroundColor: "#282828", color: "white", width: "30rem"}}>
        <Form onSubmit={handleRegister} ref={form} style={{padding:"20px"}}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, validUsername]}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Aadhaar Card Number</label>
                <Input
                  type="text"
                  className="form-control"
                  name="aadhaar"
                  value={aadhaarCardNumber}
                  onChange={onChangeAadhaar}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Ethereum Account Address</label>
                <Input
                  type="text"
                  className="form-control"
                  name="address"
                  value={address}
                  onChange={onChangeAddress}
                  validations={[required, validAddress]}
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
                  validations={[required, validPassword]}
                />
              </div>
  
              <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}
  
          {message && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div> 
      )
}