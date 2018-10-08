var mongoose = require('mongoose');


var ArticleSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	tag: String,
	breif: String,
	slug: String,
	cat: String, 
	content: String
})


module.exports = mongoose.model('Article', ArticleSchema);