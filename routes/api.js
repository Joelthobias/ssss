import express from 'express';
import db from '../connection.js';

const apiRouter = express.Router();
<<<<<<< HEAD
apiRouter.get('/',(req,res)=>{
    console.log(req.cookies.user);
    if(req.cookies.user){

        res.json({
            msg:"Sucess",
            user:req.cookies.user.name
        })
    }
=======
apiRouter.get('/',async(req,res)=>{
    const userCollection = db.get().collection('user');
    let users=await userCollection.find().toArray()
    console.log(users);
    res.json({
        msg:"hello",
        users
    })
>>>>>>> 96063ccba1e26adfe5a24069e12001e6c3218c70
})

apiRouter.post('/user/login',async(req,res)=>{
    const userData = req.body;
    const userCollection = db.get().collection('user');
    const user = await userCollection.findOne({ 'email': userData.email },{'password':userData.password});
    console.log(user);
    if (user) {
        res.status(200).cookie('user', user,{expires:new Date(Date.now()+9000000)}).json({
            status:'Sucess',
            user:user
        });
    } else {
        let msg = "Invalid Credentials";
        res.status(400).json({
            status:'failed',
            msg
        })
    }
})
apiRouter.get('/user/logout', (req, res) => {
    res.clearCookie('user');
    res.status(200).json({
        msg:'done'
    })
    console.log('logout');
})
export default apiRouter;
