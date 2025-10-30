const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  relationship: {
    type: String,
    required: true,
  },
});

const employeeInfoSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  preferredName: {
    type: String,
  },
  profilePicture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doc",
    default: "6903897cdcd920c6c1f86a03",
  },
  addressBuilding: {
    type: String,
    required: true,
  },
  addressStreet: {
    type: String,
    required: true,
  },
  addressCity: {
    type: String,
    required: true,
  },
  addressState: {
    type: String,
    required: true,
  },
  addressZip: {
    type: String,
    required: true,
  },
  cellPhone: {
    type: String,
    required: true,
  },
  workPhone: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  ssn: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  visa: {
    type: String,
    required: true,
  },
  addressBuilding: {
    type: String,
    required: true,
  },
  referenceFirstName: {
    type: String,
    required: true,
  },
  referenceLastName: {
    type: String,
    required: true,
  },
  referenceMiddleName: {
    type: String,
    required: true,
  },
  referencePhone: {
    type: String,
    required: true,
  },
  referenceEmail: {
    type: String,
    required: true,
  },
  referenceRelationship: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: [ContactSchema],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "There should be at least one emergency contact",
    },
  },
  isPrOrCitizen: {
    type: String,
    required: true,
  },
  prOrCitizenType: {
    type: String,
    required: true,
  },
  workAuthType: {
    type: String,
  },
  visaTitle: {
    type: String,
  },
  visaStartDate: {
    type: String,
  },
  visaEndDate: {
    type: String,
  },
  driverLicense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doc",
  },
  optReceipt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doc",
  },
});

const EmployeeInfo = mongoose.model("EmployeeInfo", employeeInfoSchema);

module.exports = EmployeeInfo;
