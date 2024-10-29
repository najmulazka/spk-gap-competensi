const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const PORT = 3000;
const { hitung } = require('./controllers/hitung.controllers');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Router index
app.get('/', (req, res) => {
  return res.status(200).json({ status: true, message: 'Welcome to techacademy app', err: null, data: null });
});

// Route upload file
app.post('/upload', hitung);

// Jalankan server
app.listen(PORT, () => console.log('Running on port', PORT));
