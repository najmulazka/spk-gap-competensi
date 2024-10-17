const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = 3000;
const { hitung } = require('./controllers/hitung.controllers');

app.use(morgan('dev'));
app.use(express.json());

// Router index
app.get('/', (req, res) => {
  return res.status(200).json({ status: true, message: 'Welcome to techacademy app', err: null, data: null });
});

// Route upload file
app.post('/upload', hitung);

// Jalankan server
app.listen(PORT, () => console.log('Running on port', PORT));
