// Login.js
import React, { useState } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';  // Added missing imports

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  //   const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    // Add your authentication logic here
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
              type="password"
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
