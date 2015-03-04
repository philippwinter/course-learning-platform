/**
 * Handle the contact formular on browser side.
 */

$(document).ready(function(){
	$('#errorBox').hide();
	
	$('#sendNow').click(function(e) {
		e.preventDefault();
		var serializedData = $('#contactForm').serialize();
		
		console.log("Sending serialized contact form:");
		console.log(serializedData);
		
		var onSuccess = function(data) {
			console.log("Got response of:");
			console.log(data);
			if(data.status === "success"){
				$('#contactForm').fadeOut().remove();
				$('#intro').html("Your request has been sent to us. We're contacting you as soon as possible via mail.");
			}else{
				$('#errorBox').html(data.cause);
				$('#errorBox').fadeIn();
			}
		}
		
		var request = $.post("/contact", serializedData, onSuccess, "json");
	});
});