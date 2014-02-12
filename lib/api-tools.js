var fs = require('fs'),
	path = require('path'),
	YAML = require('js-yaml'),
	_ = require('underscore'),
	dsv = require('dsv'),
	csv = dsv(','),
	config = require(path.resolve(__dirname, '../../../config.js')),
	docs = path.resolve(__dirname, '..', config.documentation),
	argv = {};


var getApiDocumentation = exports.getApiDocumentation = function(docs) {
	return YAML.safeLoad(fs.readFileSync(docs, 'utf8'));
};

var selectRequired = exports.selectRequired = function(parameters) {
	return _.chain(parameters).filter(function(param) {
		return param.required == true;
	}).pluck('name').value()
}

var parseQuery = exports.parseQuery = function(query, params) {
	_.keys(query).forEach(function(key) {
		if (!_.chain(params).pluck('name').contains(key.toString()).value()) {
			delete query[key];
		}
	});
	return query;
}

var argvKeys = [];
var getArgv = exports.getArgv = function() {
	var apiConfig = getApiDocumentation(docs);
	apiConfig.apis.forEach(function(api) {
		selectOperation(api.operations).parameters.forEach(function(param) {
			argvKeys.push(param.name);
			argv[param.name] = {
				"description": param.description,
				"name": param.name
			};
			argv[param.name][param.dataType] = true;
			if (typeof(param.required) !== "undefined") {
				argv[param.name].required = true;
			}
		});
	});
	return argv;
}

module.exports.processPrint = function(data, toPrint, format) {
	if (toPrint.length == 0) toPrint = argvKeys;
	if (data.length == 0) data = [data];
	var res = [];
	data.forEach(function(entry) {
	var result = {};
		toPrint.forEach(function(print) {
			if (_.contains(argvKeys, print)) {
				if (typeof(entry[print]) !== 'undefined') 
					result[print] = entry[print];
				else 
					result[print] = entry[0][print];
			}
		});
		res.push(result);
	});

	(format === true) ? console.info(csv.format(res)) : console.info(res);
}