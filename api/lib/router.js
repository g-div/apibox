var _ = require('underscore'),
    path = require('path'),
    db = require(path.resolve(__dirname, '../../lib/db')),
    response = require(path.resolve(__dirname, 'response')),
    apitools = require(path.resolve(__dirname, '../../lib/api-tools'));


function search(parsedQuery, res) {
    db.searchQuery(parsedQuery, function(doc) {
        response.setResponse(res, doc);
    });
}

function post(data, res) {
    db.post(data, function() {
        response.setResponse(res, {message: "ok"});
    })
}

module.exports.init = function(app, apiConfig) {
    apiConfig.apis.forEach(function(api) {
        api.operations.forEach(function(apiClass) {
            if (apiClass.httpMethod === "GET") {
                app.get(apiConfig.resourcePath + api.path, function(req, res) {
                    var parameters = apiClass.parameters,
                        required = apitools.selectRequired(parameters),
                        parsedQuery = apitools.parseQuery(req.query, parameters);

                    if (required.length != 0) {
                        required.forEach(function(reqm) {
                            if (!_.contains(_.keys(parsedQuery), reqm)) {
                                response.errorResponse(res, reqm);
                            } else {
                                search(parsedQuery, res);
                            }
                        });
                    } else {
                        search(parsedQuery, res);
                    }
                });
            } else if (apiClass.httpMethod === "POST") {
                app.post(apiConfig.resourcePath + api.path, function(req, res) {
                    post(req.query, res);
                });
            }
        });
    });
}