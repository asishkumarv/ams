// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

import HeaderButton from './utils/HeaderButton';
import HeaderHomeButton from './utils/HeaderHomeButton';
const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">AMS</Typography>
        <Box sx={{ marginLeft: 'auto' }}></Box>
        <HeaderHomeButton to="home" label="Home" />
        <HeaderButton to="/login" label="Login" />
        <HeaderButton to="/menu" label="Menu" />
        <HeaderButton to="/services" label="Services" />
        <HeaderButton to="/contact" label="Contact Us" />
        <HeaderButton to="/about" label="About Us" />
      </Toolbar>

    </AppBar>

  );
};

export default Header;
