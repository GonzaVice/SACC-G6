import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const Home = () => {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            try {
        
                const csrfToken = getCsrfToken();
                const headers = {
                    'X-CSRFToken': csrfToken,
                };

                const response = await axios.get('http://68.183.138.37:8000/base/get_stations_info/', {
                    headers,
                    withCredentials: true,
                });

                setStations(response.data.station_info);
                console.log(response)
            } catch (error) {
                console.error('Error al obtener las estaciones:', error);
            }
        };

        fetchStations();
    }, []); 

    const handleButtonClick = (station) => {
        navigate('/DashboardActualPorEstacion', { state: 
            { 
                station_name: station.name, 
                station_id: station.id 
            } 
        });
    };

    const handleCreateStationClick = () => {
        navigate('/CreateEstacion');
    };

    const handleViewLockersClick = () => {
        navigate('/all_lockers');
    };
 

    const handleEcommercesClick = () => {
        navigate('/GetAllEcommerce');
    };

    return (
        <div className="home">
            <h1>Estaciones:</h1>
            {stations.map((station) => (
                <div className="station-card" key={station.name} onClick={() => handleButtonClick(station)}>
                    {station.name}
                </div>
            ))}
            <div className="button-container">
                <button className="btn btn-secondary" onClick={handleViewLockersClick}>
                    View Lockers
                </button>
                <button className="btn btn-secondary" onClick={handleEcommercesClick}>
                    Ecommerces
                </button>
            </div>
            <button className="btn btn-tertiary" onClick={handleCreateStationClick}>
                Create Station
            </button>
   

        </div>
    );
};

export default Home;
