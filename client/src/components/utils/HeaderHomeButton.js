import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeaderHomeButton = ({ to, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to === 'home') {
      navigate('/');
    } else {
      navigate(to);
    }
  };

  return (
    <Button onClick={handleClick} color="inherit">
      {label}
    </Button>
  );
};

export default HeaderHomeButton;