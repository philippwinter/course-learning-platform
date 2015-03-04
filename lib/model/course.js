/**
 * Courses model.
 */

module.exports = model = {
		generalInformation: require(dirs.data + 'json/courses/courses.json'),
		db: null
};

entities.whenLoaded(function() {
	model.db = entities.courses;
	console.log("Loaded courses collection into model");
});
