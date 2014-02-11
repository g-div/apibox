#! /usr/bin/node

var flatiron = require('flatiron'),
	path = require('path'),
	app = flatiron.app,
	db = require(path.resolve(__dirname, '../lib/db'));
	api = require(path.resolve(__dirname, '../lib/api-tools'));

app.db = db;
app.apitools = api;

app.use(flatiron.plugins.cli, {
	source: path.join(__dirname, 'lib', 'commands'),
	argv: api.getArgv(),
	usage: ['Usage:', 
		'Simple run node cli.js <command>', '',
		'commands:',
		'  getfile - Geocode a CSV or a JSON file',
		'  get - Geocode an address using at least one of the parameters below',
		'',
		'Example:',
		'./cli.js getfile path/to/file.csv',
		'  or',
		'./cli.js get --name "Entryname 1"'
			]
});

app.start();