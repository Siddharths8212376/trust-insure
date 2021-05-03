import axios from 'axios'

const url = 'http://localhost:3001/api/'

const registerUser = (username, email, password, aadhaarCardNumber, address, type, firmtype) => {
    const curList = []
    return axios.post(url + 'signup', {
        username, 
        email,
        password,
        aadhaarCardNumber,
        address,
        type,
        firmtype,
        curList 
    })
    // .then((response) => {
    //     console.log(response.data, 'inside service')
    // })
}
const registerFirm = (name, email, password, address, type, firmtype) => {
    const curList = []
    return axios.post(url + 'firms', {
        name, 
        email,
        password,
        address,
        type,
        firmtype,
        curList 
    })
}
const login = (email, password) => {
    console.log(email, password)
    console.log(url+'login')
    return axios.post(url + 'login', {
        email, 
        password,
    })
    .then((response) => {
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data))
        }
        console.log(response.data)
        return response.data
    })
}

const logout = () => {
    console.log('logged out!')
    localStorage.removeItem("user")
}

export default {
    registerUser,
    registerFirm,
    login,
    logout,
}