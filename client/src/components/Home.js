// Home.js
import React from 'react';
import AppLayout from './../AppLayout';
//import { Link as RouterLink } from 'react-router-dom';
// import axios from 'axios';
import { Button, Typography, Grid } from '@mui/material';
import HomeBg from './Assets/HomeBg.jpg'

const Home = () => {

  const handleBookNowClick = () => {
    // Check if JWT token exists in local storage
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Redirect to the dashboard page if token exists
      window.location.href = '/dashboard';
    } else {
      // Redirect to the login page if token doesn't exist
      window.location.href = '/login';
    }
  };

  return (
    <Grid style={{
      textAlign: 'center',
      backgroundImage: `url(${HomeBg})`, // Set background image
      backgroundSize: 'cover', // Make sure the image covers the entire container
      backgroundPosition: 'center', // Center the image
      minHeight: '120vh', // Ensure the layout covers the full viewport height
      position: 'relative', // Set position to relative to position the header and footer
    }}>
    <AppLayout >

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>

        <Button variant="contained" color="primary" style={{ color: 'white' }} onClick={handleBookNowClick}>
          Book Now!
        </Button>

      </div>
      <div >
        
        <Typography variant="h4" color="#1565c0">Welcome to AMS App</Typography>
        <Typography color="Red">
          It is a Platform that provides Appointment management system for a very range of Organisations
        </Typography>
        
      </div>

      


    </AppLayout>
    </Grid>
  );
};

export default Home;
