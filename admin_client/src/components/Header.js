// Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import HeaderButton from './utils/HeaderButton';
import HeaderHomeButton from './utils/HeaderHomeButton';
// import PositionedMenuButton from './utils/PositionedMenuButton';
const Header = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <List>
      <ListItem button key="home">
        <HeaderHomeButton to="/" label="Home" />
      </ListItem>
      <ListItem>
      <HeaderButton to="/login" label="Login" />
      </ListItem>
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
  );

  return (
    <div style={{ backgroundColor: theme.palette.primary.main }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ color: 'white' }} >AMS Admin</Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            {isMobile ? (
              // Render menu icon for mobile
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              // Render buttons for desktop
              <>
                <HeaderHomeButton to="/" label="Home" />
                <HeaderButton to="/login" label="Login" />
                {/* <HeaderButton to="/menu" label="Menu" /> */}
                <HeaderButton to="/services" label="Services" />
                <HeaderButton to="/contact" label="Contact Us" />
                <HeaderButton to="/about" label="About Us" />
              </>
            )}
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
