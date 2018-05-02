
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');

//Just to not have to type chai.expect every time
const expect = chai.expect;

chai.use(chaiHttp);

describe('Note tests', function(){
  // before running any tests connect to the test database
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI);
  });

  // before each test reset/re-seed the database with the default data
  // or you could write all tests to expect the changes from previous tests
  beforeEach(function(){
    return Note.insertMany(seedNotes)
      .then(() => Note.createIndexes());
  });

  // after each test drop the test db so you can re-seed it before each
  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });

  // disconnect from the db after all the tests 
  after(function(){
    return mongoose.disconnect();
  });

  // describe('GET api/notes/', function(){
    
  //   it('should get all notes from the db and an http request and check that they are the same', () => {
  //     return Promise.all([
  //       Note.find(),
  //       chai.request(app).get('/api/notes'),
  //     ])
  //       .then(([data, res]) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.an('array');
  //         expect(res.body).to.have.length(data.length);
  //       });
  //   });
  //  });


  describe('POST /api/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content');
          // 2) then call the database
          return Note.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });
  });
  

});