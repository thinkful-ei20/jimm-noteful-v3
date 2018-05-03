'use strict';

const express = require('express');
const router = express.Router();
const Note = require('../models/note');

/* ========== GET/READ ALL ITEM ========== */
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  let filter = {};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.title = { $regex: re };
  }

  return Note.find(filter)
    .sort('created')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const idToFind = req.params.id;

  return Note.findById(idToFind)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  if(!('title' in req.body)){
    console.error('Missing `title` in request body');
    return res.status(400).send('Missing `title` in request body');
  }
  
  const newNote = {
    title : req.body.title,
    content : req.body.content
  };

  Note.create(newNote)
    .then(result => {
      res.status(201).location(`${req.originalUrl}/${result.id}`).json(result);
    })
    .catch(err => console.error(err));

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  const updateObj = {};
  const updateableValues = ['title', 'content',];
  updateableValues.forEach(field => {
    if(field in req.body){
      updateObj[field] = req.body[field];
    }
  });

  Note.findByIdAndUpdate(req.params.id, updateObj, {new : true})
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => next(err));

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err));

});

module.exports = router;