var fs = require('fs');
var ncp = require('ncp').ncp;
var http = require('http');
var rmdir = require('rimraf');
var und = require('underscore');
var httpSync = require('http-sync');


var opts = {string:['epic', 'screen']};
var argv = require('minimist')(process.argv.slice(2), opts);

var build_dir = 'build',
    url_base = 'http://localhost:1337/';

var data = fs.readFileSync('./file_config.json'),
    urls;

try {
    urls = JSON.parse(data);
} catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
}

rmdir(build_dir, function() {
    fs.mkdirSync(build_dir);
        
    if (und.size(argv.epic) == 0 && und.size(argv.screen) == 0) {
        buildAllEpics();
    }else if (und.size(argv.epic) > 0 && und.size(argv.screen) == 0) {
        // console.log('arg is: %s', argv.epic);
        if (und.isArray(argv.epic)){
            // console.log('argv.epic is an array'); 
            und.each(argv.epic, function(epicName){
               buildSingleEpic(getEpicObjByName(epicName)); 
            });     
        }
        else if (und.isString(argv.epic)){
            // console.log('argv.epic is a string');
            // console.dir(getEpicObjByName(argv.epic));
            buildSingleEpic(getEpicObjByName(argv.epic));
        }
    }else if(und.size(argv.epic) > 0 && und.size(argv.screen) > 0){
        if (und.isString(argv.screen)){
            var epicObj = getEpicObjByName(argv.epic);
            fs.mkdirSync(build_dir + '/' + epicObj.slug + '/');
            buildSingleScreen(epicObj, getScreenfromEpicObj(argv.screen, epicObj));
        }else if (und.isArray(argv.screen)){
            var epicObj = getEpicObjByName(argv.epic);
            fs.mkdirSync(build_dir + '/' + epicObj.slug + '/');
            und.each(argv.screen, function(screenName){
                buildSingleScreen(epicObj, getScreenfromEpicObj(screenName, epicObj));
            });
        }
    }

    ncp('css', build_dir + '/css', function(err) {});
    ncp('img', build_dir + '/img', function(err) {});
    ncp('js', build_dir + '/js', function(err) {});
    ncp('less', build_dir + '/less', function(err) {});
});

function buildAllEpics() {
    und.each(urls, function(epicObj) {
        buildSingleEpic(epicObj);
    });
}

function buildSingleEpic(epicObj) {
    // console.dir(epicObj);
    var path = build_dir + '/' + epicObj.slug + '/';
    console.log('building epic to: %s', path);
    fs.mkdirSync(path);
    und.each(epicObj.screens, function(screen) {
        buildSingleScreen(epicObj, screen);
    });
}

function buildSingleScreen(epicObj, screenObj) {
    var urlPath = "/" + epicObj.slug + '/' + screenObj.url;
    var filePath = __dirname + '/' + build_dir + '/' + epicObj.slug + '/' + screenObj.url;
    // console.log('urlPath is %s and filePath is %s', urlPath, filePath);
    var file = fs.createWriteStream(filePath);

    var request = httpSync.request({
        method: 'GET',
        headers: {},
        body: '',
        protocol: 'http',
        host: 'localhost',
        port: 1337,
        path: urlPath
    });
    var timedout = false;
    request.setTimeout(500, function() {
        console.log("Request Timedout!");
        timedout = true;
    });

    try {
        var response = request.end();
    } catch (err) {
        console.log('There has been an error in http GET.')
        console.log(err);
    }


    if (!timedout) {
        try {
            file.write(response.body.toString());
        } catch (err) {
            console.log('There has been an error writing to the file.')
            console.log(err);
        }

    }
}

function getEpicObjByName(name){    
    var tempObj = und.pick(urls, name);
    var returnObj;
    und.each(tempObj, function(epicObj){
        // console.dir(epicObj);
        returnObj = epicObj;
    });
    return returnObj;
}

function getScreenfromEpicObj(screenName, epicObj){
    var tempScreenObj;
    und.each(epicObj.screens, function(screen){
        // console.dir(screen);
        if (screen.page == screenName)
            tempScreenObj = screen;
    });
    // console.dir(tempScreenObj);
    return tempScreenObj;
}


