var app,
	path = require('path'),
	_ = require('underscore');

module.exports = function() {
	app = this;

	var query = {},
		keys = Object.keys(this.argv).slice(1),
		required = app.apitools.selectRequired(_.toArray(app.apitools.getArgv())),
		argvKeys = _.keys(app.apitools.getArgv()),
		toPrint = [],
		formatToCSV = false;

	keys.length = keys.length - 1;

	required.forEach(function(requirement) {
		if (!_.contains(keys, requirement)) {
			app.log.error('Parameter missing:', requirement);
			app.log.error('run "node cli/cli.js" for help');
			process.exit();
		}
	});

	if (keys.length == 0) {
		app.log.error('Please pass at least one field.');
		app.log.help(app.showOptions());
		process.exit();
	}

	keys.forEach(function(argument, i) {
		if ((app.argv[argument] == true || app.argv[argument].length <= 0) && (argument !== "csv")) {
			app.log.error('Please insert a valid value for the following parameter:', argument)
			process.exit();
		}
		if (_.contains(argvKeys, argument)) {
			query[argument] = '' + app.argv[argument];
		} else if (argument === "print") {
			toPrint = app.argv.print.split(',');
		} else if (argument === "csv") {
			formatToCSV = true;
		} else {
			app.log.error('Parameter unknow:', argument);
			app.log.error('Please read the documentation or run "node cli/cli.js" (without any additional command) for help.')
			process.exit()
		}
	});

	app.db.searchQuery(query, function(data) {
		app.apitools.processPrint(data, toPrint, formatToCSV);
		process.exit();
	});

};