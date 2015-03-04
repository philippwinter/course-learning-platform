/**
 * Data module, taking care of the site's data.
 */

var path = require("path");

var security = require(dirs.lib + 'security.js');
var cachedData = [];
var data = setup();

console.log("Loading data module");

function setup() {
	var jsonDirectory = path.normalize(dirs.data + '/json/');
	var sitesDirectory = path.normalize(jsonDirectory + '/sites/');
	var errorSitesDirectory = path.normalize(sitesDirectory + '/error/');
	var coursesDirectory = path.normalize(jsonDirectory + '/courses/');
	
	d = [];
	// Data available to all sites
	d["general"] = require(jsonDirectory + 'general.json');

	// Data respective to each site
	d["Courses"] = require(coursesDirectory + 'courses.json');
	d["Home"] = require(sitesDirectory + 'home.json');
	d["Contact"] = require(sitesDirectory + 'contact.json');
	d["About"] = require(sitesDirectory + 'about.json');
	d["Credits"] = require(sitesDirectory + 'credits.json');
	d["Register"] = require(sitesDirectory + 'register.json');
	d["Login"] = require(sitesDirectory + 'login.json');
	d["Error-403"] = require(errorSitesDirectory + "403.json");
	d["Error-404"] = require(errorSitesDirectory + "404.json");
	d["Error-500"] = require(errorSitesDirectory + "500.json");
	
	console.log(d);
	
	return d;
}

function getSiteData(name) {
	if(cachedData[name] === undefined) {
		cachedData[name] = wrapSiteData(name);
	}
	return cachedData[name];
}

function wrapSiteData(name) {
	console.log('Wrapping data for site ' + name + " now");
	
	var o = {};
	
	o.all = data['general'];
	o.site = data[name];
	o.siteName = name;
	
	return o;
}

function wrapAndRender(template, data, req, res) {
	var user = security.getCurrentUser(req);
	
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
	//console.log(wrappedData);
	res.render(template, wrappedData);
}

exports.data = data;
exports.setup = setup;
exports.getSiteData = getSiteData;
exports.wrapSiteData = wrapSiteData;
exports.wrapAndRender = wrapAndRender;