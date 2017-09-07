'use strict';
/*$ global*/

const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require(__dirname + '/model');

const blogPostRouter = require('./router.js');

const app = express();

// log the http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPostRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
