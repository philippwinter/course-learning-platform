// User interaction code for the practice/test

$(document).ready(function () {
    var siteData;
    var currentStage = -1;
    
    var answers = [];

    $.get('/course/parallel_programming/practice/data', function (data) {
        console.log("Got following data from server:");        
        console.log(data);

        siteData = data;
        $('#startTest').removeAttr('disabled');
    });

    $("#startTest").click(function (e) {
        $('#introduction').fadeOut(500);
        setTimeout(function () {
            loadStage(0);
        }, 500);
    });

    function loadStage(stage) {
        console.log("Loading stage " + stage);
        
        currentStage = stage;

        var d = siteData.stages[stage];
        console.log(d);
        
        $('#questionLabel').html(d.label);

        var q1 = d.questions[0];
        var q2 = d.questions[1];
        var q3 = d.questions[2];
        var q4 = d.questions[3];

        $('#question1-label').html(q1.label);
        $('#question2-label').html(q2.label);
        $('#question3-label').html(q3.label);
        $('#question4-label').html(q4.label);
        
        $('#test').fadeIn(500);
        
        $('#submitAnswer').off(); // Unbind previous event handlers

        $('#submitAnswer').click(function (e) {
            e.preventDefault();
            answers[currentStage] = $('#test').serialize();
            if (siteData.stages.length == currentStage + 1) { // Test finished, send to server and show results
                console.log("Test finished! Agrregated data:");
                console.log(answers);
                
                function onSuccess(data) {
                    if (data.status === 'Success') {
                        window.location.href = '/course/parallel_programming/practice/results';
                        
                        $('#test').fadeOut();
                        $('#introduction').after('<a href="/course/parallel_programming/practice/results">Show result</a>');
                    } else {
                        // Display error message
                        console.log("Error sending final data");
                        console.log(data);
                        alert(data.message);
                    }

                }
                
                console.log(answers);

                $.post('/course/parallel_programming/practice/results', {answers: answers}, onSuccess);
            } else {
                loadStage(currentStage + 1);
            }
        })
    }
});