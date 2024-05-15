const fs = require('fs');
const path = require('path');
const { plot } = require('nodeplotlib');
const { BytesIO } = require('buffer');
const base64 = require('base64-js');

// Function to calculate word frequencies for multiple words
const calculateWordFrequencies = (csvFile, folderPath, words) => {
    const wordFrequenciesByWord = {};

    // Iterate through each word
    words.forEach(word => {
        const wordFrequencyByYear = {};
        try {
            const csvData = fs.readFileSync(csvFile, 'utf-8').split('\n');

            csvData.forEach(row => {
                const [fileName, date] = row.split(',');
                if (date) {
                    const year = date.split('-')[2];
                    const filePath = path.join(folderPath, `${fileName}.txt`);
                    if (fs.existsSync(filePath)) {
                        const text = fs.readFileSync(filePath, 'utf-8');
                        const occurrences = (text.match(new RegExp(`\\b${word}\\b`, 'gi')) || []).length;
                        if (year in wordFrequencyByYear) {
                            wordFrequencyByYear[year] += occurrences;
                        } else {
                            wordFrequencyByYear[year] = occurrences;
                        }
                    }
                }
            });
        } catch (error) {
            console.error(`Error processing CSV file: ${csvFile}`, error);
        }

        wordFrequenciesByWord[word] = wordFrequencyByYear;
    });

    return wordFrequenciesByWord;
};

// Function to generate ngram plot
const generateNgramPlot = (req, res) => {
    console.log("Reached here");
    const { words } = req.body;

    if (!words || !Array.isArray(words)) {
        return res.status(400).json({ error: 'Invalid input: words must be a non-empty array' });
    }

    const currentDir = path.dirname(__filename);
    const csvFile = path.join(currentDir, '..', 'Book1.csv');
    const folderPath = path.join(currentDir, '..', 'Book1');

    const wordFrequencies = calculateWordFrequencies(csvFile, folderPath, words);

    // Convert wordFrequencies object into arrays of x (years) and y (frequencies)
    const xValues = Object.keys(wordFrequencies);
    const yValues = Object.values(wordFrequencies);

    // Create a plot
    const plt = plot([
        {
            x: xValues,
            y: yValues,
            type: 'line',
            mode: 'lines+markers',
            name: 'Word Frequency',
            marker: { color: 'blue' }
        }
    ]);

    // Return the plot as a JSON response
    res.json({ plot: plt });
};

module.exports = {
    generateNgramPlot
};
