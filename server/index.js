// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
const PORT = 5000;


// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');


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
  db.query(sql, [firstName, lastName, formattedDate, email, hashedPassword], (err, result) => {
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
        // Generate JWT token with the random secret key
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
  });
});



// User profile route
app.get('/user-profile', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  // Retrieve user profile details from the database based on userId
  db.query('SELECT *, DATE_FORMAT(date_of_birth, "%Y-%m-%d") AS formatted_date_of_birth FROM user WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving user profile:', err);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(404).send('User profile not found');
    } else {
      const userProfile = results[0];
      const fullName = `${userProfile.first_name} ${userProfile.last_name}`;
      userProfile.full_name = fullName;
      // Send user profile details as response
      res.status(200).json(userProfile);
    }
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).send('Forbidden');
    req.user = decoded;
    next();
  });
}

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
      console.log(dateOfBirth, "formattedDate", formattedDate);
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

// API endpoint to get organizations
app.get('/organisations', (req, res) => {
  db.query('SELECT * FROM organisations', (error, results) => {
    if (error) {
      console.error('Error fetching organisations:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});


//  Organisation Registration endpoint
app.post('/orgregister', async (req, res) => {
  const { orgName, orgrName, email, password, orgSince, orgType, address, city, pincode } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const inputDateTimeString = orgSince;
  const inputDate = new Date(inputDateTimeString);
  const formattedDate = inputDate.toISOString().split('T')[0];
  const sql = 'INSERT INTO organisations (org_name, orgr_name, org_since, email, password, org_type, address, city, pincode ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [orgName, orgrName, formattedDate, email, hashedPassword, orgType, address, city, pincode], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Admin registered successfully');
      res.status(200).send('Admin registered successfully');
    }
  });
});


// Admin login route
app.post('/orglogin', async (req, res) => {
  console.error('Requesttt retrieving user:', req.body);
  const { username, password } = req.body;

  // Retrieve user from the database
  db.query('SELECT * FROM organisations WHERE email = ?', [username], async (err, results) => {
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

// Route to get organization details by ID
app.get('/organisation/:id', (req, res) => {
  const organisationId = req.params.id;
  const sql = 'SELECT * FROM organisations WHERE id = ?';

  db.query(sql, [organisationId], (err, result) => {
    if (err) {
      console.error('Error fetching organisation details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        // Organization found, return details
        res.json(result[0]);
      } else {
        // Organization not found
        res.status(404).json({ error: 'Organisation not found' });
      }
    }
  });
});

// Define the endpoint to fetch slots for a specific organization
app.get('/organisation/:id/slots', (req, res) => {
  const organisationId = req.params.id;
  const sql = 'SELECT * FROM organisation_slots WHERE organisation_id = ?';

  db.query(sql, [organisationId], (err, results) => {
    if (err) {
      console.error('Error fetching organization slots:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Check if slots are found
      if (results.length > 0) {
        // Modify the slot data to include status
        const slotsWithStatus = results.map(slot => {
          // Determine the status based on the slot value
          const status = slot.status === 'booked' ? 'booked' : 'available';
          return { ...slot, status };
        });
        res.json(slotsWithStatus);
      } else {
        // Slots not found
        res.status(404).json({ error: 'Slots not found for the organization' });
      }
    }
  });
});
// Define the endpoint to create a new booking
app.post('/bookings', async (req, res) => {
  const { bookingId, organisationId, userId, slotId } = req.body;

  // Generate a unique booking ID
  //const bookingId = generateUniqueBookingId();

  // Update the status of the booked slot in the organisation_slots table
  const updateSlotStatusSql = 'UPDATE organisation_slots SET status = ? WHERE id = ?';
  db.query(updateSlotStatusSql, ['booked', slotId], (updateError, updateResult) => {
    if (updateError) {
      console.error('Error updating slot status:', updateError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Insert the booking details into the bookings table
      const insertBookingSql = 'INSERT INTO bookings (booking_id, organisation_id, user_id, slot_id) VALUES (?, ?, ?, ?)';
      db.query(insertBookingSql, [bookingId, organisationId, userId, slotId], (insertError, insertResult) => {
        if (insertError) {
          console.error('Error creating booking:', insertError);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Booking created successfully');
          // Return the booking ID
          res.status(200).json({ bookingId });
        }
      });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

