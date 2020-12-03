import { combineReducers } from 'redux'
import authReducer from './authReducer'
import messageReducer from './messageReducer'

export default combineReducers({
    authReducer, 
    messageReducer,
})