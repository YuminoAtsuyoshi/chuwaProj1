const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema({
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
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/8/83/Default-Icon.jpg",
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
    type: Date,
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
  reference: referenceSchema,
  emergencyContact: {
    type: [referenceSchema],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "There should be at least one emergency contact",
    },
  },
});

const EmployeeInfo = mongoose.model("EmployeeInfo", employeeInfoSchema);

module.exports = EmployeeInfo;
