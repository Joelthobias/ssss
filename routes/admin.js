const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const adminController = require('../controller/adminController');
const { log } = require('handlebars/runtime');

router.post('/login', adminController.admin_login)
router.get('/login', (req, res) => {
    let msg=undefined
    msg=req.query.msg
    console.log(msg);
    res.render('admin/login',{msg})
})

router.use(adminController.isLoggedIn)
router.get('/', async(req, res) => {
    let users=await userController.findAllUsers()
    let admin=true 
    let msg=""
    msg = req.query.msg
    res.render('admin/dashboard',{users,admin,msg})
})

router.get('/logout', adminController.logout)

router.get('/edit/:id',userController.editUser)
router.post('/edit/:id', userController.updateUser)
router.get('/delete/:id', userController.deleteUser)
module.exports = router;


// router.get('/signup', (req, res) => {
//     res.render('signup')
// })