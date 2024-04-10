import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import AppLayout from './../AppLayout';
import axios from 'axios';

const Contact = () => {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the entered email exists in the user table
      const response = await axios.get(`http://localhost:5000/users?email=${username}`);

      if (response.data.length === 0) {
        setErrorMessage('User with this email does not exist.');
        setOpenSnackbar(true);
        return;
      }

      // If the user exists, save the feedback
      const userId = response.data[0].id;
      await axios.post('http://localhost:5000/feedback', { userId, email: username, description });

      // Feedback saved successfully
      setSuccessMessage('Feedback saved successfully and You will get response in user dashboard');
      setOpenSnackbar(true);

      // Reset form fields
      setUsername('');
      setDescription('');
    } catch (error) {
      console.error('Error saving feedback:', error);
      // Handle error, show error message, etc.
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <AppLayout>
      <Grid container justifyContent="center" alignItems="flex-start" style={{ marginTop: '20px' }}>
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  label="Username (Email)"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
                  label="Description"
                  multiline
                  fullWidth
                  rows={4} // Increase the height of the description box
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} align="center">
                {errorMessage && (
                  <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" onClose={() => setSuccessMessage('')}>
                    {successMessage}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default Contact;
