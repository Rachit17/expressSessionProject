var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var parseurl = require('parseurl');
var path= require('path');
var logger = require('./utils/loggerUtil');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Third -Party Middleware
app.use(cookieParser());

app.use(session({resave: true, saveUninitialized: true, 
secret: 'RANDOM', cookie: { maxAge: 3000 }}));

var sess;


/*
The below function acts as application level middleware where it  
has access to the request object (req), the response object (res), 
and the next middleware function in the application’s request-response cycle
*/

app.use(function (req, res, next) {

  var views = req.session.views


  if (!views) {
    views = req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname;
  logger.info("Body of request is ",req.body)

  // count the views
  views[pathname] = (views[pathname] || 0) + 1;
  if(pathname=='/loginForm')
   {
    views['username'] =req.body.username;
    next();
    }
  else if(views['username']!=''){
      next();
  }else if(pathname=='/' || pathname=='/registration' ){
      next();

  }else {
      res.end('Session expired... Invalid Value');  
  }


  
  
})


/*
This page will load by default on launch of the application
*/
app.get('/', function(req, res){
  
  res.sendFile(path.join(__dirname+'/index.html'));
});

/*
This will load when the user clicks on registration button
*/
app.get('/registration', function(req, res){
    sess = req.session;

    logger.info('User Entered In Registration ',sess.views['username']);
    res.setHeader('Content-Type', 'text/html')
    res.write('<p><b>Registration Page View Count : ' + sess.views['/registration'] + '</b></p>')
    res.write('<p><b>Cookie expires in : ' + (sess.cookie.maxAge / 1000) + '</b></p>')
    res.end()
});

/*This will load when the user enters the login credentials and 
submits the form
*/
app.post('/loginForm', function(req, res){
	logger.info("request  ::",req.body);

  sess = req.session;
    logger.info('\n session : '+sess);
    logger.info('\n sess : '+sess.views);
    logger.info('\n User Entered',sess.views['username']);
    res.setHeader('Content-Type', 'text/html')
    res.write('<p><b>Welcome ' + sess.views['username'] + ' !!!!</b></p>');
    res.write('<a href="valid"><p class="small">Valid Access</p></a>');
    res.write('<a href="logout"><p class="small">Log out</p></a>');
    res.end()
});

/*This function logs out the user
*/
app.get('/logout', function(req, res){

  sess = req.session;
  logger.info('username before session invalidation ' +sess.views['username']);
  sess = null;
  logger.error(res.error);

  res.setHeader('Content-Type', 'text/html')
  res.write('<p><b>Logout Success</b> </p>');
  res.write('<a href="valid"><p class="small">Invalid Access</p></a>');

  res.end()
});

/*Starting the html server*/
app.listen(9000, function(){
	logger.info('Server listening on port: 9000');
  console.log('Server listening on port: 9000');
});


/*This function checks for the validity of the url after session is inactive
*/
app.get('/valid', function(req, res){

  logger.info('\n In The Valid Method',sess)

  if(sess == null){
  res.setHeader('Content-Type', 'text/html')
  res.write('<p><b>Page Rendered After Session Expired </b></p>');
  res.write('<p>Invalid Request </p>');
  res.end();

  }else{
  res.setHeader('Content-Type', 'text/html')
  res.write('<p><b>Page Rendered Before Session Expired </b></p>');
  res.write('<a href="logout"><p class="small">Log out</p></a>');
  res.end();

  }

  
});