let chai = require('chai');
let chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const host = 'http://localhost:5000';
const path = '/login'

describe('Testing admin', ()=>{


    it('should return all departments', (done)=>{
        chai
        .request(host)
        .post(path)
        .send({
            "email": 'KA@gmail.com',
            "password": '1234'
        })
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
            });
    })


})