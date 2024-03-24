import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,


} from '@mui/material';
import AppLayout from './../AppLayout';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UploadButton from './utils/UploadButton';
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
          console.log('orgid:', orgId) // Set orgId state with fetched data
        })
        .catch(error => console.error(error));
    }
  }, [orgId]); // Run once on component mount

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
  };
  const formatDate = (dateString) => {
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
          {/* Left Sidebar */}
          {isMobile ? (
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#004d40' }}>
                <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                <Typography variant="h6" style={{ color: 'white' }}>{orgName ? orgName.org_name : 'Admin'}</Typography>
              </div>
              <List>
                <ListItem button onClick={() => handleOptionSelect('OrganisationProfile')}>
                  <ListItemText primary="Oragnisation Profile" />
                </ListItem>
                <ListItem button onClick={handleSetAppointment}>
                  <ListItemText primary="Set Appointments" />
                </ListItem>
                <ListItem button onClick={() => handleOptionSelect('Appointments')}>
                  <ListItemText primary="Appointments" />
                </ListItem>
                <ListItem button onClick={() => handleOptionSelect('History')}>
                  <ListItemText primary="History" />
                </ListItem>
                <ListItem button onClick={handleLogout} >
                  <ListItemText primary="Logout" />
                </ListItem>
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
                  <ListItem button onClick={() => handleOptionSelect('OrganisationProfile')}>
                    <ListItemText primary="Organisation Profile" />
                  </ListItem>
                  <ListItem button onClick={handleSetAppointment}>
                    <ListItemText primary="Set Appointments" />
                  </ListItem>
                  <ListItem button onClick={() => handleOptionSelect('Appointments')}>
                    <ListItemText primary="Appointments" />
                  </ListItem>
                  <ListItem button onClick={() => handleOptionSelect('History')}>
                    <ListItemText primary="History" />
                  </ListItem>
                  <ListItem button onClick={handleLogout} >
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          )}

          {/* Right Content */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <AppBar position="static" elevation={0}>
              <Toolbar>
                <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
                  <MoreVertIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Dashboard
                </Typography>
                {isMobile && (
                  <IconButton color="inherit" onClick={handleSearchToggle}>
                    <SearchIcon />
                  </IconButton>
                )}
                {isSearchOpen && (
                  <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
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
              </Typography>
              {selectedOption === 'Appointments' && (
                <div>
                  {appointments.map(appointments => (
                    <Paper key={appointments.booking_id} style={{ marginBottom: '8px', padding: '8px' }}>
                      <Typography variant="h6">Booking ID: {appointments.booking_id}</Typography>
                      <Typography>User: {appointments.user_name}</Typography>
                      <Typography>Organisation: {appointments.organisation_name}</Typography>
                      <Typography>Date: {appointments.date}</Typography>
                      <Typography>Start Time: {appointments.start_time}</Typography>
                      <Typography>End Time: {appointments.end_time}</Typography>
                      {/* Render other appointment details */}
                    </Paper>
                  ))}
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

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
