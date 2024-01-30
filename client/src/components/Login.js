// Login.js
import React, { useState } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';  // Added missing imports
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const postData = {
      // Initialize your state for the POST data
      username: username,
      password: password,
      // ... add more key-value pairs as needed
    };
    try {
      const response = await axios.post('http://localhost:5000/login',  postData, {
        // Optional headers
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
      });
      console.log(response.data);

      // Redirect to login success page upon successful login
      navigate('/loginsuccess');
    } catch (error) {
      console.log('Login failed:', error.response.data);
      // Handle login failure, e.g., show an error message
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password clicked');
    // Add logic to handle forgotten password (e.g., show a modal)
  };

  //   const handleCreateAccount = () => {
  //     navigate('/registration');
  //   };

  return (
    <AppLayout>
      <Container component="main" maxWidth="xs">
        <div>
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center', color: theme.palette.primary.main }}>
            Login!
          </Typography>
          <form>
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
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"cd
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Link component="button" variant="body2" onClick={handleForgotPassword}>
                  Forgot Password?
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
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
