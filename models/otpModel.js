// models/otpModel.js
const mailSender = require('../utils/mailSender');
const db = require('../connection')

// Define a function to send emails
exports.sendVerificationEmail=async(email, otp)=>{
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
    return 1
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    return 0
  }
}

