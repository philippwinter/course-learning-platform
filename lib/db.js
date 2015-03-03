/**
 * Db module, handling the data storages.
 */

console.log("Loading db module");

var loki = require("lokijs");
var configuration = {
	autoload : true,
	autoloadCallback : loadHandler,
	autosave : true,
	autosaveInterval : 10000
}
var db = new loki(global.dirs.db + '/main.json', configuration);

global.entities = {
	users: null
};

function loadHandler() {
	console.log("Loading loki.js database");
	entities.users = db.getCollection('users');
	if (!entities.users) {
		entites.users = db.addCollection('users');
	}
}

function init() {
	console.log('Initializing database now');
}

exports.init = init;