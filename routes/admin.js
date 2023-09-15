const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const adminController = require('../controller/adminController');
const { log } = require('handlebars/runtime');

router.get('/',adminController.isLoggedIn, async(req, res) => {
    let users=await userController.findAllUsers()
    let admin=true
    res.render('admin/dashboard',{users,admin})
})

router.get('/login', (req, res) => {
    msg=req.query.msg
    console.log(msg);
    res.render('admin/login',{msg})
})
router.get('/editUser/:id',userController.editUser)

router.get('/logout', adminController.logout)
router.post('/login', adminController.admin_login)

module.exports = router;


// router.get('/signup', (req, res) => {
//     res.render('signup')
// })