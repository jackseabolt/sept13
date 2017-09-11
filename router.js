'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model'); // we had (__dirname + '/model')

// we had the 2 lines below in server.js
BlogPosts.create('My 1st Blog', 'Just some shit', 'myself', new Date());
BlogPosts.create('My 2nd Blog', 'Poetry, baby!', 'obviously not me', '9/8/2017');

// all the functions below assume rout prefixed with /blog-posts

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  if(req.body.title && req.body.author && req.body.content && req.body.publishDate) {
    let item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.json(item).status(201);
  } else {let message = 'there was an issue with your submission';
    console.log(message); 
    res.status(400).send(message);
  }
});

router.put('/:id', jsonParser, (req, res) => {
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

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted crappy post ${req.params.id}`);
  res.status(204).end();
});

module.exports = router;