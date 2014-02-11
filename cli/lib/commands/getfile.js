var app,
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	_ = require('underscore'),
	dsv = require("dsv"),
	csv = dsv(","),
	headers = [],
	results = [];

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function error(error) {
	app.log.error(error);
	process.exit();
}

function search(query, callback) {
	app.db.searchQuery(query, function(data) {
		results.push(data);
		callback();
	});
};

function processFile(file) {
	var extension = "";
	if (!(file.endsWith('.json') || file.endsWith('.csv'))) {
		error('Only .json and .csv files are allowed.');
	} else {
		extension = file.split('.')[1];
	}

	app.log.info('Geocoding the file: ' + file);
	try {
		fs.readFile(path.resolve(file), function(err, content) {
			if (err) {
				error('Error reading the input file. Do the file really exists ?');
			}

			var q = (extension === 'csv') ? csv.parse(content.toString()) : JSON.parse(content);

			async.forEach(q, search, function(err) {
				if (err) error('An error occurred connecting to the database.');

				var formatCSV = false;
				if (typeof(app.argv.csv) !== 'undefined') {
					formatCSV = true;
				}

				if (typeof(app.argv.print) === 'string') {
					var toPrint = app.argv.print.split(',');
					app.apitools.processPrint(results, toPrint, formatCSV);
				} else {
					app.apitools.processPrint(results, [], formatCSV);
				}
				process.exit();
			});
		});
	} catch (e) {
		error('Error reading the input file. Do the file really exists ?');
	};
};

module.exports = function(file) {
	app = this;

	if (typeof(file) === 'function') {
		app.log.warn('Please enter a valid filename.')
		app.prompt.get('filename', function(err, result) {
			processFile(result.filename);
		});
	} else {
		processFile(file);
	}
};;