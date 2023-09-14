const { log } = require('console');
const express=require('express');
const router=express.Router();
const db=require('../connection')
var ObjectId = require("mongodb").ObjectID;

router.get('/',(req,res)=>{
    res.render('home')
})
router.get('/profile',async(req,res)=>{
      console.log(req.cookies);

    if (!req.user) { // Handle the case where there is no authenticated user
      res.redirect('/login') // Redirect to the login page, for example
      return
    }
    let userEmail=req.user;
    let user = await db.get().collection('user').findOne({'email':userEmail})
    console.log(req.user);
    res.json({
        user
    })
})

router.get('/login',(req,res)=>{
    res.render('login')
  })
  router.get('/signup',(req,res)=>{
      res.render('signup')
  })
router.post('/signup', async (req, res) => {
  try {
    const userData = req.body;
    const userCollection = db.get().collection('user');
    const user=await userCollection.findOne({'email':userData.email})
    if(user){
      res.render('signup',{msg:"User already exists"})
      return 0;
    }
    const result = await userCollection.insertOne(userData);

    if (result.acknowledged) {
      console.log('User registered successfully');
      const cookieOptions = {
        expires: new Date(Date.now() +100* 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      const userInfo = req.body;
      res.cookie('user',userInfo,cookieOptions);
      req.user=userInfo
      res.redirect('/profile');
      
    } else {
      console.error('Failed to insert user data');
      res.status(500).send('Failed to register user');
    }
  } catch (error) {
    console.error('Error while registering user:', error);
    res.status(500).send('An error occurred while registering user');
  }
});
router.post('/login',async(req,res)=>{
  const userData=req.body
  const userCollection = db.get().collection('user');
  const user=await userCollection.findOne({'email':userData.email})
  if(user){
    req.user=user;
    res.redirect('/profile')
  }
})
module.exports=router;