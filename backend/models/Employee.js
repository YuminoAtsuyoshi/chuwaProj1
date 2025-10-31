const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  stage: {
    type: String,
    enum: ["onboarding", "OPT Receipt", "OPT EAD", "I-983", "I-20"],
    default: "onboarding",
  },
  status: {
    type: String,
    enum: ["never_submit", "pending", "approved", "rejected"],
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
