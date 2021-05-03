const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = 'mongodb+srv://siddharth-s:3012@cluster0.cbsfq.mongodb.net/insurance-reformed?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const firmSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    }, 
    name: {
        type: String, 
    }, 
    address: {
        type: String,
        unique: true
    },
    passwordHash: String,
    type: String,
    firmType: String,
    insurees: [
        {
            username: {
                type: String,
            },
            address: {
                type: String,
            },
            typeOfInsurance: {
                type: String,
            },
            premium: {
                type: String,
            },
            claimStatus: {
                type: String,
            }
        }
    ]
})

firmSchema.plugin(uniqueValidator)
firmSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const Firm = mongoose.model('Firm', firmSchema)
module.exports = Firm