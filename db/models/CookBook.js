var mongoose = require('mongoose');

var CookBookSchema = mongoose.Schema({
	title: String,
	date: {type: Date, default: Date.now},
	coverW: String,
	coverS: String,
	coverE: String,
	coverAll: String,
})

module.exports = mongoose.model('CookBook', CookBookSchema);