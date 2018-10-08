var mongoose = require('mongoose');


var ChildSchema = mongoose.Schema({
	title: String,
	area: String,
	cover: String,
	class: String,
	tag: String,
	award: String,
	breif: String,
	type: String
})


module.exports = mongoose.model('Child', ChildSchema);