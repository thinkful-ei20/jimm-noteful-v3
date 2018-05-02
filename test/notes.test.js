
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI} = require('../config');

const Note = require('../models/notes');
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
    return Note.insertMany()
      .then(() => Note.creatIndexes());
  });

  // after each test drop the test db so you can re-seed it before each
  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });

  // disconnect from the db after all the tests 
  after(function(){
    return mongoose.disconnect();
  });

});