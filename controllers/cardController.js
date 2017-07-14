import db from './../models';
import moment from 'moment';

const cardController = {};

//Get cards
cardController.allCards = (req, res) => {
    mtg.card.all()
        .on('data', function(card) {
            console.log(card.name);
    });
};

//Get card by id
cardController.cardId = (req, res) => {
    unirest.get('https://api.magicthegathering.io/v1/cards/' + req.params.id).end(function(card) {
        console.log(card);
    });
};

//Get cards with filters
cardController.filteredCards = (req, res) => {
    let name = req.query.name;
    let manaCost = req.query.manaCost;
    let cmc = req.query.cmc;
    let colors = req.query.colors;
    let type = req.query.type;
    let types = req.query.types;
    let subtypes = req.query.subtypes;
    let rarity = req.query.rarity;
    let filters = {};
    Object.assign(filters, {name,manaCost,cmc,colors,type,types,subtypes},
        (rarity == undefined?{}:{rarity}),
        (name == undefined?{}:{name}),
        (manaCost == undefined?{}:{manaCost}),
        (cmc == undefined?{}:{cmc}),
        (colors == undefined?{}:{colors}),
        (type == undefined?{}:{type}),
        (types == undefined?{}:{types}),
        (subtypes == undefined?{}:{subtypes})
        );
    // Cache.find({
    //     filters
    // });
    // if(!(card in Cache)) {

    // }
    mtg.card.where(filters)
        .then(cards => {
            return Promise.all(cards = cards.map( (c) => {
				return new Promise((resolve, rej) => {
					c.set = c._set
					delete c.set
					let cd = new Card();
					Object.assign(cd, c);
					cd.save((err) => {
						resolve(cd);
					});
				});
			}))
		.then( cards => {
			res.json(cards)
		});
    });
};

    //Cache cards jsonParser
    cardController.cacheCards = (req, res) => {
        if (!req.body) {
            return res.status(400).json({
                message: "No request body"
            });
        }

        if(!('card' in req.body)) {
            return res.status(422).json({
                message: "Missing field: card"
            });
        }



        var card = req.body.card;
        var cache = new Cache({
            card: card,
            date: moment()
        });


    };

export default cardController;