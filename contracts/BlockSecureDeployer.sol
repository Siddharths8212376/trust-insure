// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.0 <0.8.0;
// import './BlockSecure.sol';


contract SecureInsuranceContract
{
    enum StateType { BuyPolicy, RequestUnderwriting,BankUnderwriting,BankUnderwritingDone,MedicalUnderwriting,MedicalUnderwritingDone,FinalPolicyIssuance,ConfirmPolicyDetails,Rejected,ClaimVerificationFromHospital,ClaimVerificationDone,ClaimAcccepted,ClaimRejected}
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

    constructor(int aadhaarCardNumber,string memory sex, address bankName, int accountNumber, address insurerName,string memory policyName,address hospitalName,string memory pan, int sumAssured,int policyTerm,int paymentTerm, bool premiumPayment) public {
            Buyer = msg.sender;

            AadhaarCardNumber=aadhaarCardNumber;
            Sex=sex;
            BankName=bankName;
            AccountNumber=accountNumber;
            InsurerName=insurerName;
            PolicyName=policyName;
            HospitalName=hospitalName;
            PAN=pan;
            SumAssured=sumAssured;
            PolicyTerm=policyTerm;
            PaymentTerm=paymentTerm;
            PremiumPayment=premiumPayment;

            State = StateType.BuyPolicy;
    }

    function ConfirmDetails() public {
         Buyer = msg.sender;
         State = StateType.RequestUnderwriting;
    }

    function SendToBankUnderwriter() public {
        InsuranceProvider = msg.sender;
        State = StateType.BankUnderwriting;
    }

    function UpdateFinancialHealth(bool customerVerification,bool active,int financialHealthPoints,bool bankUnderwritingResult) public {
        BankUnderwriter = msg.sender;
        CustomerVerification=customerVerification;
        Active=active;
        FinancialHealthPoints=financialHealthPoints;
        BankUnderwritingResult=bankUnderwritingResult;

        State = StateType.BankUnderwritingDone;
    }
    function  SendToMedicalUnderwriter() public {
         InsuranceProvider = msg.sender;
         State = StateType.MedicalUnderwriting;
    }

    function  UpdateMedicalHealth(bool activeStatus,int healthScore,bool physicalVerification,bool medicalUnderwriting) public {
         MedicalUnderwriter = msg.sender;
         ActiveStatus=activeStatus;
         HealthScore=healthScore;
         PhysicalVerification=physicalVerification;
         MedicalUnderwriting=medicalUnderwriting;

         State = StateType.MedicalUnderwritingDone;
    }

    function RecalculatePolicy(bool premiumRecieved,int policyNumber,int issuanceDate,int maturityDate,int premiumFinal,int sumAssuredFinal,bool policyIssued ) public {
        PremiumRecieved=premiumRecieved;
        PolicyNumber=policyNumber;
        IssuanceDate=issuanceDate;
        MaturityDate=maturityDate;
        PremiumFinal=premiumFinal;
        SumAssuredFinal=sumAssuredFinal;
        PolicyIssued=policyIssued;

        State = StateType.FinalPolicyIssuance;
    }
    function ConfirmPolicy() public {
        Buyer = msg.sender;
        State = StateType.ConfirmPolicyDetails;
    }
    function Reject() public {
        Buyer = msg.sender;
    }

    function InvokeClaim(string memory claimReason,address claimResponder) public {
        ClaimReason = claimReason;
        ClaimResponder=claimResponder;
        State = StateType.ClaimVerificationFromHospital;
    }

    function SubmitClaimDetails(bool claimReasonVerification,string memory claimReasonRemark) public {
        ClaimReasonVerification = claimReasonVerification;
        ClaimReasonRemark=claimReasonRemark;
        State = StateType.ClaimVerificationDone;
    }
     function ClaimRequestAccepted() public {
        State = StateType.ClaimAcccepted;
    }
     function ClaimRequestRejected() public {
        State = StateType.ClaimRejected;
    }
}
// this contract is deployed only once
// all the insurances are updated as a part of state update
// an automated deployer for all insurances
contract BlockSecureDeployer {
    // a list that holds all the insurances
    SecureInsuranceContract[] public insurances;
    uint public insuranceCounter;
    constructor() public {
        insuranceCounter=0;
    }
    function ApplyForInsurance(int aadhaarCardNumber,string memory sex, address bankName, int accountNumber, address insurerName,string memory policyName,address hospitalName,string memory pan, int sumAssured,int policyTerm,int paymentTerm, bool premiumPayment) public returns (uint) {
        // create an instance of the insurance contract here
        SecureInsuranceContract insurance = new SecureInsuranceContract(aadhaarCardNumber, sex, bankName, accountNumber, insurerName, policyName, hospitalName, pan, sumAssured, policyTerm, paymentTerm, premiumPayment);
        // add to the list of insurances
        insurances.push(insurance);
        insuranceCounter++;
        return (uint(insuranceCounter-1));
    }
    function FetchInsuranceByIndex(uint idx) public view returns (int aadhaarCardNumber, int accountNumber, string memory pan, uint state, address bankName, address insurerName, address hospitalName, string memory policyName, int sumAssured, int policyTerm, int paymentTerm, bool premiumPayment) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        return (SIC.AadhaarCardNumber(), SIC.AccountNumber(), SIC.PAN(), uint(SIC.State()), SIC.BankName(), SIC.InsurerName(), SIC.HospitalName(), SIC.PolicyName(), SIC.SumAssured(), SIC.PolicyTerm(), SIC.PaymentTerm(), SIC.PremiumPayment());
    }
    function ConfirmDetails(uint idx) public returns (uint) {
        // fetch the required insurance
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.ConfirmDetails();
        return uint(SIC.State());
    }
    function SendToBankUnderwriter(uint idx) public returns (uint) {
        // fetch the required insurance
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.SendToBankUnderwriter();
        return uint(SIC.State());
    }
    function UpdateFinancialHealth(uint idx, bool customerVerification, bool active, int financialHealthPoints, bool bankUnderwritingResult) public returns (uint) {
        // fetch the required insurance
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.UpdateFinancialHealth(customerVerification, active, financialHealthPoints, bankUnderwritingResult);
        return uint(SIC.State());        
    }
    function SendToMedicalUnderwriter(uint idx) public returns (uint) {
        // fetch the required insurance
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.SendToMedicalUnderwriter();
        return uint(SIC.State());        
    }
    function UpdateMedicalHealth(uint idx, bool activeStatus, int healthScore, bool physicalVerification, bool medicalUnderwriting) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.UpdateMedicalHealth(activeStatus, healthScore, physicalVerification, medicalUnderwriting);
        return uint(SIC.State());          
    } 
    function RecalculatePolicy(uint idx, bool premiumReceived, int policyNumber, int issuanceDate, int maturityDate, int premiumFinal, int sumAssuredFinal, bool policyIssued) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.RecalculatePolicy(premiumReceived, policyNumber, issuanceDate, maturityDate, premiumFinal, sumAssuredFinal, policyIssued);
        return uint(SIC.State());        
    }
    function ConfirmPolicy(uint idx) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.ConfirmPolicy();
        return uint(SIC.State());         
    }
    function Reject(uint idx) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.Reject();
        return uint(SIC.State());       
    }
    function InvokeClaim(uint idx, string memory claimReason, address claimResponder) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.InvokeClaim(claimReason, claimResponder);
        return uint(SIC.State());
    }
    function SubmitClaimDetails(uint idx, bool claimReasonVerification, string memory claimReasonRemark) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.SubmitClaimDetails(claimReasonVerification, claimReasonRemark);
        return uint(SIC.State());
    }
    function ClaimRequestAccepted(uint idx) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.ClaimRequestAccepted();
        return uint(SIC.State());
    }
    function ClaimRequestRejected(uint idx) public returns (uint) {
        SecureInsuranceContract SIC = SecureInsuranceContract(insurances[idx]);
        SIC.ClaimRequestRejected();
        return uint(SIC.State());
    }

}
