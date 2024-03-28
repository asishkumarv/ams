import React, { useState, useRef } from 'react';
import axios from 'axios';
import AppLayout from './../AppLayout';
import {
    Container,
    Typography,
    TextField,
    Button,
    //Snackbar,
    useTheme, InputAdornment, IconButton,
} from '@mui/material';
//import MuiAlert from '@mui/material/Alert';
import DatePicker from './utils/DatePicker';
import ReCAPTCHA from 'react-google-recaptcha';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [captchaResponse, setCaptchaResponse] = useState('');
    const recaptchaRef = useRef();
    const [showPassword, setShowPassword] = useState(false);
    const [showCnfPassword, setShowCnfPassword] = useState(false);
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
        if (newPassword !== confirmNewPassword) {
            setMessage('Passwords do not match.');
            return;
          }
          // Clear previous error messages
          setMessage('');
        try {
            const response = await axios.post('http://localhost:5000/forgot-password', {
                username,
                dateOfBirth,
                newPassword,
                confirmNewPassword,
                captchaResponse: captchaResponse
            });

            setMessage(response.data.message);

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
                        value={dateOfBirth}
                        // setDateOfBirth={setDateOfBirth}
                        onChange={(newDate) => setDateOfBirth(newDate)}
                    />
                    <TextField
                        label="New Password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setNewPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                    />
                    <TextField
                        label="Confirm New Password"
                        fullWidth
                        margin="normal"
                        value={confirmNewPassword}
                        type={showCnfPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowCnfPassword(!showCnfPassword)} edge="end">
                                  {showCnfPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
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
                    <Typography variant="h5" color="error" paragraph>
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
