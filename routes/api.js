import express from 'express';
import db from '../connection.js';

const apiRouter = express.Router();
apiRouter.get('/',(req,res)=>{
    res.json({
        msg:"hello",
        user:"JOEL"
    })
})

apiRouter.post('/user/login',async(req,res)=>{
    const userData = req.body;
    const userCollection = db.get().collection('user');
    const user = await userCollection.findOne({ 'email': userData.email },{'password':userData.password});
    if (user) {
        res.status(200).cookie('user', user).json({
            status:'Sucess',
            user:req.body
        });
    } else {
        let msg = "Invalid Credentials";
        res.status(400).json({
            status:'failed',
            msg
        })
    }
})

export default apiRouter;
