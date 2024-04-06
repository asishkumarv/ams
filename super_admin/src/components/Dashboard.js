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
import DataTable from './utils/DataTable';

//import DataTable from './utils/DataTable'
const Dashboard = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [adminName, setAdminName] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Appointments');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [adminId, setAdminId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');




  const handleSearchToggle = () => {
    setSearchOpen(!isSearchOpen);
  };



  useEffect(() => {
    const token = localStorage.getItem('jwtTokenS');
    // console.log('token', token)
    // console.log('token:', token)
    if (!token) {
      // setError('JWT token not found');
      // setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/admin-profile', {
      headers: {
        Authorization: token
      }
    })
      .then(response => setAdminName(response.data))
      .catch(error => console.error(error));
  })

  useEffect(() => {
    // Fetch orgId from your backend or wherever it's available
    const token = localStorage.getItem('jwtTokenS');
    if (token) {
      axios.get('http://localhost:5000/admin-profile', {
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          setAdminId(response.data.id);
          console.log('Adminid:', response.data.id) // Set orgId state with fetched data
        })
        .catch(error => console.error(error));
    }
  }, [adminId]); // Run once on component mount


  useEffect(() => {
    axios.get(`http://localhost:5000/organisations`)
      .then(response => setOrganisations(response.data))
      .catch(error => console.error(error));
      console.log('data', organisations)
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('jwtTokenS');
    navigate('/logout');
  };




  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === 'Organisations') {

    }
    else if (option === 'Users') {

    }
    else if (option === ' AdminProfile') {

    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };


  const orgs = [
    { key: 'id', label: 'ID' },
    { key: 'org_name', label: 'Name' },
    { key: 'org_type', label: 'Type' },

    { key: 'city', label: 'City' },
  ];

  const user = [
    { key: 'first_name', label: 'Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'gender', label: 'Gender' },
    { key: 'date_of_birth', label: 'DOB', formatter: formatDate },
  ];


  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Grid container spacing={2}>

          <Grid item xs={12} md={3}>
            <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#004d40' }}>
                <AccountCircleIcon style={{ marginRight: '8px', color: 'white' }} />
                <Typography variant="h6" style={{ color: 'white' }}>{adminName ? adminName.name : 'Admin'}</Typography>
              </div>
              <List>
                <ListItemButton selected={selectedOption === 'AdminProfile'} onClick={() => handleOptionSelect('AdminProfile')}>
                  <ListItemText primary="Admin Profile"
                    primaryTypographyProps={{ color: selectedOption === 'AdminProfile' ? 'Red' : 'inherit' }} />
                </ListItemButton>

                <ListItemButton selected={selectedOption === 'Organisations'} onClick={() => handleOptionSelect('Organisations')}>
                  <ListItemText primary="Organisations"
                    primaryTypographyProps={{ color: selectedOption === 'Organisations' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton selected={selectedOption === 'Users'} onClick={() => handleOptionSelect('Users')}>
                  <ListItemText primary="Users"
                    primaryTypographyProps={{ color: selectedOption === 'Users' ? 'Red' : 'inherit' }} />
                </ListItemButton>
                <ListItemButton onClick={handleLogout} >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>


          {/* Right Content */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <AppBar position="static" elevation={0}>
              <Toolbar>
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
                {selectedOption === 'AdminProfile' && 'Here are the Admin details:'}
                {selectedOption === 'Organisations' && 'Here are the Organisations List:'}
                {selectedOption === 'Users' && 'Here are the User details:'}
              </Typography>
              {selectedOption === 'AdminProfile' && adminName ? (
                <div>

                  <Paper style={{ marginBottom: '8px', padding: '8px' }}>
                    <Typography>Admin Id: {adminName.id}</Typography>
                    <Typography>Admin name: {adminName.name}</Typography>
                    <Typography>Email: {adminName.email}</Typography>


                  </Paper>

                </div>
              ) : (
                <div></div>
              )}
              {selectedOption === 'Organisations' && organisations ? (
                <div>
                  <DataTable columns={orgs} data={organisations} />
                </div>
              ) : (
                <div></div>
              )}
              {selectedOption === 'Users' && users ? (
                <div>
                  <DataTable columns={user} data={users} />
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
