import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography ,Button, Grid} from '@mui/material';
import AppLayout from './../AppLayout';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';

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
      <Container maxWidth="md" >
      <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>
        {bookingDetails ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Booking ID: {bookingDetails.booking_id}</Typography>
              <Typography variant="body1">Organisation Name: {bookingDetails.organisation_name}</Typography>
              <Typography variant="body1">User Name: {bookingDetails.user_name}</Typography>
              <Typography variant="body1">Slot Date: {bookingDetails.date}</Typography>
              <Typography variant="body1">
                Slot Time: {bookingDetails.start_time} - {bookingDetails.end_time}
              </Typography>
              <Typography variant="body2" color="red">
                Take a screenshot or print to show in the organisation
              </Typography>
            </Grid>
            <Grid item xs={6} container justifyContent="center" alignItems="center">
              {/* Display the QR code */}
              <QRCode value={bookingDetails.qr_code} size={128} />
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
                <Button variant="contained" color="primary" onClick={() => window.history.back()} style={{ marginRight: '10px' }}>
          Back
        </Button>
        <Link to={`/Dashboard`}>
              <Button variant="contained" color="secondary" >Dashboard</Button>
              </Link>
      </Container>
    </AppLayout>
  );
};

export default BookingDetailsPage;
