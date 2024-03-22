import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppLayout from './../AppLayout';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

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
        <h2>Organization Details</h2>
        <Card variant="outlined">
          <CardContent>
            <img src={`data:image/jpeg;base64,${organisation.image}`} alt="Organisation" style={{ maxWidth: '100%', marginBottom: '20px' }} />
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
        </Card>
      </div>
    </AppLayout>
  );
};

export default OrganisationDetails;
