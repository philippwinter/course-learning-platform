/**
 * Security module. Enforces e.g. login to access certain sections of the application.
 */

console.log("Loading security module");

/**
 * UUID module, used to associate sessions with data
 */
var uuid_module = require('node-uuid');
var data = require(dirs.lib + 'data.js');

var sessionMapping = {};

function logSessions() {
	console.log("---- DUMPING SESSION DATA ----");
	var count = 0;
	for(var i in sessionMapping){
		count++;
		console.log("Got session " + i);
		console.log(sessionMapping[i]);
	}
	console.log("Dumped " + count + " sessions");
	console.log("--- END DUMP ----");
}

function generateUuid() {
	return uuid_module.v1();
}

function getSessionData(uuid) {
	return sessionMapping[uuid];
}

function addSession(user) {
	var uuid = generateUuid();
	if(sessionMapping[uuid] !== undefined) {
		throw new Error("There must not be the same uuid twice");
	}else{
		sessionMapping[uuid] = {
				uuid: uuid,
				user: user
		}
		console.log("Created session mapping for uuid " + uuid + ":");
		console.log(sessionMapping[uuid]);
	}
	return uuid;
}

function getCurrentUser(req) {
	if(req.session.uuid) {
		var data = getSessionData(req.session.uuid);
		//console.log("Data for session uuid " + req.session.uuid + " is:");
		//console.log(data);
		return data.user;
	}else{
		return null;
	}
}

function protectedAreaHandler(req, res, next) {
	console.log("Accessing protected area at " + req.url);
	
	var user = getCurrentUser(req);
	if(user !== null) {
		console.log("Allow access");
		next();
	}else{
		console.log("Deny access");
		data.wrapAndRender('error.dust', data.getSiteData('Error-403'), req, res);
	}
}

function unloggedAreaHandler(req, res, next) {
	var user = getCurrentUser(req);
	if(user === null) {
		next();
	}else{
		res.redirect('/alreadyLoggedIn');
	}
}

exports.addSession = addSession;
exports.getSessionData = getSessionData;
exports.logSessions = logSessions;
exports.getCurrentUser = getCurrentUser;
exports.protectedArea = protectedAreaHandler;
exports.onlyUnloggedArea = unloggedAreaHandler;