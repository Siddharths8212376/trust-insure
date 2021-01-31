import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
const displayInsuranceDetails = (insurances) => (
    <div>
        <h4>Insurance Details </h4>
       <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Provider</th>
      <th scope="col">Type</th>
      <th scope="col">Premium</th>
      <th scope="col">Claim Status</th>
    </tr>
  </thead>
  <tbody>
      {insurances.map((insurance) => 
      <tr>
        <th scope="row">{insurance._id}</th>
        <td>{insurance.insurer}</td>
        <td>{insurance.typeOfInsurance}</td>
        <td>{insurance.premium}</td>
        <td>{insurance.claimStatus}</td>
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
const displayInsureeDetails = (insurees) => (
    <div>
        <table class="table" style={{width: "100%", overflowX:"scroll", display:"block"}}>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Username</th>
      <th scope="col">Address</th>
      <th scope="col">Type of Insurance</th>
      <th scope="col">Premium</th>
      <th scope="col">Claim Status</th>
    </tr>
  </thead>
  <tbody>
      {insurees.map((insuree) => 
      <tr>
        <th scope="row">{insuree._id}</th>
        <td>{insuree.username}</td>
        <td>{insuree.address}</td>
        <td>{insuree.typeOfInsurance}</td>
        <td>{insuree.premium}</td>
        <td>{insuree.claimStatus}</td>
        </tr>
          )}
        </tbody>
        </table>
        <CreateInsuranceButton />
    </div>
)
const ProfileHome = () => {
    const { user: currentUser } = useSelector((state) => state.authReducer)
    console.log(currentUser)
    if (!currentUser) {
        return <Redirect to="/login" />
    } else {
        console.log(currentUser.user.insurances)
    } 

    return (
        <div>
            <p>Your address: {currentUser.user.address}  Your email: {currentUser.user.email} </p>
            {/* Add correct routing to these parts, from the insurance schema */}
            <div>{currentUser.user.type==='individual'
            ? displayInsuranceDetails(currentUser.user.insurances) 
            : displayInsureeDetails(currentUser.user.insurees) }
            </div>
        </div>
    )
}
export default ProfileHome