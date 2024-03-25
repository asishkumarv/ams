// Header.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import HeaderButton from './utils/HeaderButton';
import HeaderHomeButton from './utils/HeaderHomeButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import PositionedMenuButton from './utils/PositionedMenuButton';
const Header = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const [orgProfile, setorgProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtTokenA');
    if (token) {
      axios.get('http://localhost:5000/org-profile', {
        headers: {
          Authorization: token
        }
      })
        .then(response => setorgProfile(response.data))
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
      <HeaderButton to="/login" label="Login" />
      <HeaderButton to="/registration" label="Sign Up" />
    </Box>
  );

  const renderOrgProfile = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
      <IconButton color="inherit" onClick={handleUserIconClick}>
        <AccountCircleIcon />
      </IconButton>
      <Typography variant="h6" style={{ color: 'inherit', marginLeft: '1px', marginRight: '6px', cursor: 'pointer' }} onClick={handleUserIconClick}>
        {orgProfile ? orgProfile.org_name : ''}
      </Typography>
    </Box>
  );

  const drawerContent = (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '0px' }}>
    {orgProfile ? renderOrgProfile() : renderLoginSignUp()}
  </Box>
    <List>
      <ListItem button key="home">
        <HeaderHomeButton to="/" label="Home" />
      </ListItem>
      {!orgProfile && (
        <ListItem>
          <HeaderButton to="/login" label="Login" />
        </ListItem>
      )}
      {/* <ListItem button key="menu">
        <HeaderButton to="/menu" label="Menu" />
      </ListItem> */}
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
    <div style={{ backgroundColor: theme.palette.primary.main }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ color: 'white' }} >AMS Admin</Typography>

          {isMobile ? (
            // Render menu icon for mobile
            <Box sx={{ marginLeft: 'auto' }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            </Box>
          ) : (
            // Render buttons for desktop
            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, ml: '60px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>

                <HeaderHomeButton to="/" label="Home" />

                {/* <HeaderButton to="/menu" label="Menu" /> */}
                <HeaderButton to="/services" label="Services" />
                <HeaderButton to="/contact" label="Contact Us" />
                <HeaderButton to="/about" label="About Us" />

              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? null : (orgProfile ? renderOrgProfile() : renderLoginSignUp())}
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
