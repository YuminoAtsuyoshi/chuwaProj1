const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  stage: {
    type: String,
    default: "onboarding",
  },
  status: {
    type: String,
    default: "never_submit",
  },
  personInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmployeeInfo",
  },
  optList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opt",
    },
  ],
  isHr: {
    type: Boolean,
    default: false,
  },
  feedback: {
    type: String,
  },
  submissionDate: {
    type: String,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
