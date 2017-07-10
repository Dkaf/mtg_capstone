import express from 'express';

// Controllers
import userController from './controllers/userController';

const routes = express();

// User Routes
routes.post('/users', userController.newUser);

// Import Authenticate

routes.post('/login', Authenticate, userController.login);



export default routes