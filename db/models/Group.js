var mongoose = require('mongoose');


var GroupSchema = mongoose.Schema({
	title: String,
	area: String,
	cover: String,
	type: String
})


module.exports = mongoose.model('Group', GroupSchema);
