/**
 * Handle the login process on browser side.
 */

$(document).ready(function(){
	$('#errorBox').hide();
	
	$('#loginNow').click(function(e) {
		e.preventDefault();
		var serializedData = $('#loginForm').serialize();
		
		console.log("Sending serialized login form:");
		console.log(serializedData);
		
		var onSuccess = function(data) {
			console.log("Got response of:");
			console.log(data);
			if(data.status === "success"){
				$('#loginForm').fadeOut().remove();
				$('#intro').html("Welcome back, " + document.app.helpers.escape(data.username) + "! <br />We're redirecting you to the home page shortly.");
				
				setTimeout(function() {
					window.location.href = '/';
				}, 2000);
			}else{
				$('#errorBox').html(data.cause);
				$('#errorBox').fadeIn();
			}
		}
		
		var request = $.post("/login", serializedData, onSuccess, "json");
	});
});