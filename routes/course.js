/**
 * Course routes.
 */

var express = require('express');
var data = require(dirs.lib + 'data.js');
var utils = require(dirs.lib + 'utils.js');
var security = require(dirs.lib + 'security.js');
var isProtected = security.protectedArea;

var mountpath = '/course/';
var model = require(dirs.model + 'course.js');

var router = express.Router();

router.route('/').all(function(req, res) {
	res.redirect(mountpath + 'list');
});

router.route('/list').all(isProtected).all(
		function(req, res) {
			var loadedCourses = {
				loaded : coursesLoaded,
				course_names : coursesLoadedNames
			};
			console.log("Loaded courses: ");
			console.log(loadedCourses);
			data.wrapAndRender('course/list.dust', utils.merge(data
					.getSiteData("Course-list"), loadedCourses), req, res);
		});

module.exports = router;