import express from 'express';

// Controllers
import userController from './controllers/userController';
import cardController from './controllers/cardController';

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


export default routes