'use strict';

//use TEST_MONGODB_URI for seeding the local test db and MONGODB_URI for the local scratch db 

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');

const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(seedNotes),
      Folder.insertMany(seedFolders),
      Folder.createIndexes(),
    ]);
  })
  .then(results => {
    console.info('Inserted Notes and Folders');
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });