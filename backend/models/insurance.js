const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = 'mongodb+srv://siddharth-s:3012@cluster0.cbsfq.mongodb.net/block-insure-updated?retryWrites=true&w=majority'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
/* 
    requirements:
    StateType public  State;

    address public  Buyer;
    address public  BankUnderwriter;
    address public  MedicalUnderwriter;
    address public  InsuranceProvider;

    int public AadhaarCardNumber;
    string public Sex;
    address public BankName;
    int public AccountNumber;
    address public InsurerName;
    string public PolicyName;
    address public HospitalName;
    string public PAN;
    int public SumAssured;
    int public PolicyTerm;

    int public PaymentTerm;
    bool public PremiumPayment;
    bool public CustomerVerification;
    bool public Active;
    int public FinancialHealthPoints;
    bool public BankUnderwritingResult;
    bool public ActiveStatus;
    int public HealthScore;
    bool public PhysicalVerification;
    bool public MedicalUnderwriting;
    bool public PremiumRecieved;
    int public PolicyNumber;
    int public IssuanceDate;
    int public MaturityDate;
    int public PremiumFinal;
    int public  SumAssuredFinal;
    bool public PolicyIssued;
    string public ClaimReason;
    bool public ClaimReasonVerification;
    string public ClaimReasonRemark;
    address public ClaimResponder;


*/
const insuranceSchema = new mongoose.Schema({
    viewed: {
        type: Boolean
    },
    userAddress: {
        type: String
    },
    ID: {
        type: Number
    },
    name: {
        type: String
    }, 
    aadhaarNumber: {
        type: Number
    },
    accountNumber: {
        type: Number
    }, 
    PAN: {
        type: String
    }, 
    gender: {
        type: String
    },
    state: {
        type: Number
    },
    insurerAddress: {
        type: String
    },
    bankUWAddress: {
        type: String
    },
    medUWAddress: {
        type: String
    }, 
    policyName: {
        type: String
    }, 
    sumAssured: {
        type: Number
    }, 
    policyTerm: {
        type: Number
    },
    paymentTerm: {
        type: Number
    },
    premium: {
        type: Boolean
    }
})

insuranceSchema.plugin(uniqueValidator)
insuranceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Insurance = mongoose.model('Insurance', insuranceSchema)
module.exports = Insurance