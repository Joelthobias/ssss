import express from 'express';
import db from '../connection.js';

const admin_login = async (req, res) => {
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
const isLoggedIn = async (req, res,next) => {
  if (!req.cookies.admin) { // Handle the case where there is no authenticated user
    res.redirect('/admin/login') // Redirect to the login page, for example
  } else {
    req.admin=req.cookies.admin
    next()
  }
}
const logout = (req, res) => {
    res.clearCookie('admin')
    res.redirect('/admin/login')

}
export default {admin_login,isLoggedIn,logout}