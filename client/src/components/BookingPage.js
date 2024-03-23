import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import AppLayout from './../AppLayout';
import AppBar from '@mui/material/AppBar';
import { jwtDecode } from 'jwt-decode';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BookingPage = () => {
  const { id } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { generateUniqueBookingId } = require('./utils');
  const navigate = useNavigate();
  const fetchOrganisationDetails = useCallback(async () => {
    try {
      const organisationResponse = await axios.get(`http://localhost:5000/organisation/${id}`);
      setOrganisation(organisationResponse.data);

      const slotsResponse = await axios.get(`http://localhost:5000/organisation/${id}/slots`);
      setSlots(slotsResponse.data);
    } catch (error) {
      console.error('Error fetching organization details and slots:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchOrganisationDetails();
  }, [fetchOrganisationDetails]);

  const handleSlotSelection = (slot) => {
    // Check if the slot is already booked
    if (slot.status === 'booked') {
      return;
    }
    setSelectedSlot(slot);
  };

  const handleBookNow = async () => {

    // Implement booking logic here
    try {
      // Get the JWT token from local storage
      const token = localStorage.getItem('jwtToken');
      console.log('Token:', token);
      if (!token) {
        console.error('JWT token not found');
        // Handle the absence of token here
        return;
      }

      // Ensure that the token is a string
      if (typeof token !== 'string') {
        console.error('Invalid token format');
        // Handle the invalid token format here
        return;
      }

      // Decode the token to obtain user ID
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      console.log('user id:', userId)
      // Use the generateUniqueBookingId function where needed
      const bookingId = generateUniqueBookingId();
      const response = await axios.post('http://localhost:5000/bookings', {
        bookingId: bookingId,
        organisationId: organisation.id,
        userId: userId,
        slotId: selectedSlot.id
      });


      // If booking was successful, navigate to booking details page
      navigate(`/BookingDetailsPage/${response.data.bookingId}`);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  const formatSlotDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };
  return (
    <AppLayout>
      <Container maxWidth="md">
        <AppBar position="static">
          <Toolbar>
 
              <IconButton edge="start" color="inherit" aria-label="back" onClick={() => window.history.back()} >
                <ArrowBackIcon style={{ color: 'white' }} />
              </IconButton>

            <Typography variant="h4" gutterBottom mt="10px">
              {organisation ? organisation.org_name : 'Organisation'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Typography variant="h6" gutterBottom mt="20px">
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

                <Button
                  variant={selectedSlot === slot ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleSlotSelection(slot)}
                  disabled={selectedSlot === slot || slot.status === 'booked'}
                  fullWidth
                >
                  {slot.status === 'booked' ? 'not avl' : selectedSlot === slot ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBookNow}
          disabled={!selectedSlot}
          style={{ marginTop: '20px' }}
        >
          Book Now
        </Button>
      </Container>
    </AppLayout>
  );
};

export default BookingPage;
