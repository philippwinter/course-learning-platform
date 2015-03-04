/**
 * Error handling module.
 */

var data = require(dirs.lib + 'data.js');

app.use(function(req, res) {
	res.status(404);
	data.wrapAndRender('error.dust', data.getSiteData('Error-404'), req, res);
});

app.use(function(error, req, res) {
	console.error(error.stack);
	res.status(500);
	data.wrapAndRender('error.dust', data.getSiteData('Error-500'), req, res);
});

process.on('error', function(err) {
	console.error(err);
});