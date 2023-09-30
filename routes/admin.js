import express from 'express';
import adminController from '../controller/adminController.js';
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
const adminRouter = express.Router();

adminRouter.post('/login', adminController.admin_login);

adminRouter.get('/login', (req, res) => {
    let msg = req.query.msg;
    console.log(msg);
    res.render('admin/login', { msg });
});

adminRouter.use(adminController.isLoggedIn);

adminRouter.get('/', async (req, res) => {
    let users = await findAllUsers();
    let admin = true;
    let msg = "";
    msg = req.query.msg;
    res.render('admin/dashboard', { users, admin, msg });
});

adminRouter.get('/logout', adminController.logout);

adminRouter.get('/edit/:id', editUser);
adminRouter.post('/edit/:id', updateUser);
adminRouter.get('/delete/:id', deleteUser);

export default adminRouter;
