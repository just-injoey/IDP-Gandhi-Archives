// backend/models/Ngram.js

const mongoose = require('mongoose');

const NgramSchema = new mongoose.Schema({
  ngram: { type: String, required: true },
  frequency: { type: Number, required: true },
  year: { type: String, required: true },
});

module.exports = mongoose.model('Ngram', NgramSchema);
