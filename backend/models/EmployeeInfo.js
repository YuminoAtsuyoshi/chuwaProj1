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
    // default removed; will use placeholder on frontend if absent
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
  // visa details are represented by isPrOrCitizen/prOrCitizenType/workAuthType
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
    // optional
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
    validate: {
      validator: function (v) {
        return this.isPrOrCitizen !== "yes" || !!v;
      },
      message: "prOrCitizenType is required when isPrOrCitizen is yes",
    },
  },
  workAuthType: {
    type: String,
    validate: {
      validator: function (v) {
        return this.isPrOrCitizen !== "no" || !!v;
      },
      message: "workAuthType is required when isPrOrCitizen is no",
    },
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
  workAuthDoc: {
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
