const express = require('express')
const router = express.Router()
const db = require('../connection');
const { log } = require('handlebars');
const objectId = require('mongodb').ObjectId

exports.isLoggedIn = async (req, res,next) => {
  console.log(req.cookies.user);
  if (!req.cookies.user) { // Handle the case where there is no authenticated user
    res.redirect('/login') // Redirect to the login page, for example
  } else {
    next()
  }
}
exports.findProfile = async (req, res) => {
  if (!req.cookies.user) { // Handle the case where there is no authenticated user
    res.redirect('/login') // Redirect to the login page, for example
    return
  }
  let userEmail = req.cookies.user.email;
  let user = await db.get().collection('user').findOne({ 'email': userEmail })
  res.render('home',{user})
}
exports.findAllUsers=async(req,res)=>{
  let userDB = db.get().collection('user');
  let users=null;
  users=await userDB.find().toArray()
  return users;
}
exports.signup = async (req, res) => {
  try {
    const userData = req.body
    const userCollection = db.get().collection('user')
    const user = await userCollection.findOne({
      'email': userData.email
    })
    if (user) {
      let msg = "User Already Exits"
      res.redirect(`../?msg=${msg}`)
      return 0
    }
    const result = await userCollection.insertOne(userData)

    if (result.acknowledged) {
      const userInfo = req.body
      res.cookie('user', userInfo).redirect('/profile')

    } else {
      console.error('Failed to insert user data')
      res.status(500).send('Failed to register user')
    }
  } catch (error) {
    console.error('Error while registering user:', error)
    res.status(500).send('An error occurred while registering user')
  }
}
exports.login = async (req, res) => {
  const userData = req.body
  const userCollection = db.get().collection('user');
  const user = await userCollection.findOne({ 'email': userData.email })
  if (user) {
    res.cookie('user', user).redirect('/profile')
  }else{
    let msg = "User Already Exits"
    res.redirect(`../?msg=${msg}`)
  }
}
exports.editUser=async(req,res)=>{
  let id=req.params.id
  const userCollection = db.get().collection('user');
  let user = await userCollection.findOne({ '_id':objectId('6503410143125845359227b5')})
  console.log(user);
  res.send(user)
}

exports.logout=(req,res)=>{
  res.clearCookie('user')
  res.redirect('..')
  
}