import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, useMediaQuery, useTheme, } from '@mui/material';
import AppLayout from './../AppLayout';
import AppBar from '@mui/material/AppBar';
import { jwtDecode } from 'jwt-decode';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

const BookingPage = () => {
  const { id } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      // Generate QR code for the booking ID
      const generateQRCode = async (bookingId) => {
        // Append a unique identifier (e.g., a UUID) to the booking ID
        const uniqueBookingId = bookingId + '_' + uuidv4();

        // Generate QR code for the unique booking ID
        const qrCodeDataURL = await QRCode.toDataURL(uniqueBookingId);

        return qrCodeDataURL;
      };
      // Generate QR code for the booking ID
      const qrCodeDataURL = await generateQRCode(bookingId);

      const response = await axios.post('http://localhost:5000/bookings', {
        bookingId: bookingId,
        organisationId: organisation.id,
        userId: userId,
        slotId: selectedSlot.id,
        qrCode: qrCodeDataURL

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
  const formatSlotTime = (timeString) => {
    // Split the time string to get hours, minutes, and seconds
    const [hours, minutes,] = timeString.split(':').map(Number);
    // Check if hours is NaN
    if (isNaN(hours)) return ''; // Return empty string if the time string is invalid
    // Determine AM/PM
    const ampm = hours >= 12 ? 'pm' : 'am';
    // Convert hours to 12-hour format
    let formattedHours = hours % 12 || 12; // Convert midnight (0 hours) to 12
    formattedHours = formattedHours < 10 ? '0' + formattedHours : formattedHours; // Add leading zero if necessary
    // Add leading zero for minutes if necessary
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    // Construct the formatted time string
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <AppLayout>
      <Container maxWidth="md"
        sx={{
          padding: isMobile ? 0 : '30px', // Set padding to 0 if it's mobile, otherwise set it to 30px
        }}>
        <AppBar position="static">
          <Toolbar>

            <IconButton edge="start" color="inherit" aria-label="back" onClick={() => window.history.back()} >
              <ArrowBackIcon style={{ color: 'white' }} />
            </IconButton>

            <Typography variant="h5" gutterBottom mt="10px">
              {organisation ? organisation.org_name : 'Organisation'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBookNow}
          disabled={!selectedSlot}
          style={{ marginTop: '20px' }}
        >
          Book Now
        </Button>
        {isMobile ? (
          <>
            <Typography variant="h6" gutterBottom mt="20px">
              Available Slots:
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '13px'}}>
              {slots.map(slot => (
                <Card key={slot.id} variant="outlined" style={{ width: '150px', opacity: slot.status === 'booked' ? 0.8 : 1 }}>
                  <CardContent>
                    <Typography variant="body3" component="p" align='center' style={{ color: slot.status === 'booked' ? 'inherit' : 'red' }} >
                      {formatSlotDate(slot.date)}
                    </Typography>
                    <Typography variant="body3" component="p" align='center' style={{ color: slot.status === 'booked' ? 'inherit' : 'primary' }}>
                      {formatSlotTime(slot.start_time)}


                    </Typography>

                    <Button
                      variant={selectedSlot === slot ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => handleSlotSelection(slot)}
                      disabled={selectedSlot === slot || slot.status === 'booked'}
                      fullWidth
                      style={isMobile ? { fontSize: '0.8rem', padding: '8px' } : null}
                    >
                      {slot.status === 'booked' ? 'not avl' : selectedSlot === slot ? 'Selected' : 'Select'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
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
                      {formatSlotTime(slot.start_time)}


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
          </>
        )}
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
