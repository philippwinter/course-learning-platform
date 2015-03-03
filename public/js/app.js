/**
 * Client side code for the whole application
 */

var helpers = {
	entityMap : {
		"&" : "&amp;",
		"<" : "&lt;",
		">" : "&gt;",
		'"' : '&quot;',
		"'" : '&#39;',
		"/" : '&#x2F;'
	},

	escape : function(html) {
		return String(html).replace(/[&<>"'\/]/g, function(s) {
			return entityMap[s];
		});
	}
}

document.app = {
	helpers : helpers
}