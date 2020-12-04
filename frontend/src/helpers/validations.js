import { isEmail } from 'validator'
export const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        )
    }
}
export const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email!
            </div>
        )
    }
}
export const validUsername = (value) => {
    if (value.length < 3 || value.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          The username must be between 3 and 20 characters.
        </div>
      )
    }
}
  
export const validPassword = (value) => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          The password must be between 6 and 40 characters.
        </div>
      )
    }
}
export const validAddress = (value) => {
    if (value.length != 42) {
        return (
            <div className="alert alert-danger" role="alert">
                The address must be 42 characters long
            </div>
        )
    }
}
export const validOrgtype = (value) => {
    value = value.toLowerCase()
    if (value !== 'insurer' && value !== 'hospital' && value !== 'bank' ) {
        return (
            <div className="alert alert-danger" role="alert">
                The organization should either be an insurance provider, bank, or a hospital
            </div>
        )
    }
}