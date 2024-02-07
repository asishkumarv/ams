// OrganizationDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppLayout from './../AppLayout';
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
      <p>ID: {organisation.id}</p>
      <p>Name: {organisation.org_name}</p>
      <p>Type: {organisation.org_type}</p>
      <p>Address: {organisation.address}</p>
      <p>City: {organisation.city}</p>
      <p>Pincode: {organisation.pincode}</p>
    </div>
    </AppLayout>
  );
};

export default OrganisationDetails;
