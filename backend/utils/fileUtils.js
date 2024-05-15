const fs = require('fs');
const path = require('path');
const re2 = require('re2');
const csv = require('csv-parser');
const { createCanvas } = require('canvas');
const base64Stream = require('base64-stream');

const countWordOccurrences = (filePath, word) => {
  const text = fs.readFileSync(filePath, 'utf-8');
  const re = new re2(`\\b${word}\\b`, 'gi');
  const matches = text.match(re);
  return matches ? matches.length : 0;
};

const calculateWordFrequency = (csvFile, folderPath, word) => {
  const wordFrequencyByYear = {};

  const csvData = fs.readFileSync(csvFile, 'utf-8');
  const rows = csvData.split('\n').map(row => row.split(','));

  for (let row of rows) {
    const [fileName, date] = row;
    const year = date.split('-')[2];
    const filePath = path.join(folderPath, `${fileName}.txt`);
    if (fs.existsSync(filePath)) {
      const occurrences = countWordOccurrences(filePath, word);
      if (wordFrequencyByYear[year]) {
        wordFrequencyByYear[year] += occurrences;
      } else {
        wordFrequencyByYear[year] = occurrences;
      }
    }
  }

  return wordFrequencyByYear;
};

const sortDictionary = (dictionary) => {
  const sortedDict = {};
  Object.keys(dictionary).sort().forEach(key => {
    sortedDict[key] = dictionary[key];
  });
  return sortedDict;
};

const createPlot = (plots) => {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);
  ctx.font = '12px Arial';

  const colors = ['red', 'green', 'blue', 'orange', 'purple', 'brown', 'pink'];
  let colorIndex = 0;

  for (let plot of plots) {
    const { word, data } = plot;
    const xValues = Object.keys(data);
    const yValues = Object.values(data);

    ctx.strokeStyle = colors[colorIndex % colors.length];
    ctx.beginPath();
    for (let i = 0; i < xValues.length; i++) {
      const x = i * (width / xValues.length);
      const y = height - (yValues[i] / Math.max(...yValues)) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.fillText(word, width - 100, 20 + colorIndex * 20);
    colorIndex++;
  }

  const imgBuffer = canvas.toBuffer('image/png');
  const base64Img = imgBuffer.toString('base64');
  return base64Img;
};

module.exports = { countWordOccurrences, calculateWordFrequency, sortDictionary, createPlot };
