const Token = require("../models/Token.js");
const generateToken = require("../utils/tokenGenerator.js");
const sendEmail = require("../utils/emailService.js");

const createToken = async (req, res, next) => {
  try {
    const email = req.body.email;
    const tokenString = generateToken(email);
    const token = new Token({ email: email, token: tokenString });
    await token.save();
    await sendEmail(email, tokenString);
    res.status(200).json(token);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getTokens = async (req, res, next) => {
  try {
    const tokens = await Token.find({});
    res.status(200).json(tokens);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createToken,
  getTokens,
};
