import React, { useState } from 'react';
import { Typography, Box, Button, Grid, ListItem, List } from '@mui/material';
import DatePicker from './utils/DatePicker';
import TimePicker from './utils/TimePicker';
import Applayout from './../AppLayout';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const SetAppointment = () => {
    // State variables for date and time
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStartTime, setSelectedStartTime] = useState();
    const [selectedEndTime, setSelectedEndTime] = useState();
    // Function to handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Function to handle time change
    const handleStartTimeChange = (time) => {
        setSelectedStartTime(time);
    };
    const handleEndTimeChange = (time) => {
        setSelectedEndTime(time);
    };
    // Get JWT token from local storage
    const jwtToken = localStorage.getItem('jwtTokenA');
    const DecodedjwtToken = jwtDecode(jwtToken);
    const orgId = DecodedjwtToken.orgId;
    // Function to update appointment slot
    const updateAppointmentSlot = async () => {
        try {
            // Prepare data for the API request
            const requestData = {
                organisationId: orgId,
                date: selectedDate,
                startTime: selectedStartTime,
                endTime: selectedEndTime, // You might want to change this if endTime is different
            };
            // Make API call to update appointment slot
            await axios.post('http://localhost:5000/update-appointment-slot', requestData, {
                headers: {
                    'Content-Type': 'application/json'
                    // 'OrganisationId': orgId, // Include JWT token in request headers
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

                    <DatePicker label="Select Date" onChange={handleDateChange} value={selectedDate} />

                </Grid>
                <Grid container spacing={0} alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">Select Time:</Typography>
                    </Grid>
                    <List>
                        <ListItem >
                            <TimePicker label="Start time:  " onChange={handleStartTimeChange} value={selectedStartTime} />
                        </ListItem>
                        <ListItem>
                            <TimePicker label="End time: " onChange={handleEndTimeChange} value={selectedEndTime} />
                        </ListItem>
                    </List>
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
