import React from 'react';

const TimePicker = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Ensure that value is always defined
  const safeValue = value || '';

  return (
    <div>
      <label>{label}</label>
      <input 
        type="time" 
        value={safeValue} 
        onChange={handleChange} 
      />
    </div>
  );
};

export default TimePicker;
