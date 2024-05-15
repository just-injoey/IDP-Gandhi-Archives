const { countWordOccurrences, calculateWordFrequency, sortDictionary, createPlot } = require('../utils/fileUtils');

const plotNGram = async (req, res) => {
  const { words } = req.body;
  const csvFile = path.join(__dirname, '../data/Book1.csv');
  const folderPath = path.join(__dirname, '../data/Book1');

  const wordArray = words.split(',').map(word => word.trim());
  const plots = [];

  for (let word of wordArray) {
    const freqDictionary = calculateWordFrequency(csvFile, folderPath, word);
    const sortedDict = sortDictionary(freqDictionary);
    plots.push({ word, data: sortedDict });
  }

  const plotData = createPlot(plots);
  res.json({ plotData });
};

module.exports = { plotNGram };
