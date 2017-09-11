'use strict';
 
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function(){

  const updateData = {
    title: 'title',
    content: 'content',
    author: 'author',
    publishDate: Date.now()
  };

  before(function(){
    console.log('server starting to run');
    return runServer();
  });

  after(function(){
    console.log('server starting to close');    
    return closeServer();
  });

  it('if we do NOT pass it an id, it shows all in alpha order', function(){
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item){
          item.should.be.a('object');
          item.should.have.all.keys('id','title','content','author','publishDate');
        });
      });
  });

  // it('if we pass it an id, it gets one with matching id', function(){

  //   return chai.request(app)
  //     .get('/blog-posts')
  //     .then(function(res){
  //       let id = res.body[0].id;
  //       return chai.request(app)
  //       .get(`/blog-posts/${id}`)
  //     })
  //     .then(function(res){
  //       res.should.have.status(200);
  //       res.should.be.json;
        
  //     })
  // })


});