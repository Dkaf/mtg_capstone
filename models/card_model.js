var mongoose = require('mongoose');
var cardSchema = new mongoose.Schema({
	name:{type: String},
	names:{type: Array},
	manaCost:{type: String},
	cmc:{type: Number},
	colors:{type: Array},
	colorIdentity:{type: Array},
	type:{type: String},
	supertypes:{type: Array},
	types:{type: Array},
	subtypes:{type: Array},
	rarity:{type: String},
	set:{type: String},
	text:{type: String},
	artist:{type: String},
	number:{type: String},
	power:{type: String},
	toughness:{type: String},
	layout:{type: String},
	multiverseid:{type: String},
	imageUrl:{type: String},
	rulings:{type: Array},
	foreignNames:{type: Array},
	printings:{type: Array},
	originalText:{type: String},
	originalType:{type: String},
	id:{type: String}
})

var Card = mongoose.model('Card', cardSchema);

//deconstruct object for needed data
