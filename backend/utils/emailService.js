const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.163.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (address, token) => {
  try {
    const info = await transporter.sendMail({
      from: '"Employee Management System" <zxy119010445@163.com>',
      to: address,
      subject: "Welcome to our company",
      text: `Thank you for joining our company.\nPlease use the following token and link to register in our employee management system to provide your information and files. Thank you for your cooperation. This token is valid for 3 hours.\nToken: ${token}\nLink: https://localhost:5173/register?token=${token}`,
      html: `Thank you for joining our company.<br/>Please use the following token and link to register in our employee management system to provide your information and files. Thank you for your cooperation. This token is valid for 3 hours.<br/>Token: ${token}<br/>Link: <a href="https://localhost:5173/register?token=${token}">https://localhost:5173/register?token=${token}</a>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
};

module.exports = sendEmail;
