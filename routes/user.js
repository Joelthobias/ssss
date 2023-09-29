const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const queryString = require('querystring');
const { default: axios } = require('axios');
const otpController = require('../controller/otpController');

const authController = require('../controller/authController');

// router.post('/signup', authController.signup);
// send otp : send email by post method to host/send-otp
router.post('/send-otp', otpController.sendOTP);
// verify otp : verify email and otp by post method to host/verify-otp
router.post('/verify-otp', otpController.verifyOTP);

router.get('/login', (req, res) => {
  msg = req.query.msg
  console.log(msg);
  res.render('login', { msg })
})

router.get('/signup', (req, res) => {
  let stringifiedParams = {
    client_id: process.env.FBAPPID,
    redirect_uri: 'http://localhost:7081/auth/facebook',
    scope: ['email', 'user_friends'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  }
  msg = req.query.msg
  console.log(msg);
  res.render('signup', { msg })
})
router.get('/', (req, res) => {
  res.render('home')
})
router.post('/signinWithGoogle', userController.gAuth)
router.post('/loginWithGoogle', userController.gLogin)

router.post('/auth/facebook', async(req, res) => {
  const { accessToken } = "1494515538001503|_trDVwseInRIbYUSvOqT32GiJmc"

  try {
    // Verify the Facebook access token
    const response = await axios.get(`https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`);

    // Extract user data from the response
    const { id, name, email } = response.data;

    // Here, you can save the user data to your database or use it as needed
    // For this example, we'll just send the user data back as a response
    res.json({ id, name, email });
  } catch (error) {
    console.error('Facebook authentication error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
})
router.get('/profile', userController.isLoggedIn, userController.findProfile)
router.get('/logout', userController.logout)
// router.post('/signup', userController.signup);
router.post('/login', userController.login)

module.exports = router;