import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography ,Button, Grid,  useMediaQuery,
  useTheme, IconButton,Paper} from '@mui/material';
import AppLayout from './../AppLayout';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Function to handle appointment download as PDF
  const downloadAppointmentAsPdf = (bookingDetails) => {
    // Select the appointment card element
    const appointmentCard = document.getElementById(`appointment-card-${bookingDetails.booking_id}`);

    // Use html2canvas to capture the appointment card as an image
    html2canvas(appointmentCard).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions for PDF
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const orientation = canvas.width > canvas.height ? 'l' : 'p'; // Landscape or portrait

      // Initialize jsPDF with appropriate orientation
      const pdf = new jsPDF(orientation, 'mm', [pdfWidth, pdfHeight]);

      // Add captured image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF file
      pdf.save(`appointment_${bookingDetails.booking_id}.pdf`);
    });
  };

  // Function to handle appointment download as image
  const downloadAppointmentAsImage = (bookingDetails) => {
    // Select the appointment card element
    const appointmentCard = document.getElementById(`appointment-card-${bookingDetails.booking_id}`);

    // Use html2canvas to capture the appointment card as an image
    html2canvas(appointmentCard).then((canvas) => {
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // Save the image file using file-saver
        saveAs(blob, `appointment_${bookingDetails.booking_id}.png`);
      });
    });
  };


  return (
    <AppLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>
        <Paper
  id={`appointment-card-${bookingDetails?.booking_id}`} // Use optional chaining to access booking_id
  key={bookingDetails?.booking_id}
          style={{
            marginBottom: '8px',
            padding: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column', // Change flex direction to column
          }}
        >
          {bookingDetails ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">Booking ID: {bookingDetails.booking_id}</Typography>
                <Typography variant="body1">Organisation Name: {bookingDetails.organisation_name}</Typography>
                <Typography variant="body1">User Name: {bookingDetails.user_name}</Typography>
                <Typography variant="body1">Slot Date: {bookingDetails.date}</Typography>
                <Typography variant="body1">Description: {bookingDetails.description}</Typography>
                <Typography variant="body1">
                  Slot Time: {bookingDetails.start_time} - {bookingDetails.end_time}
                </Typography>
                <Typography variant="body2" color="red">
                  Download the Booking Details to show and authenticate in the organization
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
        </Paper>
        {/* Move the buttons below the booking details */}
        <Button variant="contained" color="primary" onClick={() => window.history.back()} style={{ marginRight: '10px', marginBottom: '10px' }}>
          Back
        </Button>
        <Link to={`/Dashboard`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="secondary" style={{ marginRight: '10px', marginBottom: '10px' }}>Dashboard</Button>
        </Link>
        {isMobile ? (
          <>
            <IconButton onClick={() => downloadAppointmentAsPdf(bookingDetails)} color="primary">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton onClick={() => downloadAppointmentAsImage(bookingDetails)} color="primary">
              <ImageIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              onClick={() => downloadAppointmentAsPdf(bookingDetails)}
              color="primary"
              variant="contained"
              sx={{ marginRight: '10px',  marginBottom: '10px' }}
            >
              Download as PDF
            </Button>
            <Button
              onClick={() => downloadAppointmentAsImage(bookingDetails)}
              color="primary"
              variant="contained"
              sx={{ marginBottom: '10px' }}
            >
              Download as Image
            </Button>
          </>
        )}
      </Container>
    </AppLayout>
  );
  
};

export default BookingDetailsPage;
