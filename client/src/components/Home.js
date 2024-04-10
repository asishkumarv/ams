import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from './../AppLayout';
import { Button, Typography, Grid, Paper, IconButton } from '@mui/material';
import HomeBg from './Assets/HomeBg.jpg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  const slides = [
    {
      title: 'Welcome to AMS App',
      content: 'Book Now!',
      action: 'dashboard',
    },
    {
      title: 'It is a Platform that provides Appointment management system for a wide range of Organizations',
      content: '',
      action: null,
    },
    {
      title: 'To know more about us click here',
      content: 'Click here',
      action: 'about',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [timer, setTimer] = useState(null);

  const goToNextSlide = useCallback(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextSlide);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 3000);
    setTimer(interval);
    return () => clearInterval(interval);
  }, [currentSlide, goToNextSlide]);

  const goToPreviousSlide = () => {
    const prevSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    setCurrentSlide(prevSlide);
  };

  const handleActionClick = () => {
    const action = slides[currentSlide].action;
    if (action === 'dashboard') {
      const token = localStorage.getItem('jwtToken');
      const redirectUrl = token ? '/dashboard' : '/login';
      window.location.href = redirectUrl;
    } else if (action === 'about') {
      window.location.href = '/about';
    }
  };

  const handleBookNowClick = () => {
    const token = localStorage.getItem('jwtToken');
    const redirectUrl = token ? '/dashboard' : '/login';
    window.location.href = redirectUrl;
  };

  const handlePause = () => {
    clearInterval(timer);
  };

  const handleResume = () => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 3000);
    setTimer(interval);
  };

  return (
    <Grid
      style={{
        textAlign: 'center',
        backgroundImage: `url(${HomeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '120vh',
        position: 'relative',
      }}
    >
      <AppLayout>
        <div style={{ marginTop: '20px' }}>
          <Paper elevation={3} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', background: 'rgba(255, 255, 255, 0.8)', maxWidth: '40%', margin: '0 auto', position: 'relative', height: '150px' }}>
            <IconButton color="primary"
              style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', zIndex: '1' }}
              onClick={goToPreviousSlide}
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton color="primary"
              style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', zIndex: '1' }}
              onClick={goToNextSlide}
              onMouseEnter={handlePause}
              onMouseLeave={handleResume}
            >
              <ArrowForwardIcon />
            </IconButton>
            <Typography variant="h4" color="#1565c0" style={{ fontSize: currentSlide === 0 ? '30px' : '20px' }}>
              {slides[currentSlide].title}
            </Typography>
            <Typography color="Red" style={{ fontSize: currentSlide === 0 ? 'inherit' : '16px' }}>
              {slides[currentSlide].content}
            </Typography>
            {slides[currentSlide].action && (
              <Button variant="contained" color="primary" style={{ color: 'white', marginTop: '10px' }} onClick={handleActionClick}>
                {slides[currentSlide].content}
              </Button>
            )}
          </Paper>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleBookNowClick}>
            Book Now
          </Button>
        </div>
      </AppLayout>
    </Grid>
  );
};

export default Home;
