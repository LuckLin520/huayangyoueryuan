var mongoose = require('mongoose');

var VideoSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	cover: String,
	breif: String,
	link: String,
})

module.exports = mongoose.model('Video', VideoSchema);