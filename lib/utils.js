/**
 * The utils module.
 */

function listElementNames(obj, lineStart) {
	for(var i in obj) {
		var info = i;
		console.log(lineStart == undefined ? info : lineStart + info );
	}
}

exports.listElementNames = listElementNames;