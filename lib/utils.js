/**
 * The utils module.
 */

console.log("Loading utils module");

var crypto = require('crypto');

function listElementNames(obj, lineStart) {
	for(var i in obj) {
		var info = i;
		console.log(lineStart == undefined ? info : lineStart + info );
	}
}

function hash(value) {
	var sha512 = crypto.createHash('sha512');
	
	if(sha512 === undefined) {
		console.error("sha512 has to be supported on this platform");
	}
	
	sha512.update(value);
	return sha512.digest('hex');
}

exports.listElementNames = listElementNames;
exports.hash = hash;