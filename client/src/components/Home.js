// Home.js
import React, { useState, useEffect } from 'react';
import AppLayout from './../AppLayout';
import axios from 'axios';
const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);
  return (
    <AppLayout>
      <h1>Welcome to Your App</h1>
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
    </AppLayout>
  );
};

export default Home;
