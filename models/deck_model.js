var mongoose = require('mongoose');
var Schema = mongoose.Schema

var deckSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	format: {
		type: String,
		required: true
	},
	cards: [{
		type: Schema.Types.ObjectId, ref: 'Card'
	}],
	user: {
		type: String,
		required: true
	}
});

var Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;
