import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Button, Grid, ListItem, List, Card, CardContent, Container } from '@mui/material';
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
    const [organisation, setOrganisation] = useState(null);
    const [slots, setSlots] = useState([]);
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
            // Refresh the page
            window.location.reload();
        } catch (error) {
            // Show error message to the user if the API call fails
            alert('Failed to update appointment slot. Please try again later.');
            console.error(error);
        }
    };

    const fetchOrganisationDetails = useCallback(async () => {
        try {
            const organisationResponse = await axios.get(`http://localhost:5000/organisation/${orgId}`);
            setOrganisation(organisationResponse.data);

            const slotsResponse = await axios.get(`http://localhost:5000/organisation/${orgId}/slots`);
            setSlots(slotsResponse.data);
        } catch (error) {
            console.error('Error fetching organization details and slots:', error);
        }
    }, [orgId]);

    const handleDropSlot = async (slotId) => {
        const isConfirmed = window.confirm('Are you sure you want to drop this slot?');
        if (isConfirmed) {
        try {
            await axios.post(`http://localhost:5000/drop-slot`, { slotId: slotId, status: 'dropped' });
        
            // Update the slot status in the state
            const updatedSlots = slots.map(slot => {
                if (slot.id === slotId) {
                    return { ...slot, status: 'Dropped' };
                }
                return slot;
            });
            setSlots(updatedSlots);
            window.location.reload();
        } catch (error) {
            console.error('Error dropping slot:', error);
        }
    }
    };

    useEffect(() => {
        fetchOrganisationDetails();
    }, [fetchOrganisationDetails]);

    const formatSlotDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    return (
        <Applayout>
            <Box textAlign="center" >
                <Typography variant="h5">Update Appointment Slot</Typography>

                <Grid container spacing={0} alignItems="center" justifyContent="center" mt={2}>
                    <Grid item></Grid>
                    <Grid item>
                        <Typography variant="subtitle1">Select Date:</Typography>
                    </Grid>

                    <DatePicker label="Select Date" onChange={handleDateChange} value={selectedDate} />

                </Grid>
                <Grid container spacing={0} alignItems="center" justifyContent="center">
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
            </Box>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>
                    {organisation ? organisation.org_name : 'Organisation'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Available Slots:
                </Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {slots.map(slot => (
                        <Card key={slot.id} variant="outlined" style={{ width: '150px', opacity: slot.status === 'booked' ? 0.8 : 1 }}>
                            <CardContent>
                                <Typography variant="body1" component="p" align='center' style={{ color: slot.status === 'booked' ? 'inherit' : 'red' }} >
                                    {formatSlotDate(slot.date)}
                                </Typography>
                                <Typography variant="body1" component="p" align='center' style={{ color: slot.status === 'booked' ? 'inherit' : 'primary' }}>
                                    {slot.start_time}
                                </Typography>

                                {/* Render drop button only for unbooked slots */}
                                {slot.status === 'available' && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDropSlot(slot.id)}
                                        fullWidth
                                    >
                                        Drop
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </Container>
        </Applayout>
    );
};

export default SetAppointment;
