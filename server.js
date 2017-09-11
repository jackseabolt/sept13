'use strict';
/*$ global*/

const express = require('express');
const morgan = require('morgan');
// const router = express.Router(); we don't need this, because it is in the router.js file
// const bodyParser = require('body-parser'); 
// const jsonParser = bodyParser.json(); we could do app.use(jsonParser) in this file, and NOT in the router file

const app = express();

const {BlogPosts} = require(__dirname + '/model');
const blogPostRouter = require('./router.js');

// log the http layer
app.use(morgan('common'));
app.use('/blog-posts', blogPostRouter); // think of this as $('http-connection').on('request', '/blog-posts')... though that is NOT proper code

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
