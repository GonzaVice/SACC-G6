import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const CreateLocker = () => {
    const navigate = useNavigate();
    const [lockerName, setLockerName] = useState('');
    const [lockerLength, setLockerLength] = useState('');
    const [lockerWidth, setLockerWidth] = useState('');
    const [lockerHeight, setLockerHeight] = useState('');
    const [stationName, setStationName] = useState('');

    const handleCreateLocker = async (e) => {
        e.preventDefault();
        try {

            const csrfToken = getCsrfToken();
            const headers = {
              'X-CSRFToken': csrfToken,
            };

            const response = await axios.post('http://68.183.138.37:8000/base/create_locker/', 
            {
                'name': lockerName,
                'length': lockerLength,
                'width': lockerWidth,
                'height': lockerHeight,
                'station_name': stationName
            }, {
                headers,
                withCredentials: true,
                timeout: 10000,
            });

            navigate('/all_lockers')

        } catch (error) {
            console.error('Error creating locker:', error);
            
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
                <br/>
                <label>
                    Locker Length:
                    <input type="text" value={lockerLength} onChange={e => setLockerLength(e.target.value)} />
                </label>
                <br/>
                <label>
                    Locker Width:
                    <input type="text" value={lockerWidth} onChange={e => setLockerWidth(e.target.value)} />
                </label>
                <br/>
                <label>
                    Locker Height:
                    <input type="text" value={lockerHeight} onChange={e => setLockerHeight(e.target.value)} />
                </label>
                <br/>
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
