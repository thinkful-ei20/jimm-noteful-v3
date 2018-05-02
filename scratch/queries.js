'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');
/*
mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = 'lady gaga';
    let filter = {};

    if (searchTerm) {
      const re = new RegExp(searchTerm, 'i');
      filter.title = { $regex: re };
    }

    return Note.find(filter)
      .sort('created')
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
  */

/*
mongoose.connect(MONGODB_URI)
  .then(() => {
    return Note.findById("000000000000000000000005")
      .then(results => {
        console.log(results);
      })
      .catch(console.error);
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
  */

mongoose.connect(MONGODB_URI)
  .then(() => {
    const testNote ={
      title: 'dummy note',
      content: 'Bacon ipsum dolor amet chuck picanha rump sausage.',
    };
    return Note.create(testNote)
      .then(results => {
        console.log(results);
      })
      .catch(err => console.error(err));
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
