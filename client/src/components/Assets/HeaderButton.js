// HeaderButton.js
import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HeaderButton = ({ to, label }) => {
  
  return (
    <Button component={Link} to={to} color="inherit">
      {label}
    </Button>
  );
};

export default HeaderButton;