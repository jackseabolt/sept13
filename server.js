'use strict';
/*$ global*/

const express = require('express');
const morgan = require('morgan');
// const router = express.Router(); we don't need this, because it is in the router.js file
// const bodyParser = require('body-parser'); 
// const jsonParser = bodyParser.json(); we could do app.use(jsonParser) in this file, and NOT in the router file

const {BlogPosts} = require(__dirname + '/model');
const blogPostRouter = require('./router.js');

const app = express();

// log the http layer
app.use(morgan('common'));
app.use('/blog-posts', blogPostRouter); // think of this as $('http-connection').on('request', '/blog-posts')... though that is NOT proper code

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
