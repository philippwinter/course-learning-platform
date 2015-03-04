/**
 * Handle the registration process on browser side.
 */

$(document).ready(function(){
	$('#errorBox').hide();
	
	$('#registerNow').click(function(e) {
		e.preventDefault();
		var serializedData = $('#registrationForm').serialize();
		
		console.log("Sending serialized registration form:");
		console.log(serializedData);
		
		var onSuccess = function(data) {
			console.log("Got response of:");
			console.log(data);
			if(data.status === "success"){
				$('#registrationForm').fadeOut().remove();
				$('#intro').html("Welcome, " + document.app.helpers.escape(data.username) + "!");
			}else{
				$('#errorBox').html(data.cause);
				$('#errorBox').fadeIn();
			}
		}
		
		var request = $.post("/register", serializedData, onSuccess, "json");
	});
});