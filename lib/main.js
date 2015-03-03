/**
 * The main module. Defines mainly routes.
 */

console.log("Loading main module");

/**
 * Course information.
 */
var courses = require(dirs.data + 'json/courses/courses.json');

/**
 * Data module
 */
var data = require(dirs.lib + 'data.js');

/**
 * Body parser
 */
var bodyParser = require('body-parser');

app.get("/public/*", function(req, res) {
	var requestedFile = dirs.base + req.path;
	//console.log('Serving static content ' + req.path + " now!");
	res.sendFile(requestedFile);
});

app.use(function(req, res, next) {
	console.log("***************************************************");
	console.log(new Date() + '\t - Accessing: ' + req.path + " now!");
	console.log("***************************************************");
	//console.log("Current session:");
	//console.log(req.session);
	//security.logSessions();
	next();
});

app.all('/', function(req, res) {
	res.redirect('/home');
});

app.all('/home', function(req, res) {
	data.wrapAndRender('home.dust', data.getSiteData("Home"), req, res);
});

app.all('/about', function(req, res) {
	data.wrapAndRender('about.dust', data.getSiteData("About"), req, res);
});

app.all('/contact', function(req, res) {
	data.wrapAndRender('contact.dust', data.getSiteData("Contact"), req, res);
});

app.all('/credits', function(req, res) {
	data.wrapAndRender('credits.dust', data.getSiteData("Credits"), req, res);
});

app.route('/courses/')
	.all(security.protectedArea)
	.all(function(req, res) {
		data.wrapAndRender('courses.dust', data.getSiteData("Courses"), req, res);
});

app.route('/course/:name')
	.all(security.protectedArea)
	.all(function(req, res) {
		res.redirect('/course/' + req.params.name + '/view');
});

app.route('/course/:name/view')
	.all(security.protectedArea)
	.all(function(req, res) {
		data.wrapAndRender('course_detail.dust', getCourseInformation(req.params.name), req, res);
});

app.route('/register')
	.get(function(req, res) {
		console.log('Getting the register page');
		data.wrapAndRender('register.dust', data.getSiteData("Register"), req, res);
	})
	.post(bodyParser.json())
	.post(bodyParser.urlencoded())
	.post(
		function(req, res) {
			console.log('Trying to register with following body:');
			console.log(req.body);
			var response = {};
			// TODO: Handle submitted data
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

app.route('/login')
	.all(function(req, res, next) {
		if(security.getCurrentUser(req) === null) {
			next();
		}else{
			res.redirect('/home');
		}
	})
	.get(function(req, res){
		data.wrapAndRender('login.dust', data.getSiteData("Login"), req, res);
	})
	.post(bodyParser.json()).post(bodyParser.urlencoded()).post(function(req, res){
		console.log('Trying to login with following body:');
		console.log(req.body);
		var response = {};
		
		if(req.body.username && req.body.password) {
			var users = entities.users;
			var resultSet = users.find({username: req.body.username});
			
			if(resultSet == undefined || resultSet.length == 0) {
				response = {
						status: "error",
						cause: "Username not found"
				};
			}else{
				var obj = resultSet[0];
				if(obj.password === utils.hash(req.body.password)){
					response = {
							status: "success",
							username: obj.username
					};
					var uuid = security.addSession(obj);
					req.session.uuid = uuid;
					console.log("Saved session identifier " + uuid + ":");
					console.log(req.session);
				}else{
					response = {
							status: "error",
							cause: "Password is wrong"
					};
				}
			}
		}		
		
		res.send(response);
	});

app.all('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});