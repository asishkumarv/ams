import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {  useNavigate } from 'react-router-dom';
import HeaderButton from './utils/HeaderButton';
import PositionedMenuButton from './utils/PositionedMenuButton';
import axios from 'axios';

const Header = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios.get('http://localhost:5000/user-profile', {
        headers: {
          Authorization: token
        }
      })
        .then(response => setUserProfile(response.data))
        .catch(error => console.error(error));
    }
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleUserIconClick = () => {
    navigate('/dashboard');
  };

  const renderLoginSignUp = () => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      
      <PositionedMenuButton
            label="Login"
            menuItems={[
              { label: 'Login as User', link: '/login' },
              { label: 'Login as Organisation', link: 'http://localhost:3001/login' },
            ]}
          />
      <HeaderButton to="/registration" label="Sign Up" />
    </Box>
  );

  const renderUserProfile = () => (
    <Box sx={{ display: 'flex', alignItems: 'center',color:'inherit' }}>
      <IconButton color="inherit" onClick={handleUserIconClick}>
        <AccountCircleIcon />
      </IconButton>
      <Typography variant="h6" style={{ color: 'inherit', marginLeft: '1px', marginRight: '6px',cursor: 'pointer' }} onClick={handleUserIconClick}>
        {userProfile ? userProfile.full_name : ''}
      </Typography>
    </Box>
  );

  const drawerContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
        {userProfile ? renderUserProfile() : renderLoginSignUp()}
      </Box>
      <List>
        <ListItem button key="home">
          <HeaderButton to="/" label="Home" />
        </ListItem>
        {!userProfile && (
        <ListItem>
          <PositionedMenuButton
            label="Login"
            menuItems={[
              { label: 'Login as User', link: '/login' },
              { label: 'Login as Organisation', link: 'http://localhost:3001/login' },
            ]}
          />
        </ListItem>
      )}
        <ListItem button key="menu">
          <HeaderButton to="/menu" label="Menu" />
        </ListItem>
        <ListItem button key="services">
          <HeaderButton to="/services" label="Services" />
        </ListItem>
        <ListItem button key="contact">
          <HeaderButton to="/contact" label="Contact Us" />
        </ListItem>
        <ListItem button key="about">
          <HeaderButton to="/about" label="About Us" />
        </ListItem>
      </List>
    </>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" >
            AMS
          </Typography>
          {isMobile ? (
            <Box sx={{ marginLeft: 'auto' }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, ml: '60px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HeaderButton to="/" label="Home" />
                <HeaderButton to="/menu" label="Menu" />
                <HeaderButton to="/services" label="Services" />
                <HeaderButton to="/contact" label="Contact Us" />
                <HeaderButton to="/about" label="About Us" />
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? null : (userProfile ? renderUserProfile() : renderLoginSignUp())}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default Header;
