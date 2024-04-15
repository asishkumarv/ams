import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  List,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,


} from '@mui/material';
import AppLayout from './../AppLayout';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadButton from './utils/UploadButton';
import { jwtDecode } from "jwt-decode";

//import DataTable from './utils/DataTable'
const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [orgName, setOrgName] = useState([]);
  const [orgProfile, setOrgProfile] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Appointments');
  const [appointments, setAppointments] = useState([]);
  const [oldappointments, setOldAppointments] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [orgId, setOrgId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredBookingId, setEnteredBookingId] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isBookingIdValid, setIsBookingIdValid] = useState(true);
  const [messages, setMessages] = useState([]);

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
    const token = localStorage.getItem('jwtTokenA');
    // console.log('token:', token)
    if (!token) {
      // setError('JWT token not found');
      // setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/org-profile', {
      headers: {
        Authorization: token
      }
    })
      .then(response => setOrgName(response.data))
      .catch(error => console.error(error));
  })

  useEffect(() => {
    // Fetch orgId from your backend or wherever it's available
    const token = localStorage.getItem('jwtTokenA');
    if (token) {
      axios.get('http://localhost:5000/org-profile', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setOrgId(response.data.id);
          console.log('orgid:', response.data.id) // Set orgId state with fetched data
        })
        .catch(error => console.error(error));
    }
  }, [orgId]); // Run once on component mount

  useEffect(() => {
    fetchAppointments(); // Fetch appointments when component mounts
  }, []); // Run once on component mount

  const handleSetAppointment = () => {

    navigate('/SetAppointment');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtTokenA');
    navigate('/logout');
  };
  const fetchOrgProfile = () => {
    // Fetch appointments based on user ID or any other relevant logic
    const token = localStorage.getItem('jwtTokenA');
    if (token) {


      axios.get(`http://localhost:5000/org-profile`, {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setOrgProfile(response.data);
          // Update appointments state with fetched data
          console.log('profile:', response.data)
        })
        .catch(error => console.error(error));
    }
  };

  const fetchAppointments = () => {
    // Fetch appointments based on user ID or any other relevant logic
    const token = localStorage.getItem('jwtTokenA');
    if (token) {


      axios.get(`http://localhost:5000/org-appointments`, {
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
    const token = localStorage.getItem('jwtTokenA');
    if (token) {


      axios.get(`http://localhost:5000/org-history`, {
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

    // Function to fetch messages
    const fetchMessages = () => {

      const token = localStorage.getItem('jwtTokenA');
      if (token) {
 
        console.log('orgid',orgId)
        axios.get(`http://localhost:5000/org-messages/${orgId}`)
          .then(response => {
            setMessages(response.data); // Update messages state with fetched data
          })
          .catch(error => console.error(error));
      }
    };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'Appointments') {
      fetchAppointments();
    }
    else if (option === 'History') {
      fetchOldAppointments();
    }
    else if (option === 'OrganisationProfile') {
      fetchOrgProfile();
    }
    else if (option === 'Messages') {
      fetchMessages();
    }
  };

  const filteredAppointments = appointments ? appointments.filter(appointment =>
    appointment.booking_id.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };
  // Function to mask the characters at positions 4, 5, and 6 of the booking ID
  const maskBookingId = (bookingId) => {
    if (bookingId.length < 6) {
      return '***';
    }
    const maskedPart = '***'; // Masking characters for positions 4, 5, and 6
    return bookingId.substring(0, 3) + maskedPart + bookingId.substring(6);
  };

  const handleOpenDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEnteredBookingId('');
    setSelectedAppointment(null);
  };

const handleSubmit = () => {
  // Proceed to close appointment
  const prefix = 'AMS'; // Prefix for the booking ID
  const fullBookingId = prefix + enteredBookingId;
  if (selectedAppointment && selectedAppointment.booking_id === fullBookingId) {
    // Update status of the appointment to "closed"
    const token = localStorage.getItem('jwtTokenA');
    if (token) {
      axios.post(`http://localhost:5000/close-appointment/${selectedAppointment.booking_id}`, {
        status: 'closed'
      }, {
        headers: {
          Authorization: token
        }
      })
      .then(response => {
        // Handle success
        window.alert('Appointment closed successfully');
        fetchAppointments(); // Fetch appointments again to reflect changes
        handleCloseDialog();
        window.location.reload();
      })
      .catch(error => {
        console.error('Error closing appointment:', error);
        // Handle error
      });
    }
  } else {
    // Show error message or handle invalid booking ID
    window.alert('Invalid booking ID');
    setIsBookingIdValid(false);
  }
};


  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Left Sidebar */}
          {isMobile ? (
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#004d40' }}>
                <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                <Typography variant="h6" style={{ color: 'white' }}>{orgName ? orgName.org_name : 'Admin'}</Typography>
              </div>
              <List>
                <ListItemButton selected={selectedOption === 'OrganisationProfile'} onClick={() => handleOptionSelect('OrganisationProfile')}>
                  <ListItemText primary="Organisation Profile"
                    primaryTypographyProps={{ color: selectedOption === 'OrganisationProfile' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton onClick={handleSetAppointment}>
                  <ListItemText primary="Set Appointments" />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'Appointments'} onClick={() => handleOptionSelect('Appointments')}>
                  <ListItemText primary="Appointments"
                    primaryTypographyProps={{ color: selectedOption === 'Appointments' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'History'} onClick={() => handleOptionSelect('History')}>
                  <ListItemText primary="History"
                    primaryTypographyProps={{ color: selectedOption === 'History' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'Messages'} onClick={() => handleOptionSelect('Messages')}
                  sx={{ backgroundColor: selectedOption === 'Messages' ? '#333' : 'inherit' }}>
                  <ListItemText primary="Messages"
                    primaryTypographyProps={{ color: selectedOption === 'Messages' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton onClick={handleLogout} >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Drawer>
          ) : (
            <Grid item xs={12} md={3}>
              <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#004d40' }}>
                  <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                  <Typography variant="h6" style={{ color: 'white' }}>{orgName ? orgName.org_name : 'Admin'}</Typography>
                </div>
                <List>
                  <ListItemButton selected={selectedOption === 'OrganisationProfile'} onClick={() => handleOptionSelect('OrganisationProfile')}>
                    <ListItemText primary="Organisation Profile"
                      primaryTypographyProps={{ color: selectedOption === 'OrganisationProfile' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton onClick={handleSetAppointment}>
                    <ListItemText primary="Set Appointments" />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'Appointments'} onClick={() => handleOptionSelect('Appointments')}>
                    <ListItemText primary="Appointments"
                      primaryTypographyProps={{ color: selectedOption === 'Appointments' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'History'} onClick={() => handleOptionSelect('History')}>
                    <ListItemText primary="History"
                      primaryTypographyProps={{ color: selectedOption === 'History' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'Messages'} onClick={() => handleOptionSelect('Messages')}
                    sx={{ backgroundColor: selectedOption === 'Messages' ? '#333' : 'inherit' }}>
                    <ListItemText primary="Messages"
                      primaryTypographyProps={{ color: selectedOption === 'Messages' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton onClick={handleLogout} >
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>
          )}

          {/* Right Content */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <AppBar position="static" elevation={0}>
              <Toolbar>
                {isMobile && (
                  <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
                    <MoreVertIcon />
                  </IconButton>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Dashboard
                </Typography>


                <IconButton color="inherit" onClick={handleSearchToggle}>
                  <SearchIcon />
                </IconButton>

                {isSearchOpen && (
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              {/* Your content for the right side goes here */}
              <Typography variant="h5" gutterBottom>
                Welcome to the Dashboard
              </Typography>
              <Typography paragraph>
                {selectedOption === 'OrganisationProfile' && 'Here are the organisation details:'}
                {selectedOption === 'Appointments' && 'Here are the appointments details:'}
                {selectedOption === 'History' && 'Here are the Old appointments details:'}
                {selectedOption === 'Messages' && 'Here are the feedbacks & replies:'}
              </Typography>
              {selectedOption === 'Appointments' && (
                <div>
                  {searchQuery.trim() === '' ? (
                    // Render all appointments when search is not used
                    appointments.map(appointment => (
                      <Paper key={appointment.booking_id} style={{ marginBottom: '8px', padding: '8px' }}>
                        <Typography variant="h6">Booking ID: {maskBookingId(appointment.booking_id)}</Typography>
                        <Typography>User: {appointment.user_name}</Typography>
                        <Typography>Organisation: {appointment.organisation_name}</Typography>
                        <Typography>Date: {appointment.date}</Typography>
                        <Typography>Start Time: {appointment.start_time}</Typography>
                        <Typography>End Time: {appointment.end_time}</Typography>
                        <Button variant="contained" onClick={() => handleOpenDialog(appointment)}>Close Appointment</Button>
                        {/* Render other appointment details */}
                      </Paper>
                    ))
                  ) : (
                    // Render filtered appointments when search is used
                    filteredAppointments.map(appointment => (
                      <Paper key={appointment.booking_id} style={{ marginBottom: '8px', padding: '8px' }}>
                        <Typography variant="h6">Booking ID: {maskBookingId(appointment.booking_id)}</Typography>
                        <Typography>User: {appointment.user_name}</Typography>
                        <Typography>Organisation: {appointment.organisation_name}</Typography>
                        <Typography>Date: {appointment.date}</Typography>
                        <Typography>Start Time: {appointment.start_time}</Typography>
                        <Typography>End Time: {appointment.end_time}</Typography>
                        <Button onClick={() => handleOpenDialog(appointment)}>Close Appointment</Button>
                        {/* Render other appointment details */}
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
              {selectedOption === 'OrganisationProfile' && orgProfile ? (
                <div>

                  <Paper style={{ marginBottom: '8px', padding: '8px' }}>

                    <Typography>Organisation name: {orgProfile.org_name}</Typography>
                    <Typography>Organiser Name : {orgProfile.orgr_name}</Typography>
                    <Typography>Type : {orgProfile.org_type}</Typography>
                    <Typography>Email: {orgProfile.email}</Typography>
                    <Typography>Since : {formatDate(orgProfile.org_since)}</Typography>
                    <Typography>Address : {orgProfile.address} ,{orgProfile.city}</Typography>
                    <Typography>Pin Code : {orgProfile.pincode}</Typography>
                    {/* Upload organization image */}
                    <UploadButton orgId={orgId} />
                    <img
                      src={`data:image/jpeg;base64,${orgProfile.imageBase64}`}
                      alt="Organisation"
                      style={{ maxWidth: '70%', marginBottom: '20px' }}
                    />
                  </Paper>

                </div>
              ) : (
                <div></div>
              )}
              {/* List of Organizations */}
              {/* <DataTable data={organisations} columns={columns} /> */}

              {/* Dialog for entering booking ID */}
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Close Appointment</DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography color="Primary">AMS</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Enter Last 7 characters of Booking ID"
                        placeholder="Last 7 characters"
                        value={enteredBookingId}
                        onChange={(e) => setEnteredBookingId(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  {!isBookingIdValid && ( // Render the message if booking ID is invalid
                    <Typography variant="body2" color="error">
                      Invalid booking ID
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
              </Dialog>

              {selectedOption === 'Messages' && (
                <div>
                  {messages.map((message, index) => (
                    <Paper key={index} style={{ marginBottom: '8px', padding: '8px' }}>
                      <Typography >Feedback: {message.feedback_description}</Typography>
                      <Typography variant="h6">Reply: {message.reply_answer}</Typography>
                    </Paper>
                  ))}
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
