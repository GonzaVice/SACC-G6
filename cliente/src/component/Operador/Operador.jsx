import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Operador = () => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/base/user/', {
              withCredentials: true,
            });
            if (response.status === 200) {
              setUserData(response.data);
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