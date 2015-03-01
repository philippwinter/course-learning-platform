/**
 * Data module, taking care of the site's data.
 */

var cachedData = [];
var data = setup();

function setup() {
	var jsonDirectory = dirs.data + '/json/';
	var sitesDirectory = jsonDirectory + '/sites/';
	
	
	d = [];
	// Data available to all sites
	d["general"] = require(jsonDirectory + 'general.json');

	// Data respective to each site
	d["Courses"] = require('../data/json/courses/courses.json');
	d["Home"] = require(sitesDirectory + 'home.json');
	d["Contact"] = require(sitesDirectory + 'contact.json');
	d["About"] = require(sitesDirectory + 'about.json');
	d["Credits"] = require(sitesDirectory + 'credits.json');
	
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

exports.data = data;

exports.setup = setup;
exports.getSiteData = getSiteData;
exports.wrapSiteData = wrapSiteData;