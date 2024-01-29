// Registration.js
import React, { useState } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  

  const handleRegister = async () => {
    // Your registration logic here
  };

  return (
    <AppLayout>
      <Container component="main" maxWidth="xs">
        <div>
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center', color: theme.palette.primary.main }}>
            Registration
          </Typography>
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleRegister}>
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </AppLayout>
  );
};

export default Registration;
