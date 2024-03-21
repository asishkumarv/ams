import React from 'react';
import TextField from '@mui/material/TextField';

const DatePicker = ({ label, value, onChange }) => {
  // Function to handle date change
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const adjustedDate = adjustDate(selectedDate);
    onChange(adjustedDate);
  };

  // Function to adjust date by adding one day
  const adjustDate = (date) => {
    const selectedDate = new Date(date);
    //selectedDate.setDate(selectedDate.getDate() + 1); // Add one day
    return selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  };

  return (
    <TextField
      id="date"
      label={label}
      type="date"
      value={value}
      onChange={handleDateChange} // Call handleDateChange instead of onChange directly
      InputLabelProps={{
        shrink: true,
      }}
      
    />
  );
};

export default DatePicker;
