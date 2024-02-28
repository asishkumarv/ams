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
import axios from 'axios';
import DataTable from './utils/DataTable';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [organisations, setOrganisations] = useState([]);

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
    axios.get('http://localhost:5000/organisations')
      .then(response => setOrganisations(response.data))
      .catch(error => console.error(error));
  }, []);

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
  const handleUserProfileClick = () => {
    navigate('/UserProfile');
  }

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {isMobile ? (
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
              <List>
                <ListItem button onClick={handleUserProfileClick}>
                  <ListItemText primary="User Profile" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Appointments" />
                </ListItem>
                <ListItem button>
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
                <List>
                  <ListItem button onClick={handleUserProfileClick}>
                    <ListItemText primary="User Profile" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Appointments" />
                  </ListItem>
                  <ListItem button>
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
              <Typography variant="h5" gutterBottom>
                Welcome to the Dashboard
              </Typography>
              <Typography paragraph>
                Here is the List of organisations in our Ams.
              </Typography>
              <DataTable data={organisations} columns={columns} />
              <Typography paragraph>
                Click on organization names to view details.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
