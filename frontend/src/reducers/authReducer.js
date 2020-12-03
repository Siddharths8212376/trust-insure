import { useReducer } from 'react'
import { REGISTER_SUCCESS,
        REGISTER_FAILURE,
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        LOGOUT
    } from '../actions/actionTypes'
const user = JSON.parse(localStorage.getItem('user'))
const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null }
export default function (state=initialState, action) {
    const { type, payload } = action

    switch (type) {
        case REGISTER_SUCCESS: return { ...state, isLoggedIn: false, }
        case REGISTER_FAILURE: return { ...state, isLoggedIn: false, }
        case LOGIN_SUCCESS: return { ...state, isLoggedIn: true, user: payload.user, }
        case LOGIN_FAILURE: return { ...state, isLoggedIn: false, user: null }
        case LOGOUT: return { ...state, isLoggedIn: false, user: null }
        default: return state
    }
}