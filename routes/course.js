/**
 * Course routes.
 */

var express = require('express');
var data = require(dirs.lib + 'data.js');
var security = require(dirs.lib + 'security.js');
var isProtected = security.protectedArea;

var mountpath = '/course/';
var model = require(dirs.model + 'course.js');

var router = express.Router();

router.route('/')
	.all(function(req, res) {
		res.redirect(mountpath + 'list');
	})

router.route('/list')
	.all(isProtected)
	.all(function(req, res) {
		data.wrapAndRender('course/list.dust', data.getSiteData("Courses"), req, res);
});

router.route('/view/:name')
	.all(isProtected)
	.all(function(req, res) {
		data.wrapAndRender('course/detail.dust', model.getCourseInformation(req.params.name), req, res);
});

module.exports = router;