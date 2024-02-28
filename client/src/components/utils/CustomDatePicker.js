import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomDatePicker({ label, value, onChange }) {
  
  // Function to handle date change
  const handleDateChange = (newDate) => {
    // Adjust the date by adding one day
    const adjustedDate = newDate.clone().add(1, 'day');
    onChange(adjustedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={label}
          value={value}
          onChange={handleDateChange} // Call handleDateChange instead of onChange directly
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
