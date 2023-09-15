const express = require('express')
const router = express.Router()
const db = require('../connection') 

exports.admin_login = async (req, res) => {
    const userData = req.body
    const userCollection = db.get().collection('admin');
    const admin = await userCollection.findOne({ 'email': userData.email })
    if (admin) {
        res.cookie('admin', admin).redirect('/admin')
    }else{
        let msg= "Invalid creadtinals"
        res.redirect(`/admin/login?msg=${msg}`)
    }
}
exports.isLoggedIn = async (req, res,next) => {
    console.log(req.cookies);
  if (!req.cookies.admin) { // Handle the case where there is no authenticated user
    res.redirect('/admin/login') // Redirect to the login page, for example
  } else {
    next()
  }
}
exports.logout = (req, res) => {
    res.clearCookie('admin')
    res.redirect('/admin/login')

}