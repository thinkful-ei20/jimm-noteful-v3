'use strict';

//use TEST_MONGODB_URI for seeding the local test db and MONGODB_URI for the local scratch db 

const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');


const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');
const seedTags = require('../db/seed/tags');

mongoose.connect(TEST_MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(seedNotes),
      Folder.insertMany(seedFolders),
      Tag.insertMany(seedTags),
      Folder.createIndexes(),
      Tag.createIndexes(),
    ]);
  })
  .then(results => {
    console.info('Inserted Notes, Folders, and Tags into local test DB');
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });