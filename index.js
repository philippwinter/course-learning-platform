/**
 * Index module, or the 'bootstrapper' of the project.
 */

var port = 8888;

/**
 * The path module, essential to resolve and normalize fs paths.
 */
var path = require('path');

/**
 * Directory declarations
 */
var BASE_DIR = path.normalize(__dirname);
var DATA_DIR = path.normalize(BASE_DIR + '/data/');
var LIB_DIR = path.normalize(BASE_DIR + '/lib/');
var VIEWS_DIR = path.normalize(BASE_DIR + '/views/');
var DB_DIR = path.normalize(DATA_DIR + '/db/');
var ROUTES_DIR = path.normalize(BASE_DIR + '/routes/');
var MODEL_DIR = path.normalize(LIB_DIR + '/model/');

global.dirs = {
	base: BASE_DIR,
	data: DATA_DIR,
	lib: LIB_DIR,
	view: VIEWS_DIR,
	db: DB_DIR,
	routes: ROUTES_DIR,
	model: MODEL_DIR
}

/**
 * Basic libraries for our server;
 */
var express = require('express');
global.app = express();

/**
 * Template engine and supporting libs.
 */
var dust = require('dustjs-linkedin');
var dust_helpers = require('dustjs-helpers');
var cons = require('consolidate');

/**
 * Database backend
 */
global.db = {
		'main': require(dirs.lib + 'db.js')
};
(function() {
	for(var i in db) {
		db[i].init();
	}
})();

/**
 * Utils
 */
global.utils = require(dirs.lib + 'utils.js');

/**
 * Enable session storage
 */
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
app.use(cookieParser());
app.use(sessionParser({secret: utils.hash("" + Math.random() * 10000)}));

/**
 * Load the security module
 */
var security = require(dirs.lib + 'security.js');

app.set('views', dirs.view);
app.engine('dust', cons.dust);

var main = require(dirs.lib + 'main.js');
var errorHandling = require(dirs.lib + 'error_handling.js');

console.log('Server started');

process.on('exit', function() {
	console.log('Shutting down app now');
});

app.listen(port);

console.log('-----------------------------')
console.log('---- BEGIN LOG DUMPS NOW ----')
console.log('-----------------------------')
console.log(security.protectedArea);
console.log('Using views from the directory ' + app.get('views'));
//console.log('Got data to serve:');
//console.log(data);
console.log('Got following databases:');
utils.listElementNames(db, '\t');
console.log('-----------------------------')
console.log('---- SUCCESSFULL STARTUP ----')
console.log('----   RUNNING ON ' + port + '   ----')
console.log('-----------------------------')