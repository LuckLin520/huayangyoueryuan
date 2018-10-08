var mongoose = require('mongoose');


var HomenewsSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	tag: String,
	cover: String,
	breif: String,
	content: String,
	type: String,
	ishome: String,
	sortdate: Number
})


module.exports = mongoose.model('Homenews', HomenewsSchema);