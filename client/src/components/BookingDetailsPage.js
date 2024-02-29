import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import AppLayout from './../AppLayout';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/booking-details/${bookingId}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  return (
    <AppLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>
        {bookingDetails ? (
          <div>
            <Typography variant="h6">Booking ID: {bookingDetails.booking_id}</Typography>
            <Typography variant="body1">Organisation ID: {bookingDetails.organisation_id}</Typography>
            <Typography variant="body1">User ID: {bookingDetails.user_id}</Typography>
            <Typography variant="body1">Slot ID: {bookingDetails.slot_id}</Typography>
            <Typography variant="body1">Organisation Name: {bookingDetails.org_name}</Typography>
            <Typography variant="body1">User Name: {bookingDetails.first_name}</Typography>
            <Typography variant="body1">
              Slot Time: {bookingDetails.start_time} - {bookingDetails.end_time}
            </Typography>
          </div>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </Container>
    </AppLayout>
  );
};

export default BookingDetailsPage;
