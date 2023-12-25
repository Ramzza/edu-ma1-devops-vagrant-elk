const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const logger = require('./logger/logger');
require('dotenv/config');

logger.info('Starting...', 'general~.~.');

// var fnExitHandler = function (sMessage) {
// 	var sRes = 'Exited';
// 	if (sMessage) {
// 		sRes = sRes + ' with ' + sMessage;
// 	}
// 	logger.info(sRes);
// };

// // do something when app is closing
// process.on('exit', fnExitHandler.bind(this));
// // catches ctrl+c event
// process.on('SIGINT', fnExitHandler.bind(this, 'SIGINT'));
// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', fnExitHandler.bind(this, 'SIGUSR1'));
// process.on('SIGUSR2', fnExitHandler.bind(this, 'SIGUSR2'));
// //catches uncaught exceptions
// process.on('uncaughtException', fnExitHandler.bind(this, 'uncaughtException'));

// Middlewares
logger.info('Adding middlewares', 'general~.~.');
app.use(cors());
app.use(bodyParser.json());

// Import Routes
logger.info('Importing Routes', 'general~.~.');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');

// Route middlewares
logger.info('Adding route middlewares', 'general~.~.');
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/tasks', tasksRoute);

// Connect to DB
logger.info('Connectiong to DB...', 'general~db~connection');
try {
	mongoose
		.connect(process.env.DB_CONNECTION, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(
			() => {
				logger.info('DB connection successful', 'general~db~connection');
			},
			(err) => {
				logger.error(
					'DB connection failed with promise',
					'general~db~connection'
				);
			}
		);
} catch (err) {
	logger.error('DB connection failed with exception', 'general~db~connection');
}

// mongoose.disconnect();

// How do we start listening to the server
logger.info('Listening to port 3001...', 'general~network~connection');
console.log('Listening to port 3001...');
app.listen(3001);
