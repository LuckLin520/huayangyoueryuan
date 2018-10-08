var mongoose = require('mongoose');

var SpecialFocusSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	tag: String,
	cover: String,
	breif: String,
	content: String,
	type: String
})

module.exports = mongoose.model('SpecialFocus', SpecialFocusSchema);