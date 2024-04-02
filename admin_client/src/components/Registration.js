// Registration.js
import React, { useState, useRef } from 'react';
import AppLayout from './../AppLayout';
import { Container, Typography, TextField, Button, Link, Grid, useTheme, InputAdornment, IconButton,
  MenuItem,
  FormControl,
  Select,
  InputLabel, } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from './utils/DatePicker';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Registration = () => {
  const [orgName, setOrgName] = useState('');
  const [orgrName, setOrgrName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const theme = useTheme();
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const [orgSince, setOrgSince] = useState('');
  const [orgType, setOrgType] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [captchaResponse, setCaptchaResponse] = useState('');
  const recaptchaRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  //const [citySuggestions, setCitySuggestions] = useState([]);
  const [otherOrgType, setOtherOrgType] = useState('');


    // Define array of organization types
    const organizationTypes = [
      'Medical',
      'Restaurant',
      'Office',
      'Saloon',
      'Parlour',
      'Banking',
      'Other', // Add "Other" option to the list
    ];

    const handleOrgTypeChange = (event) => {
      const value = event.target.value;
      if (value === 'Other') {
        setOrgType(value); // Set organization type to "Other"
      } else {
        setOrgType(value); // Set organization type to selected option
      }
    };
  const handlePincodeChange = async (e) => {
    const newPincode = e.target.value;
    setPincode(newPincode);

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${newPincode}`);

      // Extract city name from the response
      const cityName = response.data[0].PostOffice[0].District;

      // Update city field with the retrieved city name
      setCity(cityName);
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };


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
      orgName: orgName,
      orgrName: orgrName,
      password: password,
      cnfPassword: cnfPassword,
      orgSince: orgSince,
      orgType: orgType,
      address: address,
      city: city,
      pincode: pincode,
      captchaResponse: captchaResponse
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
            Admin Registration
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
            />
            <Grid container spacing={1}>
              <Grid item xs={6} mt={2}>
                <DatePicker
                  label="Organisation Since"
                  value={orgSince}
                  onChange={(newDate) => setOrgSince(newDate)}
                />
              </Grid>
              <Grid item xs={6} mt={1}>
              <FormControl fullWidth>
            <InputLabel id="organization-type-label" style={{ marginBottom: '8px' }}>Organisation Type</InputLabel>
            <Select
              labelId="organization-type-label"
              id="organization-type"
              value={orgType}
              onChange={handleOrgTypeChange}
              required
              style={{ marginTop: '8px' }}
            >
              {organizationTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Allow user to type their own organization type if "Other" is selected */}
          {orgType === 'Other' && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Other Organization Type"
              value={otherOrgType}
              onChange={(e) => setOtherOrgType(e.target.value)}
            />
          )}
              </Grid>

            </Grid>
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
                 // onInputChange={(e) => handleCityInputChange(e.target.value)}
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
                  onChange={handlePincodeChange}
                />
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
