import axios from 'axios'
const url = 'http://localhost:3001/api/insurance-list'

const insuranceList = () => {
    return axios.get(url)
    .then((response)=> {
        console.log(response.data)
        return response.data
    })
}
export default insuranceList