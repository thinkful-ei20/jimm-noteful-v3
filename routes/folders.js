
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Folder = require('../models/folder');
const Note = require('../models/note');

router.get('/', (req, res, next) => {
  return Folder.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const idToFind = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(idToFind)){
    const err = new Error('Not a valid id');
    err.status = 400;
    return next(err);
  }
  Folder.findById(idToFind)
    .then(result => {
      if(result){
        res.json(result);
      } else {
        next(); //if no folder with that id exists => 404 
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  if(!('name' in req.body)){
    console.error('Missing `name` in request body');
    return res.status(400).send('Missing `name` in request body');
  }
  
  const newFolder = {
    name: req.body.name,
  };

  Folder.create(newFolder)
    .then(result => {
      res.status(201).location(`${req.originalUrl}/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateFolder = { name };

  Folder.findByIdAndUpdate(id, updateFolder, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const idToDelete = req.params.id;
  Folder.findByIdAndRemove(req.params.id)
    .then(() => {
      Note.remove({folderId : idToDelete}, function (err, removed) {
        if (err) return next(err);
        console.log(removed);
      });
    })
    .then(() => res.status(204).end())
    .catch(err => next(err));
  

  // Note.deleteMany({folderId: idToDelete}; == Note.remove({condition}, callback)
});

module.exports = router;
