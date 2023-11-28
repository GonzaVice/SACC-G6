import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const AllLockers = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchLockers = async () => {
          try {

            const csrfToken = getCsrfToken();
            const headers = {
                'X-CSRFToken': csrfToken,
            };

            const response = await axios.get('http://127.0.0.1:8000/base/lockers/', {
                headers,
                withCredentials: true,
            });
            console.log('Lockers data:', response.data);

          } catch (error) {
            console.error('Error fetching lockers:', error);
          }
        };

        fetchLockers();
    }, []);

    const handleCreateLockerClick = () => {
        navigate('/CreateEcommerce');
    };

    return (
        <>
            <button className="btn btn-secondary" onClick={handleCreateLockerClick}>
                Create new locker
            </button>
        </>
    );
};

export default AllLockers;