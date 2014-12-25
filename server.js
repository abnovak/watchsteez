var express = require('express'),
    app = express(),
    swig = require('swig'),
    extras = require('swig-extras'),
    fs = require('fs');

var serverMode = process.env.NODE_ENV;
var port = process.env.PORT || 8080;

var tidy = require('htmltidy').tidy;

var data = fs.readFileSync('./file_config.json'),
    urls;

try {
    urls = JSON.parse(data);
    // console.dir(urls);
} catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
}

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/app/templates');

app.set('view cache', false);
swig.setDefaults({
    cache: false
});

app.use('/js', express.static(__dirname + '/app/js'));
app.use('/js', express.directory(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/css', express.directory(__dirname + '/app/css'));
app.use('/images', express.static(__dirname + '/app/images'));
app.use('/images', express.directory(__dirname + '/app/images'));
app.use('/fonts', express.static(__dirname + '/app/fonts'));
app.use('/fonts', express.directory(__dirname + '/app/fonts'));
app.use('/lib', express.static(__dirname + '/app/lib'));
app.use('/test', express.static(__dirname + '/app/lib/bootstrap-sass/example'));
app.use('/data', express.static(__dirname + '/app/data'));

var tidyopts = {
    indent: 'auto',
    outputHtml: 'yes',
    indentSpaces: '4',
    wrap: '0',
    'drop-empty-elements': false
};

app.get('/', function(req, res) {
    res.render('index', {page: 'index', title: 'Index', urls: urls}, function(err, html) {
        tidy(html, tidyopts, function(err, html) {
            console.log(err);
            res.send(html);
        });
    });
});

app.get('/index.html', function(req, res) {
    res.render('index', {page: 'index', title: 'Index', urls: urls}, function(err, html) {
        tidy(html, tidyopts, function(err, html) {
            console.log(err);
            res.send(html);
        });
    });
});


app.get('/*.html', function(req, res) {
    var page = req.params[0];
    res.render(page, urls[0].screens[page], function(err, html) {
        tidy(html, tidyopts, function(err, html) {
            console.log(err);
            res.send(html);
        });
    });
});

app.listen(port);
console.log('Application Started on http://localhost:' + port + '/');