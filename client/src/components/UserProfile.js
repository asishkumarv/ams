import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from './../AppLayout';
const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('JWT token not found');
            setLoading(false);
            return;
        }

        axios.get('http://localhost:5000/user-profile', {
            headers: {
                Authorization: token
            }
        })
            .then(response => {
                setUserProfile(response.data);
                setLoading(false);
                console.log('details:',response )
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!userProfile) {
        return <p>User profile not found</p>;
    }

// Format date of birth
const formattedDateOfBirth = userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString() : '';

    return (
        <AppLayout>
            <div>
                <h2>User Profile</h2>
                <p>Email: {userProfile.email}</p>
                <p>Name: {userProfile.full_name}</p>
                <p>Date of Birth: {formattedDateOfBirth}</p>
            {/* <p>Password: {userProfile.password}</p> */}
            </div>
        </AppLayout>
    );
};

export default UserProfile;
