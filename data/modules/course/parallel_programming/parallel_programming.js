/**
 * The parallel programming course.
 */

console.log("Loading parallel programming module now!");

var express = require("express");
var router = express.Router();
var security = require(dirs.lib + 'security.js');
var courses = require(dirs.model + 'course.js');
var isProtected = security.protectedArea;
var thisCourse = coursesLoaded.parallel_programming;

var data = require(dirs.lib + 'data.js');
var renderInfo = 'parallel_programming';
var utils = require(dirs.lib + 'utils.js');

var contentRouter = require(__dirname + '/lib/content.js');

var cachedCourseData = {};

function courseData(name) {
	if(!cachedCourseData[name]){
		cachedCourseData[name] = require(thisCourse.dir + 'data/' + name + '.json');
	}
	return cachedCourseData[name];
}

var availablePaths = function() {
	var content = thisCourse.mountpath + '/content/'
	return {
		'start': thisCourse.mountpath + '/overview',
		'general': content + 'general',
		'usecases': content + 'usecases',
		'scenarios': content + 'scenarios',
		'implementation': content + 'implementation',
		'finalTest': '/practice'
	};
}
var basicData = function() {
	var d;
	d = utils.merge({info: thisCourse.info}, {paths: availablePathsCached});
	return d;
}

var availablePathsCached = null;
var basicDataCached = null;

router.use(isProtected);

// Fix awkward bug -.-
router.use(function(req, res, next) {
	if(!thisCourse) {
		thisCourse = coursesLoaded.parallel_programming;
	}
	if(!availablePathsCached) {
		availablePathsCached = availablePaths();
	}
	if(!basicDataCached) {
		basicDataCached = basicData();
	}
	next();
});

router.route('/').all(function(req, res) {
	console.log(thisCourse);
	res.redirect(thisCourse.mountpath + '/view');
});

router.route('/view').all(function(req, res) {
	var siteData = utils.merge(basicDataCached, data.getSiteData('Course-view'));
	data.wrapAndRender('course/view.dust', siteData, req, res);
});

router.route('/overview').all(function(req, res) {
	var d = {content: courseData("content")};
	var siteData = utils.merge(basicDataCached, d);
	siteData = utils.merge(siteData, data.wrapSiteData("Parallel Programming course - Overview"));
	data.wrapAndRender('overview.dust', siteData, req, res, renderInfo);
});

router.use('/content', contentRouter);

module.exports = router;