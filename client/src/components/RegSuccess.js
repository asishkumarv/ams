import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Box, Typography } from '@mui/material';
import AppLayout from './../AppLayout';
const RegistrationSuccess = () => {
    const navigate = useNavigate();
    const [message] = useState('Registration Successful');

    const goToLoginPage = () => {
        // Redirect to the login page
        navigate.push('/login');
    };

    return (
        <AppLayout>
            <Container component="main" maxWidth="xs">

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 8,
                    }}>
                    <Typography variant="h5" align="center">
                        {message}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={goToLoginPage}>
                        Go to Login Page
                    </Button>

                </Box>
            </Container>
        </AppLayout>
    );
};

export default RegistrationSuccess;
