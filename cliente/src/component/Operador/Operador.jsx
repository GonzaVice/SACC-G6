import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Operador = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const userId = location.state?.userId;
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/base/user/${userId}/`, { withCredentials: true });
                if (response.status === 200) {
                  console.log(response.data);
                  setUserData(response.data.user_data);  // Access the user_data property
                  setLoading(false);
                } else {
                  console.error('Failed to fetch user data');
                }
              } catch (error) {
                console.error('Error fetching user data:', error.message);
              }
        };
    
        fetchUserData();
    }, []);

    return (
        <>
            {userData ? (
                <div>
                    <h2>User Information</h2>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>User Type: {userData.userType}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </>
    );
};

export default Operador;