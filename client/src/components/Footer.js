// Footer.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Container component="footer" maxWidth="xl" align="center">
      <Typography variant="body2" color="textSecondary">
        Your App © {new Date().getFullYear()}
      </Typography>
    </Container>
  );
};

export default Footer;
