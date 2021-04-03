const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = 'mongodb+srv://albertaug:albert333augustine@cluster0.bv63t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const insuranceListSchema = new mongoose.Schema({
    policyName: {
        type: String
    }, 
    insurerName: {
        type: String
    },
    insurerAddress: {
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
    },
    paymentTerm: {
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