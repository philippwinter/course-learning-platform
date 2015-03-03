/**
 * Error handling module.
 */

var data = require(dirs.lib + 'data.js');

app.use(function(req, res) {
	res.status(404);
	res.render('error.dust', data.getSiteData('Error-404'));
});

app.use(function(error, req, res) {
	console.error(error.stack);
	res.status(500);
	res.render('error.dust', data.getSiteData('Error-500'));
});

process.on('error', function(err) {
	console.error(err);
});