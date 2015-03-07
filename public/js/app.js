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
	helpers : helpers,
	dateFormat : "dd.MM.yyyy", // 01.02.2015
	timeFormat : "HH:mm:ss", // 14:56:01
	dateTimeFormat : "dd.MM.yyyy, HH:mm:ss" // 01.02.2015, 14:56:01
}

$(document).ready(
		function() {
			var formatNow = function(jThis, format) {
				var isInput = jThis.is(":input");
				
				var text;
				if (isInput) {
					text = jThis.val();
				} else {
					text = jThis.text();
				}

				var textAsInt = parseInt(text);
				var parsed = textAsInt === NaN ? text : textAsInt;
				var result = $.format.date(parsed, format);
				
				//console.log(jThis);
				//console.log(format);
				//console.log(isInput);
				//console.log("Got parsed: " + parsed + " (" + typeof parsed + ")");
				//console.log("Got format: " + format);
				//console.log("Got result: " + result);
				
				if (isInput) {
					jThis.val(result);
				} else {
					jThis.text(result);
				}
			}

			$(".dateFormat").each(
					function() {
						formatNow($(this), document.app.dateFormat);
					});
			$(".timeFormat").each(
					function() {
						formatNow($(this), document.app.timeFormat);
					});
			$(".dateTimeFormat").each(
					function() {
						formatNow($(this), document.app.dateTimeFormat);
					});
		});