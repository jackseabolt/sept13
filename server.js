'use strict';
/*$ global*/

const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require(__dirname + '/model');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

BlogPosts.create('My 1st Blog', 'Just some shit', 'myself', new Date());
BlogPosts.create('My 2nd Blog', 'Poetry, baby!', 'obviously not me', '9/8/2017');


app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});


app.post('/blog-posts', jsonParser, (req, res) => {
  if(req.body.title && req.body.author && req.body.content && req.body.publishDate) {
  let item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.json(item);
  } else {let message = 'there was an issue with your submission';
  console.log(message); 
  res.status(400).send(message);
  }
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['title', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post # \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate || Date.now()
  });
  res.status(204).end();
});

app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted crappy post ${req.params.id}`);
  res.status(204).end();
});




app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
