/**
 * Tests for backend
 * Precondition: Empty database defined in config url. Server started with npm start
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

describe("User authentication test #UJ2", function(){

  it("should be possible to create token with valid credentials", function(done){
    // POST /user/login
    server
      .post("/user/login")
      .send({email : "tester@gmail.com", password : "123456"})
      .expect(200) // created
      .expect("Content-type",/json/)
      .end(function(err,res){
        // token exists
        should.exist(res.body.token);
        // token long enough
        (res.body.token ? res.body.token.length : -1).should.be.above(15);
        done();
      });
  });

  it("should not be possible to create token with wrong password", function(done){
    // POST /user/login
    server
      .post("/user/login")
      .send({email : "tester@gmail.com", password : "wrongPass"})
      .expect(401) // created
      .expect("Content-type",/json/)
      .end(function(err,res){
        done();
      });
  });

  it("should not be possible to create token with inexistent email address", function(done){
    // POST /user/login
    server
      .post("/user/login")
      .send({email : "testerWrong@gmail.com", password : "123456"})
      .expect(401) // created
      .expect("Content-type",/json/)
      .end(function(err,res){
        done();
      });
  });

});

describe("Contract #UJ2-4", function(){
  var token = null;
  var contractId = null;

  // Save token of user
  before(function(done) {
    server
      .post('/user/login')
      .send({ email: "tester@gmail.com", password: "123456" })
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  });

  it("should create a new contract", function(done){
    // POST /contract
    server
      .post("/contract")
      .set("Authorization", "Bearer "+token)
      .send({title: "contractTitle", company: "Insurance company", price: 287 })
      .expect(201) // created
      .expect("Content-type",/json/)
      .end(function(err,res){
        should.exist(res.body.title);
        should.exist(res.body.price);
        should.exist(res.body.company);
        should.exist(res.body._id);
        contractId = res.body._id; // save for usage in update test

        res.body.company.should.equal("Insurance company");
        res.body.title.should.equal("contractTitle");
        res.body.price.should.equal(287);

        done();
      });
  });

  it("should update an existing contract", function(done){
    // PUT /contract
    server
      .put("/contract/"+contractId)
      .set("Authorization", "Bearer "+token)
      .send({title: "contract Title corrected" })
      .expect(200) // created
      .expect("Content-type",/json/)
      .end(function(err,res){

        should.exist(res.body.title);
        should.exist(res.body.price);
        should.exist(res.body.company);
        res.body.title.should.equal("contract Title corrected");
        res.body.company.should.equal("Insurance company");
        done();
      });
  });

  it("should delete an existing contract", function(done){
    // DELETE /contract
    server
      .delete("/contract/"+contractId)
      .set("Authorization", "Bearer "+token)
      .send()
      .expect(200)
      .expect("Content-type",/json/)
      .end(function(err,res){

        done();
      });
  });


});
