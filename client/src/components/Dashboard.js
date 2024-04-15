import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  List,
  MenuItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Button,
  Menu,

} from '@mui/material';
import AppLayout from './../AppLayout';
import SearchIcon from '@mui/icons-material/Search';
//import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
//import DataTable from './utils/DataTable';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OrganisationCards from './utils/DataCards';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import LocationOnIcon from '@mui/icons-material/LocationOn';
//import CategoryIcon from '@mui/icons-material/Category';
import FilterListIcon from '@mui/icons-material/FilterList';



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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [messages, setMessages] = useState([]);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [typeAnchorEl, setTypeAnchorEl] = useState(null)
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
    // Close location and type menus without resetting selected values
    setLocationAnchorEl(null);
    setTypeAnchorEl(null);
  };

  const handleLocationClick = (event) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleTypeClick = (event) => {
    setTypeAnchorEl(event.currentTarget);
  };

  const handleLocationClose = () => {
    setLocationAnchorEl(null);
  };

  const handleTypeClose = () => {
    setTypeAnchorEl(null);
  };

  const handleLocationSelect = (value) => {
    setSelectedLocation(value);
    setLocationAnchorEl(null);
  };

  const handleTypeSelect = (value) => {
    setSelectedType(value);
    setTypeAnchorEl(null);
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
    axios.get(`http://localhost:5000/organisations?location=${selectedLocation}&type=${selectedType}`)
      .then(response => setOrganisations(response.data))
      .catch(error => console.error(error));
  }, [selectedLocation, selectedType]);

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

  // Function to fetch messages
  const fetchMessages = () => {

    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Extract the user ID from the JWT token
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      axios.get(`http://localhost:5000/messages/${userId}`)
        .then(response => {
          setMessages(response.data); // Update messages state with fetched data
        })
        .catch(error => console.error(error));
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
    else if (option === 'Messages') {
      fetchMessages();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

  };

  const filteredOrganisations = organisations.filter(org =>
    org.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof org.pincode === 'number' && org.pincode.toString().includes(searchQuery)) ||
    org.address.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const formatDob = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  // Function to handle appointment download as PDF
  const downloadAppointmentAsPdf = (appointment) => {
    // Select the appointment card element
    const appointmentCard = document.getElementById(`appointment-card-${appointment.booking_id}`);

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
      pdf.save(`appointment_${appointment.booking_id}.pdf`);
    });
  };

  // Function to handle appointment download as image
  const downloadAppointmentAsImage = (appointment) => {
    // Select the appointment card element
    const appointmentCard = document.getElementById(`appointment-card-${appointment.booking_id}`);

    // Use html2canvas to capture the appointment card as an image
    html2canvas(appointmentCard).then((canvas) => {
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // Save the image file using file-saver
        saveAs(blob, `appointment_${appointment.booking_id}.png`);
      });
    });
  };
  const uniqueCities = [...new Set(organisations.map(org => org.city))];
  return (
    <AppLayout>
      <Container maxWidth={isMobile ? "100%" : "lg"}
        sx={{
          padding: isMobile ? 0 : '30px', // Set padding to 0 if it's mobile, otherwise set it to 30px
        }}>
        <Grid container spacing={2}>
          {isMobile ? (
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#070d1e' }}>
                <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                <Typography variant="h6" style={{ color: 'white' }}>{userName ? userName.full_name : 'User'}</Typography>
              </div>
              <List>
                <ListItemButton selected={selectedOption === 'UserProfile'} onClick={() => handleOptionSelect('UserProfile')}
                  sx={{ backgroundColor: selectedOption === 'UserProfile' ? '#333' : 'inherit' }}>
                  <ListItemText primary="User Profile"
                    primaryTypographyProps={{ color: selectedOption === 'UserProfile' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'Organisations'} onClick={() => handleOptionSelect('Organisations')}
                  sx={{ backgroundColor: selectedOption === 'Organisations' ? '#333' : 'inherit' }}>
                  <ListItemText primary=" View Organisations"
                    primaryTypographyProps={{ color: selectedOption === 'Organisations' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'Appointments'} onClick={() => handleOptionSelect('Appointments')}
                  sx={{ backgroundColor: selectedOption === 'Appointments' ? '#333' : 'inherit' }}>
                  <ListItemText primary="Appointments"
                    primaryTypographyProps={{ color: selectedOption === 'Appointments' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'History'} onClick={() => handleOptionSelect('History')}
                  sx={{ backgroundColor: selectedOption === 'History' ? '#333' : 'inherit' }}>
                  <ListItemText primary="History"
                    primaryTypographyProps={{ color: selectedOption === 'History' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'Cancelled Appointments'} onClick={() => handleOptionSelect('Cancelled Appointments')}
                  sx={{ backgroundColor: selectedOption === 'Cancelled Appointments' ? '#333' : 'inherit' }}>
                  <ListItemText primary="Cancelled Appointments"
                    primaryTypographyProps={{ color: selectedOption === 'Cancelled Appointments' ? 'Red' : 'inherit' }} />
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
              <Paper elevation={3} style={{ padding: '16px', height: '100%', backgroundColor: '#b2ebf2' }} >

                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#070d1e' }}   >
                  <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                  <Typography variant="h6" style={{ color: 'white' }}>{userName ? userName.full_name : 'User'}</Typography>
                </div>
                <List>

                  <ListItemButton selected={selectedOption === 'UserProfile'} onClick={() => handleOptionSelect('UserProfile')}
                    sx={{ backgroundColor: selectedOption === 'UserProfile' ? '#333' : 'inherit' }}>
                    <ListItemText primary="User Profile"
                      primaryTypographyProps={{ color: selectedOption === 'UserProfile' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'Organisations'} onClick={() => handleOptionSelect('Organisations')}
                    sx={{ backgroundColor: selectedOption === 'Organisations' ? '#333' : 'inherit' }}>
                    <ListItemText primary=" View Organisations"
                      primaryTypographyProps={{ color: selectedOption === 'Organisations' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'Appointments'} onClick={() => handleOptionSelect('Appointments')}
                    sx={{ backgroundColor: selectedOption === 'Appointments' ? '#333' : 'inherit' }}>
                    <ListItemText primary="Appointments"
                      primaryTypographyProps={{ color: selectedOption === 'Appointments' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'History'} onClick={() => handleOptionSelect('History')}
                    sx={{ backgroundColor: selectedOption === 'History' ? '#333' : 'inherit' }}>
                    <ListItemText primary="History"
                      primaryTypographyProps={{ color: selectedOption === 'History' ? 'Red' : 'inherit' }} />
                  </ListItemButton>
                  <ListItemButton selected={selectedOption === 'Cancelled Appointments'} onClick={() => handleOptionSelect('Cancelled Appointments')}
                    sx={{ backgroundColor: selectedOption === 'Cancelled Appointments' ? '#333' : 'inherit' }}>
                    <ListItemText primary="Cancelled Appointments"
                      primaryTypographyProps={{ color: selectedOption === 'Cancelled Appointments' ? 'Red' : 'inherit' }} />
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

          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <AppBar position="static" elevation={0}>
              <Toolbar>
                {isMobile && (
                  <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
                    <MenuIcon />
                  </IconButton>
                )}
                {isMobile && (!isSearchOpen && (
                  <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
                    Dashboard
                  </Typography>
                ))}
                {!isMobile && (
                  <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    Dashboard
                  </Typography>
                )}
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
                <IconButton color="inherit" onClick={handleLocationClick}>
                  <LocationOnIcon />
                </IconButton>
                <Menu
                  anchorEl={locationAnchorEl}
                  open={Boolean(locationAnchorEl)}
                  onClose={handleLocationClose}
                >
                  <MenuItem onClick={() => handleLocationSelect('')}>All</MenuItem>
                  {uniqueCities.map(city => (
                    <MenuItem key={city} onClick={() => handleLocationSelect(city)}>
                      {city}
                    </MenuItem>
                  ))}
                  {/* Add more menu items for locations */}
                </Menu>


                <IconButton color="inherit" onClick={handleTypeClick}>
                  <FilterListIcon />
                </IconButton>
                <Menu
                  anchorEl={typeAnchorEl}
                  open={Boolean(typeAnchorEl)}
                  onClose={handleTypeClose}
                >
                  <MenuItem onClick={() => handleTypeSelect('')}>All</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('medical')}>Medical</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('offices')}>Offices</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('restaurant')}>Restaurant</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('parlour')}>Parlour</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('saloon')}>Saloon</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('banking')}>Banking</MenuItem>
                  <MenuItem onClick={() => handleTypeSelect('others')}>Others</MenuItem>
                  {/* Add more menu items for types */}
                </Menu>

              </Toolbar>
            </AppBar>
            <Paper elevation={3} style={{ padding: '16px', minHeight: '60vh' }}>

              {/* <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                Welcome to the Dashboard
              </Typography> */}

              <Typography paragraph>
                {selectedOption === 'Organisations' && 'Here are the organisations details:'}
                {selectedOption === 'Appointments' && 'Here are the appointments details:'}
                {selectedOption === 'History' && 'Here are the Old appointments details:'}
                {selectedOption === 'Cancelled Appointments' && 'Here are the Cancelled appointments details:'}
                {selectedOption === 'Messages' && 'Here are the feedbacks & replies:'}
              </Typography>
              {/* Render organisations or appointments */}
              {selectedOption === 'Organisations' && (
                <div style={{ marginBottom: '20px' }}>
                  {selectedLocation && (
                    <TextField
                      onClick={handleLocationClick}
                      label="Location"
                      value={selectedLocation}
                      variant="outlined"
                      size="small"
                      disabled
                      InputProps={{ style: { color: 'black' } }}
                      InputLabelProps={{ style: { color: 'black' } }}
                      sx={{
                        '& label.Mui-focused': { color: 'blck' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'black' },
                          '&:hover fieldset': { borderColor: 'black' },
                          '&.Mui-focused fieldset': { borderColor: 'black' },
                        },
                      }}
                    />
                  )}
                  {selectedType && (
                    <TextField
                      onClick={handleTypeClick}
                      label="Type"
                      value={selectedType}
                      variant="outlined"
                      size="small"
                      disabled
                      mt={2}
                      InputProps={{ style: { color: 'black' } }}
                      InputLabelProps={{ style: { color: 'black' } }}
                      sx={{
                        '& label.Mui-focused': { color: 'blck' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'black' },
                          '&:hover fieldset': { borderColor: 'black' },
                          '&.Mui-focused fieldset': { borderColor: 'black' },
                        },
                      }}
                    />
                  )}
                  <OrganisationCards organisations={searchQuery ? filteredOrganisations : organisations} />
                </div>

              )}


              {selectedOption === 'Appointments' && (
                <div>
                  {appointments.length === 0 ? (
                    <Typography variant="body1">No appointments found.</Typography>
                  ) : (
                    appointments.map(appointment => (
                      <Paper id={`appointment-card-${appointment.booking_id}`} key={appointment.booking_id} style={{ marginBottom: '8px', padding: '8px', position: 'relative', display: 'flex' }}>
                        {/* Left section with appointment details */}
                        <div style={{ flex: 1 }}>
                          <Typography variant="h6">Booking ID: {appointment.booking_id}</Typography>
                          <Typography>User: {appointment.user_name}</Typography>
                          <Typography>Organisation: {appointment.organisation_name}</Typography>
                          {/* <Typography>Slot: {appointment.slot_id}</Typography> */}
                          <Typography>Date: {appointment.date}</Typography>
                          <Typography>Start Time: {appointment.start_time}</Typography>
                          <Typography>End Time: {appointment.end_time}</Typography>
                          <Typography>Description: {appointment.description}</Typography>
                          <div style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {isMobile ? (
                              <>
                                <IconButton onClick={() => downloadAppointmentAsPdf(appointment)} color="primary">
                                  <PictureAsPdfIcon />
                                </IconButton>
                                <IconButton onClick={() => downloadAppointmentAsImage(appointment)} color="primary">
                                  <ImageIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <Button
                                  onClick={() => downloadAppointmentAsPdf(appointment)}
                                  color="primary"
                                  variant="contained"
                                  sx={{ fontSize: '0.6rem', padding: '8px 12px' }}
                                >
                                  Download as PDF
                                </Button>
                                <Button
                                  onClick={() => downloadAppointmentAsImage(appointment)}
                                  color="primary"
                                  variant="contained"
                                  sx={{ fontSize: '0.6rem', padding: '8px 12px' }}
                                >
                                  Download as Image
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right section with QR code and cancel appointment button */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          {/* QR code */}
                          {appointment.qr_code && (
                            <QRCode value={String(appointment.qr_code)} size={isMobile ? '80' : '128'} />
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
                        <Typography>Description: {oldappointments.description}</Typography>
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
                        <Typography>Description: {cancelledappointments.description}</Typography>
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
                    <Typography>Gender: {userProfile.gender}</Typography>
                    <Typography>Date of Birth : {formatDob(userProfile.date_of_birth)}</Typography>

                  </Paper>

                </div>
              ) : (
                <div></div>
              )}

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
