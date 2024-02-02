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
  const { firstName, lastName, email, password, dateOfBirth } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const inputDateTimeString = dateOfBirth;
  const inputDate = new Date(inputDateTimeString);
  const formattedDate = inputDate.toISOString().split('T')[0];
  const sql = 'INSERT INTO user (first_name, last_name, date_of_birth, email, password ) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [firstName, lastName, formattedDate, email, hashedPassword ], (err, result) => {
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

// Forgot Password endpoint
app.post('/forgot-password', async (req, res) => {
  const { username, dateOfBirth, newPassword, confirmNewPassword } = req.body;
  const inputDateTimeString = dateOfBirth;
  const inputDate = new Date(inputDateTimeString);
  const formattedDate = inputDate.toISOString().split('T')[0];
  // Validate if new password and confirm password match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match' });
  }

  // Find the user in the database based on username and date of birth
  const findUserQuery = 'SELECT * FROM user WHERE email = ? AND date_of_birth = ?';
  db.query(findUserQuery, [username, formattedDate], async (err, results) => {
    if (err) {
      console.error('Failed to execute query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      console.log(dateOfBirth,"formattedDate",formattedDate);
      return res.status(401).json({ error: 'Invalid username or date of birth' });

    }

    const user = results[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatePasswordQuery = 'UPDATE user SET password = ? WHERE id = ?';
    db.query(updatePasswordQuery, [hashedPassword, user.id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Failed to update password:', updateErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'Password reset successful' });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

