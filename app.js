import http from 'http';
import express from 'express';
import path from 'path';
import hbs from 'express-handlebars';
import db from './connection.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'



const port = 7081;
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Set up Handlebars as the template engine
app.set('view engine', 'hbs');
app.use(express.json());
app.set('views', 'views');
app.use(express.static(`public`));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';
import apiRouter from './routes/api.js';


app.use('/', userRouter);
app.use('/admin', adminRouter);

app.use('/api/v1', apiRouter)

// Start the server using http module
const server = http.createServer(app);

const connect = db.connect((err) => {
  if (!err) {
    console.log("Database Connected");
  } else {
    console.log(err);
  }
});

server.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
