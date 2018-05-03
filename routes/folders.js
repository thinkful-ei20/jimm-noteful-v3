
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Folder = require('../models/folder');

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
        next();
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

module.exports = router;
