const jwt = require("jsonwebtoken");

const generateToken = (email) => {
  const token = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );
  return token;
};

module.exports = generateToken;
