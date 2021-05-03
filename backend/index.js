const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const User = require('./models/user')
const Firm = require('./models/firm')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const InsuranceList = require('./models/insuranceList')
const Insurance = require('./models/insurance')
const SECRET = 'abc'
app.use(cors())
var jsonParser = bodyParser.json()
app.get('/', (request, response) => {
    response.send('Insurance Reformed Backend Here.')
})
app.post('/api/insurance-list', jsonParser, async (request, response)=> {
    console.log(response.body)
    const body = request.body
    const insuranceInstance = new InsuranceList({
        policyName: body.policyName,
        insurerName: body.insurerName,
        insurerEmail: body.insurerEmail,
        insurerAddress: body.insurerAddress,
        sumAssured: body.sumAssured,
        premiumPayment: body.premiumPayment,
        policyTerm: body.policyTerm,
        paymentTerm: body.paymentTerm,
        insuranceDescription: body.insuranceDescription
    })
    const savedInsuranceInstance = await insuranceInstance.save()
    console.log(savedInsuranceInstance)
    response.json(savedInsuranceInstance)
})
app.get('/api/insurance-list', async (request, response) => {
    const insuranceList = await InsuranceList.find({})
    response.json(insuranceList)
})
app.post('/api/insurances', jsonParser, async (request, response) => {
    console.log(response.body) 
    const body = request.body
    const insurance = new Insurance({
        viewed: false,
        userAddress: body.userAddress,
        ID: body.id,
        name: body.name,
        aadhaarNumber: body.aadhaarNumber,
        accountNumber: body.accountNumber,
        PAN: body.PAN,
        gender: body.gender,
        state: body.state,
        insurerAddress: body.insurerAddress,
        insurerName: body.insurerName,
        bankUWAddress: body.bankUWAddress,
        medUWAddress: body.medUWAddress,
        policyName: body.policyName,
        sumAssured: body.sumAssured,
        policyTerm: body.policyTerm,
        paymentTerm: body.paymentTerm,
        premium: body.premium,
        customerVerification: false,
        active: true,
        financialHealthPoints: -1,
        bankUWResult: false,
        activeStatus: false,
        healthScore: -1,
        physicalVerification: false,
        medicalUWResult: false,
        premiumReceived: false,
        policyNumber: -1,
        issuanceDate: -1,
        maturityDate: -1,
        premiumFinal: -1,
        sumAssuredFinal: -1,
        policyIssued: false,
        claimReason: 'Nan',
        claimReasonVerification: false,
        claimReasonRemark: 'Nan',
        claimResponder: 'Nan'

    })
    const savedInsurance = await insurance.save()
    console.log(savedInsurance)
    response.json(savedInsurance)
})
app.get('/api/insurances', async (request, response) => {
    const insurances = await Insurance.find({})
    response.json(insurances)
})
app.get('/api/insurances/:id', async (request, response) => {
    console.log(request.params)
    const insurance = await Insurance.find({"ID": request.params.id})
    response.json(insurance)
})
app.put('/api/insurances/:id', jsonParser, async (request, response) => {
    // console.log(request.body, 'boy here')
    // const insurance = await Insurance.find({"ID": request.params.id})
    const body = request.body
    console.log(body, 'body of the request')
    const updatedInsurance = await Insurance.findOneAndUpdate({"ID": request.params.id}, body)
    response.json(updatedInsurance)
})
app.post('/api/signup', jsonParser, async (request, response) => {
    console.log(request.body, 'request to register here')
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const emailExists = await(await User.find({})).map(user=>user.email)
    const addressExists = await(await User.find({})).map(user=>user.address)
    if (emailExists.includes(body.email)) response.status(400).send({ message: "The email you entered already exists!"})
    if (addressExists.includes(body.address)) response.status(400).send({ message: "The address you entered already exists!"})
    else {
        const user = new User({
        email: body.email,
        username: body.username,
        aadhaarCardNumber: body.aadhaarCardNumber,
        address: body.address,
        passwordHash,
        type: body.type,
        insurances: body.insurances
    })
    const savedUser = await user.save()
    console.log(savedUser)
    response.json(savedUser)
}
})
app.get('/api/users', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})
app.post('/api/firms', jsonParser, async (request, response) => {
    console.log(request.body)
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const emailExists = await(await Firm.find({})).map(firm=>firm.email)
    const addressExists = await(await Firm.find({})).map(firm=>firm.address)
    if (emailExists.includes(body.email)) response.status(400).send({ message: "The email you entered already exists!"})
    if (addressExists.includes(body.address)) response.status(400).send({ message: "The address you entered already exists!"}) 
    const firm = new Firm({
        email: body.email,
        name: body.name,
        address: body.address,
        passwordHash,
        type: body.type,
        firmType: body.firmType,
        insurees: body.insurees
    })
    const savedFirm = await firm.save()
    console.log(savedFirm)
    response.json(savedFirm)
})
app.get('/api/firms', async (request, response) => {
    const firms = await Firm.find({})
    response.json(firms)
})
app.post('/api/login', jsonParser, async (request, response) => {
    const body = request.body
    let user = await User.findOne({ email: body.email })
    if (!user) {
        user = await Firm.findOne({ email: body.email })
    }
    const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)
    if (!(user && passwordCorrect)) {
        return response.status(401).json({ error: 'invalid email or password '})
    }
    const userForToken = {
        email: user.email,
        id: user._id,
    }
    const token = jwt.sign(userForToken, SECRET)

    response.status(200).send({
        token,
        user: user,
    })
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})