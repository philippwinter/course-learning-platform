/**
 * The parallel programming course.
 */

console.log("Loading parallel programming module now!");

var express = require("express");
var router = express.Router();
var security = require(dirs.lib + 'security.js');
var courses = require(dirs.model + 'course.js');
var isProtected = security.protectedArea;
var thisCourse = coursesLoaded.parallel_programming;

var querystring = require('querystring');

var data = require(dirs.lib + 'data.js');
var renderInfo = 'parallel_programming';
var utils = require(dirs.lib + 'utils.js');

var contentRouter = require(__dirname + '/lib/content.js');

var cachedCourseData = {};

function courseData(name) {
	if(!cachedCourseData[name]){
		cachedCourseData[name] = require(thisCourse.dir + 'data/' + name + '.json');
	}
	return cachedCourseData[name];
}

var availablePaths = function() {
	var content = thisCourse.mountpath + '/content/'
	return {
		'start': thisCourse.mountpath + '/overview',
		'general': content + 'general',
		'usecases': content + 'usecases',
		'scenarios': content + 'scenarios',
		'implementation': content + 'implementation',
		'finalTest': '/practice'
	};
}
var basicData = function() {
	var d;
	d = utils.merge({info: thisCourse.info}, {paths: availablePathsCached});
	return d;
}

var availablePathsCached = null;
var basicDataCached = null;

router.use(isProtected);

// Fix awkward bug -.-
router.use(function(req, res, next) {
	if(!thisCourse) {
		thisCourse = coursesLoaded.parallel_programming;
	}
	if(!availablePathsCached) {
		availablePathsCached = availablePaths();
	}
	if(!basicDataCached) {
		basicDataCached = basicData();
	}
	next();
});

router.route('/').all(function(req, res) {
	console.log(thisCourse);
	res.redirect(thisCourse.mountpath + '/view');
});

router.route('/view').all(function(req, res) {
	var siteData = utils.merge(basicDataCached, data.getSiteData('Course-view'));
	data.wrapAndRender('course/view.dust', siteData, req, res);
});

router.route('/overview').all(function(req, res) {
	var d = {content: courseData("content")};
	var siteData = utils.merge(basicDataCached, d);
	siteData = utils.merge(siteData, data.wrapSiteData("Parallel Programming course - Overview"));
	data.wrapAndRender('overview.dust', siteData, req, res, renderInfo);
});

router.route('/practice/').get(function (req, res) {
    var siteData = utils.merge(basicDataCached, { content: courseData("practice") });
    data.wrapAndRender('practice.dust', siteData, req, res, renderInfo);
});

router.route('/practice/data').get(function (req, res) {
    res.sendFile(__dirname + '/data/practice.json');
});

router.route('/practice/results').post(function (req, res) {
    console.log("not implemented yet");
    console.log(req.body);
    
    var niceData = [];
    for (var i = 0; i < req.body.answers.length; i++) {
        var data = querystring.parse(req.body.answers[i]);
        
        console.log("got data for " + i + ":");
        console.log(data);
        niceData[i] = data;
    }
    
    var currUser = security.getCurrentUser(req);
    console.log("current user: ");
    console.log(currUser);
    
    var dataForDb = {
        course: 'parallel_programming',
        answers: niceData,
        username: currUser.username,
        time: new Date()
    };
    
    console.log("Crunched data:");
    console.log(dataForDb);
    
    entities.practice.insert(dataForDb);
    console.log("Finished saving");
    
    res.send({
        status: 'Success'
    }
    );
}).get(function (req, res) {
    var currUser = security.getCurrentUser(req);
    var results = entities.practice.find();
    var siteData = {
        siteTitle: 'Results',
        siteIntro: 'The results of the parallel programming courses\' practice quiz.',
        data: []
    };
    
    var questions = courseData('practice');
    
    console.log(results);
    
    function handleResult(d) {
        var correctCount = 0;
        var totalCount = 0;
        
        console.log(d);
                
        for (var j = 0; j < questions.stages.length; j++) {
            var e = d.answers[j];
            var f = questions.stages[j].questions;
            
            if (!e || !f) {
                console.log("Something bad happened at index " + j);
                continue;
            }
            
            for (var k = 0; k < f.length; k++) {
                console.log(f[k]);
                if (f[k].valid) {
                    totalCount++; // Increase counter of total correct answers
                }
            }
            
            if (e.question1 && e.question1 === 'checked' && f[0].valid) {
                correctCount++;
            } else if (e.question1 && e.question1 !== 'checked' && !f[0].valid || e.question1 && e.question1 === 'checked' && f[0].valid) {
                correctCount--;
            }
            
            if (e.question2 === 'checked' && f[1].valid) {
                correctCount++;
            } else if (e.question2 && e.question2 !== 'checked' && !f[1].valid || e.question2 && e.question2 === 'checked' && f[1].valid) {
                correctCount--;
            }
            
            if (e.question3 === 'checked' && f[2].valid) {
                correctCount++;
            } else if (e.question3 && e.question3 !== 'checked' && !f[2].valid || e.question3 && e.question3 === 'checked' && f[2].valid) {
                correctCount--;
            }
            
            if (e.question4 && e.question4 === 'checked' && f[3].valid) {
                correctCount++;
            } else if (e.question4 && e.question4 !== 'checked' && !f[3].valid || e.question4 && e.question4 === 'checked' && f[3].valid) {
                correctCount--;
            }
        }
        
        if (correctCount < 0) {
            correctCount = 0;
        }

        var p = correctCount / totalCount * 100;
        var c;
        
        if (p >= 95) {
            c = 'Perfect!'
        } else if (p >= 80) {
            c = 'Pretty good!';
        } else if (p >= 50) {
            c = 'That\'s a good start :)';
        } else {
            c = 'Try to rewind that a little..';
        }
        
        siteData.data.push({
            correctAnswersCount: correctCount,
            totalAnswersCount: totalCount,
            correctPercentage: p,
            conclusion: c,
            time: new Date(d.time).getTime()
        });

    }
    
    for (var i in results) {
        handleResult(results[i]);
    }
    
    console.log("Final result data:");
    console.log(siteData);

    data.wrapAndRender('results.dust', siteData, req, res, renderInfo);
    //res.send(siteData);
});

router.use('/content', contentRouter);

module.exports = router;