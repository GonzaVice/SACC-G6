import React, { useState } from 'react';
import axios from 'axios';

const CreateEstacion = () => {
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

            const response = await axios.post('http://127.0.0.1:8000/base/create_station/', data, {
                headers,
                withCredentials: true,
            });

            console.log(response.data); // Assuming the response contains a message
            // Add further handling as needed after station creation

        } catch (error) {
            console.error('Error creating station:', error);
            // Handle errors appropriately
        }
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
        </div>
    );
};

export default CreateEstacion;
