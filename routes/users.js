// Load required packages
var User = require('../models/user');
var express = require('express');
var router = express.Router();

// Create endpoint /api/users for POST
router.route('/users').post(function(req, res) {
	console.log(req.body);

	var user = new User({
		username: req.body.username,
		password: req.body.password
	});

	user.save( function(err) {
		if(err) {
			res.send(err);
		} else {
			res.json({message: 'New user added'});
		}
	});
});

//Create endpoint /api/users for GET
router.route('/users').get(function(req, res){
	User.find(function(err, users){
		if(err)
			res.send(err);
		res.json(users);
	});
});

module.exports= router;