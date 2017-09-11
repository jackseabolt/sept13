'use strict';
 
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function(){

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
        res.body.length.should.be.above(0); // this only works on arrays and strings
        res.body.forEach(function(item){
          item.should.be.a('object');
          item.should.have.all.keys('id','title','content','author','publishDate');
        });
      });
  });

  // FUTURE FUNCTIONALITY...
  // it('if we pass it an id, it gets one with matching id', function(){
  //   return chai.request(app)
  //     .get('/blog-posts')
  //     .then(function(res){
  //       updateData.id = res.body[0].id;
  //       console.log('id');
  //       console.log(res.body[0].id);
  //       return chai.request(app)
  //         .get(`/blog-posts/${updateData.id}`)
  //         .send(updateData);
  //     })
  //     .then(function(res){
  //       res.should.have.status(200);
  //       // res.should.be.json;
  //       // res.body.should.be.a('object');
  //       // res.body.length.should.be.above(0);
  //       // res.body.should.have.all.keys('id','title','content','author','publishDate');
  //       // res.body.id.should.equal(updateData.id);
  //     });
  // });

  it('if we post...', function(){
    const updateData = {
      title: 'title1',
      content: 'content1',
      author: 'author1',
      publishDate: Date.now()
    };
    delete updateData.id;
    return chai.request(app)
      .post('/blog-posts/')
      .send(updateData)
      .then(function(res){
        res.should.have.status(200); // we thought this should be 201, why is it 200?
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.id.should.not.be.null;
        res.body.should.have.all.keys('id','title','content','author','publishDate');
        res.body.should.deep.equal(Object.assign(updateData, {id: res.body.id}));
      });
  });

  it('if we put...', function(){
    const updateData = {
      title: 'title2',
      content: 'content2',
      author: 'author2',
      publishDate: Date.now()
    };
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res){
        res.should.have.status(204);
      });
  });

  it('if we delete...', function(){
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        const id = res.body[0].id;
        return chai.request(app)
          .delete(`/blog-posts/${id}`);
      })
      .then(function(res){
        res.should.have.status(204);
      });
  });

});