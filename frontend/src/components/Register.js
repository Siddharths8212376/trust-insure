import { useState } from 'react'
import { Individual } from './IndividualRegister'
import { Organization } from './OrganizationRegister'

const Button = ({ name, set, setIsInd}) => {
  return (
    <button className="btn btn-primary" style={{marginBottom:"20px", marginLeft:"10px", marginRight:"10px", marginTop:"20px"}} onClick={()=>{setIsInd(set)}}>{name}</button>
  )
}
const Register = () => {
    const [isInd, setIsInd] = useState(true)
    return (
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <h3 className="display-4">You are</h3>
            <Button name='An Individual' set={true} setIsInd={setIsInd} /> 
            <Button name='An Organization' set={false} setIsInd={setIsInd} /> 
            {isInd ? <Individual /> : <Organization />}
          </div>
        </div>
    )
}
export default Register