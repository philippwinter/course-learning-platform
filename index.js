var express = require('express');
var app = express();
var logging = express.Router();

var dust = require('dustjs-linkedin');
var dust_helpers = require('dustjs-helpers');
var cons = require('consolidate');

var courses = require('./data/json/courses/courses.json');

var data = setupData();
var cachedData = [];

function setupData() {
	d = [];
	// Data available to all sites
	d["general"] = require('./data/json/general.json');

	// Data respective to each site
	d["Courses"] = courses;
	d["Home"] = require('./data/json/sites/home.json');
	d["Contact"] = require('./data/json/sites/contact.json');
	d["About"] = require('./data/json/sites/about.json');
	
	return d;
}

function getSiteData(name) {
	if(cachedData[name] === undefined) {
		cachedData[name] = wrapSiteData(name);
	}
	return cachedData[name];
}

function wrapSiteData(name) {
	console.log('Wrapping data for site ' + name + " now");
	
	var o = {};
	
	o.all = data['general'];
	o.site = data[name];
	o.siteName = name;
	
	return o;
}

app.set('views', __dirname + '/views');
app.engine('dust', cons.dust);

app.get("/public/*", function(req, res) {
	var requestedFile = __dirname + req.path;
	console.log('Serving static content '+ req.path + " now!");
	res.sendFile(requestedFile);
});

app.all('/', function(req, res, next) {
	console.log(new Date() + '\t - Accessing: ' + req.path + " now!");
	next(); // pass control to the next handler
});

app.all('/', function(req, res) {
	res.redirect('/home');
});

app.all('/home', function(req, res) {
	res.render('home.dust', getSiteData("Home"));
});

app.all('/about', function(req, res) {
	res.render('about.dust', getSiteData("About"));
});

app.all('/contact', function(req, res) {
	res.render('contact.dust', getSiteData("Contact"));
});

app.all('/courses/', function(req, res) {
	res.render('courses.dust', getSiteData("Courses"));
});

app.all('/course/:id', function(req, res) {
	res.redirect('/course/' + req.params.id + '/view');
});

app.all('/course/:id/view', function(req, res) {
	res.render('course_detail.dust', getCourseInformation(req.params.id));
});

app.listen(8888);

console.log('Server started');
console.log('Got following courses:');
console.log(courses);
console.log('Using views from the directory ' + app.get('views'));
console.log('Got data to serve:');
console.log(data);