import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AppLayout from './../AppLayout';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OrganisationDetails = () => {
  const { id } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/organisation/${id}`)
      .then(response => {
        setOrganisation(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!organisation) {
    return <p>Organisation not found</p>;
  }

  return (
    <AppLayout>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Link to="/dashboard">
              <IconButton edge="start" color="inherit" aria-label="back">
                <ArrowBackIcon style={{ color: 'white' }}/>
              </IconButton>
            </Link>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Organisation Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Card variant="outlined" style={{ display: 'flex' }}>
          {/* Details Section */}
          <div style={{ flex: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {organisation.org_name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Type: {organisation.org_type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {organisation.address}, {organisation.city}, {organisation.pincode}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="outlined" color="primary" style={{ marginRight: '8px', fontSize: '12px' }}>Contact</Button>
                <Link to={`/bookingpage/${id}`}>
                  <Button variant="contained" color="secondary" style={{ fontSize: '12px' }}>Book</Button>
                </Link>
              </div>
            </CardContent>
          </div>
          {/* Image Section */}
          <div style={{ flex: 1, marginRight: '20px' }}>
            <CardContent>
              <img
                src={`data:image/jpeg;base64,${organisation.imageBase64}`}
                alt="Organisation"
                style={{ maxWidth: '100%', marginBottom: '20px' }}
              />
            </CardContent>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default OrganisationDetails;
