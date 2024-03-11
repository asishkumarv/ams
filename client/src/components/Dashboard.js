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

} from '@mui/material';
import AppLayout from './../AppLayout';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import DataTable from './utils/DataTable';
import { useNavigate } from 'react-router-dom';
//import { jwtDecode } from "jwt-decode";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [oldappointments, setOldAppointments] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Organisations');
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
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'org_name', label: 'Name' },
    { key: 'org_type', label: 'Type' },
    { key: 'address', label: 'Address' },
  ];

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
  };
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
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center',backgroundColor: '#1565c0' }}>
                  <AccountCircleIcon style={{ marginRight: '8px', color:'white' }} />
                  <Typography variant="h6" style={{color:'white'}}>{userName ? userName.full_name : 'User'}</Typography>
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
                <ListItem button onClick={handleLogout} >
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Drawer>
          ) : (
            <Grid item xs={12} md={3}>
              <Paper elevation={3} style={{ padding: '16px', height: '100%',backgroundColor: '#b2ebf2' }} >
              
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center',backgroundColor: '#070d1e'}}   >
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
              </Typography>
              {/* Render organisations or appointments */}
              {selectedOption === 'Organisations' && (
                <DataTable data={organisations} columns={columns} />
              )}
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
