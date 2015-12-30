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

app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, 
	secret: 'RANDOM', cookie: { maxAge: 3000 }}));

var sess;


app.use(function (req, res, next) {

  var views = req.session.views


  if (!views) {
    views = req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname;
  console.log("path name is ::",pathname)
  console.log("In view method ",req.body)
  logger.info("Body of request is ",req.body)

  // count the views
  views[pathname] = (views[pathname] || 0) + 1;
  if(pathname=='/loginForm')
   {
      console.log('1');
    views['username'] =req.body.username;
    next();
    }
  else if(views['username']!=''){
      console.log('2');
      next();
  }else if(pathname=='/' || pathname=='/registration' ){
    console.log('3');
      next();

  }else {
    console.log('4');
      console.log('Invalid Request');
      res.end('Session expired... Invalid Value');  
  }
    console.log('5');


  
  
})


app.get('/', function(req, res){

	/*fs.readFile('./index.html', 'utf-8', function(err, data){
		if(err) throw err;


		res.send(data);
	})*/
  
  res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/registration', function(req, res){

  /*fs.readFile('./views/registration.html', 'utf-8', function(err, data){
    if(err) throw err;

    res.send(data);*/
    sess = req.session;

    logger.info('User Entered In Registration ',sess.views['username']);
    res.setHeader('Content-Type', 'text/html')
    res.write('<p><b>Registration Page View Count : ' + sess.views['/registration'] + '</b></p>')
    res.write('<p><b>Cookie expires in : ' + (sess.cookie.maxAge / 1000) + '</b></p>')
    res.end()
 // })
});

app.post('/loginForm', function(req, res){
	logger.info("request  ::",req.body);
  /*fs.readFile('./views/registration.html', 'utf-8', function(err, data){
    if(err) throw err;

    res.send(data);
  })*/

  sess = req.session;
    logger.info('\n session : '+sess);
    logger.info('\n sess : '+sess.views);
    logger.info('\n User Entered'sess.views['username']);
    res.setHeader('Content-Type', 'text/html')
    res.write('<p><b>Welcome' + sess.views['username'] + ' !!!!</b></p>');
    res.write('<a href="valid"><p class="small">Valid Access</p></a>');
    res.write('<a href="logout"><p class="small">Log out</p></a>');
    res.end()
});

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

app.listen(9000, function(){
	console.log('server listening on port: 9000');
});


app.get('/valid', function(req, res){

  //sess = req.session;
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