var mongoose = require('mongoose');


var ContactSchema = mongoose.Schema({
	addr: String,
	email: String,
	tel: String,
	postcode: String,
	title: String,
})


module.exports = mongoose.model('Contact', ContactSchema);