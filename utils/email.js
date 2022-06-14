const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  //create transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //define email options
  const emailOptions = {
    to: options.email,
    subject: "Your password reset token (valid for 2min)",
    text: options.message,
  };

  // 3) Actually send email
  await transporter.sendMail(emailOptions); //return a promise
};

module.exports = sendEmail;
