// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ams_db',
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
  db.query('SELECT * FROM user', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(result);
    }
  });
});

// Define routes and controllers as needed


// Registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user details into the database
  const sql = 'INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [firstName, lastName, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('User registered successfully');
      res.status(200).send('User registered successfully');
    }
  });
});


// User login route
app.post('/login', async (req, res) => {
  console.error('Requesttt retrieving user:', req.body);
  const { username, password } = req.body;

  // Retrieve user from the database
  db.query('SELECT * FROM user WHERE email = ?', [username], async (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      const user = results[0];

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});