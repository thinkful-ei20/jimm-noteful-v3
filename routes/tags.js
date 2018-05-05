
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const Note = require('../models/note');

router.get('/', (req, res, next) => {
  Tag.find()
    .sort('name')
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const idToFind = req.params.id;

  if(! mongoose.Types.ObjectId.isValid(idToFind)){
    const err = new Error('Invalid id');
    err.status(400);
    return next(err);
  }

  Tag.findById(idToFind)
    .then(result => {
      if(result){
        res.status(200).json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  if(!req.body.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  const newTag = {
    name: req.body.name
  };
  Tag.create(newTag)
    .then(result => {
      res.status(201).location(`${req.originalUrl}/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
      } else {
        next(err);
      }
    });
});

router.put('/:id', (req, res, next) => {
  if(!req.body.name){
    console.error('Missing `name` in request body');
    return res.status(400).send('Missing `name` in request body');
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  const idToUpdate = req.params.id;

  const updatedTag = {
    name: req.body.name
  };

  Tag.findByIdAndUpdate(idToUpdate, updatedTag, {new: true})
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
      } else {
        next(err);
      }
    });
});

router.delete('/:id', (req, res, next) => {
  const idToDelete = req.params.id;
  Tag.findByIdAndRemove(req.params.id)
    .then(() => {
      Note.updateMany({'tags' : idToDelete}, {'$pull' : {'tags' : idToDelete} });
    })
    .then(() => res.status(204).end())
    .catch(err => next(err));
});

module.exports = router;