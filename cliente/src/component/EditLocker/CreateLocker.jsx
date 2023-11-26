import React, { useState } from 'react';
import axios from 'axios';

const CreateLocker = () => {
    const [lockerName, setLockerName] = useState('');
    const [lockerLength, setLockerLength] = useState('');
    const [lockerWidth, setLockerWidth] = useState('');
    const [lockerHeight, setLockerHeight] = useState('');
    const [stationName, setStationName] = useState('');

    const handleCreateLocker = async () => {
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
                name: lockerName,
                length: lockerLength,
                width: lockerWidth,
                height: lockerHeight,
                station_name: stationName,
            };

            const response = await axios.post('http://127.0.0.1:8000/base/create_locker/', data, {
                headers,
                withCredentials: true,
            });

            console.log(response.data); // Assuming the response contains a message
            // Add further handling as needed after locker creation

        } catch (error) {
            console.error('Error creating locker:', error);
            // Handle errors appropriately
        }
    };

    return (
        <div>
            <h1>Create Locker:</h1>
            <form onSubmit={handleCreateLocker}>
                <label>
                    Locker Name:
                    <input type="text" value={lockerName} onChange={e => setLockerName(e.target.value)} />
                </label>
                <label>
                    Locker Length:
                    <input type="text" value={lockerLength} onChange={e => setLockerLength(e.target.value)} />
                </label>
                <label>
                    Locker Width:
                    <input type="text" value={lockerWidth} onChange={e => setLockerWidth(e.target.value)} />
                </label>
                <label>
                    Locker Height:
                    <input type="text" value={lockerHeight} onChange={e => setLockerHeight(e.target.value)} />
                </label>
                <label>
                    Station Name:
                    <input type="text" value={stationName} onChange={e => setStationName(e.target.value)} />
                </label>
                <button type="submit">Create Locker</button>
            </form>
        </div>
    );
};

export default CreateLocker;
