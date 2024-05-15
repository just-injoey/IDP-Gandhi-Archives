const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('./DB/Database.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ngramRoutes = require('./routes/ngramRoutes');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/ngram', ngramRoutes);  // Adjusted route path

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '..', 'client/build')));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
