var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cacheSchema = new Schema({
	cards: [{
		type: Schema.Types.ObjectId, ref: 'Card'
	}],
	date: Number
});

var Cache = mongoose.model('Cache', cacheSchema);
module.exports = Cache;