var mongoose = require('mongoose');


var BossSchema = mongoose.Schema({
	title: String,
	area: String,
	cover: String,
	tag: String,
	type: Number,
	content:String
})


module.exports = mongoose.model('Boss', BossSchema);