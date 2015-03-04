/**
 * User model.
 */

module.exports = model = {
		db: null
}

entities.whenLoaded(function() {
	model.db = entities.users;
	console.log("Loaded users collection into model");

});