// Home.js
import React, { useState, useEffect } from 'react';
import AppLayout from './../AppLayout';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from '@mui/material';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <AppLayout>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h4">Welcome to Your App</Typography>
        <Typography>
          It is a Platform that provides Appointment management system for a very range of Organizations
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setShowUserList(!showUserList)}>
          {showUserList ? 'Hide User List' : 'Show User List'}
        </Button>
      </div>

      {/* Register button in the top right corner below the header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <RouterLink to="/registration" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Register
          </Button>
        </RouterLink>
      </div>

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
    </AppLayout>
  );
};

export default Home;
