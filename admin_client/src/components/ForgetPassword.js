import React, { useState, useRef } from 'react';
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
import ReCAPTCHA from 'react-google-recaptcha';
// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [orgsince, setOrgSince] = useState(new Date());
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    // const [responseMessage, setResponseMessage] = useState('');
    const [captchaResponse, setCaptchaResponse] = useState('');
    const recaptchaRef = useRef();
    //  const [snackbarOpen, setSnackbarOpen] = useState(false);
    const theme = useTheme();
    const handleResetPassword = async () => {
        setError(null);
        setMessage('');
        // Password complexity regex pattern
        const newPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        // Validate password complexity
        if (!newPasswordPattern.test(newPassword)) {
            setMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/orgforgot-password', {
                username,
                orgsince,
                newPassword,
                confirmNewPassword,
                captchaResponse
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
                        label="Organisation SInce"
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
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LcNJKApAAAAAEQwVsIZfr2Cz8LHcAd_N3mcBQBj"
                        onChange={setCaptchaResponse}
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
                    <Typography variant="body2" color="error" paragraph>
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
