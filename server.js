'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./models/user_model');
var Deck = require('./models/deck_model');
var Cache = require('./models/cache_model');
var Card = require('./models/card_model');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy
var unirest = require('unirest');
var schedule = require('node-schedule');
const cors = require('cors')
const mtg = require('mtgsdk');



var app = express();
app.options('*', cors({
	origin: "http://localhost:8080",
	methods:['POST','GET','PUT','DELETE'],
	preflightContinue: true
}));
app.use(cors({
	origin: "http://localhost:8080",
	methods:['POST','GET','PUT','DELETE'],
	preflightContinue: true
}));
var jsonParser = bodyParser.json();

app.use(jsonParser);

//Setting up passport strategy
var strategy = new BasicStrategy( function (username, password, callback)  {
	User.findOne({ username: username}, function(err, user) {
		if (err) {
			return callback(err);
		}

		if (!user) {
			return callback(null, false, { message: 'Incorrect username.' });
		}

		user.validatePassword(password, function(err, isValid) {
			if (err) {
				return callback(err);
			}

			if (!isValid) {
				return callback(null, false, { message: 'Invalid password.' });
			}

			return callback(null, user);
		});
	});
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

var Authenticate = passport.authenticate('basic', {session: false});


//Adding new users
app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    //Validating username
    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    //Validating password
    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    //Hashing password
	bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash
            });


    		user.save(function(err) {
        		if (err) {
            		return res.status(500).json({
                		message: 'Internal server error'
            		});
        		}

        		return res.status(201).json({
					username: username
				});
    		});
    	});
    });
});

//Login
app.post('/login', Authenticate, function(req, res) {
	res.status(200).send({message: "Login Success"});
});


//Find users
app.get('/users', jsonParser, function(req, res) {
    User.find({

    });
});

//Edit users
app.put('/user/edit', function(req, res) {
    User.findOneAndUpdate({

    });
});

//Delete users
app.delete('/user/delete', function(req, res) {
    User.findOneAndRemove({

    });
});

//Get cards
app.get('/cards/all', function(req, res) {
    mtg.card.all()
        .on('data', function(card) {
            console.log(card.name);
    });
});

//Get card by id
app.get('/cards/:id', function(req, res) {
    unirest.get('https://api.magicthegathering.io/v1/cards/' + req.params.id).end(function(card) {
        console.log(card);
    });
});


//Get cards with filters
app.get('/cards/', function(req, res) {
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
});
    //Cache cards
    app.post('/cards/', jsonParser, function(req, res) {
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


    });



//Make deck
app.post('/user/deck', Authenticate, function(req, res) {
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
});

//Get Decks for deckList
app.get('/decks/:user', function(req, res) {
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
});

//Find deck
app.get('/deck/:deckSearch' ,function(req, res) {
    var deckSearch = req.params.deckSearch;
    Deck.find({name: deckSearch}, function(err, deck) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        res.json(deck);
    });
});


//Add cards to deck
app.put('/user/deck/:deckName', Authenticate, function(req, res) {
    var deckName = req.params.deckName;
    Deck.findOneAndUpdate({name: deckName}, {cards: req.body.cards}),
	.populate('cards')
	.exec(function(err, deck) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
		return res.status(200).json({
			deck: deck
		})
    });
});

//Delete deck
app.delete('/user/deck/:deckName', function(req, res) {
    var deckName = req.params.deckName;
    // if (!(deckName in Deck)) {
    //     return res.status(404).json({
    //         message: 'Deck not found'
    //     });
    // }
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
});


mongoose.connect(process.env.MONGODB_URI).then(function() {
    app.use(express.static('public'));
    app.listen(process.env.PORT || 8080);

    // var j = schedule.scheduleJob('* 1 * * *', function(){
    //     var current = moment();
	//
    // });
});
