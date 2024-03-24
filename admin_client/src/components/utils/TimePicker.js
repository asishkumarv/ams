import React from 'react';
import TextField from '@mui/material/TextField';

const TimePicker = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Ensure that value is always defined
  const safeValue = value || '';

  return (
    <div>
      <label >{label}</label>
      <TextField 
        type="time" 
        value={safeValue} 
        id="time"
        onChange={handleChange} 
      />
    </div>
  );
};

export default TimePicker;
