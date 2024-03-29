// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const async = require('async');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs')

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
  const { firstName, lastName, email, password,cnfPassword, dateOfBirth,gender, captchaResponse } = req.body;

  // Verify CAPTCHA response
  const secretKey = '6LcNJKApAAAAAHJLkw56qPE06CQOJeVHEioHeD0f'; // Replace with your reCAPTCHA secret key
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
  // Validate if new password and confirm password match
  if (password !== cnfPassword) {
    return res.status(400).json({ error: ' Password and confirm password do not match' });
  }
  try {
    const captchaVerificationResponse = await axios.post(url);
    if (captchaVerificationResponse.data.success) {
      // CAPTCHA verification successful, proceed with registration

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Format date of birth
      const inputDate = new Date(dateOfBirth);
      const formattedDate = inputDate.toISOString().split('T')[0];

      // Insert user data into database
      const sql = 'INSERT INTO user (first_name, last_name, date_of_birth, gender, email, password ) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [firstName, lastName, formattedDate, gender, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('User registered successfully');
          res.status(200).send('User registered successfully');
        }
      });
    } else {
      // CAPTCHA verification failed
      res.status(400).send('CAPTCHA verification failed');
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).send('Internal Server Error');
  }
});


// User login route
app.post('/login', async (req, res) => {
  console.error('Requesttt retrieving user:', req.body);
  const { username, password } = req.body;

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
  db.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving user profile:', err);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(404).send('User profile not found');
    } else {
      const userProfile = results[0];
      const fullName = `${userProfile.first_name} ${userProfile.last_name}`;
      userProfile.full_name = fullName;

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
  const { username, dateOfBirth, newPassword, confirmNewPassword, captchaResponse } = req.body;
  const inputDateTimeString = dateOfBirth;
  const inputDate = new Date(inputDateTimeString);
  const formattedDate = inputDate.toISOString().split('T')[0];
  // Verify CAPTCHA response
  const secretKey = '6LcNJKApAAAAAHJLkw56qPE06CQOJeVHEioHeD0f'; // Replace with your reCAPTCHA secret key
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
  // Validate if new password and confirm password match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match' });
  }
  try {
    const captchaVerificationResponse = await axios.post(url);
    if (captchaVerificationResponse.data.success) {
      // CAPTCHA verification successful, proceed with registration
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
    } else {
      // CAPTCHA verification failed
      res.status(400).send('CAPTCHA verification failed');
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to get organizations
app.get('/organisations', (req, res) => {
  const { location, type } = req.query;
  let query = 'SELECT * FROM organisations';

  // If location is provided, add WHERE clause to filter by location
  if (location) {
    query += ` WHERE city = '${location}'`; // Assuming 'city' is the column in your database table for location
  }

  // If type is provided, add WHERE clause to filter by type
  if (type) {
    if (location) {
      query += ` AND org_type = '${type}'`; // Assuming 'org_type' is the column in your database table for type
    } else {
      query += ` WHERE org_type = '${type}'`; // If no location is provided, start the WHERE clause
    }
  }

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching organisations:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});



// Route to get organization details by ID
app.get('/organisation/:id', (req, res) => {
  const organisationId = req.params.id;
  const sql = 'SELECT * FROM organisations WHERE id = ? ';

  db.query(sql, [organisationId,], (err, result) => {
    if (err) {
      console.error('Error fetching organisation details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        // Organization found, encode image data as base64 and include in response
        const organisation = result[0];
        if (organisation.image) {
          // Convert image data to base64-encoded string
          const base64Image = Buffer.from(organisation.image).toString('base64');
          // Include base64-encoded image data in the organisation object
          organisation.imageBase64 = base64Image;
        }
        res.json(organisation);
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
  const currentDate = new Date().toISOString().split('T')[0];

  const sql = 'SELECT * FROM organisation_slots WHERE organisation_id = ? AND organisation_slots.date >= ? AND (organisation_slots.status = "available" OR organisation_slots.status = "booked" )';

  db.query(sql, [organisationId, currentDate], (err, results) => {
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
  const { bookingId, organisationId, userId, slotId, qrCode } = req.body;

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
      const insertBookingSql = 'INSERT INTO bookings (booking_id, organisation_id, user_id, slot_id, status, qr_code) VALUES (?, ?, ?, ?,"open", ?)';
      db.query(insertBookingSql, [bookingId, organisationId, userId, slotId, qrCode], (insertError, insertResult) => {
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

// API endpoint to retrieve booking details by booking ID
app.get('/booking-details/:id', (req, res) => {
  try {
    // Extract the booking ID from the request parameters
    const { id } = req.params;

    // Query the database for the booking details using the provided booking ID
    db.query(
      `SELECT bookings.booking_id, bookings.organisation_id, bookings.user_id, bookings.slot_id,bookings.qr_code
       FROM bookings
       WHERE bookings.booking_id = ?`,
      [id],
      (err, bookingDetails) => {
        if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if booking details were found
        if (bookingDetails.length === 0) {
          return res.status(404).json({ error: 'Booking not found' });
        }

        // Extract organization ID, user ID, and slot ID from booking details
        const { organisation_id, user_id, slot_id } = bookingDetails[0];

        // Fetch organization details
        db.query(
          `SELECT org_name FROM organisations WHERE id = ?`,
          [organisation_id],
          (err, organisation) => {
            if (err) {
              console.error('Error fetching organisation:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Fetch user details
            db.query(
              `SELECT first_name,last_name FROM user WHERE id = ?`,
              [user_id],
              (err, user) => {
                if (err) {
                  console.error('Error fetching user:', err);
                  return res.status(500).json({ error: 'Internal Server Error' });
                }

                // Fetch slot details including start time and end time
                db.query(
                  `SELECT date,start_time, end_time, description FROM organisation_slots WHERE id = ?`,
                  [slot_id],
                  (err, slot) => {
                    if (err) {
                      console.error('Error fetching slot:', err);
                      return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    const fullName = `${user[0].first_name} ${user[0].last_name}`;
                    // Combine all details
                    const bookingDetailsR = {
                      booking_id: bookingDetails[0].booking_id,
                      organisation_name: organisation[0].org_name,
                      user_name: fullName,
                      date: formatDate(slot[0].date),
                      start_time: slot[0].start_time,
                      end_time: slot[0].end_time,
                      description: slot[0].description,
                      qr_code: bookingDetails[0].qr_code
                    };

                    function formatDate(dateString) {
                      const date = new Date(dateString);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}-${month}-${year}`;
                    }
                    // Return the booking details as JSON response
                    res.json(bookingDetailsR);

                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    // If an error occurs, log the error and return a 500 Internal Server Error response
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch all user appointments based on user ID from JWT token
app.get('/user-appointments', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('User ID:', userId);
    const currentDate = new Date().toISOString().split('T')[0];

    // Query the database for all booking details associated with the user ID, filtering out past appointments
    db.query(
      `SELECT bookings.booking_id, bookings.organisation_id, bookings.slot_id, bookings.qr_code
   FROM bookings
   INNER JOIN organisation_slots ON bookings.slot_id = organisation_slots.id
   WHERE bookings.user_id = ? AND organisation_slots.date >= ? AND bookings.status ="open"`,
      [userId, currentDate],

      (err, bookingDetails) => {
        if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if booking details were found
        if (bookingDetails.length === 0) {
          return res.status(404).json({ error: 'No appointments found' });
        }

        // Function to fetch details for a single booking
        const fetchBookingDetails = (bookingDetail, callback) => {
          const { organisation_id, slot_id, booking_id } = bookingDetail;
          db.query(
            `SELECT qr_code FROM bookings WHERE booking_id = ?`,
            [booking_id],
            (err, bookings) => {
              if (err) {
                console.error('Error fetching qr_code:', err);
                return callback(err);
              }
              // Fetch organisation name
              db.query(
                `SELECT org_name FROM organisations WHERE id = ?`,
                [organisation_id],
                (err, organisation) => {
                  if (err) {
                    console.error('Error fetching organisation:', err);
                    return callback(err);
                  }

                  // Fetch user name
                  db.query(
                    `SELECT first_name,last_name FROM user WHERE id = ?`,
                    [userId],
                    (err, user) => {
                      if (err) {
                        console.error('Error fetching user:', err);
                        return callback(err);
                      }

                      // Fetch slot details (start time and end time)
                      db.query(
                        `SELECT date,start_time, end_time, description FROM organisation_slots WHERE id = ?`,
                        [slot_id],
                        (err, slot) => {
                          if (err) {
                            console.error('Error fetching slot:', err);
                            return callback(err);
                          }

                          const fullName = `${user[0].first_name} ${user[0].last_name}`;
                          // Combine all details into an appointment object
                          const appointment = {
                            booking_id: bookingDetail.booking_id,
                            organisation_name: organisation[0].org_name,
                            user_name: fullName,
                            date: formatDate(slot[0].date),
                            start_time: slot[0].start_time,
                            end_time: slot[0].end_time,
                            description: slot[0].description,
                            slot_id: slot_id,
                            qr_code: bookingDetail.qr_code,

                          };

                          function formatDate(dateString) {
                            const date = new Date(dateString);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                          }

                          // Add appointment to the appointments array
                          callback(null, appointment);
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        };

        // Array to hold all appointments
        const appointments = [];

        // Process each booking detail
        async.eachSeries(
          bookingDetails,
          (bookingDetail, callback) => {
            fetchBookingDetails(bookingDetail, (err, appointment) => {
              if (err) {
                return callback(err);
              }
              appointments.push(appointment);
              callback();
            });
          },
          (err) => {
            if (err) {
              console.error('Error processing appointments:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(appointments);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to fetch all old appointments based on user ID from JWT token
app.get('/history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('User ID:', userId);
    const currentDate = new Date().toISOString().split('T')[0];
    // Query the database for all booking details associated with the user ID, filtering out past appointments
    db.query(
      `SELECT bookings.booking_id, bookings.organisation_id, bookings.slot_id
   FROM bookings
   INNER JOIN organisation_slots ON bookings.slot_id = organisation_slots.id
   WHERE bookings.user_id = ? AND (organisation_slots.date < ? OR bookings.status = "closed")`,
      [userId, currentDate],
      (err, bookingDetails) => {
        if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if booking details were found
        if (bookingDetails.length === 0) {
          return res.status(404).json({ error: 'No appointments found' });
        }

        // Function to fetch details for a single booking
        const fetchBookingDetails = (bookingDetail, callback) => {
          const { organisation_id, slot_id } = bookingDetail;

          // Fetch organisation name
          db.query(
            `SELECT org_name FROM organisations WHERE id = ?`,
            [organisation_id],
            (err, organisation) => {
              if (err) {
                console.error('Error fetching organisation:', err);
                return callback(err);
              }

              // Fetch user name
              db.query(
                `SELECT first_name, last_name FROM user WHERE id = ?`,
                [userId],
                (err, user) => {
                  if (err) {
                    console.error('Error fetching user:', err);
                    return callback(err);
                  }

                  // Fetch slot details (start time and end time)
                  db.query(
                    `SELECT date,start_time, end_time, description FROM organisation_slots WHERE id = ?`,
                    [slot_id],
                    (err, slot) => {
                      if (err) {
                        console.error('Error fetching slot:', err);
                        return callback(err);
                      }
                      const fullName = `${user[0].first_name} ${user[0].last_name}`;
                      // Combine all details into an appointment object
                      const appointment = {
                        booking_id: bookingDetail.booking_id,
                        organisation_name: organisation[0].org_name,
                        user_name: fullName,
                        date: formatDate(slot[0].date),
                        start_time: slot[0].start_time,
                        end_time: slot[0].end_time,
                        description: slot[0].description,
                      };
                      function formatDate(dateString) {
                        const date = new Date(dateString);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      }
                      // Add appointment to the appointments array
                      callback(null, appointment);
                    }
                  );
                }
              );
            }
          );
        };

        // Array to hold all appointments
        const appointments = [];

        // Process each booking detail
        async.eachSeries(
          bookingDetails,
          (bookingDetail, callback) => {
            fetchBookingDetails(bookingDetail, (err, appointment) => {
              if (err) {
                return callback(err);
              }
              appointments.push(appointment);
              callback();
            });
          },
          (err) => {
            if (err) {
              console.error('Error processing appointments:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(appointments);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to fetch all cancelled appointments based on user ID from JWT token
app.get('/cancelled-appointments', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('User ID:', userId);
    const currentDate = new Date().toISOString().split('T')[0];
    // Query the database for all booking details associated with the user ID, filtering out past appointments
    db.query(
      `SELECT bookings.booking_id, bookings.organisation_id, bookings.slot_id
   FROM bookings
   INNER JOIN organisation_slots ON bookings.slot_id = organisation_slots.id
   WHERE bookings.user_id = ? AND bookings.status = "cancelled"`,
      [userId],
      (err, bookingDetails) => {
        if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if booking details were found
        if (bookingDetails.length === 0) {
          return res.status(404).json({ error: 'No appointments found' });
        }

        // Function to fetch details for a single booking
        const fetchBookingDetails = (bookingDetail, callback) => {
          const { organisation_id, slot_id } = bookingDetail;

          // Fetch organisation name
          db.query(
            `SELECT org_name FROM organisations WHERE id = ?`,
            [organisation_id],
            (err, organisation) => {
              if (err) {
                console.error('Error fetching organisation:', err);
                return callback(err);
              }

              // Fetch user name
              db.query(
                `SELECT first_name, last_name FROM user WHERE id = ?`,
                [userId],
                (err, user) => {
                  if (err) {
                    console.error('Error fetching user:', err);
                    return callback(err);
                  }

                  // Fetch slot details (start time and end time)
                  db.query(
                    `SELECT date,start_time, end_time, description FROM organisation_slots WHERE id = ?`,
                    [slot_id],
                    (err, slot) => {
                      if (err) {
                        console.error('Error fetching slot:', err);
                        return callback(err);
                      }
                      const fullName = `${user[0].first_name} ${user[0].last_name}`;
                      // Combine all details into an appointment object
                      const appointment = {
                        booking_id: bookingDetail.booking_id,
                        organisation_name: organisation[0].org_name,
                        user_name: fullName,
                        date: formatDate(slot[0].date),
                        start_time: slot[0].start_time,
                        end_time: slot[0].end_time,
                        description: slot[0].description,
                      };
                      function formatDate(dateString) {
                        const date = new Date(dateString);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      }
                      // Add appointment to the appointments array
                      callback(null, appointment);
                    }
                  );
                }
              );
            }
          );
        };

        // Array to hold all appointments
        const appointments = [];

        // Process each booking detail
        async.eachSeries(
          bookingDetails,
          (bookingDetail, callback) => {
            fetchBookingDetails(bookingDetail, (err, appointment) => {
              if (err) {
                return callback(err);
              }
              appointments.push(appointment);
              callback();
            });
          },
          (err) => {
            if (err) {
              console.error('Error processing appointments:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(appointments);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to cancel an appointment
app.post('/cancel-appointment', async (req, res) => {
  try {
    const { booking_id, slot_id } = req.body;

    // Update status in organisation_slots table to 'available'
    db.query('UPDATE organisation_slots SET status = "available" WHERE id = ?', [slot_id]);

    // Update status in bookings table to 'cancelled'
    db.query('UPDATE bookings SET status = "cancelled" WHERE booking_id = ?', [booking_id]);
    console.log('Appointment Cancelled succesfully');
    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});


//------------------------------------------------------------------------------------------
//__________________________________________________________________________________________
//Admin Apis

//  Organisation Registration endpoint
app.post('/orgregister', async (req, res) => {
  const { orgName, orgrName, email, password,cnfPassword, orgSince, orgType, address, city, pincode, captchaResponse } = req.body;
  // Verify CAPTCHA response
  const secretKey = '6LcNJKApAAAAAHJLkw56qPE06CQOJeVHEioHeD0f'; // Replace with your reCAPTCHA secret key
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
  if (password !== cnfPassword) {
    return res.status(400).json({ error: ' Password and confirm password do not match' });
  }
  try {
    const captchaVerificationResponse = await axios.post(url);
    if (captchaVerificationResponse.data.success) {
      // CAPTCHA verification successful, proceed with registration 
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
    } else {
      // CAPTCHA verification failed
      res.status(400).send('CAPTCHA verification failed');
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).send('Internal Server Error');
  }
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
      const org = results[0];

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, org.password);

      if (isPasswordValid) {
        const token = jwt.sign({ orgId: org.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
        // res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
  });
});
// User profile route
app.get('/org-profile', authenticateToken, (req, res) => {
  const orgId = req.user.orgId;
  // Retrieve user profile details from the database based on userId
  db.query('SELECT * FROM organisations WHERE id = ?', [orgId], (err, results) => {
    if (err) {
      console.error('Error retrieving org profile:', err);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(404).send('organisation profile not found');
    } else {
      const orgProfile = results[0];
      if (orgProfile.image) {
        // Convert image data to base64-encoded string
        const base64Image = Buffer.from(orgProfile.image).toString('base64');
        // Include base64-encoded image data in the organisation object
        orgProfile.imageBase64 = base64Image;
      }
      //console.log('profile:', orgProfile)
      res.status(200).json(orgProfile);

    }
  });
});


//Api to fetch org appointments
app.get('/org-appointments', authenticateToken, (req, res) => {
  try {
    const orgId = req.user.orgId;
    console.log('org ID:', orgId);
    const currentDate = new Date().toISOString().split('T')[0];

    // Query the database for all booking details associated with the user ID, filtering out past appointments
    db.query(
      `SELECT bookings.booking_id, bookings.user_id, bookings.slot_id
   FROM bookings
   INNER JOIN organisation_slots ON bookings.slot_id = organisation_slots.id
   WHERE bookings.organisation_id = ? AND organisation_slots.date >= ? AND bookings.status= "open"`,
      [orgId, currentDate],

      (err, bookingDetails) => {
        if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if booking details were found
        if (bookingDetails.length === 0) {
          return res.status(404).json({ error: 'No appointments found' });
        }

        // Function to fetch details for a single booking
        const fetchBookingDetails = (bookingDetail, callback) => {
          const { user_id, slot_id } = bookingDetail;

          // Fetch organisation name
          db.query(
            `SELECT org_name FROM organisations WHERE id = ?`,
            [orgId],
            (err, organisation) => {
              if (err) {
                console.error('Error fetching organisation:', err);
                return callback(err);
              }

              // Fetch user name
              db.query(
                `SELECT first_name,last_name FROM user WHERE id = ?`,
                [user_id],
                (err, user) => {
                  if (err) {
                    console.error('Error fetching user:', err);
                    return callback(err);
                  }

                  // Fetch slot details (start time and end time)
                  db.query(
                    `SELECT date,start_time, end_time FROM organisation_slots WHERE id = ?`,
                    [slot_id],
                    (err, slot) => {
                      if (err) {
                        console.error('Error fetching slot:', err);
                        return callback(err);
                      }
                      const fullName = `${user[0].first_name} ${user[0].last_name}`;
                      // Combine all details into an appointment object
                      const appointment = {
                        booking_id: bookingDetail.booking_id,
                        organisation_name: organisation[0].org_name,
                        user_name: fullName,
                        date: formatDate(slot[0].date),
                        start_time: slot[0].start_time,
                        end_time: slot[0].end_time,
                      };
                      function formatDate(dateString) {
                        const date = new Date(dateString);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      }
                      // Add appointment to the appointments array
                      callback(null, appointment);
                    }
                  );
                }
              );
            }
          );
        };

        // Array to hold all appointments
        const appointments = [];

        // Process each booking detail
        async.eachSeries(
          bookingDetails,
          (bookingDetail, callback) => {
            fetchBookingDetails(bookingDetail, (err, appointment) => {
              if (err) {
                return callback(err);
              }
              appointments.push(appointment);
              callback();
            });
          },
          (err) => {
            if (err) {
              console.error('Error processing appointments:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(appointments);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to fetch all user appointments based on user ID from JWT token
app.get('/org-history', authenticateToken, (req, res) => {
  try {
    const orgId = req.user.orgId;
    console.log('org ID:', orgId);
    const currentDate = new Date().toISOString().split('T')[0];
    // Query the database for all booking details associated with the user ID, filtering out past appointments
    db.query(
      `SELECT bookings.booking_id, bookings.user_id, bookings.slot_id
   FROM bookings
   INNER JOIN organisation_slots ON bookings.slot_id = organisation_slots.id
   WHERE bookings.organisation_id = ? AND (organisation_slots.date < ? OR bookings.status= "closed")`,
      [orgId, currentDate],
      (err, bookingDetails) => {
        if (err) {
          console.error('Error fetching booking details:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if booking details were found
        if (bookingDetails.length === 0) {
          return res.status(404).json({ error: 'No appointments found' });
        }

        // Function to fetch details for a single booking
        const fetchBookingDetails = (bookingDetail, callback) => {
          const { user_id, slot_id } = bookingDetail;

          // Fetch organisation name
          db.query(
            `SELECT org_name FROM organisations WHERE id = ?`,
            [orgId],
            (err, organisation) => {
              if (err) {
                console.error('Error fetching organisation:', err);
                return callback(err);
              }

              // Fetch user name
              db.query(
                `SELECT first_name, last_name FROM user WHERE id = ?`,
                [user_id],
                (err, user) => {
                  //console.log(user); // Check the value of user

                  if (err) {
                    console.error('Error fetching user:', err);
                    return callback(err);
                  }

                  // Fetch slot details (start time and end time)
                  db.query(
                    `SELECT date,start_time, end_time FROM organisation_slots WHERE id = ?`,
                    [slot_id],
                    (err, slot) => {
                      if (err) {
                        console.error('Error fetching slot:', err);
                        return callback(err);
                      }
                      const fullName = user && user[0] ? `${user[0].first_name} ${user[0].last_name}` : 'Unknown';

                      // const fullName = `${user[0].first_name} ${user[0].last_name}`;
                      // Combine all details into an appointment object
                      const appointment = {
                        booking_id: bookingDetail.booking_id,
                        organisation_name: organisation[0].org_name,
                        user_name: fullName,
                        date: formatDate(slot[0].date),
                        start_time: slot[0].start_time,
                        end_time: slot[0].end_time,
                      };
                      function formatDate(dateString) {
                        const date = new Date(dateString);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      }
                      // Add appointment to the appointments array
                      callback(null, appointment);
                    }
                  );
                }
              );
            }
          );
        };

        // Array to hold all appointments
        const appointments = [];

        // Process each booking detail
        async.eachSeries(
          bookingDetails,
          (bookingDetail, callback) => {
            fetchBookingDetails(bookingDetail, (err, appointment) => {
              if (err) {
                return callback(err);
              }
              appointments.push(appointment);
              callback();
            });
          },
          (err) => {
            if (err) {
              console.error('Error processing appointments:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(appointments);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to insert appointment slot
app.post('/update-appointment-slot', (req, res) => {
  try {
    // Extract data from the request body
    const { organisationId, date, startTime, endTime, numSlots ,description} = req.body;

    // Extract organization_id from the request headers
    // const organisationId = req.headers.organisationid;
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }

    // Parse start time and end time into 24-hour format
    const parseTimeTo24HourFormat = (timeString) => {
      const [time, modifier] = timeString.split(' ');

      let [hours, minutes] = time.split(':');

      if (modifier === 'PM' && hours < 12) {
        hours = parseInt(hours, 10) + 12;
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }

      return `${hours}:${minutes}:00`;
    };
    
    // Calculate slot duration
    const startDateTime = new Date(`${date} ${startTime}`);
    const endDateTime = new Date(`${date} ${endTime}`);
    const slotDuration = (endDateTime - startDateTime) / numSlots;

    // Prepare an array to hold slot data
    const slotData = [];

    // Generate slot data for each slot
    for (let i = 0; i < numSlots; i++) {
      const slotStartTime = new Date(startDateTime.getTime() + i * slotDuration);
      const slotEndTime = new Date(slotStartTime.getTime() + slotDuration);
     
      // Format start time and end time in MySQL-compatible format (HH:mm:ss)
      const formattedStartTime = parseTimeTo24HourFormat(slotStartTime.toLocaleTimeString('en-US', { hour12: true }));
      const formattedEndTime = parseTimeTo24HourFormat(slotEndTime.toLocaleTimeString('en-US', { hour12: true }));
      slotData.push([organisationId, formatDate(date), formattedStartTime, formattedEndTime, "available",description]);
    }

    // Insert data into the organisation_slots table
    db.query(
      'INSERT INTO organisation_slots (organisation_id, date, start_time, end_time, status, description) VALUES ?',
      [slotData],
      (error, results, fields) => {
        if (error) {
          console.error('Failed to insert appointment slot:', error);
          res.status(500).json({ success: false, message: 'Failed to insert appointment slot' });
        } else {
          console.log('Appointment slot inserted successfully');
          res.status(200).json({ success: true, message: 'Appointment slot inserted successfully' });
        }
      }
    );
  } catch (error) {
    console.error('Error while updating appointment slot:', error);
    res.status(500).json({ success: false, message: 'Error while updating appointment slot' });
  }
});

// API endpoint to update slot status to "dropped"
app.post('/drop-slot', (req, res) => {

  const { slotId, status } = req.body;
  // Your logic to update the slot status to "dropped" in the database
  db.query('UPDATE organisation_slots SET status = ? WHERE id = ?', [status, slotId], (error, results) => {
    if (error) {
      console.error('Error dropping slot:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Slot dropped successfully');
    }
  });

});
// Configure multer for handling file uploads
const upload = multer({ dest: 'D:/42Main/ams/orgimage' }); // Change the destination folder as per your setup

// API endpoint for uploading and inserting image
app.post('/upload-image/:orgId', upload.single('image'), (req, res) => {
  const { orgId } = req.params;
  const imagePath = req.file.path; // File path where the image is stored

  // Read the image file
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error('Error reading image file:', err);
      res.status(500).json({ error: 'Failed to upload image' });
      return;
    }

    // Construct the SQL query to update the image for the organization
    const sql = `UPDATE organisations SET image = ? WHERE id = ?`;

    // Execute the query with the image data
    db.query(sql, [data, orgId], (err, result) => {
      if (err) {
        console.error('Error inserting image:', err);
        res.status(500).json({ error: 'Failed to upload image' });
      } else {
        console.log('Image uploaded successfully');
        res.status(200).json({ message: 'Image uploaded successfully' });
      }
    });
  });
});

// Org Forgot Password endpoint
app.post('/orgforgot-password', async (req, res) => {
  const { username, orgsince, newPassword, confirmNewPassword, captchaResponse } = req.body;
  const inputDateTimeString = orgsince;
  const inputDate = new Date(inputDateTimeString);
  const formattedDate = inputDate.toISOString().split('T')[0];
  // Verify CAPTCHA response
  const secretKey = '6LcNJKApAAAAAHJLkw56qPE06CQOJeVHEioHeD0f'; // Replace with your reCAPTCHA secret key
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;
  // Validate if new password and confirm password match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match' });
  }
  try {
    const captchaVerificationResponse = await axios.post(url);
    if (captchaVerificationResponse.data.success) {
      // CAPTCHA verification successful, proceed with registration
      // Find the user in the database based on username and date of birth
      const findUserQuery = 'SELECT * FROM organisations WHERE email = ? AND org_since = ?';
      db.query(findUserQuery, [username, formattedDate], async (err, results) => {
        if (err) {
          console.error('Failed to execute query:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
          console.log(dateOfBirth, "formattedDate", formattedDate);
          return res.status(401).json({ error: 'Invalid username or Organisations since' });

        }

        const user = results[0];

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        const updatePasswordQuery = 'UPDATE organisations SET password = ? WHERE id = ?';
        db.query(updatePasswordQuery, [hashedPassword, user.id], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Failed to update password:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.status(200).json({ message: 'Password reset successful' });
        });
      });
    } else {
      // CAPTCHA verification failed
      res.status(400).send('CAPTCHA verification failed');
    }
  } catch (error) {
    console.error('Error verifying CAPTCHA:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to update slot status to "dropped"
app.post('/close-appointment/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // Your logic to update the slot status to "dropped" in the database
  db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id], (error, results) => {
    if (error) {
      console.error('Error Closing Appointment:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Appointment Closed successfully');
    }
  });

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

