import React, { useState } from 'react';

const TimePicker = ({ label, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="time" value={value} onChange={handleChange} />
    </div>
  );
};

export default TimePicker;
