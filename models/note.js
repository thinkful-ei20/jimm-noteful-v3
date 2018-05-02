'use strict';

const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  title : {type: String, required: true},
  content : String,
}, {timestamps: true});

noteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

noteSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
  };
};

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
