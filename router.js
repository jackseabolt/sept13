'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const knex = require('knex')({
  client: 'pg',
  connection: {
      database: 'short_blog'
  },
});

const {BlogPosts} = require('./model'); // we had (__dirname + '/model')

// we had the 2 lines below in server.js
//BlogPosts.create('My 1st Blog', 'Just some shit', 'myself', new Date());
//BlogPosts.create('My 2nd Blog', 'Poetry, baby!', 'obviously not me', '9/8/2017');

// all the functions below assume rout prefixed with /blog-posts

router.get('/:id', (req, res) => {
  knex
  .select('id', 'content', 'title', 'author', 'publishdate')
  .from('post')
  .where({
    id: req.params.id
    }
  )
  .then(response => {
    res.status(200).json(response);
  }).catch(err => {
    console.error(err); 
  })
  //res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  if(req.body.title && req.body.author && req.body.content) { 
   // && req.body.publishDate 
    //let item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    //res.json(item).status(201);
    const storeObj = {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content
    };
    knex('post') 
      .returning(['id', 'content', 'title', 'author', 'publishdate'])
      .insert(storeObj)
      .then(response => {
        res.status(201).json(response);
      })
    
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
  let otherObj = {
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }
  knex('post') 
    .where({id: req.params.id})
    .update(otherObj)
    .then(response => {
      res.status(204).json(response)
    })
  // BlogPosts.update({
  //   id: req.params.id,
    // title: req.body.title,
    // content: req.body.content,
    // author: req.body.author,
  //   publishDate: req.body.publishDate || Date.now()
  // });
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  knex('post')
    .where({id: req.params.id})
    .del()
    .then(response => {
      res.status(204).json(response);
    })
  // BlogPosts.delete(req.params.id);
  // console.log(`Deleted crappy post ${req.params.id}`);
  // res.status(204).end();
});

module.exports = router;