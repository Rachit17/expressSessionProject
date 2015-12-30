//configuring the application

var express= require ('express');
var bodyParser= require('body-parser');// used to parse the url
var mongoose= require('mongoose'); // to connect to mongodb
var userRoutes = require('./routes/users');// to access the routing
//var userLogin = require('./routes/userLogin')
var app = express();

//connecting to the database
var connectionString= 'mongodb://localhost:27017/usersDB';
mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api', userRoutes);
//app.use('/', userLogin);

module.exports = app; // exporting app to use in www.js