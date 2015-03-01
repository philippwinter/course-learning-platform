/**
 * New node file
 */

var loki = require('lokijs');
var db = new loki(global.DB_DIR + '/main.json');

function init() {
	console.log('Initializing database now');
}

exports.init = init;