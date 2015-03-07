/**
 * Data module, taking care of the site's data.
 */

var path = require("path");

var security = require(dirs.lib + 'security.js');
var utils = require(dirs.lib + 'utils.js');

console.log("Loading data module");

dirs.dataDirs = {};
dirs.dataDirs.modules = path.normalize(dirs.data + '/modules/');
dirs.dataDirs.sites = path.normalize(dirs.data + '/sites/');
dirs.dataDirs.errors = path.normalize(dirs.data + '/error/');

//console.log(dirs.dataDirs);

var cachedData = [];
var data = setup();

function _require(dir, name, ext) {
	if(!dir) {
		throw new TypeError("dir is not defined");
	}
	if(!name) {
		throw new TypeError("name is not defined");
	}
	if(!ext) {
		ext = ".json";
	}
	var path = dir + name + ext;
	//console.log("requiring path: " + path);
	return require(path);
}

function jsons(name) {
	return _require(dirs.dataDirs.json, name);
}

function sites(name) {
	return _require(dirs.dataDirs.sites, name);
}

function errors(name) {
	return _require(dirs.dataDirs.errors, name);
}

function modules(moduleName, fname) {
	return _require(dirs.dataDirs.modules + moduleName + '/', fname);
}

function setup() {
	d = [];
	// Data available to all sites
	d["general"] = _require(dirs.data, "general");

	// Static sites
	d["Home"] = sites("home");
	d["Contact"] = sites("contact");
	d["About"] = sites("about");
	d["Credits"] = sites("credits");
	d["Register"] = sites("register");
	d["Login"] = sites("login");
	d["AlreadyLoggedIn"] = sites("alreadyLoggedIn");
	
	// Error pages
	d["Error-403"] = errors("403");
	d["Error-404"] = errors("404");
	d["Error-500"] = errors("500");
	
	// User module
	d["User-list"] = modules("user", "list");
	d["User-view"] = modules("user", "view");
	
	// Course module
	d["Course-list"] = modules("course", "list");
	d["Course-view"] = modules("course", "view");
	
	//console.log(d);
	
	return d;
}

function getSiteData(name, obj) {
	if(cachedData[name] === undefined) {
		cachedData[name] = wrapSiteData(name);
	}
	var data = cachedData[name];
	var merged = utils.merge(data, obj);
//	console.log("Showing merged data for name " + name);
//	console.log("It should consist out of those objects:");
//	console.log(data);
//	console.log(obj);
//	console.log(merged);
	return merged;
}

function wrapSiteData(name) {
	console.log('Wrapping data for site ' + name + " now");
	
	var o = {};
	
	o.all = data['general'];
	o.site = data[name];
	o.siteName = name;
	
	return o;
}

function wrapAndRender(template, data, req, res, course) {
	var user = security.getCurrentUser(req);
	
	if(course !== undefined) {
		template = dirs.dataDirs.modules + '/course/' + course + '/views/' + template;
	}else{
		template = dirs.view + template;
	}
	
	console.log("Template path: " + template);
	
	var wrappedData = {
			session: req.session,
			user: {
				data: user,
				loggedIn: user !== null
			}
	}
	for(var i in data) {
		if(i === "session" || i === "user"){
			throw new Error("Data entries must not be named session or user");
		}
		wrappedData[i] = data[i];
	}
	console.log(wrappedData);
	res.render(template, wrappedData);
}

exports.data = data;
exports.setup = setup;
exports.getSiteData = getSiteData;
exports.wrapSiteData = wrapSiteData;
exports.wrapAndRender = wrapAndRender;
exports.modules = modules;