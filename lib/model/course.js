/**
 * Courses model.
 */

var path = require('path');
var courseDir = path.normalize(dirs.dataDirs.modules + '/course/');
var information = require(courseDir + 'list.json');
var data = require(dirs.lib + 'data.js');

module.exports = model = {
		generalInformation: information,
};

entities.whenLoaded(function() {
	console.log("Loaded courses collection into model; Begin courses initialization");
	
	global.coursesLoadedNames = [];
	global.coursesLoaded = {};
	initCourses();
	console.log(model);
});

function initCourses() {
	var courses = information.available;
	console.log("Got following courses:");
	console.log(courses);
		
	for(var i = 0; i < courses.length; i++) {
		var course = {};
		course.name = courses[i];
		course.dir = courseDir + course.name + '/';
		course.info = require(course.dir + 'course.json');
		course.routes = require(course.dir + course.info.routes);
		course.mountpath = '/course/' + course.name;
		
		app.use(course.mountpath, require(course.dir + course.info.routes));
		
		coursesLoaded[courses[i]] = course;
		coursesLoadedNames.push({name: course.name});
		console.log("Mounted course: " + course.name);
	}	
	console.log(coursesLoaded);
	console.log(coursesLoadedNames);
}