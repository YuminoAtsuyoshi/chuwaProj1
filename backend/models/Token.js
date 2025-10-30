const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 3 * 3600 * 1000),
  },
  status: {
    type: String,
    default: "valid",
  },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
