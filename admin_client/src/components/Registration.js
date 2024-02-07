// Registration.js
import React, { useState } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomDatePicker from './utils/CustomDatePicker';

const Registration = () => {
  const [orgName, setOrgName] = useState('');
  const [orgrName, setOrgrName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const [orgSince, setOrgSince] = useState('');
  const [orgType, setOrgType] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleRegister = async () => {
    const postData = {
      email: email,
      orgName: orgName,
      orgrName: orgrName,
      password: password,
      orgSince: orgSince,
      orgType: orgType,
      address: address,
      city: city,
      pincode: pincode,
    };

    try {
      const response = await axios.post('http://localhost:5000/orgregister', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
      setResponseMessage(response.data);
      navigate('/RegSuccess');
    } catch (error) {
      console.error('Error:', error.message);
    }
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
              label="Organisation Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Organiser Name"
              value={orgrName}
              onChange={(e) => setOrgrName(e.target.value)}
            /><TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Organisation Type"
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </Grid>
            </Grid>
            <CustomDatePicker
              label="Organisation Since"
              value={orgSince}
              // setDateOfBirth={setDateOfBirth}
              onChange={(newDate) => setOrgSince(newDate)}
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
            {responseMessage && (
              <Typography variant="body2" color={responseMessage.includes('successfully') ? 'success' : 'error'} mt={2}>
                {responseMessage}
              </Typography>
            )}
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
