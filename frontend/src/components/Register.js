import { useState } from 'react'
import { Individual } from './IndividualRegister'
import { Organization } from './OrganizationRegister'
import './Register.css'

const Button = ({ name, set, setIsInd}) => {
  return (
    <button className="btn btn-primary" style={{marginLeft:"5%", marginRight:"0px", marginTop:"20px"}} onClick={()=>{setIsInd(set)}}>{name}</button>
  )
}
const Register = () => {
    const [isInd, setIsInd] = useState(true)
    return (
        <div>
          <h3 style={{color: "white", marginLeft: "5%"}}> You are</h3>
          {/* <div class="col-md-6 login-form-1">
            <h3 className="display-4" style={{fontSize:'2rem'}}>Individual</h3>
            <Individual/> 
          </div>
          <div class="col-md-6 login-form-2">
          <h3 className="display-4" style={{fontSize:'2rem'}}>Organization</h3>
              <Organization/>
          </div> */}
              <Button name='An Individual' set={true} setIsInd={setIsInd} /> 
              <Button name='An Organization' set={false} setIsInd={setIsInd} /> 
              {isInd ? <Individual /> : <Organization />}
        </div>
    )
}
export default Register