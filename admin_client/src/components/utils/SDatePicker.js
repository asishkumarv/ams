import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';

const SDatePicker = ({ label, value, onChange }) => {
  // Function to adjust date
  const adjustDate = (date) => {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(selectedDate.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  // State to store adjusted date value
  const [adjustedValue, setAdjustedValue] = useState('');

  // Function to handle initial date conversion
  useEffect(() => {
    const adjustedDate = adjustDate(value);
    setAdjustedValue(adjustedDate);
  }, [value]);

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  // Function to handle date change
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const adjustedDate = adjustDate(selectedDate);
    onChange(adjustedDate);
    setAdjustedValue(adjustedDate);
  };

  return (
    <TextField
      id="date"
      label={label}
      type="date"
      value={adjustedValue}
      onChange={handleDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        min: tomorrowString // Set the minimum selectable date to tomorrow
      }}
      fullWidth
    />
  );
};

export default SDatePicker;
