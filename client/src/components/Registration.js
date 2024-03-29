// Registration.js
import React, { useState, useRef } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme, InputAdornment, IconButton, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from './utils/DatePicker';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Man, Woman } from '@mui/icons-material';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const theme = useTheme();
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [captchaResponse, setCaptchaResponse] = useState('');
  const recaptchaRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);


  const handleRegister = async () => {
    // Password complexity regex pattern
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    // Validate password complexity
    if (!passwordPattern.test(password)) {
      setResponseMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.');
      return;
    }
    // Check if passwords match
    if (password !== cnfPassword) {
      setResponseMessage('Passwords do not match.');
      return;
    }
    // Clear previous error messages
    setResponseMessage('');

    const postData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      cnfPassword: cnfPassword,
      dateOfBirth: dateOfBirth,
      gender: gender,
      captchaResponse: captchaResponse
    };

    try {
      const response = await axios.post('http://localhost:5000/register', postData, {
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} mt={1}>
                <DatePicker
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(newDate) => setDateOfBirth(newDate)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="male"><Man fontSize="small" style={{ marginRight: '8px' }} />Male</MenuItem>
                  <MenuItem value="female"><Woman fontSize="small" style={{ marginRight: '8px' }} />Female</MenuItem>
                  <MenuItem value="Rather to not-saying"><NotInterestedIcon fontSize="small" style={{ marginRight: '8px' }} />Rather to Not Saying</MenuItem>
                </TextField>
              </Grid>
            </Grid>
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
              label="Set Password"
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type={showCnfPassword ? 'text' : 'password'}
              value={cnfPassword}
              onChange={(e) => setCnfPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCnfPassword(!showCnfPassword)} edge="end">
                      {showCnfPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LcNJKApAAAAAEQwVsIZfr2Cz8LHcAd_N3mcBQBj"
              onChange={setCaptchaResponse}
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
