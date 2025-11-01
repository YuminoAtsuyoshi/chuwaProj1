const mongoose = require("mongoose");

const optSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  doc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doc",
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  feedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Opt = mongoose.model("Opt", optSchema);

module.exports = Opt;
