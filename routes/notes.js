'use strict';

const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const Tag = require('../models/tag');
const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm , folderId, tagId } = req.query;
  let filter = {};

  // maybe add some ObjectId validation and if not valid run query w/o it in filter
  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.title = { $regex: re };
  }
  if(folderId){
    filter.folderId = folderId;
  }
  if(tagId){
    filter.tags = tagId;
  }

  return Note.find(filter)
    .populate('tags')
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
    .populate('tags')
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
    content : req.body.content,
    folderId: null,
    tags: [],
  };

  if (mongoose.Types.ObjectId.isValid(req.body.folderId)) {
    newNote.folderId = req.body.folderId;
  }
  if(req.body.tags){
    req.body.tags.forEach(tag => {
      if (mongoose.Types.ObjectId.isValid(tag)) {
        newNote.tags.push(tag);
      } else {
        console.error(`Invalid tagId, adding without tagId ${tag}`);
      }
    });
  }

  Note.create(newNote)
    .then(result => {
      res.status(201).location(`${req.originalUrl}/${result.id}`).json(result);
    })
    .catch(err => console.error(err));

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const updateObj = {};
  if(req.body.folderId){
    if(mongoose.Types.ObjectId.isValid(req.body.folderId)){
      updateObj.folderId = req.body.folderId;  
    } else {
      console.error('Invalid folderId, updating without folderId');
    }
  }
  const updateableValues = ['title', 'content'];
  updateableValues.forEach(field => {
    if(field in req.body){
      updateObj[field] = req.body[field];
    }
  });
  if(req.body.tags){
    updateObj.tags = [];
    req.body.tags.forEach(tag => {
      if (mongoose.Types.ObjectId.isValid(tag)) {
        updateObj.tags.push(tag);
      } else {
        console.error(`Invalid tagId, adding without tagId ${tag}`);
      }
    });
  }

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