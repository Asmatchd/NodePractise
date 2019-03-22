var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var DB_URL = require("./constants/constants");

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongodb
// mongoose.connect(DB_URL, { useNewUrlParser: true });
// mongoose.Promise = global.Promise;


//middleware for getting req body
app.use(bodyParser.json());

//error handling middleware
app.use((err, req, res, next)=>{
    //console.log(err);
    res.status(404).send({error: err.message});
});




app.use('/', indexRouter);
app.use('/api', usersRouter);

module.exports = app;