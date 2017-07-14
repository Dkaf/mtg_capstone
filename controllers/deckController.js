import db from './../models';

const deckController = {};

//Make deck post /user/deck authenticate
deckController.newDeck = (req, res) => {
    var name = req.body.name;
    name = name.trim();

    var format = req.body.format;
    format = format.trim();

	var user = req.body.user

    var deck = new Deck({
        name: name,
        format: format,
		user: user
    });

 	deck.save(function(err) {
        	if (err) {
            	return res.status(500).json({
                	message: 'Internal server error'
            	});
        	}

        	return res.status(201).json({
        	    message: 'Deck created',
				deck: deck
        	});
    });
};

//Get Decks for deckList get /decks/:user
deckController.getDecks = (req, res) => {
	var user = req.params.user;
	Deck.find({user: user})
	.populate('cards')
	.exec( function(err, decks) {
		if (err) {
			return res.status(500).json({
				message: 'Internal server error'
			});
		}
		return res.status(201).json({
			decks: decks
		});
	});
};

//Find deck get /deck/:deckSearch
deckController.findDeck = (req, res) => {
    var deckSearch = req.params.deckSearch;
    Deck.find({name: deckSearch}, function(err, deck) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        res.json(deck);
    });
};

//Add cards to deck put /user/deck/:deckName Authenticate
deckController.addCards = (req, res) => {
    var deckName = req.params.deckName;
    Deck.findOneAndUpdate({name: deckName}, {cards: req.body.cards}, {new:true}, function(err, deck) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

		Card.populate(deck, {path:'cards', model:'Card'}, function(err, deck) {
			return res.status(200).json({
				deck: deck
			})
		})

    });
};

//Delete deck delete /user/deck/:deckName
deckController.deleteDeck = (req, res) => {
    var deckName = req.params.deckName;

    Deck.findOneAndRemove({name: deckName}, function(err, deck) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        return res.status(200).json({
            message: 'Deck deleted'
        });
    });
};

export default deckController;