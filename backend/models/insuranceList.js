const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = 'mongodb+srv://siddharth-s:3012@cluster0.cbsfq.mongodb.net/block-insure-updated?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const insuranceListSchema = new mongoose.Schema({
    policyName: {
        type: String
    }, 
    insurerName: {
        type: String
    },
    sumAssured: {
        type: Number
    },
    premiumPayment: {
        type: Boolean
    },
    policyTerm: {
        type: Number
    }
})

insuranceListSchema.plugin(uniqueValidator)
insuranceListSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const InsuranceList = mongoose.model('InsuranceList', insuranceListSchema)
module.exports = InsuranceList