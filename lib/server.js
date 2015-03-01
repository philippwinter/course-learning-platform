/**
 * Server module, or the 'heart' of the project.
 */

var port = 8888;

/**
 * The path module, essential to resolve and normalize fs paths.
 */
var path = require('path');

/**
 * Directory declarations
 */
var BASE_DIR = path.normalize(__dirname + '/..');
var DATA_DIR = path.normalize(BASE_DIR + '/data/');
var LIB_DIR = path.normalize(BASE_DIR + '/lib/');
var VIEWS_DIR = path.normalize(BASE_DIR + '/views/');
var DB_DIR = path.normalize(DATA_DIR + '/db/')

global.dirs = {
	base: BASE_DIR,
	data: DATA_DIR,
	lib: LIB_DIR,
	view: VIEWS_DIR,
	db: DB_DIR
}

/**
 * Basic libraries for our server;
 */
var express = require('express');
var app = express();

/**
 * Template engine and supporting libs.
 */
var dust = require('dustjs-linkedin');
var dust_helpers = require('dustjs-helpers');
var cons = require('consolidate');

/**
 * Course information.
 */
var courses = require(dirs.data + 'json/courses/courses.json');

/**
 * Data module
 */
var data = require(dirs.lib + 'data.js');

/**
 * Database backend
 */
global.db = {
		'main': require(dirs.lib + 'db.js').init()
};

/**
 * Util class
 */
var utils = require(dirs.lib + 'utils.js');

app.set('views', dirs.view);
app.engine('dust', cons.dust);

app.get("/public/*", function(req, res) {
	var requestedFile = dirs.base + req.path;
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
	res.render('home.dust', data.getSiteData("Home"));
});

app.all('/about', function(req, res) {
	res.render('about.dust', data.getSiteData("About"));
});

app.all('/contact', function(req, res) {
	res.render('contact.dust', data.getSiteData("Contact"));
});

app.all('/credits', function(req, res) {
	res.render('credits.dust', data.getSiteData("Credits"));
});

app.all('/courses/', function(req, res) {
	res.render('courses.dust', data.getSiteData("Courses"));
});

app.all('/course/:id', function(req, res) {
	res.redirect('/course/' + req.params.id + '/view');
});

app.all('/course/:id/view', function(req, res) {
	res.render('course_detail.dust', getCourseInformation(req.params.id));
});
console.log('Server started');
app.listen(port);

console.log('-----------------------------')
console.log('---- BEGIN LOG DUMPS NOW ----')
console.log('-----------------------------')
console.log('Got following courses:');
console.log(courses);
console.log('Using views from the directory ' + app.get('views'));
console.log('Got data to serve:');
console.log(data);
console.log('Got following databases:');
utils.listElementNames(global.db, '\t');
console.log('-----------------------------')
console.log('---- SUCCESSFULL STARTUP ----')
console.log('----   RUNNING ON ' + port + '   ----')
console.log('-----------------------------')