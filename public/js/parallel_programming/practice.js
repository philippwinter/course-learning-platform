// User interaction code for the practice/test

$(document).ready(function () {
    var siteData;
    
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
            $('#test').fadeIn(500);
        }, 500);
    });

    function loadStage(stage) {
        console.log("Loading stage " + stage);
        
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
    }
});