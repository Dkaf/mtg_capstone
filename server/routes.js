import express from 'express';

// Controllers
import userController from './controllers/userController';
import cardController from './controllers/cardController';
import deckController from './controllers/deckController';

const routes = express();

// User Routes
routes.post('/users', userController.newUser);

// Import Authenticate

routes.post('/login', Authenticate, userController.login);


// Card Routes

routes.get('/cards/all', cardController.allCards);

routes.get('/cards/:id', cardController.cardId);

routes.get('/cards/', cardContoller.filteredCards);

routes.post('/cards/', cardController.cacheCards);

// Deck Routes

routes.post('/user/deck', Authenticate, deckController.newDeck);

routes.get('/decks/:user', deckController.getDecks);

routes.get('/deck/:deckSearch', deckController.findDeck);

routes.get('/user/deck/:deckName', Authenticate, deckController.addCards);

routes.delete('/user/deck/:deckName', deckController.deleteDeck);


export default routes