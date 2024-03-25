import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Button

} from '@mui/material';
import AppLayout from './../AppLayout';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
//import DataTable from './utils/DataTable';
import { useNavigate } from 'react-router-dom';
//import { jwtDecode } from "jwt-decode";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OrganisationCards from './utils/DataCards';
import QRCode from 'react-qr-code';

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [oldappointments, setOldAppointments] = useState([]);
  const [cancelledappointments, setcancelledAppointments] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Organisations');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!isSearchOpen);
  };


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      // setError('JWT token not found');
      // setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/user-profile', {
      headers: {
        Authorization: token
      }
    })
      .then(response => setUserName(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/organisations')
      .then(response => setOrganisations(response.data))
      .catch(error => console.error(error));
  }, []);
  const fetchAppointments = () => {
    // Fetch appointments based on user ID or any other relevant logic
    const token = localStorage.getItem('jwtToken');
    if (token) {


      axios.get(`http://localhost:5000/user-appointments`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setAppointments(response.data); // Update appointments state with fetched data
        })
        .catch(error => console.error(error));
    }
  };

  const fetchOldAppointments = () => {
    // Fetch appointments based on user ID or any other relevant logic
    const token = localStorage.getItem('jwtToken');
    if (token) {


      axios.get(`http://localhost:5000/history`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setOldAppointments(response.data); // Update appointments state with fetched data
        })
        .catch(error => console.error(error));
    }
  };
  const fetchCancelledAppointments = () => {
    // Fetch appointments based on user ID or any other relevant logic
    const token = localStorage.getItem('jwtToken');
    if (token) {


      axios.get(`http://localhost:5000/cancelled-appointments`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setcancelledAppointments(response.data); // Update appointments state with fetched data
        })
        .catch(error => console.error(error));
    }
  };
  const fetchUserProfile = () => {
    // Fetch appointments based on user ID or any other relevant logic
    const token = localStorage.getItem('jwtToken');
    if (token) {


      axios.get(`http://localhost:5000/user-profile`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setUserProfile(response.data);
          // Update appointments state with fetched data
          console.log('profile:', response)
        })
        .catch(error => console.error(error));
    }
  };
  //console.log('slot', appointments.slot_id)
  const handleCancelAppointment = async (bookingId, slotId) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (isConfirmed) {
      try {
        // Retrieve the JWT token from localStorage or wherever it's stored
        const token = localStorage.getItem('jwtToken'); // Assuming the token is stored in localStorage

        // Set up the request headers with the JWT token
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Call the cancel appointment API endpoint with the token included in headers
        await axios.post(
          'http://localhost:5000/cancel-appointment',
          {
            booking_id: bookingId,
            slot_id: slotId
          },
          { headers: headers }
        );

        // Refresh the page
        window.location.reload();
        // Call the onCancel function passed from the parent component to update the UI
        //onCancel(appointment.booking_id);
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        // Handle error
      }
    }
  };

  // const columns = [
  //   { key: 'id', label: 'ID' },
  //   { key: 'org_name', label: 'Name' },
  //   { key: 'org_type', label: 'Type' },

  //   { key: 'city', label: 'City' },
  // ];

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/logout');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'Appointments') {
      fetchAppointments();
    }
    else if (option === 'Organisations') {

    }
    else if (option === 'History') {
      fetchOldAppointments();
    }
    else if (option === 'UserProfile') {
      fetchUserProfile();
    }
    else if (option === 'Cancelled Appointments') {
      fetchCancelledAppointments();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrganisations = organisations.filter(org =>
    org.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.org_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof org.pincode === 'number' && org.pincode.toString().includes(searchQuery)) ||
    org.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.address.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const formatDob = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {isMobile ? (
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#070d1e' }}>
                <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                <Typography variant="h6" style={{ color: 'white' }}>{userName ? userName.full_name : 'User'}</Typography>
              </div>
              <List>
                <ListItem button onClick={() => handleOptionSelect('UserProfile')}>
                  <ListItemText primary="User Profile" />
                </ListItem>
                <ListItem button onClick={() => handleOptionSelect('Appointments')}>
                  <ListItemText primary="Appointments" />
                </ListItem>
                <ListItem button onClick={() => handleOptionSelect('Organisations')}>
                  <ListItemText primary=" View Organisations" />
                </ListItem>
                <ListItem button onClick={() => handleOptionSelect('History')}>
                  <ListItemText primary="History" />
                </ListItem>
                <ListItem button onClick={() => handleOptionSelect('Cancelled Appointments')}>
                  <ListItemText primary="Cancelled Appointments" />
                </ListItem>
                <ListItem button onClick={handleLogout} >
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Drawer>
          ) : (
            <Grid item xs={12} md={3}>
              <Paper elevation={3} style={{ padding: '16px', height: '100%', backgroundColor: '#b2ebf2' }} >

                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#070d1e' }}   >
                  <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                  <Typography variant="h6" style={{ color: 'white' }}>{userName ? userName.full_name : 'User'}</Typography>
                </div>
                <List>

                  <ListItemButton onClick={() => handleOptionSelect('UserProfile')}>
                    <ListItemText primary="User Profile" />
                  </ListItemButton>
                  <ListItem button onClick={() => handleOptionSelect('Appointments')}>
                    <ListItemText primary="Appointments" />
                  </ListItem>
                  <ListItem button onClick={() => handleOptionSelect('Organisations')}>
                    <ListItemText primary=" View Organisations" />
                  </ListItem>
                  <ListItem button onClick={() => handleOptionSelect('History')}>
                    <ListItemText primary="History" />
                  </ListItem>
                  <ListItem button onClick={() => handleOptionSelect('Cancelled Appointments')}>
                    <ListItemText primary="Cancelled Appointments" />
                  </ListItem>
                  <ListItem button onClick={handleLogout} >
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <AppBar position="static" elevation={0}>
              <Toolbar>
                <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
                  <MoreVertIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Dashboard
                </Typography>
                <IconButton color="inherit" onClick={handleSearchToggle}>
                  <SearchIcon />
                </IconButton>

                {/* {isMobile && (
                  <IconButton color="inherit" onClick={handleSearchToggle}>
                    <SearchIcon />
                  </IconButton>
                )} */}
                {isSearchOpen && (
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: 'white' } }}
                    sx={{
                      '& label.Mui-focused': { color: 'white' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                      },
                    }}
                  />
                )}

              </Toolbar>
            </AppBar>
            <Paper elevation={3} style={{ padding: '16px', minHeight: '60vh' }}>
              <Typography variant="h5" gutterBottom>
                Welcome to the Dashboard
              </Typography>
              <Typography paragraph>
                {selectedOption === 'Organisations' && 'Here are the organisations details:'}
                {selectedOption === 'Appointments' && 'Here are the appointments details:'}
                {selectedOption === 'History' && 'Here are the Old appointments details:'}
                {selectedOption === 'Cancelled Appointments' && 'Here are the Cancelled appointments details:'}
              </Typography>
              {/* Render organisations or appointments */}
              {selectedOption === 'Organisations' && (
                <OrganisationCards organisations={searchQuery ? filteredOrganisations : organisations} />
              )}
              {selectedOption === 'Appointments' && (
                <div>
                  {appointments.length === 0 ? (
                    <Typography variant="body1">No appointments found.</Typography>
                  ) : (
                    appointments.map(appointment => (
                      <Paper key={appointment.booking_id} style={{ marginBottom: '8px', padding: '8px', position: 'relative', display: 'flex' }}>
                        {/* Left section with appointment details */}
                        <div style={{ flex: 1 }}>
                          <Typography variant="h6">Booking ID: {appointment.booking_id}</Typography>
                          <Typography>User: {appointment.user_name}</Typography>
                          <Typography>Organisation: {appointment.organisation_name}</Typography>
                          {/* <Typography>Slot: {appointment.slot_id}</Typography> */}
                          <Typography>Date: {appointment.date}</Typography>
                          <Typography>Start Time: {appointment.start_time}</Typography>
                          <Typography>End Time: {appointment.end_time}</Typography>
                        </div>
                        {/* Right section with QR code and cancel appointment button */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          {/* QR code */}
                          {appointment.qr_code && (
                            <QRCode value={String(appointment.qr_code)} size={128} />
                          )}
                          {/* Cancel appointment button */}
                          {isMobile ? (
                            <IconButton
                              onClick={() => handleCancelAppointment(appointment.booking_id, appointment.slot_id)}
                              style={{ marginTop: '8px', padding: '8px' }}
                              color="error"
                            >
                              <CancelIcon />
                            </IconButton>
                          ) : (
                            <Button
                              onClick={() => handleCancelAppointment(appointment.booking_id, appointment.slot_id)}
                              style={{ marginTop: '8px' }} // Add margin top to separate from QR code
                              color="error"
                              variant="contained"
                            >
                              Cancel Appointment
                            </Button>
                          )}
                        </div>
                      </Paper>
                    ))
                  )}
                </div>
              )}

              {selectedOption === 'History' && (
                <div>
                  {oldappointments
                    .map(oldappointments => (
                      <Paper key={oldappointments.booking_id} style={{ marginBottom: '8px', padding: '8px' }}>
                        <Typography variant="h6">Booking ID: {oldappointments.booking_id}</Typography>
                        <Typography>User: {oldappointments.user_name}</Typography>
                        <Typography>Organisation: {oldappointments.organisation_name}</Typography>
                        <Typography>Date: {oldappointments.date}</Typography>
                        <Typography>Start Time: {oldappointments.start_time}</Typography>
                        <Typography>End Time: {oldappointments.end_time}</Typography>
                        {/* Render other appointment details */}
                      </Paper>
                    ))}
                </div>
              )}
              {selectedOption === 'Cancelled Appointments' && (
                <div>
                  {cancelledappointments
                    .map(cancelledappointments => (
                      <Paper key={cancelledappointments.booking_id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#FFCCCC' }}>
                        <Typography variant="h6">Booking ID: {cancelledappointments.booking_id}</Typography>
                        <Typography>User: {cancelledappointments.user_name}</Typography>
                        <Typography>Organisation: {cancelledappointments.organisation_name}</Typography>
                        <Typography>Date: {cancelledappointments.date}</Typography>
                        <Typography>Start Time: {cancelledappointments.start_time}</Typography>
                        <Typography>End Time: {cancelledappointments.end_time}</Typography>
                        {/* Render other appointment details */}
                      </Paper>
                    ))}
                </div>
              )}
              {selectedOption === 'UserProfile' && userProfile ? (
                <div>

                  <Paper style={{ marginBottom: '8px', padding: '8px' }}>

                    <Typography>User name: {userProfile.full_name}</Typography>
                    <Typography>Email: {userProfile.email}</Typography>
                    <Typography>Date of Birth : {formatDob(userProfile.date_of_birth)}</Typography>

                  </Paper>

                </div>
              ) : (
                <div></div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
