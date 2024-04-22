// Services.js
import React, { useState, useEffect } from 'react';
import AppLayout from './../AppLayout';
import {Card, Container, Typography, CardContent, CardMedia,} from '@mui/material'; // Assuming you have a Card component
import axios from 'axios';
import BankIcon from './Assets/Logos/BankIcon.jpg';
import MedicalIcon from './Assets/Logos/MedicalIcon.jpg';
import MensBeauty from './Assets/Logos/MensBeauty.jpg';
import Womenbeauty from './Assets/Logos/Womenbeauty.jpg';
import restaurant from './Assets/Logos/restaurant.jpg';
import office from './Assets/Logos/office.jpg';


const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    // Fetch organizations when selectedCategory changes
    if (selectedCategory) {
      axios.get(`http://localhost:5000/organisations?type=${selectedCategory}`)
        .then(response => {
          setOrganizations(response.data);
        })
        .catch(error => {
          console.error('Error fetching organisations:', error);
          // Handle error
        });
    }
  }, [selectedCategory]);


  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Call API to fetch organizations based on the selected category
    // You can implement this part according to your project structure
  };
  // Function to get the icon/image for the specified category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Banking':
        return BankIcon;
      case 'Medical':
        return MedicalIcon;
      case 'Offices':
        return office;
      case 'Saloon':
        return MensBeauty;
        case 'Parlour':
          return Womenbeauty;
      case 'Restaurant':
        return restaurant;

      default:
        return null;
    }
  };
  return (
    <AppLayout>
      <Container>
      <h1>Our Services</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <Card onClick={() => handleCategorySelect("Banking")} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={getCategoryIcon("Banking")} alt="Banking" />
          <CardContent>
            <Typography variant="h5" component="div">
              Banking
            </Typography>
          </CardContent>
        </Card>
        <Card onClick={() => handleCategorySelect("Medical")} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={getCategoryIcon("Medical")} alt="Banking" />
          <CardContent>
            <Typography variant="h5" component="div">
              Medical
            </Typography>
          </CardContent>
        </Card>
        <Card onClick={() => handleCategorySelect("Office")} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={getCategoryIcon("Offices")} alt="Banking" />
          <CardContent>
            <Typography variant="h5" component="div">
              Offices
            </Typography>
          </CardContent>
        </Card>
        <Card onClick={() => handleCategorySelect("Saloon")} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={getCategoryIcon("Saloon")} alt="Banking" />
          <CardContent>
            <Typography variant="h5" component="div">
              Men's Beauty
            </Typography>
          </CardContent>
        </Card>
        <Card onClick={() => handleCategorySelect("Ladies Beauty")} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={getCategoryIcon("Parlour")} alt="Banking" />
          <CardContent>
            <Typography variant="h5" component="div">
              Ladies Beauty
            </Typography>
          </CardContent>
        </Card>
        <Card onClick={() => handleCategorySelect("Restaurant")} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" height="140" image={getCategoryIcon("Restaurant")} alt="Banking" />
          <CardContent>
            <Typography variant="h5" component="div">
              Restaurant
            </Typography>
          </CardContent>
        </Card>
        <Card onClick={() => handleCategorySelect("Others")} style={{ cursor: 'pointer' }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Others
            </Typography>
          </CardContent>
        </Card>

      </div>
      {selectedCategory && (
        <div>
          <h2>Organizations for {selectedCategory}</h2>
          <ul>
            {organizations.map(org => (
              <li key={org.id}>{org.org_name}-- {org.services} </li>
            ))}
          </ul>
        </div>
      )}
      </Container>
    </AppLayout>
  );
};

export default Services;
