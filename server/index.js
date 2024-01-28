// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test_db',
});


db.connect((err) => {
  if (err) {
    console.log('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// API endpoint to get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// Define routes and controllers as needed

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
