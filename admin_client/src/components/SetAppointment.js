import React, { useState } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import CustomDatePicker from './utils/CustomDatePicker';
import Applayout from './../AppLayout';
import CustomTimePicker from './utils/CustomTimePicker';
import axios from 'axios';
const SetAppointment = () => {
    // State variables for date and time
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    // Function to handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Function to handle time change
    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    // Function to update appointment slot
    const updateAppointmentSlot = async () => {
        try {
            // Prepare data for the API request
            const requestData = {
                date: selectedDate,
                startTime: selectedTime,
                endTime: selectedTime, // You might want to change this if endTime is different
            };

            // Get JWT token from local storage
            const jwtToken = localStorage.getItem('jwtTokenA');

            // Make API call to update appointment slot
            await axios.post('http://localhost:5000/update-appointment-slot', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'OrganisationId': jwtToken, // Include JWT token in request headers
                },
            });

            // Show success message to the user
            alert('Appointment slot updated successfully');
        } catch (error) {
            // Show error message to the user if the API call fails
            alert('Failed to update appointment slot. Please try again later.');
            console.error(error);
        }
    };


    return (
        <Applayout>
            <div >
                <Typography variant="h5">Update Appointment Slot</Typography>

                <Grid container spacing={0} alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Select Date:</Typography>
                    </Grid>

                    <CustomDatePicker label="Select Date" onChange={handleDateChange} value={selectedDate} />

                </Grid>
                <Grid container spacing={0} alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Select Time:</Typography>
                    </Grid>

                    <CustomTimePicker label="Select start time" onChange={handleTimeChange} value={selectedTime} />

                    <CustomTimePicker label="Select end time" onChange={handleTimeChange} value={selectedTime} />



                </Grid>

                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={updateAppointmentSlot}>
                        Update Slot
                    </Button>
                </Box>
            </div>
        </Applayout>
    );
};

export default SetAppointment;
