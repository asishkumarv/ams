// Home.js
import React, { useState, useEffect } from 'react';
import AppLayout from './../AppLayout';
// import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import AdminBg from './Assets/AdminBg.jpg'

const Home = () => {
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [showOrgList, setShowOrgList] = useState(false)
  const [organisations, setOrganisations] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/organisations')
      .then(response => setOrganisations(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <AppLayout>
      <div style={{
        textAlign: 'center',
        backgroundImage: `url(${AdminBg})`, // Set background image
        backgroundSize: '60% 80%', // Make sure the image covers the entire container
        backgroundPosition: 'center', // Center the image
        minHeight: '150vh', // Ensure the layout covers the full viewport height
        position: 'relative', // Set position to relative to position the header and footer
      }}>
        <Typography variant="h4">Welcome to AMS Primary Admin App</Typography>
        <Typography>
          It is a Platform that provides Appointment management system for a very range of Organizations
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setShowUserList(!showUserList)}>
          {showUserList ? 'Hide User List' : 'Show User List'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowOrgList(!showOrgList)}>
          {showOrgList ? 'Hide Organisations List' : 'Show Organisations List'}
        </Button>
        {showUserList && (
          <div>
            <h1>User List</h1>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  {user.id}-{user.first_name} - {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showOrgList && (
          <div>
            <h1>Organisations List</h1>
            <ul>
              {organisations.map(organisation => (
                <li key={organisation.id}>
                  {organisation.id}-{organisation.org_name} - {organisation.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Register button in the top right corner below the header */}
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <RouterLink to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" style={{ color: 'white' }}>
            Book Now!
          </Button>
        </RouterLink>
      </div> */}


    </AppLayout>
  );
};

export default Home;
