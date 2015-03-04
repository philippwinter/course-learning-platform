/**
 * The main module, which mainly loads routes.
 */

console.log("Loading main module");

/**
 * Data module
 */
var data = require(dirs.lib + 'data.js');

/** 
 * Routers 
 */
var topLevelRouter = require(dirs.routes + 'top_level.js');
var courseRouter = require(dirs.routes + 'course.js');
var userRouter = require(dirs.routes + 'user.js');

app.get("/public/*", function(req, res) {
	var requestedFile = dirs.base + req.path;
	//console.log('Serving static content ' + req.path + " now!");
	res.sendFile(requestedFile);
});

app.use(function(req, res, next) {
	console.log("***************************************************");
	console.log(new Date() + '\t - Accessing: ' + req.path + " now!");
	console.log("***************************************************");
	//console.log("Current session:");
	//console.log(req.session);
	//security.logSessions();
	next();
});

app.use('/', topLevelRouter);
app.use('/course', courseRouter);
app.use('/user', userRouter);