import express from 'express';
import db from '../connection.js';

const apiRouter = express.Router();
apiRouter.get('/',async(req,res)=>{
    const userCollection = db.get().collection('user');
    let users=await userCollection.find().toArray()
    console.log(users);
    res.json({
        msg:"hello",
        users
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
