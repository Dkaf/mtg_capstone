var mongoose = require('mongoose');
var formatSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
})