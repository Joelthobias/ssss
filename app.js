const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const port = 7081;
const db=require('./connection')
const cookieParser=require('cookie-parser')
const app = express();

// Set up Handlebars as the template engine
app.set('view engine', 'hbs');
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use(express.urlencoded({extended:true}))

const userRouter=require('./routes/user')
const adminRouter = require('./routes/admin')

app.use('/', userRouter)
app.use('/admin', adminRouter)
// Start the server
const connect = db.connect((err) => {
  if (!err){
      console.log("Database Connected");
    }else{
      console.log(err);
    } 
    
  })
  
  const server = app.listen(port, () => {
    
  
      console.log(`Server Started at ${port}`);
  });