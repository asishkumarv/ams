import React, { useState } from 'react';
import axios from 'axios';
import AppLayout from './../AppLayout';
import {
    Container,
    Typography,
    TextField,
    Button,
   // Snackbar,
    useTheme
} from '@mui/material';
//import MuiAlert from '@mui/material/Alert';
import DatePicker from './utils/DatePicker';

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [orgsince, setOrgSince] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
  //  const [snackbarOpen, setSnackbarOpen] = useState(false);
    const theme = useTheme();
    const handleResetPassword = async () => {
        setError(null);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/orgforgot-password', {
                username,
                orgsince,
                newPassword,
                confirmNewPassword,
            });

            setMessage(response.data.message);
           // setSnackbarOpen(true);
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    // const handleSnackbarClose = () => {
    //     setSnackbarOpen(false);
    // };

    return (
        <AppLayout>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h4" sx={{ textAlign: 'center', color: theme.palette.primary.main }}>
                    Forgot Password
                </Typography>
                <div>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <DatePicker
                        label="Date of Birth"
                        value={orgsince}
                        fullWidth
                        // setDateOfBirth={setDateOfBirth}
                        onChange={(newDate) => setOrgSince(newDate)}
                    />
                    <TextField
                        label="New Password"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm New Password"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </Button>
                </div>
                {error && (
                    <Typography variant="body2" color="error" paragraph>
                        {error}
                    </Typography>
                )}
                {message && (
                    <Typography variant="body2" color="success" paragraph>
                        {message}
                    </Typography>
                )}
                {/* <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity="success">
                        {message}
                    </Alert>
                </Snackbar> */}
            </Container>
        </AppLayout>
    );
};

export default ForgotPassword;
