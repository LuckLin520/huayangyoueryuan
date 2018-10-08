var mongoose = require('mongoose');


var ActivitySchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	tag: String,
	pic: String,
	slug: String,
	content: String
})


module.exports = mongoose.model('Activity', ActivitySchema);