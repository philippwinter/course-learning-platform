/**
 * Db module, handling the data storages.
 */

console.log("Loading db module");

var events = require("events");
var dbEvents = new events.EventEmitter();

console.log(dbEvents);

var loki = require("lokijs");
var configuration = {
	autoload : true,
	autoloadCallback : loadHandler,
	autosave : true,
	autosaveInterval : 10000
}
var db = new loki(global.dirs.db + '/main.json', configuration);

global.entities = {
	users: null,
    courses: null,
    practice: null,
	whenLoaded: registerLoadedCallback
};

function registerLoadedCallback(cb) {
	dbEvents.on('loaded', cb);
}

function loadHandler() {
	console.log("Loading loki.js database");
	initCollection('users');
    initCollection('courses');
    initCollection('practice');
	dbEvents.emit('loaded');
}

function initCollection(name) {
	entities[name] = db.getCollection(name);
	if(!entities[name]){
		entities[name] = db.addCollection(name);
		console.log("Created collection: " + name);
	}else{
		console.log("Loaded collection from file: " + name);
	}
}

function init() {
	console.log('Initializing database now');
}

exports.init = init;