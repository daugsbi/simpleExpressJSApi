/**
 * Tests for backend
 */

const supertest = require("supertest");
let should = require("should");

const server = supertest.agent("http://localhost:3000");

describe("User registration test #UJ1",function(){

  it("should create a user after registration", function(done){
    // POST /user
    server
      .post("/user")
      .send({email : "tester@gmail.com", password : "123456"})
      .expect(201) // created
      .expect("Content-type",/json/)
      .end(function(err,res){
        // Error key should be false.
        res.body.email.should.equal("tester@gmail.com");
        done();
      });
  });

  it("should not create the same user again", function(done){
    // POST /user
    server
      .post("/user")
      .send({email : "tester@gmail.com", password : "123456"})
      .expect(400) // error
      .end(function(err, res) {
          done();
      });
  });

  it("should not be possible to create a user with an invalid email address", function(done){
    // POST /user
    server
      .post("/user")
      .send({email : "testergmail.com", password : "123456"})
      .expect(400) // error
      .end(function(err, res) {
        done();
      });
  });

  it("should create another user with different email address", function(done){
    // POST /user
    server
      .post("/user")
      .send({email : "tester2@gmail.com", password : "123123"})
      .expect(201) // created
      .expect("Content-type",/json/)
      .end(function(err,res){
        // Error key should be false.
        res.body.email.should.equal("tester2@gmail.com");
        done();
      });
  });

});

