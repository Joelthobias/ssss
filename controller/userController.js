const express = require('express')
const router = express.Router()
const db = require('../connection');
const { log } = require('handlebars');
const { ObjectId } = require('mongodb');
const axios = require('axios')
exports.isLoggedIn = async (req, res, next) => {
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
  res.render('home', { user })
}
exports.findAllUsers = async (req, res) => {
  let userDB = db.get().collection('user');
  let users = null;
  users = await userDB.find().toArray()
  return users;
}
exports.signup = async (req, res) => {
  try {
    const data = req.body
    const collection = db.get().collection('user')
    const user = await collection.findOne({
      'email': data.email
    })
    if (user) {
      let msg = "User Already Exits"
      res.redirect(`../?msg=${msg}`)
      return 0
    }
    const doc = await collection.insertOne(data)

    if (doc.acknowledged) {
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
  } else {
    let msg = "Invalid Creditnals"
    res.redirect(`login/?msg=${msg}`)
  }
}
exports.editUser = async (req, res) => {
  let id = req.params.id
  id = new ObjectId(id)
  const userCollection = db.get().collection('user');
  try {
    let user = await userCollection.find({ '_id': id }).toArray();
    user = user[0]
    admin=req.admin
    res.render('admin/editUser', { user,admin })
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
exports.gLogin= async (req, res) => {
  let data = req.body
  let token = req.body.credential
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client();
  let ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  ticket = ticket.payload
  let email=ticket.email
  const userCollection = db.get().collection('user');
  const user = await userCollection.findOne({ 'email': email })
  if (user) {
    res.cookie('user', user).redirect('/profile')
  } else {
    let msg = "Invalid Creditnals"
    res.redirect(`login/?msg=${msg}`)
  }
}

exports.gAuth = async (req, res) => {
  let data = req.body
  let token = req.body.credential
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client();
  let ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  ticket = ticket.payload
  let iat = ticket.iat
  const d = new Date(0);
  d.setUTCSeconds(iat)
  let user = { name: ticket.name, email: ticket.email, picture: ticket.picture }
  console.log('jwt created on ' + d);
  let status =await this.save(user, 'user')
  if (status==1) {
    const userInfo = user
    res.cookie('user', userInfo).redirect('/profile')
  } else {
    if (status!=0) {
      console.log(status);
      res.redirect(`signup/?msg=${status}`)
      return 0;
    }
    console.error('Failed to insert user data')
    res.status(500).send('Failed to register user')
  }
}
exports.save = async (data, coll) => {
  const collection = db.get().collection(coll)
  const user = await collection.findOne({
    'email': data.email
  })
  if (user) {
    let msg = "User Already Exits"
    return msg;
  }
  const doc = await collection.insertOne(data)

  if (doc.acknowledged) {
    return 1

  } else {
    return 0;
  }
}
exports.logout = (req, res) => {
  res.clearCookie('user')
  res.redirect('..')

}

exports.updateUser = async (req, res) => {
  let data=req.body
  let id = req.params.id
  id = new ObjectId(id)
  const userCollection = db.get().collection('user');
  try{

    let upadtedUser=await userCollection.updateOne({'_id':id},{
      $set:{
        "name":data.name,
        "email":data.email
      }
    })
    if (upadtedUser.acknowledged){
      let msg = "Sucessfully Updated "
      res.redirect(`/admin?msg=${msg}`)
    }
    
  }catch(e){
    console.log(e);
  }
}
exports.deleteUser =async (req, res) => {
  let id = req.params.id
  id = new ObjectId(id)
  const userCollection = db.get().collection('user');
  try{
    let deletedUser=await userCollection.deleteOne({'_id':id})
    // console.log();
    if (deletedUser.acknowledged){
      let msg="Sucessfully Deleted "
      res.redirect(`/admin?msg=${msg}`)
    }
  }catch(error){
    res.json(error)
  }
}