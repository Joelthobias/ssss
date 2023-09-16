const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

router.get('/login', (req, res) => {
  msg = req.query.msg
  console.log(msg);
  res.render('login',{msg})
})
router.get('/signup', (req, res) => {


  msg = req.query.msg
  console.log(msg);
  res.render('signup',{msg})
})
router.get('/', (req, res) => {
  res.render('home')
})
router.post('/signinWithGoogle',userController.gAuth)
router.post('/loginWithGoogle',userController.gLogin)

router.get('/profile',userController.isLoggedIn,userController.findProfile)
router.get('/logout',userController.logout)
router.post('/signup',userController.signup);
router.post('/login', userController.login)

module.exports = router;