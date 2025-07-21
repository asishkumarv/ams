// Registration.js
import React, { useState, useRef } from 'react';
import AppLayout from './../AppLayout';
import {
  Container, Typography, TextField, Button, Link, Grid, useTheme, InputAdornment, IconButton,
  // MenuItem,
  // FormControl,
  // Select,
  // InputLabel,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Registration = () => {

  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const theme = useTheme();
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
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
      adminName: adminName,
      secretCode: secretCode,
      password: password,
      cnfPassword: cnfPassword,
      captchaResponse: captchaResponse
    };

    try {
      const response = await axios.post('http://localhost:5000/adminregister', postData, {
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
            Admin Registration
          </Typography>
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Admin Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
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
              label="Secret Code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
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
