import express from "express";
require('dotenv').config()
import bodyParser from 'body-parser'
import mongoose from "mongoose";
import Joi from "joi"
const passport = require('passport');
const rateLimit = require("express-rate-limit");

const startServer = async () => {
  const passport = require('passport');
  const cors = require('cors');
  const logger = require('morgan');
  const cookieParser = require('cookie-parser')
  // create express app
  const app = express();
  const limiter = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
   
  //  apply to all requests
  app.use(limiter);

  // Simple API Check only
  var myAPIChecker = function (req, res, next) {
    let apiKey = req.header("APIKEY");
    console.log(apiKey)
    if (apiKey && apiKey == "S1E9C9R0E0T5K0E7Y-qlx") {
      next()
    } else {
      res.status(501).send({msg: "UnAuthorized!"})
    }
  }

  app.use(myAPIChecker)

  // Add headers Middle Ware
  // app.use(function (req, res, next) {
  //     // Website you wish to allow to connect
  //     res.setHeader('Access-Control-Allow-Origin', '*');
  //     // Request methods you wish to allow
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //     // Request headers you wish to allow
  //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //     // Set to true if you need the website to include cookies in the requests sent
  //     // to the API (e.g. in case you use sessions)
  //     res.setHeader('Access-Control-Allow-Credentials', true);
  //     // Pass to next layer of middleware
  //     next();
  // });

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }))
  // parse requests of content-type - application/json
  app.use(bodyParser.json())
  //app.use(cookieParser());

  app.use(passport.initialize());
  require('./components/AppPassPort');

  // Log requests to the console.
  app.use(logger('dev'));
  //app.use(cors());
  //app.use(cors({origin: 'http://localhost:3000'}));
  //app.use(cors({origin: 'http://localhost:3000'}));

  // CORS check for specific ORIGIN because we use Cookie
  // var allowedOrigins = ['http://localhost:3000',
  //                       'http://phuphuong.s3-website-ap-southeast-1.amazonaws.com'];
  // app.use(cors({
  //   origin: function(origin, callback){
  //     // allow requests with no origin 
  //     // (like mobile apps or curl requests)
  //     if(!origin) return callback(null, true);
  //     if(allowedOrigins.indexOf(origin) === -1){
  //       var msg = 'The CORS policy for this site does not ' +
  //                 'allow access from the specified Origin.';
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   }
  // }));

  // Require our routes into the application.
  require('./controllers')(app);

  // Setup a default catch-all route that sends back a welcome message in JSON format.
  app.get('*', (req, res) => res.status(200).send({
      message: 'Welcome to the beginning of nothingness.',
  }));

  var dbName = "test";
  if (process.env.IS_PROD) {
    dbName = process.env.DB_NAME_PROD;
  } else {
    dbName = process.env.DB_NAME_DEV;
  }

  console.log ("Use Mongo DB:" + dbName)
  await mongoose.connect("mongodb://127.0.0.1:27017/" + dbName, {
    useNewUrlParser: true, useUnifiedTopology:true
  });

  // listen for requests
  const port = process.env.PORT || 3000
  app.listen(port, () => {
      console.log("Vehicle Server is listening on port "+ port);
  });
}

startServer();
