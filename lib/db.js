var path = require('path'),
    mongojs = require('mongojs'),
    config = require(path.resolve(__dirname, "../config.js")),
    db = mongojs(config.db);

module.exports.searchQuery = function(query, callback) {
    db.collection(config.collection).find(query, function (err, doc) {
        callback(doc);
    });   
}

module.exports.post = function(data, callback) {
	db.collection(config.collection).insert(data, function(err) {
		if (!err) callback();
	});
}

module.exports.closeDB = function() {
	db.close();
}