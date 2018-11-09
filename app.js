import bodyParser from 'body-parser';
import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import cors from 'cors';


import errorController from './controllers/errors';
import logger from './utils/logger';
import routes from './routes';


const app = express();

// add cors - "Access-Control-Allow-Origin", "*" by default
app.use(cors());

// make models available globally in engine
app.set('models', require('./models'));

app.use(bodyParser.json({ limit: '1mb' })); // sets payload limit
app.use(bodyParser.urlencoded({ extended: false })); // url encoding
app.use(express.static(path.join(__dirname, 'public'))); // sets a static route to public

// Set up routes
Object.keys(routes).forEach((route) => {
  logger.info(`setting up route /${route} to file ${routes[route]}`);
  app.use(`/${route}`, require(`${routes[route]}`).default);
});

// Handle 404s
app.use((req, res) => errorController.notFound(req, res));

export default app;
