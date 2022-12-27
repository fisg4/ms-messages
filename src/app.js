/* eslint-disable no-console */
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const routes = require('./routes');
const swagger = require('../swagger');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.use('/api/v1', routes.hello);
app.use('/api/v1/messages', routes.messages);
app.use('/api/v1/rooms', routes.rooms);

swagger(app);

module.exports = app;
