/**
 * User routes.
 */

var express = require('express');
var data = require(dirs.lib + 'data.js');
var security = require(dirs.lib + 'security.js');
var isProtected = security.protectedArea;

var mountpath = '/user/';
var model = require(dirs.model + 'user.js');

var router = express.Router();

router.route('/list').all(isProtected).all(function(req, res) {
	data.wrapAndRender('user/list.dust', {userList: model.db.find()}, req, res);
});

router.route('/view/:username').all(isProtected).all(function(req, res) {
	var result = model.db.findOne({username: req.params.username});
	console.log('Found user for name "' + req.params.username + '"');
	console.log(result);
	data.wrapAndRender('user/view.dust', data.getSiteData("User-view", {specificUser: result}), req, res);
});

module.exports = router;