const bcryptjs = require("bcryptjs");

const generateToken = (email) => {
  const token = btoa(email);
  return token;
};

module.exports = generateToken;
