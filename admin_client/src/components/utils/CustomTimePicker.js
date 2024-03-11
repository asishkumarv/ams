import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TextField } from '@mui/material';

const CustomMobileTimePicker = ({ label, value, onChange }) => {
    // Customize the appearance of the TextField component
    const textFieldProps = {
        variant: 'outlined',
        fullWidth: true,
        margin: 'normal',
        label: label,
        InputLabelProps: {
            shrink: true,
        },
    };

    return (
        <TimePicker
            renderInput={(props) => <TextField {...props} {...textFieldProps} />}
            label={label}
            value={value}
            onChange={onChange}
            mobile
        />
    );
};

export default CustomMobileTimePicker;
