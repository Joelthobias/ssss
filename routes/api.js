import express from 'express';
import db from '../connection.js';

const apiRouter = express.Router();
apiRouter.get('/',(req,res)=>{
    console.log('called');
    console.log(req.cookies);
    if(req.cookies.user){

        res.json({
            msg:"Sucess",
            user:req.cookies.user.name
        })
    }else{
        res.json({
            msg:"not loged in"
        }).status(201)
    }
})

apiRouter.post('/user/login', async (req, res) => {
    const userData =req.body;
    const userCollection = db.get().collection('user');
    const user = await userCollection.findOne({ "email": userData.email, "password": userData.password });
    console.log(req.body);
    if (user) {
        const userToStore = {
            _id: user._id, 
            name:user.name
        };
        res.session('user', userToStore, { maxAge: 3600000, httpOnly: true }).status(200).json({
            msg: "Success",
            user:userToStore
        });
    } else {
        res.status(400).json({
            status: 'Failed',
            msg: 'Invalid Credentials'
        });
    }
});





apiRouter.get('/user/logout', (req, res) => {

    console.log('logout called');
    res.clearCookie('user');
    res.status(200).json({
        msg:'done'
    })
    console.log('logout');
})
export default apiRouter;
