import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import AppLayout from './../AppLayout';

const BookingPage = () => {
  const { id } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  const handleBookNow = () => {
    console.log('Booking slot:', selectedSlot);
    // Implement booking logic here
  };

  return (
    <AppLayout>
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
                <Typography variant="body1" component="p">
                  {slot.start_time} - {slot.end_time}
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
