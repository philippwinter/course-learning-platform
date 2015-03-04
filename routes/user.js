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
	console.log(model);
	data.wrapAndRender('user/list.dust', {userList: model.db.find()}, req, res);
});

module.exports = router;