const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const db = require('../connection')

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Check if all details are provided
    if ( !email || !otp) {
      return res.status(403).json({
        success: false,
        message: 'email and otp are required',
      });
    }

    // Find the most recent OTP for the email
    const response = await db.get().collection('otp').find({ email }).toArray();
    console.log(response);
    if (response[0].email) {
      if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({
          success: false,
          message: 'The OTP is not valid',
        });
      }

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email',
      });

    }
    // Secure password
    
    return res.status(201).json({
      success: true,
      message: 'OTP VERIFIED'
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user is already present
    const checkUserPresent = await db.get().collection('user').findOne({ email });
    // If user found with provided email
    if (checkUserPresent) {
      console.log(checkUserPresent);
      return res.status(401).json({
        success: false,
        message: 'User is already registered',
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await db.get().collection('otp').findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await db.get().collection('otp').findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    let sendOTPres=await OTP.sendVerificationEmail(email,otp)
    if (sendOTPres){

      const otpBody = await db.get().collection('otp').insertOne(otpPayload);
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
      });
    }else{
      throw('failed to send email')
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
