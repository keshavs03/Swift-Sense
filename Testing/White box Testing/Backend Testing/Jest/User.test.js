let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const expect=chai.expect();

const host = 'http://localhost:5000';
const path = '/login'

describe('Testing admin', ()=>{


    it('should return all departments', (done)=>{
        chai
        .request(host)
        .post(path)
        .send({
            "email": 'dhruvchokshi25@gmail.com',
            "password": 'Dhruv@12295'
        })
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
            });
    })
})

describe('Testing user', () => {
    it('should return error for invalid email', (done) => {
      chai.request(host)
        .post(path)
        .send({
          email: 'invalid-email-address', // this is an invalid email address
          password: 'password123',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').equal('Invalid email address');
          done();
        });
    });
  });
  

