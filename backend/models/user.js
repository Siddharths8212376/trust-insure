const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = 'mongodb+srv://albertaug:albert333augustine@cluster0.bv63t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    }, 
    username: {
        type: String, 
    }, 
    aadhaarCardNumber: {
        type: Number,
        unique: true
    },
    address: {
        type: String,
        unique: true
    },
    passwordHash: String,
    type: String,
    insurances: [
        {
            insurer: {
                type: String,
            },
            typeOfInsurance: String,
            premium: String,
            claimStatus: String
        }
    ], 
})

userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User