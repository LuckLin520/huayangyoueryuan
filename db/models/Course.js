var mongoose = require('mongoose');

var CourseSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
    tag: String,
    cover: String,
	breif: String,
	slug: String,
	cat: String, 
	content: String
})

module.exports = mongoose.model('Course', CourseSchema);