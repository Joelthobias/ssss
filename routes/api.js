import express from 'express';
const apiRouter = express.Router();

apiRouter.get('/',(req,res)=>{
    res.json({
        msg:"hello",
        user:"JOEL"
    })
})

export default apiRouter;
