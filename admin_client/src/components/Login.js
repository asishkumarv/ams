// Login.js
import React, { useState } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';  // Added missing imports
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    const postData = {
      // Initialize your state for the POST data
      username: username,
      password: password,
      // ... add more key-value pairs as needed
    };
    try {
      const response = await axios.post('http://localhost:5000/orglogin', postData, {
        // Optional headers
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
      });
      console.log(response.data);

      // Redirect to login success page upon successful login
      navigate('/Dashboard');
    } catch (error) {
      console.log('Login failed:', error.response.data);
      console.log('Login failed:', error.response.data);
      setError('Invalid username or password');// Handle login failure, e.g., show an error message
    }
  };

  // const handleForgotPassword = () => {
  //   console.log('Forgot Password clicked');
  //   // Add logic to handle forgotten password (e.g., show a modal)
  // };

  //   const handleCreateAccount = () => {
  //     navigate('/registration');
  //   };
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    handleLogin(); // Manually trigger the login function
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(); // Simulate a click on the "Sign In" button when Enter is pressed
    }
  }
  return (
    <AppLayout>
      <Container component="main" maxWidth="xs">
        <div>
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center', color: theme.palette.primary.main }}>
            Admin Login!
          </Typography>
          {error && ( // Render error message if error state is not null
            <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleFormSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleEnterKeyPress}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password" cd
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleEnterKeyPress}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Link to="/forgetpassword" variant="body2" component={RouterLink}>
                  Forgot Password?
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="primary" onClick={handleLogin} style={{ color: 'white' }}>
                  Sign In
                </Button>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                {/* Use Link component for navigation */}
                <Link to="/registration" variant="body2" component={RouterLink}>
                  Create New Account
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </AppLayout>
  );
};

export default Login;
