var mongoose = require('mongoose');

var TeachersSchema = mongoose.Schema({
    name: String,
	title: String,
	date: {type: Date, default: Date.now},
	tag: String,
	cover: String,
	breif: String,
	content: String,
	type: String
})

module.exports = mongoose.model('Teachers', TeachersSchema);