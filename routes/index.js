const { log } = require('console');
const express=require('express');
const router=express.Router();
const db=require('../connection')

router.get('/',(req,res)=>{
    res.render('home')
})
router.get('/profile',async(req,res)=>{
    let data;
   let book = await db.get().collection('book').find().toArray()
    res.json({
        book
    })
})

router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',(req,res)=>{
    let data=req.body
    console.log(req.body);
    db.get().collection('user').inserOne(data).then((response)=>{
        
    })
    res.redirect('/profile')
})
router.get('/signin',(req,res)=>{
    res.render('index')
})
module.exports=router;