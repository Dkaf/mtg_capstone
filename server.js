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
	origin: "https://dkaf.github.io",
	methods:['POST','GET','PUT','DELETE'],
	preflightContinue: true
}));
app.use(cors({
	origin: "https://dkaf.github.io",
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
});

//Delete deck
app.delete('/user/deck/:deckName', function(req, res) {
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
});


mongoose.connect(process.env.MONGODB_URI).then(function() {
    app.use(express.static('public'));
    app.listen(process.env.PORT || 8080);
});
