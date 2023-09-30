import express from 'express';
import queryString from 'querystring';
import axios from 'axios';
import { sendOTP, verifyOTP } from '../controller/otpController.js';
import {
  isLoggedIn,
  findProfile,
  findAllUsers,
  signup,
  login,
  editUser,
  gLogin,
  gAuth,
  save,
  logout,
  updateUser,
  deleteUser,
} from '../controller/userController.js';
const userRouter = express.Router();

userRouter.get('/help',(req,res)=>{
  res.render('otp')
})

// send otp: send email by post method to host/send-otp
userRouter.post('/send-otp', sendOTP);

// verify otp: verify email and otp by post method to host/verify-otp
userRouter.post('/verify-otp', verifyOTP);

userRouter.get('/login', (req, res) => {
  const msg = req.query.msg;
  console.log(msg);
  res.render('login', { msg });
});

userRouter.get('/signup', (req, res) => {
  const stringifiedParams = {
    client_id: process.env.FBAPPID,
    redirect_uri: 'http://localhost:7081/auth/facebook',
    scope: ['email', 'user_friends'].join(','), // comma-separated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  };
  const msg = req.query.msg;
  console.log(msg);
  res.render('signup', { msg });
});

userRouter.get('/', (req, res) => {
  res.render('home');
});

userRouter.post('/signinWithGoogle', gAuth);
userRouter.post('/loginWithGoogle', gLogin);

userRouter.post('/auth/facebook', async (req, res) => {
  const { accessToken } = "1494515538001503|_trDVwseInRIbYUSvOqT32GiJmc";

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
});

userRouter.get('/profile', isLoggedIn, findProfile);
userRouter.get('/logout', logout);
userRouter.post('/signup', signup);
userRouter.post('/login', login);

export default userRouter;
