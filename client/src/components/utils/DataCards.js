import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const OrganisationCard = ({ organisation }) => {
  const { id, org_name, org_type, city, pincode, } = organisation;

  return (
    <Link to={`/organisationdetails/${id}`} style={{ textDecoration: 'none', color: 'Primary', cursor: 'pointer' }}>
      <Card style={{ marginBottom: '16px' }}>
        <CardContent>
         {/* <Typography variant="h6">ID: {id}</Typography> */}
          <Typography variant="h6">Org Name: <span style={{ color: 'red', fontSize: '1.6rem' }}>{org_name}</span></Typography>
          <Typography variant="h6">Type: {org_type}</Typography>
          <Typography variant="h6">City: {city}</Typography>
          <Typography variant="h6">Pincode: {pincode}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

const OrganisationCards = ({ organisations }) => {
  return (
    <div>
      {organisations.map(organisation => (
        <OrganisationCard key={organisation.id} organisation={organisation} />
      ))}
    </div>
  );
};

export default OrganisationCards;
