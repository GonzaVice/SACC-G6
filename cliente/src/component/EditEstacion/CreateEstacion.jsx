import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEstacion = () => {
    const navigate = useNavigate();
    const [stationName, setStationName] = useState('');

    const handleCreateStation = async () => {
        try {
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                .split('=')[1];

            const headers = {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            };

            const data = {
                name: stationName,
            };

            const response = await axios.post('http://68.183.138.37:8000/base/create_station/', data, {
                headers,
                withCredentials: true,
            });

            console.log(response.data); // Assuming the response contains a message
            // Add further handling as needed after station creation
            navigate('/home')
        } catch (error) {
            console.error('Error creating station:', error);
            // Handle errors appropriately
        }
    };

    const handleBackClick = () => {
        navigate('/home');
    };

    return (
        <div>
            <h1>Create Station</h1>
            <input
                type="text"
                placeholder="Enter Station Name"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
            />
            <button onClick={handleCreateStation}>Create Station</button>
            <button onClick={handleBackClick}>Go back</button>
            
        </div>
    );
};

export default CreateEstacion;
