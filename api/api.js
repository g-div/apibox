#! /usr/bin/node

var express = require('express'),
    http = require('http'),
    path = require('path'),
    config = require(path.resolve(__dirname, '../../../config.js')),
    swagger = require('swagger-express'),
    apitools = require(path.resolve(__dirname, '../lib/api-tools'));


var app = express(),
    defaultRouting = require('./lib/router.js'),
    docs = path.resolve(__dirname, '..', '..', '..', config.documentation),
    apiConfig = apitools.getApiDocumentation(docs);

// swagger
app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    basePath: 'http://' + config.api.hostname + ':' + config.api.port + apiConfig.resourcePath,
    swaggerUI: './docs',
    apis: [docs]
}));

// all environments
app.set('port', config.api.hostname);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res) {
    res.title = "Not found";
    res.send(404);
});
// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// redirect from the root to the documentation
app.get("/", function(req, res) {
    res.redirect("/docs");
});

// load all routes
defaultRouting.init(app, apiConfig);

// start the server
http.createServer(app).listen(config.api.port, function() {
    var urlOfApp = 'http://' + config.api.hostname + ':' + config.api.port;
    console.log('API running at: ' + urlOfApp);
});