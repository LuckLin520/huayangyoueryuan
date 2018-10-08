var mongoose = require('mongoose');

var ParentingSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
    tag: String,
    cover: String,
	breif: String,
	type: String, 
	content: String
})

module.exports = mongoose.model('Parenting', ParentingSchema);