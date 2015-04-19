/**
 * The content module.
 */

var express = require('express');
var router = express.Router();
var security = require(dirs.lib + 'security.js');
var isProtected = security.protectedArea;
var fs = require("fs");

var data = require(dirs.lib + 'data.js');
var utils = require(dirs.lib + 'utils.js');

var contentData = __dirname + '/../data/content/';
var localData = contentData + 'de/';

var sitesData = {
    general: require(localData + 'general.json'),
    usecases: require(localData + 'usecases.json'),
    scenarios: require(localData + 'scenarios.json'),
    implementation: require(localData + 'implementation.json')
};

function fillFileContents(json) {
    //console.log("=======================FILL FILE CONTENTS=======================");
    console.log(json);
    
    var filename, result;
        if (json["file"] !== undefined) {
            filename = contentData + json["file"];
            fs.readFile(filename, 'utf8', function (err, data) {
                if (!err) {
                    console.log("in " + json);
                    result = json["fileContent"] = data;
                    console.log("filename: " + filename);
                    console.log("content: " + result);
                } else {
                    console.log(err);
                }
            });

        }
    //console.log("=======================END FILL FILE CONTENTS=======================");
}

for (var i = 0; i < sitesData.implementation.sources.length; i++) {
    fillFileContents(sitesData.implementation.sources[i]);
}



var parallel_programming = require(__dirname + '/../parallel_programming.js');

var renderInfo = 'parallel_programming';

var basicDataCached = {};

var breadcrumbStuff = [
    { tail:false, link: "/course", caption: "Courses" },
    { tail:false, link: "/course/parallel_programming/overview", caption: "Overview"}
];

var breadcrumbs = {
    general: { breadcrumbs: [breadcrumbStuff[0], breadcrumbStuff[1], { tail: true, caption: "General" }] },
    usecases: { breadcrumbs: [breadcrumbStuff[0], breadcrumbStuff[1], { tail: true, caption: "Usecases" }] },
    scenarios: { breadcrumbs: [breadcrumbStuff[0], breadcrumbStuff[1], { tail: true, caption: "Scenarios" }] },
    implementation: { breadcrumbs: [breadcrumbStuff[0], breadcrumbStuff[1], { tail:true, caption: "Implementation"}] }
};

router.use(isProtected);

router.all('/', function(req, res) {
	res.redirect('general');
});

router.all('/general', function(req, res) {
	var d = utils.merge(utils.merge(basicDataCached, sitesData.general), breadcrumbs.general);
	data.wrapAndRender('content/general.dust', d, req, res, renderInfo);
});

router.all('/usecases', function(req, res) {
	var d = utils.merge(utils.merge(basicDataCached, sitesData.usecases), breadcrumbs.usecases);
	data.wrapAndRender('content/usecases.dust', d, req, res, renderInfo);
});

router.all('/scenarios', function(req, res) {
	var d = utils.merge(utils.merge(basicDataCached, sitesData.scenarios), breadcrumbs.scenarios);
	data.wrapAndRender('content/scenarios.dust', d, req, res, renderInfo);
});

router.all('/implementation', function(req, res) {
	var d = utils.merge(utils.merge(basicDataCached, sitesData.implementation), breadcrumbs.implementation);
	data.wrapAndRender('content/implementation.dust', d, req, res, renderInfo);
});

module.exports = router;