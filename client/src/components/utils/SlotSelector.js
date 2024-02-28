import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const SlotPicker = ({ label, slots, value, onChange }) => {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
    >
      {slots.map(slot => (
        <MenuItem key={slot} value={slot}>{slot}</MenuItem>
      ))}
    </TextField>
  );
};

export default SlotPicker;
