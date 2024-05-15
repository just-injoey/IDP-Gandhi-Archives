// backend/scripts/preprocessData.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const Ngram = require('../models/Ngram');

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/ngrams', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// Helper function to count word occurrences
const countWordOccurrences = (text, word) => {
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  return (text.match(regex) || []).length;
};

// Function to process CSV and text files
const processFiles = async () => {
  const csvFilePath = path.join(__dirname, '../uploads/book1/metadata.csv');
  const folderPath = path.join(__dirname, '../uploads/book1');

  const wordFrequencyByYear = {};

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const { file_name, date } = row;
      const year = date.split('-')[2];
      const filePath = path.join(folderPath, `${file_name}.txt`);

      if (fs.existsSync(filePath)) {
        const text = fs.readFileSync(filePath, 'utf-8');
        const words = text.split(/\s+/);

        words.forEach(word => {
          const occurrences = countWordOccurrences(text, word);
          wordFrequencyByYear[year] = wordFrequencyByYear[year] || {};
          wordFrequencyByYear[year][word] = (wordFrequencyByYear[year][word] || 0) + occurrences;
        });
      }
    })
    .on('end', async () => {
      for (const [year, wordFreq] of Object.entries(wordFrequencyByYear)) {
        for (const [word, frequency] of Object.entries(wordFreq)) {
          const ngramData = new Ngram({ ngram: word, frequency, year });
          await ngramData.save();
        }
      }
      console.log('Data processing and upload complete.');
      mongoose.disconnect();
    })
    .on('error', (error) => {
      console.error(error);
      mongoose.disconnect();
    });
};

processFiles();
