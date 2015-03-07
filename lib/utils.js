/**
 * The utils module.
 */

console.log("Loading utils module");

var crypto = require('crypto');

module.exports = utils = {
	listElementNames : function(obj, lineStart) {
		for ( var i in obj) {
			var info = i;
			console.log(lineStart == undefined ? info : lineStart + info);
		}
	},

	hash : function(value) {
		var sha512 = crypto.createHash('sha512');

		if (sha512 === undefined) {
			throw new Error("sha512 has to be supported on this platform");
		}

		sha512.update(value);
		return sha512.digest('hex');
	},
	
	// NOTE: Creates only a shallow copy
	merge : function(a, b) {
		if(a === undefined) {
			return b;
		}
		if(b === undefined) {
			return a;
		}
		var merged = {};
		for(var n in a) {
			merged[n] = a[n];
			//console.log("Added " + n + " to merged: " + merged[n]);
		}
		
		// If properties exist in both objects, b one's will be used;
		for(n in b) {
			merged[n] = b[n];
			//console.log("Added " + n + " to merged: " + merged[n]);
		}
		
		return merged;
	}
}