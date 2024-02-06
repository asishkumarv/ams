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
import DataTable from './utils/DataTable'
const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [organisations, setOrganisations] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    // Fetch organizations using Axios
    axios.get('http://localhost:5000/organisations')  // Update the API endpoint
      .then(response => setOrganisations(response.data))
      .catch(error => console.error(error));
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'org_name', label: 'Name' },
    { key: 'org_type', label: 'Type' },
    { key: 'address', label: 'Address' },
  ];
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Left Sidebar */}
          {isMobile ? (
            <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
              <List>
                <ListItem button>
                  <ListItemText primary="User Profile" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Appointments" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="History" />
                </ListItem>
              </List>
            </Drawer>
          ) : (
            <Grid item xs={12} md={3}>
              <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                <List>
                  <ListItem button>
                    <ListItemText primary="User Profile" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="Appointments" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="History" />
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
                Here is the List of organisations in our Ams.
              </Typography>
              {/* List of Organizations */}
              <DataTable data={organisations} columns={columns} />

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default Dashboard;
