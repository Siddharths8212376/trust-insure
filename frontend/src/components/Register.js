import { useState } from 'react'
import { Individual } from './IndividualRegister'
import { Organization } from './OrganizationRegister'
import './Register.css'

{/*const Button = ({ name, set, setIsInd}) => {
  return (
    <button className="btn btn-primary" style={{marginBottom:"20px", marginLeft:"10px", marginRight:"10px", marginTop:"20px"}} onClick={()=>{setIsInd(set)}}>{name}</button>
  )
}*/}
const Register = () => {
    const [isInd, setIsInd] = useState(true)
    return (
        <div className="row">
          <div class="col-md-6 login-form-1">
            <h3 className="display-4" style={{fontSize:'2rem'}}>Individual</h3>
            <Individual/> 
          </div>
          <div class="col-md-6 login-form-2">
          <h3 className="display-4" style={{fontSize:'2rem'}}>Organization</h3>
              <Organization/>
          </div>
              {/*<Button name='An Individual' set={true} setIsInd={setIsInd} /> 
              <Button name='An Organization' set={false} setIsInd={setIsInd} /> 
              {isInd ? <Individual /> : <Organization />}*/}
          
        </div>
    )
}
export default Register