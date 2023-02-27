const cors = require('cors');
const express = require('express');
const morgan = require('morgan')
const app = express();

app.use(express.json());
app.use(morgan('tiny'))
app.use(cors());

require('./config/db')
require('dotenv').config()
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const {authenticateUser}=require('./middleware/isAuthenticated')

const userRouter=require('./routes/user.route')
const adminRouter=require('./routes/admin.route')
const petRouter=require('./routes/pet.route')
const dashboardRouter=require('./routes/dashboard.route')

app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/pet',authenticateUser,petRouter)
app.use('/dashboard',dashboardRouter)


module.exports=app