const express = require('express');

const app = express();

app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// --

require('dotenv').config();


const port = process.env.SERVER_PORT | 3000;


//--
// DB connection

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/restful-auth-api');



// routes

const userRoute = require('./routes/userRoute');

app.use('/api', userRoute);


// auth routes
const authRoutes = require('./routes/authRoute');
app.use('/', authRoutes);



// VIEW Engine ko index.js me hi define karenge.

app.set('view engine', 'ejs');
app.set('views', './views');




app.listen(port, () => {
  console.log("Server Start");
})