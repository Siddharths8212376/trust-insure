import { REGISTER_SUCCESS,
         REGISTER_FAILURE, 
         LOGIN_SUCCESS, 
         LOGIN_FAILURE, 
         LOGOUT, 
         SET_MESSAGE, 
         CLEAR_MESSAGE 
        } from './actionTypes'
import AuthService from '../services/auth.service'
export const registerUser = (username, email, password, aadhaarCardNumber, address, type, firmType) => (dispatch) => {
    console.log(username, email, password, aadhaarCardNumber, address, type, firmType, 'inside action creator')
    return AuthService.registerUser(username, email, password, aadhaarCardNumber, address, type, firmType).then(
        (response) => {
            console.log(response.data, 'success!!')
            dispatch({
                type: REGISTER_SUCCESS,
            })
            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            })
            return Promise.resolve()
        }, (error) => {
            console.log(error)
            const message = (error.response
                && error.response.data
                && error.response.data.message) 
                || error.message || error.toString()
            dispatch({
                type: REGISTER_FAILURE,
            })
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            })
            return Promise.reject()
        }
    )
}
export const registerFirm = (username, email, password, address, type, firmType) => (dispatch) => {
    console.log(username, email, password, address, type, firmType)
    return AuthService.registerFirm(username, email, password, address, type, firmType).then(
        (response) => {
            console.log(response.data)
            dispatch({
                type: REGISTER_SUCCESS,
            })
            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            })
            return Promise.resolve()
        }, (error) => {
            const message = (error.response
                && error.response.data
                && error.response.data.message) 
                || error.message || error.toString()
            dispatch({
                type: REGISTER_FAILURE,
            })
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            })
            return Promise.reject()
        }
    )
}
export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
        (data) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: data },
            })
            return Promise.resolve()
        }, (error) => {
            const message = ( error.response 
                && error.response.data
                && error.response.data.message)
                || error.message || error.toString()
            dispatch({
                type: LOGIN_FAILURE,
            })
            dispatch({
                type: SET_MESSAGE,
                payload: message,
            })
            return Promise.reject()
        }
    )
}

export const logout = () => (dispatch) => {
    AuthService.logout()
    dispatch({
        type: LOGOUT,
    })
}