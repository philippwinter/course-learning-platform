/**
 * Top level router;
 */

var express = require('express');
var data = require(dirs.lib + 'data.js');
var security = require(dirs.lib + 'security.js');
var bodyParser = require('body-parser');

var mountpath = '/';

var router = express.Router();

router.all('/', function(req, res) {
	res.redirect(mountpath + 'home');
});

router.all('/home', function(req, res) {
	data.wrapAndRender('home.dust', data.getSiteData("Home"), req, res);
});

router.all('/about', function(req, res) {
	data.wrapAndRender('about.dust', data.getSiteData("About"), req, res);
});

router.all('/contact', function(req, res) {
	data.wrapAndRender('contact.dust', data.getSiteData("Contact"), req, res);
});

router.all('/credits', function(req, res) {
	data.wrapAndRender('credits.dust', data.getSiteData("Credits"), req, res);
});

router.route('/register').get(
		function(req, res) {
			console.log('Getting the register page');
			data.wrapAndRender('register.dust', data.getSiteData("Register"),
					req, res);
		}).post(bodyParser.json()).post(bodyParser.urlencoded()).post(
		function(req, res) {
			console.log('Trying to register with following body:');
			console.log(req.body);
			var response = {};
			if (req.body.username && req.body.password) {
				var users = entities.users;
				var resultSet = users.find({
					username : req.body.username
				});
				if (resultSet == undefined || resultSet.length == 0) {
					var obj = users.insert({
						username : req.body.username,
						password : utils.hash(req.body.password)
					});
					response = {
						status : "success",
						username : obj.username
					};
					console.log("Successfully registered user:");
					console.log(obj);
				} else {
					response = {
						status : "error",
						cause : "Username not available"
					};
					console.log("Username " + req.body.username
							+ " not available - got following resultSet:");
					console.log(resultSet);
				}

			} else {
				response = {
					status : "error",
					cause : "Username or password is not specified"
				};
				console.log("Username or password hasn't been specified");
			}

			res.send(response);
		});

router.route('/login').all(function(req, res, next) {
	if (security.getCurrentUser(req) === null) {
		next();
	} else {
		res.redirect('/home');
	}
}).get(function(req, res) {
	data.wrapAndRender('login.dust', data.getSiteData("Login"), req, res);
}).post(bodyParser.json()).post(bodyParser.urlencoded()).post(
		function(req, res) {
			console.log('Trying to login with following body:');
			console.log(req.body);
			var response = {};

			if (req.body.username && req.body.password) {
				var users = entities.users;
				var resultSet = users.find({
					username : req.body.username
				});

				if (resultSet == undefined || resultSet.length == 0) {
					response = {
						status : "error",
						cause : "Username not found"
					};
				} else {
					var obj = resultSet[0];
					if (obj.password === utils.hash(req.body.password)) {
						response = {
							status : "success",
							username : obj.username
						};
						var uuid = security.addSession(obj);
						req.session.uuid = uuid;
						console.log("Saved session identifier " + uuid + ":");
						console.log(req.session);
					} else {
						response = {
							status : "error",
							cause : "Password is wrong"
						};
					}
				}
			}

			res.send(response);
		});

router.all('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;