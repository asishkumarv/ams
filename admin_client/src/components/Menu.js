// Menu.js
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const Menu = () => {
  const menuItems = ['Home', 'About', 'Services', 'Contact'];

  return (
    <List component="nav">
      {menuItems.map((item) => (
        <ListItem button key={item}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
};

export default Menu;
